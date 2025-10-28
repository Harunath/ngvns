import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import prisma, { MarketingRole, Prisma } from "@ngvns2025/db/client";

export const POST = async (request: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);

		if (
			!session ||
			!session.user ||
			session.user.role !== MarketingRole.GENERAL_MANAGER
		) {
			console.log("Unauthorized access attempt to create Manager");
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}

		const { userId } = await request.json();
		if (!userId) {
			return NextResponse.json(
				{ success: false, message: "userId is required" },
				{ status: 400 }
			);
		}

		// Ensure the manager actually has a team
		const marketingTeam = await prisma.marketingTeam.findUnique({
			where: { id: session.user.teamId },
			select: { id: true },
		});
		if (!marketingTeam) {
			return NextResponse.json(
				{ success: false, message: "Marketing team not found" },
				{ status: 404 }
			);
		}

		// Ensure the target user exists AND is directly joined by this manager (your current rule)
		const user = await prisma.user.findFirst({
			where: { vrKpId: userId, parentReferralId: session.user.vrKpId },
			select: {
				id: true,
				canRefer: true,
				marketingMember: { select: { id: true, role: true, teamId: true } },
			},
		});

		if (!user) {
			return NextResponse.json(
				{
					success: false,
					message: "User not found or not your direct referral",
				},
				{ status: 404 }
			);
		}

		if (user.marketingMember) {
			return NextResponse.json(
				{ success: false, message: "User is already a marketing member" },
				{ status: 409 }
			);
		}

		// Atomic: update user.canRefer and create MarketingMember together
		const result = await prisma.$transaction(async (tx) => {
			// Re-check inside the transaction to avoid race conditions
			const freshUser = await tx.user.findUnique({
				where: { id: user.id },
				select: {
					id: true,
					canRefer: true,
					marketingMember: { select: { id: true } },
				},
			});

			if (!freshUser) {
				throw new Error("USER_NOT_FOUND_RACE");
			}
			if (freshUser.marketingMember) {
				// bail out in tx: someone else created it
				const err = new Error("ALREADY_MEMBER");
				// @ts-expect-error add code for easier outer catch mapping
				err.code = "ALREADY_MEMBER";
				throw err;
			}

			const updatedUser = await tx.user.update({
				where: { id: user.id },
				data: { canRefer: true },
				select: { id: true, canRefer: true },
			});

			const newMember = await tx.marketingMember.create({
				data: {
					userId: freshUser.id,
					teamId: marketingTeam.id,
					role: MarketingRole.MANAGER, // <- adjust if you use a different enum value
				},
				select: {
					id: true,
					userId: true,
					teamId: true,
					role: true,
					createdAt: true,
				},
			});

			// (Optional) write an audit log here if you keep one
			// await tx.adminAuditLog.create({ data: { ... } })

			return { updatedUser, newMember };
		});

		return NextResponse.json({ success: true, data: result }, { status: 201 });
	} catch (error: any) {
		console.log("Error object:", error);
		// Handle unique constraint (e.g., marketingMember.userId unique) gracefully
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				return NextResponse.json(
					{ success: false, message: "User is already a marketing member" },
					{ status: 409 }
				);
			}
		}
		if (error?.code === "ALREADY_MEMBER") {
			return NextResponse.json(
				{ success: false, message: "User is already a marketing member" },
				{ status: 409 }
			);
		}
		if (error?.message === "USER_NOT_FOUND_RACE") {
			return NextResponse.json(
				{ success: false, message: "User disappeared during transaction" },
				{ status: 409 }
			);
		}

		console.error("Error creating Manager:", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
