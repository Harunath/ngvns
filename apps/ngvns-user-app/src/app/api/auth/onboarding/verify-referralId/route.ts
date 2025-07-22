// app/api/onboarding/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { referralId } = body;

		// Step 1: Check User table for exact matches
		const existingUser = await prisma.user.findFirst({
			where: {
				referralId: referralId,
			},
		});

		if (!existingUser) {
			return NextResponse.json(
				{
					success: false,
					message: `No user exists with the referral Id ${referralId}.`,
				},
				{ status: 404 }
			);
		}

		return NextResponse.json({
			success: true,
			message: "User exists with the given referral Id.",
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
