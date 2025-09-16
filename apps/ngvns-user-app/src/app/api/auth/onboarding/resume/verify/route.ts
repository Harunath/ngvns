import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const { phone, otp } = body;
		if (!phone || !otp) {
			return NextResponse.json(
				{ ok: false, error: "PHONE_AND_OTP_REQUIRED" },
				{ status: 400 }
			);
		}

		const phoneOtp = await prisma.phoneVerificationCode.findUnique({
			where: { phone },
		});

		if (!phoneOtp || !phoneOtp.expiresAt) {
			return NextResponse.json(
				{
					success: false,
					message: "OTP not found or expired.",
				},
				{ status: 400 }
			);
		}

		if (new Date() > phoneOtp.expiresAt) {
			return NextResponse.json(
				{
					success: false,
					message: "OTP has expired.",
				},
				{ status: 400 }
			);
		}

		if (otp !== phoneOtp.code) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid OTP code.",
				},
				{ status: 400 }
			);
		}

		const onboardingUser = await prisma.onboarding.update({
			where: { phone },
			data: { phoneVerified: true },
		});
		if (!onboardingUser) {
			return NextResponse.json(
				{ success: false, message: "Onboarding user not found." },
				{ status: 404 }
			);
		}
		const currentStep = onboardingUser.emailVerified ? "tandc" : "email";
		return NextResponse.json({
			success: true,
			message: "Onboarding user is registered",
			user: onboardingUser,
			currentStep,
		});
	} catch (error) {
		console.error("Verifying Phone error:", error);

		return NextResponse.json(
			{
				success: false,
				message: "Something went wrong. Please try again later.",
			},
			{ status: 500 }
		);
	}
}
