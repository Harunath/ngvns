// app/api/user/me/[id]/bank-account/route.ts
import { NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@ngvns2025/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../../lib/auth/auth";
import { decrypt, encrypt } from "../../../../../../lib/user/bank-crypto";

const createBodySchema = z.object({
	accountHolderName: z.string().min(2),
	accountNumber: z.string().min(6).max(34), // India ~9-18; keep flexible
	ifsc: z.string().min(4).max(11),
	bankName: z.string().optional(),
	branch: z.string().optional(),
	accountType: z.enum(["SAVINGS", "CURRENT"]).optional(),
	upiId: z.string().optional().nullable(),
	isPrimary: z.boolean().optional(),
});

export async function GET(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		console.log("session", session);
		const p = await params;
		if (!session)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

		if (session.user.id !== p.id) {
			// if you have admin role check, or adjust as per your auth model
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const bank = await prisma.bankDetails.findFirst({
			where: { userId: p.id },
			orderBy: { createdAt: "desc" }, // latest primary or latest
		});

		if (!bank) return NextResponse.json({ data: null });

		// don't return raw account number — mask it (or decrypt if needed)
		let maskedAccount = "****";
		try {
			const decrypted = decrypt({
				payload: bank.accountNumberEnc,
				key: process.env.FIELD_ENCRYPTION_KEY!,
			});
			// show last 4 digits
			maskedAccount =
				decrypted.length > 4 ? `****${decrypted.slice(-4)}` : decrypted;
		} catch (e) {
			maskedAccount = "****";
		}
		return NextResponse.json({
			data: {
				id: bank.id,
				accountHolderName: bank.accountHolderName,
				accountNumberMasked: maskedAccount,
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
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ id: string }> }
) {
	try {
		const session = await getServerSession(authOptions);
		const p = await params;
		console.log(p);
		if (!session)
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		console.log("p.id", p.id, "session.user.id", session.user.id);
		if (session.user.id !== p.id) {
			return NextResponse.json({ error: "Forbidden" }, { status: 403 });
		}

		const body = await req.json();
		const parsed = createBodySchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid input", details: parsed.error.flatten() },
				{ status: 422 }
			);
		}

		const {
			accountHolderName,
			accountNumber,
			ifsc,
			bankName,
			branch,
			accountType = "SAVINGS",
			upiId,
			isPrimary = false,
		} = parsed.data;

		// Encrypt account number before storing
		const accountNumberEnc = encrypt({
			text: accountNumber,
			key: process.env.FIELD_ENCRYPTION_KEY!,
		});

		// if isPrimary true, unset previous primary
		if (isPrimary) {
			await prisma.bankDetails.updateMany({
				where: { userId: p.id, isPrimary: true },
				data: { isPrimary: false },
			});
		}
		if (bankName === undefined || branch === undefined) {
			return NextResponse.json(
				{ error: "Bank name and branch are required" },
				{ status: 422 }
			);
		}

		const created = await prisma.bankDetails.create({
			data: {
				userId: p.id,
				accountHolderName,
				accountNumberEnc,
				ifscCode: ifsc,
				bankName,
				branch,
				accountType: accountType as "SAVINGS" | "CURRENT",
				upiId,
				isPrimary,
			},
			select: {
				id: true,
				accountHolderName: true,
				ifscCode: true,
				bankName: true,
				branch: true,
				accountType: true,
				upiId: true,
				isPrimary: true,
				createdAt: true,
			},
		});

		return NextResponse.json({ data: created }, { status: 201 });
	} catch (err) {
		console.error(err);
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
