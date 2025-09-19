// app/api/payments/hdfc/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma, { OrderStatus } from "@ngvns2025/db/client";

function safeEqual(a: string, b: string) {
	const ab = Buffer.from(a, "utf8");
	const bb = Buffer.from(b, "utf8");
	if (ab.length !== bb.length) return false;
	return crypto.timingSafeEqual(ab, bb);
}

/**
 * Verify SmartGateway webhook using Basic Auth header.
 * Expects header in the form: "Basic <base64(username:password)>".
 */
function verifySmartGatewayAuth(authorizationHeader?: string): boolean {
	if (!authorizationHeader) return false;

	const [scheme, encoded] = authorizationHeader.split(" ");
	if (!scheme || !encoded || scheme.toLowerCase() !== "basic") return false;

	let decoded: string;
	try {
		decoded = Buffer.from(encoded, "base64").toString("utf8");
	} catch {
		return false;
	}

	const sep = decoded.indexOf(":");
	if (sep === -1) return false;

	const username = decoded.slice(0, sep);
	const password = decoded.slice(sep + 1);

	const expectedUser = process.env.HDFC_SG_WEBHOOK_USERNAME ?? "";
	const expectedPass = process.env.HDFC_SG_WEBHOOK_PASSWORD ?? "";
	if (!expectedUser || !expectedPass) return false;

	return safeEqual(username, expectedUser) && safeEqual(password, expectedPass);
}

// helpers (put with your other utils)
const normalizeSmartGatewayStatus = (
	raw: string | undefined
): "SUCCESS" | "FAILED" | "PENDING" => {
	if (!raw) return "PENDING";
	const s = raw.toUpperCase();
	if (["CHARGED", "SUCCESS", "CAPTURED", "PAID"].includes(s)) return "SUCCESS";
	if (["FAILED", "CANCELLED", "DECLINED", "EXPIRED"].includes(s))
		return "FAILED";
	return "PENDING";
};
const isFinal = (s?: string | null) => s === "SUCCESS" || s === "FAILED";

export async function POST(req: NextRequest) {
	// 1) Verify Basic Auth header
	const auth = req.headers.get("authorization") ?? "";
	if (!verifySmartGatewayAuth(auth)) {
		return NextResponse.json(
			{ ok: false, error: "unauthorized" },
			{ status: 401 }
		);
	}

	// 2) Parse raw JSON body once (also store it)
	const raw = await req.text();
	let evt: any;
	try {
		evt = JSON.parse(raw);
	} catch {
		return NextResponse.json(
			{ ok: false, error: "invalid_json" },
			{ status: 400 }
		);
	}

	// 3) Extract identifiers from your sample payload
	const o = evt?.content?.order;
	const orderId = o?.order_id; // your public order ref
	const paymentSessionId = o?.id; // gateway "session" id
	if (!orderId || !paymentSessionId) {
		return NextResponse.json(
			{ ok: false, error: "missing_ids" },
			{ status: 400 }
		);
	}

	// 4) Normalize status from the correct field
	const status = normalizeSmartGatewayStatus(o?.status);

	// --- Do DB work; compute side-effects; return outside the tx ---
	let needsUserCreate = false;
	let onboardingIdToCreate: string | null = null;
	let paymentId: string | null = null;

	try {
		await prisma.$transaction(async (tx) => {
			const order = await tx.order.findUnique({ where: { orderId } });
			if (!order) throw new Error("ORDER_NOT_FOUND");

			// Order: only move forward, never downgrade
			if (!isFinal(order.status)) {
				const nextOrderStatus =
					status === "SUCCESS"
						? "PAID"
						: status === "FAILED"
							? "FAILED"
							: "PENDING";
				if (order.status !== nextOrderStatus) {
					await tx.order.update({
						where: { id: order.id },
						data: { status: nextOrderStatus },
					});
				}
			}

			// Payment: idempotent upsert, never downgrade a final state
			const existing = await tx.payment.findFirst({
				where: { paymentSessionId },
				orderBy: { createdAt: "desc" },
			});

			if (!existing) {
				const created = await tx.payment.create({
					data: {
						orderId: order.id, // FK to Order.id
						paymentOrderId: orderId, // store public order ref too
						paymentSessionId, // gateway session id
						amount: o?.amount ?? order.totalAmount,
						currency: order.currency,
						paymentMethod: o?.payment_method ?? null,
						status, // <-- use normalized
						processedAt: new Date(),
						gatewayResponse: raw,
						errorMessage: o?.bank_error_message || null,
					},
					select: { id: true, status: true },
				});
				paymentId = created.id;
			} else if (!isFinal(existing.status) && existing.status !== status) {
				const updated = await tx.payment.update({
					where: { id: existing.id },
					data: {
						status, // don't write PENDING over final
						processedAt: new Date(),
						gatewayResponse: raw,
					},
					select: { id: true, status: true },
				});
				paymentId = updated.id;
			} else {
				paymentId = existing.id;
			}

			// On success, mark need for user creation (do AFTER commit)
			if (status === "SUCCESS" && order.onBoardingId) {
				const user = await tx.user.findFirst({
					where: { onBoardingId: order.onBoardingId },
					select: { id: true },
				});
				if (!user) {
					needsUserCreate = true;
					onboardingIdToCreate = order.onBoardingId;
				}
			}
		});
	} catch (e: any) {
		const code = e?.message === "ORDER_NOT_FOUND" ? 404 : 500;
		return NextResponse.json(
			{ ok: false, error: e?.message || "db_error" },
			{ status: code }
		);
	}

	// 5) Do post-commit side-effects (no DB locks held)
	if (needsUserCreate && onboardingIdToCreate) {
		// Prefer calling a local service function, not HTTP.
		// If you must call HTTP, use a BASE URL + internal token.
		const base = process.env.NEXT_PUBLIC_BASE_URL;
		try {
			const res = await fetch(`${base}/api/user/create`, {
				method: "POST",
				headers: {
					"content-type": "application/json",
				},
				body: JSON.stringify({
					onboardingId: onboardingIdToCreate,
					orderId: orderId,
				}),
			});
			if (!res.ok) {
				return NextResponse.json(
					{ ok: false, error: "user_creation_failed" },
					{ status: 500 }
				);
			}
		} catch {
			return NextResponse.json(
				{ ok: false, error: "user_creation_error" },
				{ status: 500 }
			);
		}
	}

	return NextResponse.json({ ok: true }, { status: 200 });
}

// // sample response for reference
// const a = {
// 	id: "evt_V2_b737837102414514ae0e9717a9f2664d",
// 	event_name: "ORDER_SUCCEEDED",
// 	date_created: "2023-08-10T07:00:48Z",
// 	content: {
// 		order: {
// 			offers: [],
// 			txn_id: "ms-sample_ord_200-1",
// 			udf7: "FILTERED",
// 			payment_method: "VISA",
// 			txn_uuid: "moziqFZtYKQkTsRFGXX",
// 			metadata: {
// 				payment_page_client_id: "FILTERED",
// 				merchant_payload:
// 					'{"customerPhone":"999999999","customerEmail":"1111111"}',
// 				payment_page_sdk_payload: "FILTERED",
// 				payment_links: {
// 					web: "https://smartgateway.hdfcbank.com/orders/ordeh_a9eb2884e4fe4738b70c3d51e6397d34/payment-page",
// 					iframe:
// 						"https://smartgateway.hdfcbank.com/orders/ordeh_a9eb2884e4fe4738b70c3d51e6397d34/payment-page",
// 					mobile:
// 						"https://smartgateway.hdfcbank.com/orders/ordeh_a9eb2884e4fe4738b70c3d51e6397d34/payment-page",
// 				},
// 			},
// 			udf5: "FILTERED",
// 			status_id: 21,
// 			amount_refunded: 0,
// 			udf9: "FILTERED",
// 			status: "CHARGED",
// 			bank_error_message: "",
// 			id: "ordeh_a9eb2884e4fe4738b70c3d51e6397d34",
// 			auth_type: "THREE_DS",
// 			udf3: "",
// 			udf6: "FILTERED",
// 			udf10: "FILTERED",
// 			effective_amount: 1,
// 			product_id: "",
// 			order_id: "sample_ord_200",
// 			return_url: "https://shop.merchant.com",
// 			payment_gateway_response: {
// 				gateway_response: {
// 					authCode: "ybbjy9",
// 					resMessage: "FILTERED",
// 					mandateToken: "FILTERED",
// 					resCode: "200",
// 				},
// 				created: "2023-08-10T07:00:48Z",
// 				auth_id_code: "ybbjy9",
// 			},
// 			udf1: "",
// 			currency: "INR",
// 			udf4: "",
// 			customer_id: "FILTERED",
// 			date_created: "1111111T07:00:40Z",
// 			gateway_id: 100,
// 			payment_links: {
// 				web: "https://smartgateway.hdfcbank.com/merchant/pay/ordeh_a9eb2884e4fe4738b70c3d51e6397d34",
// 				iframe:
// 					"https://smartgateway.hdfcbank.com/merchant/ipay/ordeh_a9eb2884e4fe4738b70c3d51e6397d34",
// 				mobile:
// 					"https://smartgateway.hdfcbank.com/merchant/pay/ordeh_a9eb2884e4fe4738b70c3d51e6397d34?mobile=true",
// 			},
// 			maximum_eligible_refund_amount: "FILTERED",
// 			txn_detail: {
// 				express_checkout: true,
// 				txn_id: "ms-sample_ord_200-1",
// 				txn_amount: 1,
// 				error_message: "",
// 				txn_uuid: "moziqFZtYKQkTsRFGXX",
// 				created: "2023-08-10T07:00:46Z",
// 				metadata: { payment_channel: "WEB", microapp: "hyperpay" },
// 				gateway: "DUMMY",
// 				status: "CHARGED",
// 				net_amount: 1,
// 				order_id: "sample_ord_200",
// 				currency: "INR",
// 				error_code: "",
// 				gateway_id: 100,
// 				txn_flow_type: "FILTERED",
// 				redirect: true,
// 			},
// 			bank_error_code: "",
// 			udf8: "FILTERED",
// 			payment_method_type: "CARD",
// 			customer_phone: "FILTERED",
// 			merchant_id: "ms",
// 			customer_email: "FILTERED",
// 			udf2: "",
// 			amount: 1,
// 			refunded: false,
// 			card: "FILTERED",
// 		},
// 	},
// };
