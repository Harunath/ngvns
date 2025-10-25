import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../lib/auth/auth";
import prisma, { AdminRole } from "@ngvns2025/db/client";

export const GET = async (
	_req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) => {
	try {
		const session = await getServerSession(authOptions);
		if (
			!session?.user?.id ||
			!session.user.role ||
			session.user.role !== AdminRole.SUPER
		) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}
		const userId = (await params).id;
		// Ensure target user exists
		const target = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, fullname: true, email: true, phone: true },
		});
		if (!target)
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		return NextResponse.json({ ok: true, user: target });
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
