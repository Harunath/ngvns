import prisma, { MarketingRole } from "@ngvns2025/db/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth/auth";

export const POST = async (request: NextRequest) => {
	try {
		const session = await getServerSession(authOptions);
		if (
			!session ||
			!session.user ||
			session.user.role != MarketingRole.GENERAL_MANAGER
		) {
			return NextResponse.json(
				{ success: false, message: "Unauthorized" },
				{ status: 401 }
			);
		}
		const body = await request.json();
		const { userId } = body;
		console.log("Fetching user with ID:", userId);
		const user = await prisma.user.findFirst({
			where: { vrKpId: userId, parentReferralId: session.user.vrKpId },
			select: {
				id: true,
				vrKpId: true,
				fullname: true,
				phone: true,
			},
		});
		if (!user) {
			return NextResponse.json(
				{ success: false, message: "User not found" },
				{ status: 404 }
			);
		}
		return NextResponse.json(user, { status: 200 });
	} catch (error) {
		console.error("Error fetching user:", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
