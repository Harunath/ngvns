import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const onboardingSchema = z.object({
	email: z.email(),
	phone: z.string().length(10, "Wrong user"),
	code: z.string().length(6, "OTP must be at least 4 digits"),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const parsed = onboardingSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid input",
					errors: parsed.error.issues,
				},
				{ status: 400 }
			);
		}

		const { email, code, phone } = parsed.data;

		const emailOtp = await prisma.gmailVerificationCode.findUnique({
			where: { email },
		});

		if (!emailOtp || !emailOtp.expiresAt) {
			return NextResponse.json(
				{
					success: false,
					message: "OTP not found or expired.",
				},
				{ status: 400 }
			);
		}

		if (new Date() > emailOtp.expiresAt) {
			return NextResponse.json(
				{
					success: false,
					message: "OTP has expired.",
				},
				{ status: 400 }
			);
		}

		if (code !== emailOtp.code) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid OTP code.",
				},
				{ status: 400 }
			);
		}
		console.log("correct code ", code, " ", phone);
		await prisma.onboarding.update({
			where: { phone },
			data: {
				emailVerified: true,
			},
		});

		return NextResponse.json({
			success: true,
			message: "Email is successfully verified",
		});
	} catch (error) {
		console.error("Email Verifying error:", error);

		return NextResponse.json(
			{
				success: false,
				message: "Something went wrong. Please try again later.",
			},
			{ status: 500 }
		);
	}
}
