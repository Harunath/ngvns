// app/api/onboarding/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";
import { generateOtp } from "../../../../../utils/generateOtp";
import { SentEmailOtp } from "../../../../../utils/OTPEmail";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { email } = body;

		if (!email) {
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
				email: email,
			},
		});

		if (existingUser) {
			return NextResponse.json(
				{
					success: false,
					message: `Email ${email} is already taken`,
				},
				{ status: 409 }
			);
		}

		const code = generateOtp(6);
		const date = new Date();
		const expiresAt = new Date(date.getTime() + 10 * 60 * 1000);
		console.log(`email code for ${email} is ${code}`);
		// await SentEmailOtp(process.env.ZEPTO_TOKEN as string, code, email);

		await prisma.gmailVerificationCode.upsert({
			where: { email },
			create: {
				email,
				code,
				expiresAt,
			},
			update: {
				code,
				expiresAt,
			},
		});

		return NextResponse.json({
			success: true,
			message: `OTP is sent to ${email} email.`,
		});
	} catch (error) {
		console.error("Email Verifing error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Something went wrong. Please try again later.",
			},
			{ status: 500 }
		);
	}
}
