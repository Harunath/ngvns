// apps/<your-app>/app/api/onboarding/resume/lookup/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { OTPURI } from "../../../../../utils/OTPPhone";
import { generateOtp } from "../../../../../utils/generateOtp";
const prisma = new PrismaClient();

// DO: return a generic response to avoid leaking whether phone exists
export async function POST(req: Request) {
	try {
		const { phone } = await req.json();
		if (!phone)
			return NextResponse.json(
				{ ok: false, error: "PHONE_REQUIRED" },
				{ status: 400 }
			);

		// If user missing, optionally create a user shell so OTP can proceed
		let user = await prisma.onboarding.findUnique({ where: { phone } });
		if (!user) {
			return NextResponse.json({ error: "USER_NOT_FOUND" }, { status: 404 });
		}

		// Issue OTP (store a hashed code + TTL in a table or KV; here simplified)
		// const otp =
		// 	process.env.NODE_ENV === "development"
		// 		? "111111"
		// 		: Math.floor(100000 + Math.random() * 900000).toString();
		const code = generateOtp(6);
		const date = new Date();
		const expiresAt = new Date(date.getTime() + 10 * 60 * 1000);

		if (process.env.NEXT_PUBLIC_NODE_ENV == "production") {
			const url = OTPURI({
				username: process.env.SMS_USERNAME!,
				apikey: process.env.SMS_API_KEY!,
				senderid: process.env.SMS_SENDER_ID!,
				mobile: phone,
				message: `Dear member, your OTP for phone number verification to the vrkisanparivaar Application is ${code}. It is valid for 10 minutes. Please do not share it with anyone.`,
				templateid: process.env.SMS_TEMPLATE_ID!,
			});
			const response = await fetch(url);
			const data = await response.text();
			console.log("SMS API response:", data);
		}

		await prisma.phoneVerificationCode.upsert({
			where: { phone: phone },
			create: {
				phone: phone,
				code,
				expiresAt,
			},
			update: {
				code,
				expiresAt,
			},
		});

		if (process.env.NODE_ENV === "development")
			return NextResponse.json({
				ok: true,
				message: "OTP sent",
				otp: code,
			});
		return NextResponse.json({
			ok: true,
			message: "OTP sent",
		});
	} catch (error) {
		console.error("Error in resume", error);
		return NextResponse.json(
			{
				success: false,
				message: "Internal server error",
			},
			{ status: 500 }
		);
	}
}
