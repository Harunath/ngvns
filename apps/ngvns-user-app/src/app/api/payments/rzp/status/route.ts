import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@ngvns2025/db/client";
import Razorpay from "razorpay";

const RZ_KEY_ID =
	process.env.NEXT_PUBLIC_GATEWAY_MODE == "TEST"
		? process.env.NEXT_PUBLIC_RZP_TEST_KEY_ID!
		: process.env.NEXT_PUBLIC_RZP_LIVE_KEY_ID!;
const RZ_KEY_SECRET =
	process.env.NEXT_PUBLIC_GATEWAY_MODE == "TEST"
		? process.env.RZP_TEST_KEY_SECRET!
		: process.env.RZP_LIVE_KEY_SECRET!;

var instance = new Razorpay({
	key_id: "YOUR_KEY_ID",
	key_secret: "YOUR_SECRET",
});

function isValidSignature({
	orderId,
	razorpay_payment_id,
	razorpay_order_id,
	razorpay_signature,
}: {
	orderId: string;
	razorpay_payment_id: string;
	razorpay_order_id: string;
	razorpay_signature: string;
}) {
	// IMPORTANT: HMAC over order_id|payment_id (order id MUST be the Razorpay order id)
	const payload = `${razorpay_order_id}|${razorpay_payment_id}`;
	const expected = crypto
		.createHmac("sha256", RZ_KEY_SECRET)
		.update(payload)
		.digest("hex");
	return expected === razorpay_signature;
}

// export async function POST(req: NextRequest) {
// 	try {
// 		const {
// 			orderId,
// 			razorpay_payment_id,
// 			razorpay_order_id,
// 			razorpay_signature,
// 		} = await req.json();

// 		// idempotency: load once
// 		if (
// 			!orderId ||
// 			!razorpay_payment_id ||
// 			!razorpay_order_id ||
// 			!razorpay_signature
// 		) {
// 			return NextResponse.json(
// 				{ error: "missing_parameters" },
// 				{ status: 400 }
// 			);
// 		}
// const ok = isValidSignature({
// 	orderId,
// 	razorpay_payment_id,
// 	razorpay_order_id,
// 	razorpay_signature,
// });
// if (!ok) {
// 	return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
// }
export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const paymentId = searchParams.get("paymentId"); // your "orderId" from client
		const orderId = searchParams.get("orderId");
		if (!orderId || !paymentId) {
			return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
		}

		const order = await prisma.order.findUnique({
			where: { orderId },
			include: { onBoarding: true },
		});
		if (!order) {
			return NextResponse.json({ error: "Order mismatch" }, { status: 400 });
		}

		var instance = new Razorpay({
			key_id: RZ_KEY_ID,
			key_secret: RZ_KEY_SECRET,
		});
		const res = await instance.payments.fetch(paymentId);
		if (res.error_code) {
			await prisma.order.update({
				where: { orderId: order.orderId },
				data: {
					status: "FAILED",
					notes: JSON.stringify({
						via: "callback",
						res: res,
					}),
				},
			});
			return NextResponse.json(
				{ ok: false, error: "invalid_signature", status: "FAILED" },
				{ status: 400 }
			);
		}
		if (res.status == "captured") {
			const alreadyPaid = await prisma.payment.findFirst({
				where: { orderId: order.id, status: "SUCCESS" },
			});
			if (alreadyPaid) {
				const user = await prisma.user.findFirst({
					where: { onBoardingId: order.onBoardingId },
				});
				if (!user) {
					// edge case: payment success but user creation failed earlier, try again
					fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user/create`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							onboardingId: order.onBoardingId,
							orderId: order.orderId,
						}),
					}).catch((e) => console.error("post-commit user/create failed", e));
				}
				return NextResponse.json({
					ok: true,
					alreadyPaid: true,
					status: "SUCCESS",
				});
			}

			await prisma.$transaction(async (tx) => {
				await tx.order.update({
					where: { orderId: order.orderId },
					data: {
						status: "PAID",
						notes: JSON.stringify({
							// razorpay_signature: razorpay_signature,
							via: "callback",
						}),
					},
				});
				// TODO: trigger your onboarding/user creation here safely (queue or outbox if heavy)
				await tx.payment.create({
					data: {
						orderId: order.id,
						amount: res.amount,
						currency: res.currency,
						paymentSessionId: order.orderId,
						status: "SUCCESS",
						paymentMethod: res.method,
						gatewayResponse: JSON.stringify(res),
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

			return NextResponse.json({ ok: true, status: "SUCCESS" });
		}
		return NextResponse.json({ ok: false, status: "PENDING" });
	} catch (e: any) {
		console.error(e);
		return NextResponse.json(
			{ error: e.message ?? "server_error" },
			{ status: 500 }
		);
	}
}
