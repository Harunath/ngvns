import { NextRequest, NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";
import { v4 as uuidv4 } from "uuid";

export async function POST(req: NextRequest) {
	try {
		const { phone } = await req.json();

		if (!phone) {
			return NextResponse.json(
				{ success: false, message: "onboardingId is required" },
				{ status: 400 }
			);
		}

		const onboarding = await prisma.onboarding.findUnique({
			where: { phone },
		});

		if (!onboarding) {
			return NextResponse.json(
				{ success: false, message: "Onboarding not found" },
				{ status: 404 }
			);
		}

		const result = await prisma.$transaction(async (tx) => {
			// Step 1: Create fake Order
			const order = await tx.order.create({
				data: {
					paymentOrderId: uuidv4(),
					paymentSessionId: uuidv4(),
					status: "PAID",
					totalAmount: 3999,
					currency: "INR",
					onBoardingId: onboarding.id,
				},
			});

			// Step 2: Create fake Payment
			await tx.payment.create({
				data: {
					paymentOrderId: uuidv4(),
					paymentSessionId: uuidv4(),
					status: "SUCCESS",
					amount: 3999,
					currency: "INR",
					orderId: order.id,
					processedAt: new Date(),
				},
			});

			// Step 3: Create User
			const user = await tx.user.create({
				data: {
					fullname: onboarding.fullname,
					relationType: onboarding.relationType,
					relationName: onboarding.relationName,
					dob: onboarding.dob,
					address: onboarding.address || "",
					phone: onboarding.phone,
					email: onboarding.email,
					emailVerified: onboarding.emailVerified,
					aadhaar: onboarding.aadhaar,
					aadhaarVerified: onboarding.aadhaarVerified,
					gender: onboarding.gender,
					userPhoto: onboarding.userPhoto,
					referralId: uuidv4(),
					nominieeName: onboarding.nominieeName,
					nominieeDob: onboarding.nominieeDob,
					relationship: onboarding.relationship,
					onBoardingId: onboarding.id,
					orderId: order.id,
				},
			});

			return user;
		});

		return NextResponse.json({
			success: true,
			message: "User successfully created",
			userId: result.id,
		});
	} catch (error) {
		console.error("[USER_CREATE_ERROR]", error);
		return NextResponse.json(
			{ success: false, message: "Something went wrong", error: String(error) },
			{ status: 500 }
		);
	}
}
