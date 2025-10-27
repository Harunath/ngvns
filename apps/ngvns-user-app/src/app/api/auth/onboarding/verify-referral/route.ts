// app/api/onboarding/create/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { referralId } = body;
		console.log("Verifying referral Id : ", referralId);
		// Step 1: Check User table for exact matches
		const existingUser = await prisma.user.findFirst({
			where: {
				vrKpId: referralId,
			},
			select: {
				id: true,
				canRefer: true,
				marketingMember: {
					select: {
						isActive: true,
					},
				},
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
		if (!existingUser.canRefer) {
			return NextResponse.json(
				{
					success: false,
					message: `The user with referral Id ${referralId} is not authorized to refer new users.`,
				},
				{ status: 403 }
			);
		}
		if (
			existingUser.marketingMember &&
			!existingUser?.marketingMember?.isActive
		) {
			return NextResponse.json(
				{
					success: false,
					message: `The user with referral Id ${referralId} is not an active marketing member.`,
				},
				{ status: 403 }
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
