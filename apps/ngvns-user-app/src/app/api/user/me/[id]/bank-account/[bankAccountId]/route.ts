// app/api/user/me/[userId]/bank-account/[bankAccountId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";
import { z } from "zod";
import { getServerSession } from "next-auth";
import { decrypt, encrypt } from "../../../../../../../lib/user/bank-crypto";
import { authOptions } from "../../../../../../../lib/auth/auth";

const updateSchema = z.object({
	accountHolderName: z.string().min(2).optional(),
	accountNumber: z.string().min(6).max(34).optional(), // if provided, re-encrypt
	ifsc: z.string().min(4).max(11).optional(),
	bankName: z.string().optional(),
	branch: z.string().optional(),
	accountType: z.enum(["SAVINGS", "CURRENT"]).optional(),
	upiId: z.string().nullable().optional(),
	isPrimary: z.boolean().optional(),
});

function mask(enc?: string) {
	if (!enc) return "****";
	try {
		const raw = decrypt({
			payload: enc,
			key: process.env.FIELD_ENCRYPTION_KEY!,
		});
		return raw.length > 4 ? `****${raw.slice(-4)}` : raw;
	} catch {
		return "****";
	}
}

async function authorize(userIdParam: string) {
	const session = await getServerSession(authOptions);
	if (!session || !session.user || !session.user.id)
		return { ok: false, status: 401 as const };
	const isSelf = session.user?.id === userIdParam;
	if (!isSelf) return { ok: false, status: 403 as const };
	return { ok: true, status: 200 as const };
}

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string; bankAccountId: string }> }
) {
	try {
		const p = await params;
		console.log("Params in GET bank account:", p);
		const auth = await authorize(p.id);
		if (!auth.ok)
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: auth.status }
			);

		const bank = await prisma.bankDetails.findFirst({
			where: { id: p.bankAccountId, userId: p.id },
		});
		if (!bank)
			return NextResponse.json({ error: "Not found" }, { status: 404 });

		return NextResponse.json({
			data: {
				id: bank.id,
				userId: bank.userId,
				accountHolderName: bank.accountHolderName,
				accountNumberMasked: decrypt({
					payload: bank.accountNumberEnc,
					key: process.env.FIELD_ENCRYPTION_KEY!,
				}),
				ifsc: bank.ifscCode,
				bankName: bank.bankName,
				branch: bank.branch,
				accountType: bank.accountType,
				upiId: bank.upiId,
				isPrimary: bank.isPrimary,
				createdAt: bank.createdAt,
				updatedAt: bank.updatedAt,
			},
		});
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: Promise<{ id: string; bankAccountId: string }> }
) {
	try {
		const p = await params;
		const auth = await authorize(p.id);
		if (!auth.ok)
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: auth.status }
			);

		const body = await req.json();
		const parsed = updateSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid input", details: parsed.error.flatten() },
				{ status: 422 }
			);
		}

		const existing = await prisma.bankDetails.findFirst({
			where: { id: p.bankAccountId, userId: p.id },
			select: { id: true, userId: true, isPrimary: true },
		});
		if (!existing)
			return NextResponse.json({ error: "Not found" }, { status: 404 });

		const data: any = { ...parsed.data };

		// Re-encrypt account number if provided
		if (parsed.data.accountNumber) {
			data.accountNumberEnc = encrypt({
				text: parsed.data.accountNumber,
				key: process.env.FIELD_ENCRYPTION_KEY!,
			});
			delete data.accountNumber;
		}

		// Primary handling: if toggling to primary, unset others
		if (typeof parsed.data.isPrimary === "boolean" && parsed.data.isPrimary) {
			await prisma.bankDetails.updateMany({
				where: {
					userId: p.id,
					isPrimary: true,
					NOT: { id: p.bankAccountId },
				},
				data: { isPrimary: false },
			});
		}

		const updated = await prisma.bankDetails.update({
			where: { id: p.bankAccountId },
			data: {
				ifscCode: data.ifsc,
				accountType: data.accountType,
				accountNumberEnc: data.accountNumberEnc,
				accountHolderName: data.accountHolderName,
				bankName: data.bankName,
				branch: data.branch,
				upiId: data.upiId,
				isPrimary: data.isPrimary,
			},
			select: {
				id: true,
				userId: true,
				accountHolderName: true,
				accountNumberEnc: true,
				ifscCode: true,
				bankName: true,
				branch: true,
				accountType: true,
				upiId: true,
				isPrimary: true,
				createdAt: true,
				updatedAt: true,
			},
		});

		return NextResponse.json({
			data: {
				...updated,
				accountNumberMasked: mask(updated.accountNumberEnc),
				accountNumberEnc: undefined, // hide raw enc in response
			},
		});
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string; bankAccountId: string }> }
) {
	try {
		const p = await params;
		const auth = await authorize(p.id);
		if (!auth.ok)
			return NextResponse.json(
				{ error: "Unauthorized" },
				{ status: auth.status }
			);

		// Only delete if it belongs to user
		const existing = await prisma.bankDetails.findFirst({
			where: { id: p.bankAccountId, userId: p.id },
			select: { id: true },
		});
		if (!existing)
			return NextResponse.json({ error: "Not found" }, { status: 404 });

		await prisma.bankDetails.delete({ where: { id: p.bankAccountId } });
		return NextResponse.json({ success: true });
	} catch (e) {
		console.error(e);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
