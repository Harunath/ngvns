// app/api/onboarding/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { phone, aadhaar, email } = body;

		// Step 1: Check User table for exact matches
		const existingUser = await prisma.user.findFirst({
			where: {
				OR: [{ phone }, { aadhaar }, { email }],
			},
		});

		if (existingUser) {
			const conflict =
				existingUser.phone === phone
					? "phone"
					: existingUser.aadhaar === aadhaar
						? "aadhaar"
						: "email";

			return NextResponse.json(
				{
					success: false,
					message: `User already exists in main system with ${conflict}.`,
					conflict,
				},
				{ status: 409 }
			);
		}

		// 🔍 Optimized: Single call to check for onboarding conflicts
		const onboardingConflicts = await prisma.onboarding.findMany({
			where: {
				OR: [{ phone }, { aadhaar }, { email }],
			},
		});

		for (const record of onboardingConflicts) {
			if (record.aadhaar === aadhaar && record.onBoardingFinished) {
				return NextResponse.json(
					{
						success: false,
						message: "User with this Aadhaar already onboarded.",
						conflict: "aadhaar",
					},
					{ status: 409 }
				);
			}
			if (record.phone === phone) {
				if (!record.onBoardingFinished) {
					return NextResponse.json(
						{
							success: false,
							message:
								"User already started onboarding. Please verify OTP to continue.",
							phone: record.phone,
							conflict: "phone",
							resume: true,
						},
						{ status: 409 }
					);
				}
			}
			if (record.email === email && record.onBoardingFinished) {
				return NextResponse.json(
					{
						success: false,
						message: "User with this email already onboarded.",
						conflict: "email",
					},
					{ status: 409 }
				);
			}
		}

		return NextResponse.json({
			success: true,
			message: "No conflicts with current data.",
		});
	} catch (error) {
		console.error("Onboarding creation error:", error);
		return NextResponse.json(
			{
				success: false,
				message: "Something went wrong. Please try again later.",
			},
			{ status: 500 }
		);
	}
}
