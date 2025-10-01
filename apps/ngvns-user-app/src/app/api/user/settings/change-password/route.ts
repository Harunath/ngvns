import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth/auth";
import prisma from "@ngvns2025/db/client";
import bcrypt from "bcryptjs"; // ensure Node runtime (not edge)

export const runtime = "nodejs"; // bcrypt needs Node.js

type Body = {
	currentPassword?: string;
	newPassword?: string;
};

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { currentPassword, newPassword } = (await req.json()) as Body;

		if (!currentPassword || !newPassword) {
			return NextResponse.json({ error: "Missing fields" }, { status: 400 });
		}
		if (newPassword.length < 8) {
			return NextResponse.json(
				{ error: "New password must be at least 8 characters." },
				{ status: 400 }
			);
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: { id: true, password: true },
		});

		if (!user?.password) {
			// No local password set (e.g., OAuth-only account).
			return NextResponse.json(
				{ error: "Password change not available for this account." },
				{ status: 400 }
			);
		}

		const isValid = await bcrypt.compare(currentPassword, user.password);
		if (!isValid) {
			return NextResponse.json(
				{ error: "Current password is incorrect." },
				{ status: 400 }
			);
		}

		const isSame = await bcrypt.compare(newPassword, user.password);
		if (isSame) {
			return NextResponse.json(
				{ error: "New password must be different from current password." },
				{ status: 400 }
			);
		}

		const saltRounds = 12; // good default
		const newHash = await bcrypt.hash(newPassword, saltRounds);

		await prisma.user.update({
			where: { id: user.id },
			data: { password: newHash },
		});

		// Optional: Invalidate other sessions/tokens here if you store them.
		// e.g., bump a `sessionVersion` column and check it in your session callback.

		return NextResponse.json({ ok: true });
	} catch (err) {
		console.error("change-password error:", err);
		return NextResponse.json({ error: "Internal error" }, { status: 500 });
	}
}
