import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@ngvns2025/db/client";
import { makeGatewayOrderId } from "../../../../../utils/gatewayOrderId";
import Razorpay from "razorpay";

const RZ_KEY_ID =
	process.env.NEXT_PUBLIC_GATEWAY_MODE == "TEST"
		? process.env.NEXT_PUBLIC_RZP_TEST_KEY_ID!
		: process.env.NEXT_PUBLIC_RZP_LIVE_KEY_ID!;
const RZ_KEY_SECRET =
	process.env.NEXT_PUBLIC_GATEWAY_MODE == "TEST"
		? process.env.RZP_TEST_KEY_SECRET!
		: process.env.RZP_LIVE_KEY_SECRET!;

// const amount = 524995; // INR in paise
const amount = process.env.NEXT_PUBLIC_AMOUNT || 524995;

export async function POST(req: NextRequest) {
	try {
		const { phone } = (await req.json()) as { phone: string }; // your business order id

		const onboarding = await prisma.onboarding.findUnique({ where: { phone } });
		if (!onboarding)
			return NextResponse.json({ error: "Order not found" }, { status: 404 });

		// const body = JSON.stringify({
		// 	amount: 5249.95,
		// 	currency: "INR",
		// 	notes: { source: "web", project: "VRKP" },
		// 	customerId: onboarding.id,
		// 	customerPhone: onboarding.phone,
		// 	receipt: `vrkp_onboarding_${onboarding.id}`,
		// });

		// const basic = Buffer.from(`${RZ_KEY_ID}:${RZ_KEY_SECRET}`).toString(
		// 	"base64"
		// );
		// const r = await fetch("https://api.razorpay.com/v1/orders", {
		// 	method: "POST",
		// 	headers: {
		// 		Authorization: `Basic ${basic}`,
		// 		"Content-Type": "application/json",
		// 	},
		// 	body,
		// });
		console.log({ RZ_KEY_ID, RZ_KEY_SECRET });
		console.log(phone);
		var instance = new Razorpay({
			key_id: RZ_KEY_ID,
			key_secret: RZ_KEY_SECRET,
		});

		const r = await instance.orders.create({
			amount: amount,
			currency: "INR",
			notes: { source: "web", project: "VRKP" },
			receipt: `${onboarding.id}`,
		});
		if (!r.id) {
			return NextResponse.json(
				{ error: "Razorpay order create failed" },
				{ status: 502 }
			);
		}
		console.log(r);
		// const json = (await r.json()) as {
		// 	id: string;
		// 	amount: number;
		// 	currency: string;
		// 	status: string;
		// };
		await prisma.order.create({
			data: {
				orderId: r.id,
				onBoardingId: onboarding.id,
				totalAmount: r.amount,
				currency: r.currency,
				status: "PENDING",
				notes: `VRKP onboarding payment for ${onboarding.fullname} (${onboarding.phone})`,
			},
		});

		return NextResponse.json({
			ok: true,
			rzOrderId: r.id,
			amount: r.amount,
			currency: r.currency,
			onBoardingPhone: onboarding.phone,
		});
	} catch (e: any) {
		console.error("Razorpay order create error", e);
		return NextResponse.json(
			{ error: e.message ?? "server_error" },
			{ status: 500 }
		);
	}
}
