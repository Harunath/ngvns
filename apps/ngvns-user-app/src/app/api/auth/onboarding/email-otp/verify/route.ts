import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const onboardingSchema = z.object({
	email: z.email(),
	code: z.string().length(6, "OTP must be at least 4 digits"),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		console.log("Request body:", body);
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

		const { email, code } = parsed.data;
		const emailOtp = await prisma.gmailVerificationCode.findFirst({
			where: { email },
		});
		console.log("Fetched emailOtp:", emailOtp);
		if (!emailOtp || !emailOtp.expiresAt) {
			return NextResponse.json(
				{
					success: false,
					message: "OTP not found or expired.",
				},
				{ status: 400 }
			);
		}

		// if (new Date() > emailOtp.expiresAt) {
		// 	return NextResponse.json(
		// 		{
		// 			success: false,
		// 			message: "OTP has expired.",
		// 		},
		// 		{ status: 400 }
		// 	);
		// }

		// if (code !== emailOtp.code) {
		// 	return NextResponse.json(
		// 		{
		// 			success: false,
		// 			message: "Invalid OTP code.",
		// 		},
		// 		{ status: 400 }
		// 	);
		// }
		// console.log("correct code ", code, " ");
		// // You need to use a unique identifier for the onboarding record, such as id, phone, or referralId.
		// // For example, if 'email' is not unique, you should first fetch the onboarding record to get its unique id.
		const onboardingRecord = await prisma.onboarding.findFirst({
			where: { email },
		});
		console.log(onboardingRecord);
		if (!onboardingRecord) {
			return NextResponse.json(
				{
					success: false,
					message: "Onboarding record not found.",
				},
				{ status: 404 }
			);
		}
		await prisma.onboarding.update({
			where: { id: onboardingRecord.id },
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
