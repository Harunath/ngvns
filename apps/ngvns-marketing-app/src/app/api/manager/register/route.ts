import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@ngvns2025/db/client";
import { RegisterSchema } from "../../../../lib/zod/superdev/Register";

export async function POST(req: Request) {
	try {
		const body = await req.json();
		const parsed = RegisterSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{
					ok: false,
					error: "validation_error",
					issues: parsed.error.flatten(),
				},
				{ status: 400 }
			);
		}
		const { email, password, fullname, phone, role } = parsed.data;

		// Optional gate: require invite code if env is set
		// if (process.env.ADMIN_SIGNUP_CODE) {
		// 	if (inviteCode !== process.env.ADMIN_SIGNUP_CODE) {
		// 		return NextResponse.json(
		// 			{ ok: false, error: "invalid_invite_code" },
		// 			{ status: 403 }
		// 		);
		// 	}
		// }

		const hashed = await bcrypt.hash(password, 12);

		const admin = await prisma.admin.create({
			data: {
				email,
				password: hashed,
				fullname,
				phone,
				role, // must match your Prisma enum AdminRole
			},
			select: {
				id: true,
				email: true,
				fullname: true,
				phone: true,
				role: true,
				createdAt: true,
			},
		});

		return NextResponse.json({ ok: true, admin }, { status: 201 });
	} catch (err: any) {
		// Prisma unique errors (email/phone)
		if (err?.code === "P2002" && Array.isArray(err?.meta?.target)) {
			return NextResponse.json(
				{ ok: false, error: "unique_constraint", target: err.meta.target },
				{ status: 409 }
			);
		}
		return NextResponse.json(
			{ ok: false, error: "server_error" },
			{ status: 500 }
		);
	}
}
