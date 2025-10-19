import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma, { AdminRole } from "@ngvns2025/db/client";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authOptions } from "../../../../../../lib/auth/auth";

const BodySchema = z.object({
	newPassword: z.string().min(8, "Password must be at least 8 characters."),
});

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
	const session = await getServerSession(authOptions);
	if (
		!session?.user?.id ||
		!session.user.role ||
		session.user.role !== AdminRole.SUPER
	) {
		return NextResponse.json({ error: "Forbidden" }, { status: 403 });
	}

	const userId = (await params).id;
	const json = await req.json().catch(() => ({}));
	const parsed = BodySchema.safeParse(json);

	if (!parsed.success) {
		return NextResponse.json(
			{ error: parsed.error.flatten() },
			{ status: 400 }
		);
	}

	const { newPassword } = parsed.data;

	// Ensure target user exists
	const target = await prisma.user.findUnique({
		where: { id: userId },
		select: { id: true },
	});
	if (!target)
		return NextResponse.json({ error: "User not found" }, { status: 404 });

	// Hash + update
	const hash = await bcrypt.hash(newPassword, 12);
	await prisma.user.update({
		where: { id: userId },
		data: { password: hash },
	});

	// Audit log
	const forwarded = req.headers.get("x-forwarded-for");
	const realIp = req.headers.get("x-real-ip");
	const ip = forwarded?.split(",")[0]?.trim() ?? realIp ?? "unknown";
	const userAgent = req.headers.get("user-agent") ?? "unknown";
	await prisma.adminAuditLog.create({
		data: {
			actorId: session.user.id,
			action: "USER_PASSWORD_RESET",
			targetType: "User",
			targetId: target.id,
			ip,
			userAgent,
			metadata: {
				method: "admin-reset",
				pwdLen: newPassword.length, // not the password itself
			},
		},
	});

	return NextResponse.json({ ok: true });
}
