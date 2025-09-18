import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";

import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ", 6);

function generateVrkpId(pincode: string) {
	const pin = pincode.slice(0, 3).padStart(3, "0"); // ensure 3 digits
	const uniqueCode = nanoid(); // e.g., "A1B2C3"
	return `VR${pin}${uniqueCode}`;
}

const BodySchema = z.object({
	orderId: z.string().min(1, "orderId is required"),
	// If you already have a password from onboarding, pass it here.
	// Otherwise we generate a temporary one.
	onboardingId: z.string().min(1, "onboardingId is required"),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { orderId, onboardingId } = BodySchema.parse(body);

		// 1) Load the onboarding with address & basic sanity
		const ob = await prisma.onboarding.findUnique({
			where: { id: onboardingId },
			include: {
				address: true, // assumes Address model exists & relation name "OnboardingAddress"
				user: true,
			},
		});

		if (!ob) {
			return NextResponse.json(
				{ ok: false, error: "onboarding_not_found" },
				{ status: 404 }
			);
		}
		if (ob.user) {
			return NextResponse.json(
				{ ok: false, error: "user_already_created_for_onboarding" },
				{ status: 409 }
			);
		}

		// Optional: ensure onboarding finished flag (if you want to gate creation)
		// if (!ob.onBoardingFinished) {
		//   return NextResponse.json(
		//     { ok: false, error: "onboarding_not_finished" },
		//     { status: 400 }
		//   );
		// }

		// Optional: if you want to ensure the order belongs to this onboarding & is paid
		// const order = await prisma.order.findFirst({
		//   where: { id: orderId, onboardingId: onboardingId, status: "SUCCESS" },
		// });
		// if (!order) {
		//   return NextResponse.json(
		//     { ok: false, error: "order_invalid_or_not_paid" },
		//     { status: 400 }
		//   );
		// }

		// 2) Basic duplicate checks (email/phone unique in User)
		// You can relax or change this to merge logic if desired.
		const [existingByPhone, existingByEmail, existingOrder] = await Promise.all(
			[
				prisma.user.findUnique({ where: { phone: ob.phone } }),
				ob.email
					? prisma.user.findUnique({ where: { email: ob.email } })
					: null,
				prisma.user.findUnique({ where: { orderId } }),
			]
		);

		if (existingOrder) {
			return NextResponse.json(
				{ ok: false, error: "order_already_used" },
				{ status: 409 }
			);
		}
		if (existingByPhone && existingByPhone.onBoardingId !== onboardingId) {
			return NextResponse.json(
				{ ok: false, error: "phone_already_in_use" },
				{ status: 409 }
			);
		}
		if (existingByEmail && existingByEmail.onBoardingId !== onboardingId) {
			return NextResponse.json(
				{ ok: false, error: "email_already_in_use" },
				{ status: 409 }
			);
		}

		// 4) Create user in a transaction with vrKpId collision retries
		const MAX_RETRIES = 5;
		let createdUser = null;
		if (!ob.address || !ob.address.pincode) {
			return NextResponse.json(
				{ ok: false, error: "address_or_pincode_missing_in_onboarding" },
				{ status: 400 }
			);
		}
		for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
			try {
				createdUser = await prisma.$transaction(async (tx) => {
					// Recompute vrKpId each retry to change the suffix
					const vrKpId = generateVrkpId(ob.address!.pincode);
					const plainPassword = vrKpId;
					const hashed = await bcrypt.hash(plainPassword, 10);

					// Copy address from onboarding (if present)
					const addressData = ob.address
						? {
								create: {
									addressLine: ob.address.addressLine,
									addressLine2: ob.address.addressLine2 ?? null,
									StateId: ob.address.StateId,
									pincode: ob.address.pincode,
								},
							}
						: undefined;

					// Create the user
					const user = await tx.user.create({
						data: {
							fullname: ob.fullname,
							relationType: ob.relationType,
							relationName: ob.relationName,
							dob: ob.dob,
							address: addressData, // relation("UserAddress")
							phone: ob.phone,
							email: ob.email, // Onboarding.email can be non-unique, but User.email is unique
							emailVerified: ob.emailVerified,
							aadhaar: ob.aadhaar,
							aadhaarVerified: ob.aadhaarVerified,
							password: hashed,
							gender: ob.gender,
							userPhoto: ob.userPhoto,
							vrKpId: vrKpId,
							nominieeName: ob.nominieeName,
							nominieeDob: ob.nominieeDob,
							relationship: ob.relationship,
							onBoardingId: ob.id,
							orderId, // the paid order id (string, unique)
							// referral/parent link
							parentReferralId: ob.parentreferralId ?? null,
							// defaults: deleted=false, deactivated=false, healthCard=false
						},
					});

					// Optional: connect back on Onboarding.user (not required since user has onBoardingId)
					// await tx.onboarding.update({
					//   where: { id: ob.id },
					//   data: { user: { connect: { id: user.id } } },
					// });

					return user;
				});

				break; // success -> exit retry loop
			} catch (err: any) {
				// On unique collision for vrKpId, retry
				if (err?.code === "P2002" && err?.meta?.target?.includes("vrKpId")) {
					if (attempt === MAX_RETRIES) throw err;
					continue;
				}
				// Propagate any other error
				throw err;
			}
		}

		return NextResponse.json(
			{
				ok: true,
				user: {
					id: createdUser!.id,
					vrKpId: createdUser!.vrKpId,
					phone: createdUser!.phone,
					email: createdUser!.email,
					onBoardingId: createdUser!.onBoardingId,
					orderId: createdUser!.orderId,
				},
				// If you generated a temp password, you can (optionally) return a hint
				// Remove this in production for security or send via secure channel (email/SMS)
				tempPasswordIssued: true,
			},
			{ status: 201 }
		);
	} catch (e: any) {
		// Zod errors
		if (e.name === "ZodError") {
			return NextResponse.json(
				{ ok: false, error: "invalid_body", details: e.flatten() },
				{ status: 400 }
			);
		}

		// Prisma unique conflicts on phone/email/orderId
		if (e?.code === "P2002") {
			const target = Array.isArray(e?.meta?.target)
				? e.meta.target.join(",")
				: e?.meta?.target;
			return NextResponse.json(
				{ ok: false, error: "unique_constraint_violation", target },
				{ status: 409 }
			);
		}

		console.error("create-user error", e);
		return NextResponse.json(
			{ ok: false, error: "internal_error" },
			{ status: 500 }
		);
	}
}
