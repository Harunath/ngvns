import prisma, { PaymentStatus } from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

function buildHdfcAuthHeader() {
	const apiKey = process.env.PAYMENT_GATEWAY_API_KEY || "";
	if (!apiKey) throw new Error("API_KEY is missing");
	const raw = `${apiKey}:`;
	return `Basic ${Buffer.from(raw).toString("base64")}`;
}

function normalizeGatewayStatus(
	json: any
): PaymentStatus | "PENDING" | "FAILED" | "SUCCESS" {
	const status = (json.status || json.txn_status || "UNKNOWN").toUpperCase();
	if (status === "CHARGED" || status === "SUCCESS") return "SUCCESS";
	if (status === "FAILED" || status === "CANCELLED") return "FAILED";
	return "PENDING";
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const paymentId = searchParams.get("paymentId"); // your "orderId" from client

		if (!paymentId) {
			return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
		}

		// Load our order/payment session
		const session = await prisma.order.findUnique({
			where: { orderId: paymentId },
			select: {
				id: true,
				orderId: true,
				onBoardingId: true,
				totalAmount: true,
				currency: true,
			},
		});

		if (!session) {
			return NextResponse.json({ error: "Payment not found" }, { status: 404 });
		}

		// ---------- 1) External fetch (outside tx) ----------
		const baseUrl =
			process.env.NEXT_PUBLIC_NODE_ENV === "development"
				? process.env.PAYMENT_GATEWAY_BASE_URL_SANDBOX!
				: process.env.PAYMENT_GATEWAY_BASE_URL!;
		const merchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID!;
		const authHeader = buildHdfcAuthHeader();

		const gwRes = await fetch(`${baseUrl}/orders/${session.orderId}`, {
			method: "GET",
			headers: {
				Authorization: authHeader,
				version: "2023-06-30",
				"Content-Type": "application/x-www-form-urlencoded",
				"x-merchantid": merchantId,
				"x-customerid": session.onBoardingId,
			},
			cache: "no-store",
		});

		const rawText = await gwRes.text();
		let gwJson: any;
		try {
			gwJson = JSON.parse(rawText);
		} catch {
			return NextResponse.json(
				{ error: "Invalid response from gateway", raw: rawText },
				{ status: 502 }
			);
		}
		console.log("Gateway response:", gwJson);

		const nextStatus = normalizeGatewayStatus(gwJson); // "PENDING" | "FAILED" | "SUCCESS"

		// ---------- 2) DB-only transaction ----------
		const { changedToSuccess } = await prisma.$transaction(
			async (tx) => {
				// Read existing payment row (by a unique idempotency key)
				const existing = await tx.payment.findUnique({
					where: { paymentSessionId: session.id }, // ensure unique index on this
					select: { status: true },
				});
				const transitionedToSuccess = nextStatus === "SUCCESS";

				// idempotent write via upsert
				await tx.payment.upsert({
					where: { paymentSessionId: session.id },
					create: {
						orderId: session.id, // or session.orderId if that’s your external ref
						status: nextStatus,
						amount: session.totalAmount,
						currency: session.currency,
						paymentOrderId: gwJson.order_id || session.orderId,
						processedAt: new Date(),
						paymentMethod: gwJson.payment_method || null,
						gatewayResponse: JSON.stringify(gwJson), // consider trimming if too big
						paymentSessionId: session.id,
					},
					update: {
						status: nextStatus,
						processedAt: new Date(),
						paymentMethod: gwJson.payment_method || null,
						gatewayResponse: JSON.stringify(gwJson),
					},
				});

				// keep Order in sync
				await tx.order.update({
					where: { id: session.id },
					data: {
						status:
							nextStatus === "SUCCESS"
								? "PAID"
								: nextStatus === "FAILED"
									? "FAILED"
									: "PENDING",
					},
				});

				return { changedToSuccess: transitionedToSuccess };
			},
			// If you have concurrent poll + webhook hits, SERIALIZABLE reduces race issues.
			{ isolationLevel: "Serializable" }
		);
		console.log("changedToSuccess ", changedToSuccess);
		// ---------- 3) Side-effects AFTER commit ----------
		if (changedToSuccess) {
			fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/create`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					onboardingId: session.onBoardingId,
					orderId: session.orderId,
				}),
				// You can ignore the response; add a .catch for logs if you want.
			}).catch((e) => console.error("post-commit user/create failed", e));
		}

		return NextResponse.json({ status: nextStatus, response: gwJson });
	} catch (error) {
		console.error("Error in GET /api/payments/checkStatus:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
