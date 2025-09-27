import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@ngvns2025/db/client";
import { validateWebhookSignature } from "razorpay/dist/utils/razorpay-utils";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
	const raw = await req.json();
	const signature = req.headers.get("x-razorpay-signature") || "";
	const webhook_event_id = req.headers.get("x-razorpay-event-id") || "";

	if (
		!signature ||
		!validateWebhookSignature(
			raw,
			signature,
			process.env.RAZORPAY_WEBHOOK_SECRET!
		)
	) {
		return NextResponse.json(
			{ ok: false, error: "invalid_signature" },
			{ status: 400 }
		);
	}

	const evt = JSON.parse(raw);
	const type = evt.event as
		| "payment.captured"
		| "payment.failed"
		| "order.paid";

	try {
		if (type === "payment.captured" || type === "order.paid") {
			const rzOrderId =
				evt.payload?.payment?.entity?.order_id ||
				evt.payload?.order?.entity?.id;
			const rzPaymentId = evt.payload?.payment?.entity?.id;

			if (rzOrderId) {
				const order = await prisma.order.findFirst({
					where: { orderId: rzOrderId },
				});

				if (order && order.status !== "PAID") {
					await prisma.$transaction(async (tx) => {
						await tx.order.update({
							where: { id: order.id },
							data: {
								status: "PAID",
								notes: JSON.stringify({
									webhook_event_id,
									via: "webhook",
								}),
							},
						});
						// TODO: trigger your onboarding/user creation here safely (queue or outbox if heavy)
						await tx.payment.create({
							data: {
								orderId: order.id,
								amount: order.totalAmount,
								currency: order.currency,
								paymentSessionId: rzPaymentId,
								status: "SUCCESS",
								paymentMethod: "unkwnown",
								gatewayResponse: JSON.stringify(raw),
								paymentOrderId: order.orderId,
							},
						});
					});
					fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/create`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							onboardingId: order.onBoardingId,
							orderId: order.orderId,
						}),
						// You can ignore the response; add a .catch for logs if you want.
					}).catch((e) => console.error("post-commit user/create failed", e));
				}
			}
		} else if (type === "payment.failed") {
			const rzOrderId = evt.payload?.payment?.entity?.order_id;
			if (rzOrderId) {
				const order = await prisma.order.findFirst({
					where: { orderId: rzOrderId },
				});
				if (order)
					await prisma.order.update({
						where: { id: order.id },
						data: {
							status: "FAILED",
							notes: JSON.stringify({
								webhook_event_id,
								via: "webhook",
								res: evt,
							}),
						},
					});
			}
		}

		return NextResponse.json({ ok: true });
	} catch (e: any) {
		return NextResponse.json({ ok: false, error: e.message }, { status: 500 });
	}
}
