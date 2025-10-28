import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth/auth";
import prisma, { AdminRole, MarketingRole } from "@ngvns2025/db/client";

export const POST = async (request: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id || session.user.role != AdminRole.SUPER) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		const body = await request.json();
		const { marketingTeamId, generalmanagerId } = body;

		if (!marketingTeamId || !generalmanagerId) {
			console.error("marketingTeamId or managerId ");
			return NextResponse.json(
				{ error: "marketingTeamId and managerId are required" },
				{ status: 400 }
			);
		}
		// Here you would add the logic to assign the manager to the marketing team
		const user = await prisma.user.findUnique({
			where: { id: generalmanagerId },
			select: { id: true },
		});
		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}
		const marketingTeam = await prisma.marketingTeam.findUnique({
			where: { id: marketingTeamId },
		});
		if (!marketingTeam) {
			return NextResponse.json(
				{ error: "Marketing Team not found" },
				{ status: 404 }
			);
		}
		await prisma.marketingMember.create({
			data: {
				userId: generalmanagerId,
				teamId: marketingTeamId,
				role: MarketingRole.GENERAL_MANAGER,
			},
		});
		return NextResponse.json(
			{ message: "General Manager assigned successfully" },
			{ status: 200 }
		);
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
