// apps/..../app/api/payments/checkStatus/route.ts
import prisma, { PaymentStatus } from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

function buildHdfcAuthHeader() {
	const apiKey = process.env.PAYMENT_GATEWAY_API_KEY || "";
	if (!apiKey) throw new Error("API_KEY is missing");
	const raw = `${apiKey}:`;
	return `Basic ${Buffer.from(raw).toString("base64")}`;
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const paymentId = searchParams.get("paymentId");

		if (!paymentId) {
			return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
		}

		const payment = await prisma.order.findUnique({
			where: { orderId: paymentId },
		});
		if (!payment) {
			return NextResponse.json({ error: "Payment not found" }, { status: 404 });
		}

		const baseUrl =
			process.env.NEXT_PUBLIC_NODE_ENV == "development"
				? process.env.PAYMENT_GATEWAY_BASE_URL_SANDBOX!
				: process.env.PAYMENT_GATEWAY_BASE_URL;
		const merchantId = process.env.PAYMENT_GATEWAY_MERCHANT_ID!;
		const authHeader = buildHdfcAuthHeader();

		const res = await fetch(`${baseUrl}/orders/${payment.orderId}`, {
			method: "GET",
			headers: {
				Authorization: authHeader,
				version: "2023-06-30",
				"Content-Type": "application/x-www-form-urlencoded",
				"x-merchantid": merchantId,
				"x-customerid": payment.onBoardingId,
			},
			cache: "no-store",
		});

		const text = await res.text();
		let json: any;
		console.log("text ", text);
		try {
			json = JSON.parse(text);
		} catch {
			return NextResponse.json(
				{ error: "Invalid response from HDFC", raw: text },
				{ status: 502 }
			);
		}

		// Extract status
		const status = json.status || json.txn_status || "UNKNOWN";
		let dbStatus: PaymentStatus = "PENDING";
		if (status == "FAILED" || status == "CANCELLED") dbStatus = "FAILED";
		else if (status == "CHARGED") dbStatus = PaymentStatus.SUCCESS;
		else if (status == "INITIATED" || status == "PENDING") dbStatus = "PENDING";

		// Update DB
		await prisma.$transaction(async (tx) => {
			await tx.payment.create({
				data: {
					orderId: payment.id,
					status: dbStatus,
					amount: payment.totalAmount,
					currency: payment.currency,
					paymentOrderId: json.order_id || payment.orderId,
					processedAt: new Date(),
					paymentMethod: json.payment_method || null,
					gatewayResponse: JSON.stringify(json),
					paymentSessionId: payment.id,
				},
			});
			await tx.order.update({
				where: { id: payment.id },
				data: { status: "PAID" },
			});
		});
		return NextResponse.json({ status, response: json });
	} catch (error) {
		console.error("Error in GET /api/payments/checkStatus:", error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
