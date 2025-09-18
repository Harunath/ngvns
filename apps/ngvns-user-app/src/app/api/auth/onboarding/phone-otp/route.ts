// app/api/onboarding/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";
import { generateOtp } from "../../../../../utils/generateOtp";
import { OTPURI } from "../../../../../utils/OTPPhone";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { phone } = body;

		if (!phone) {
			return NextResponse.json(
				{
					success: false,
					message: `Phone number is required`,
				},
				{ status: 404 }
			);
		}

		// Step 1: Check User table for exact matches
		const existingUser = await prisma.user.findFirst({
			where: {
				phone: phone,
			},
		});

		if (existingUser) {
			return NextResponse.json(
				{
					success: false,
					message: `Phone number ${phone} is already taken`,
				},
				{ status: 409 }
			);
		}

		const code = generateOtp(6);
		const date = new Date();
		const expiresAt = new Date(date.getTime() + 10 * 60 * 1000);
		console.log(`phone code for ${phone} is ${code}`);

		const url = OTPURI({
			username: process.env.SMS_USERNAME!,
			apikey: process.env.SMS_API_KEY!,
			senderid: process.env.SMS_SENDER_ID!,
			mobile: phone,
			message: `Dear member, your OTP for phone number verification to the vrkisanparivaar Application is ${code}. It is valid for 10 minutes. Please do not share it with anyone.`,
			templateid: process.env.SMS_TEMPLATE_ID!,
		});

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
		if (process.env.NEXT_PUBLIC_NODE_ENV == "production") {
			const response = await fetch(url);
			const data = await response.text();
			console.log("SMS API response:", data);
		}
		return NextResponse.json({
			success: true,
			message: `OTP is sent to ${phone} phone number.`,
		});
	} catch (error) {
		console.error("Phone Verifing error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Something went wrong. Please try again later.",
			},
			{ status: 500 }
		);
	}
}
