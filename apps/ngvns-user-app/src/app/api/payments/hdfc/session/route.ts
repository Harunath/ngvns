import prisma, { OrderStatus } from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";
import { makeGatewayOrderId } from "../../../../../utils/gatewayOrderId";

/** ---------- tiny helpers ---------- */

const APP = "HDFC_SESSION";
const redact = (v?: string | null) => (v ? v.slice(0, 6) + "•••" : "(empty)");

const log = (
	reqId: string,
	level: "info" | "warn" | "error",
	msg: string,
	extra?: any
) => {
	const base = { app: APP, reqId, level, msg, ts: new Date().toISOString() };
	if (extra) console[level]({ ...base, ...extra });
	else console[level](base);
};

const mustGetEnv = (key: string) => {
	const val = process.env[key];
	if (!val) throw new Error(`Missing env ${key}`);
	return val;
};

const coerceBaseUrl = (s: string) => s.replace(/\/+$/, "");

/** ---------- auth header ---------- */
function buildHdfcAuthHeader(): string {
	const apiKey = process.env.PAYMENT_GATEWAY_API_KEY || "";
	if (!apiKey) throw new Error("HDFC_API_KEY is missing");
	// HDFC expects "Basic base64(apikey:)" — note the trailing colon
	const raw = `${apiKey}:`;
	const basic = Buffer.from(raw).toString("base64");
	return `Basic ${basic}`;
}

/** ---------- types ---------- */
type CreateSessionInput = {
	orderId: string;
	amount: string; // e.g. "10.0" or "4999" (string required by their API)
	customerId: string;
	customerEmail: string;
	customerPhone: string;
	name?: string;
	returnUrl?: string;
	description?: string;
};

type HdfcOk =
	| {
			// shape as returned by SmartGateway; keep open
			[k: string]: any;
	  }
	| undefined;

/** ---------- HDFC call ---------- */
async function createHdfcSession(
	input: CreateSessionInput,
	reqId: string
): Promise<HdfcOk> {
	const baseUrl = coerceBaseUrl(
		process.env.NEXT_PUBLIC_NODE_ENV == "production"
			? mustGetEnv("PAYMENT_GATEWAY_BASE_URL_SANDBOX")
			: mustGetEnv("PAYMENT_GATEWAY_BASE_URL")
	);
	const merchantId = mustGetEnv("PAYMENT_GATEWAY_MERCHANT_ID");
	const paymentPageClientId = mustGetEnv(
		"PAYMENT_GATEWAY_PAYMENT_PAGE_CLIENT_ID"
	);
	const authHeader = buildHdfcAuthHeader();

	const payload = {
		order_id: input.orderId,
		amount: input.amount,
		customer_id: input.customerId,
		customer_email: input.customerEmail,
		customer_phone: input.customerPhone,
		payment_page_client_id: paymentPageClientId,
		action: "paymentPage",
		currency: "INR",
		return_url: input.returnUrl,
		description: input.description,
		name: input.name,
	};

	// timeout safety
	const ac = new AbortController();
	const timeout = setTimeout(() => ac.abort(), 15000);

	log(reqId, "info", "Creating HDFC session (request)", {
		url: `${baseUrl}/session`,
		method: "POST",
		headers: {
			Authorization: redact(authHeader),
			"x-merchantid": merchantId,
			"x-customerid": input.customerId,
		},
		bodyPreview: {
			order_id: payload.order_id,
			amount: payload.amount,
			customer_id: payload.customer_id,
			customer_email: payload.customer_email,
			customer_phone: payload.customer_phone,
			action: payload.action,
			currency: payload.currency,
		},
	});

	try {
		const res = await fetch(`${baseUrl}/session`, {
			method: "POST",
			headers: {
				Authorization: authHeader, // ⇦ only one Authorization header
				"Content-Type": "application/json",
				"x-merchantid": merchantId,
				"x-customerid": input.customerId,
			},
			body: JSON.stringify(payload),
			signal: ac.signal,
			cache: "no-store",
		});

		const text = await res.text();
		// Attempt JSON parsing regardless of status for better logs
		let json: any | null = null;
		try {
			json = text ? JSON.parse(text) : null;
		} catch {
			// keep text fallback
		}

		log(reqId, "info", "HDFC responded", {
			status: res.status,
			ok: res.ok,
			jsonPreview: json ?? text?.slice(0, 800),
		});

		if (!res.ok) {
			const code = (json && (json.error_code || json.code)) || res.status;
			const devMsg = (json && (json.developer_message || json.message)) || text;
			throw new Error(`HDFC session error: ${code} - ${devMsg}`);
		}

		return json ?? undefined;
	} catch (err: any) {
		if (err?.name === "AbortError") {
			throw new Error("HDFC session request timed out");
		}
		throw err;
	} finally {
		clearTimeout(timeout);
	}
}

/** ---------- API route ---------- */
export async function POST(req: NextRequest) {
	const reqId = crypto.randomUUID();

	try {
		const body = await req.json().catch(() => ({}) as any);
		const phone: string | undefined = body?.phone;

		// log(reqId, "info", "Incoming request", { phone });

		if (!phone) {
			// log(reqId, "warn", "Missing phone");
			return NextResponse.json(
				{ error: "Missing required fields: phone" },
				{ status: 400 }
			);
		}

		// If phone is NOT unique in your schema, prefer findFirst over findUnique
		const onb = await prisma.onboarding.findFirst({
			where: { phone },
			select: { id: true, email: true, fullname: true },
		});

		// log(reqId, "info", "Onboarding lookup", {
		// 	found: !!onb,
		// 	onboardingId: onb?.id,
		// });

		if (!onb) {
			return NextResponse.json(
				{ error: "Onboarding user not found" },
				{ status: 404 }
			);
		}

		const orderId = makeGatewayOrderId(); // <-- your util
		const amount = "5248.95"; // <-- your amount; string per HDFC reqs

		const result = await createHdfcSession(
			{
				orderId,
				amount,
				customerId: onb.id,
				customerEmail: onb.email ?? "",
				customerPhone: phone,
				returnUrl:
					process.env.NEXT_PUBLIC_NODE_ENV == "production"
						? mustGetEnv("PAYMENT_GATEWAY_RETURN_URL")
						: mustGetEnv("PAYMENT_GATEWAY_RETURN_URL_local"),
				description: `Payment for Order ${orderId}`,
				name: onb.fullname ?? undefined,
			},
			reqId
		);

		// Strip any HTTP metadata if present (defensive)
		if (result && typeof result === "object" && "http" in result) {
			delete (result as any).http;
		}

		// log(reqId, "info", "Returning success");
		if (!result || !result.payment_links) {
			// log(reqId, "error", "Missing payment_links in HDFC response", { result });
			return NextResponse.json(
				{ error: "Failed to create payment session" },
				{ status: 502 }
			);
		}

		const order = await prisma.order.create({
			data: {
				orderId: orderId,
				onBoardingId: onb.id,
				totalAmount: parseFloat(amount),
				currency: "INR",
				status: OrderStatus.PROCESSING,
				email: onb.email,
				phone: phone,
			},
		});
		// log(reqId, "info", "Created order in DB", { orderId: order.id });
		return NextResponse.json({
			url: result.payment_links.web,
			orderId: orderId,
			expiry: result.payment_links.expiry,
		});
	} catch (e: any) {
		// log(reqId, "error", "Failed to create payment session", {
		// 	error: e?.message,
		// });
		// keep error opaque to client; logs have detail
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}

/** ---------- Notes / common pitfalls ----------
 * 1) Double Authorization headers: ensure you send ONLY one "Authorization: Basic ...".
 * 2) amount MUST be a string per HDFC examples ("10.0" or "4999").
 * 3) Ensure HDFC_BASE_URL has no trailing slash; we strip it defensively.
 * 4) If `onboarding.phone` isn’t unique in DB, use findFirst (done above) or add @unique.
 * 5) Make sure all envs exist in the runtime (Vercel/Node):
 *    HDFC_API_KEY, HDFC_BASE_URL, HDFC_MERCHANT_ID, HDFC_PAYMENT_PAGE_CLIENT_ID, PAYMENT_GATEWAY_RETURN_URL.
 * 6) If you get non-JSON errors, we log the raw body preview to help debugging.
 */
