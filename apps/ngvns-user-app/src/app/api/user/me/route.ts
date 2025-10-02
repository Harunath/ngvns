import { NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth/auth";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				fullname: true,
				phone: true,
				email: true,
				vrKpId: true,
				relationType: true,
				relationName: true,
				gender: true,
				userPhoto: true,
				healthCard: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		if (!user)
			return NextResponse.json({ error: "Not found" }, { status: 404 });

		const version = user.updatedAt.getTime(); // bump on any profile change

		return NextResponse.json({ user, version });
	} catch (err) {
		console.error("Error in /api/user/me:", err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
