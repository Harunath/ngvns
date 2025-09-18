import prisma, { GenderType, RelationType } from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const phoneSchema = z.object({
	phone: z
		.string()
		.min(10, "Phone number must be at least 10 digits")
		.max(10, "Phone number must be at most 10 digits"),
	code: z.string().length(6, "OTP must be at least 4 digits"),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const parsed = phoneSchema.safeParse(body);
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

		const { phone, code } = parsed.data;
		console.log("Parsed code:", code);
		const phoneOtp = await prisma.phoneVerificationCode.findUnique({
			where: { phone },
		});
		console.log("Fetched phoneOtp:", phoneOtp);

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

		if (code !== phoneOtp.code) {
			return NextResponse.json(
				{
					success: false,
					message: "Invalid OTP code.",
				},
				{ status: 400 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "Onboarding user is registered",
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
