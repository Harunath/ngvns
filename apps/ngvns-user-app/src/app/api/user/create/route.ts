import prisma, { MarketingRole } from "@ngvns2025/db/client";
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
				parentrederral: true,
				user: true,
			},
		});

		if (!ob) {
			console.error("Onboarding not found", { onboardingId });
			return NextResponse.json(
				{ ok: false, error: "onboarding_not_found" },
				{ status: 404 }
			);
		}
		if (ob.user) {
			console.error("User already exists for onboarding", { onboardingId });
			return NextResponse.json(
				{ ok: false, error: "user_already_created_for_onboarding" },
				{ status: 409 }
			);
		}

		const order = await prisma.order.findUnique({
			where: { orderId },
		});
		if (
			!order ||
			order.onBoardingId !== onboardingId ||
			order.status !== "PAID"
		) {
			return NextResponse.json(
				{ ok: false, error: "order_invalid_or_not_paid" },
				{ status: 400 }
			);
		}

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
		if (!ob.parentreferralId) {
			console.error("parent_referral_id_missing_in_onboarding", {
				onboardingId,
			});
			return NextResponse.json(
				{ ok: false, error: "parent_referral_id_missing_in_onboarding" },
				{ status: 400 }
			);
		}
		const parents = await prisma.user.findFirst({
			where: { vrKpId: ob.parentreferralId! },
			select: {
				id: true,
				parentB: { select: { id: true } },
				joinedBy: { select: { id: true } },
				marketingMember: true,
				canRefer: true,
				vrKpId: true,
			},
		});

		if (!parents) {
			console.error("parent_user_not_found", {
				onboardingId,
				parentReferralId: ob.parentreferralId,
			});
			return NextResponse.json(
				{ ok: false, error: "parent_user_not_found" },
				{ status: 404 }
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
			if (parents?.canRefer === false) {
				break;
			}
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
					type ParentInfo = {
						id: string;
						canRefer: boolean | null;
						joinedBy?: { id: string } | null; // parentA's parent (B)
						parentB?: { id: string } | null; // parentA's grandparent (C)
						marketingMember?: { isActive: boolean; role: MarketingRole } | null;
						vrKpId: string;
					};
					function computeABC(p: ParentInfo) {
						// A = direct parent (always p.id)
						// B/C depend on marketing role when it's a marketing join
						let A: string | null = p.id;
						let B: string | null = p.joinedBy?.id ?? null;
						let C: string | null = p.parentB?.id ?? null;
						const isMarketingJoin =
							!!parents?.marketingMember?.isActive &&
							[
								MarketingRole.MANAGER,
								MarketingRole.TEAM_LEADER,
								MarketingRole.AGENT,
							].includes(parents.marketingMember.role);
						if (isMarketingJoin) {
							switch (p.marketingMember!.role) {
								case MarketingRole.MANAGER:
									// A = manager, no B/C
									B = null;
									C = null;
									break;
								case MarketingRole.TEAM_LEADER:
									// A = team leader, B = their manager
									// (joinedBy is expected to be manager in your current model)
									C = null;
									break;
								case MarketingRole.AGENT:
									// A = agent, B = TL, C = manager (as you stored)
									break;
								default:
									// keep defaults
									break;
							}
						}

						return { A, B, C };
					}

					const { A, B, C } = computeABC(parents);
					let canRefer = false;
					if (!parents?.marketingMember) {
						canRefer = true;
					}
					console.log("Creating user with vrKpId", vrKpId);
					console.log("Parent/Referral IDs", {
						A,
						B,
						C,
					});
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
							canRefer: canRefer,
							nominieeName: ob.nominieeName,
							nominieeDob: ob.nominieeDob,
							relationship: ob.relationship,
							onBoardingId: ob.id,
							orderId: order.id,
							parentReferralId: A ? parents.vrKpId : null,
							parentBId: B,
							parentCId: C,
						},
						select: {
							id: true,
							vrKpId: true,
							phone: true,
							email: true,
							fullname: true,
							onBoardingId: true,
							orderId: true,
						},
					});

					return user;
				});
				if (createdUser) {
					console.log("User created", {
						id: createdUser.id,
						name: createdUser.fullname,
						vrKpId: createdUser.vrKpId,
						phone: createdUser.phone,
					});
					const res = await fetch(
						`${process.env.NEXT_PUBLIC_BASE_URL}/api/notifications/sms/welcome`,
						{
							method: "POST",
							body: JSON.stringify({
								mobile: createdUser.phone,
								memberIdPassword: createdUser.vrKpId, // fill {#var#}
								idempotencyKey: `${createdUser.vrKpId}`, // prevents duplicates
							}),
							headers: { "Content-Type": "application/json" },
						}
					);
					if (!res.ok) {
						console.error("Failed to send welcome SMS", {
							status: res.status,
							statusText: res.statusText,
						});
					} else {
						console.log("Welcome SMS sent successfully");
					}
				}

				break; // success -> exit retry loop
			} catch (err: any) {
				// On unique collision for vrKpId, retry
				console.error(`Attempt ${attempt} to create user failed`, err);
				if (err?.code === "P2002" && err?.meta?.target?.includes("vrKpId")) {
					if (attempt === MAX_RETRIES) throw err;
					continue;
				}
				// Propagate any other error
				throw err;
			}
		}
		if (!createdUser) {
			console.error("Failed to create user - parent cannot refer", {
				onboardingId,
				parentReferralId: ob.parentreferralId,
			});
			return NextResponse.json(
				{ ok: false, error: "parent_cannot_refer" },
				{ status: 400 }
			);
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
		console.error("create-user caught error", e);
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
