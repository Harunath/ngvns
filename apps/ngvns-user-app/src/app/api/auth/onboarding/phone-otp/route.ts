// app/api/onboarding/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";
import { generateOtp } from "../../../../../utils/generateOtp";

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
