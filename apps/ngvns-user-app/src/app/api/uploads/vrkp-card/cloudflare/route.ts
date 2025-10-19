// app/api/uploads/vrkp-card/cloudflare/route.ts
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import prisma from "@ngvns2025/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../../lib/auth/auth";

export const runtime = "nodejs"; // sharp/R2 on Node

const r2 = new S3Client({
	region: "auto",
	endpoint: process.env.R2_S3_ENDPOINT,
	forcePathStyle: true,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

function pickExtAndType(ct: string | null) {
	const t = (ct || "").toLowerCase();
	if (t.includes("image/webp"))
		return { ext: "webp", contentType: "image/webp" };
	if (t.includes("image/png")) return { ext: "png", contentType: "image/png" };
	// fallback: assume PNG
	return { ext: "png", contentType: "image/png" };
}

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);
		if (!session?.user?.id || !session.user.vrKpId) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const user = await prisma.user.findUnique({
			where: { id: session.user.id },
			select: {
				id: true,
				vrKpId: true,
				fullname: true,
				dob: true,
				userPhoto: true,
				createdAt: true,
				VRKP_Card: true,
			},
		});
		if (!user)
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		if (user.VRKP_Card) {
			return NextResponse.json(
				{ error: "VRKP Card already exists" },
				{ status: 400 }
			);
		}

		// Build internal absolute URL (don’t rely on NEXT_PUBLIC_BASE_URL)
		const origin = new URL(req.url).origin;
		const renderUrl = new URL("/api/user/vrkp-card", origin);

		// Optional: add a timeout so we don’t hang forever
		const controller = new AbortController();
		const t = setTimeout(() => controller.abort(), 15_000); // 15s

		const pngRes = await fetch(renderUrl, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				// prefer images back from the render route
				accept: "image/webp,image/png;q=0.8,application/json;q=0.5,*/*;q=0.1",
			},
			body: JSON.stringify({
				userPhoto: user.userPhoto,
				vrkpid: user.vrKpId,
				name: user.fullname,
				dob: user.dob.toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				}),
				createdAt: user.createdAt.toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				}),
				issuedAt: new Date().toLocaleDateString("en-GB", {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				}),
			}),
			cache: "no-store",
			signal: controller.signal,
		}).finally(() => clearTimeout(t));

		if (!pngRes.ok) {
			// Try to pull structured error details from the render route
			let detail: any;
			const ct = pngRes.headers.get("content-type") || "";
			if (ct.includes("application/json")) {
				detail = await pngRes.json().catch(() => undefined);
			} else {
				detail = await pngRes.text().catch(() => undefined);
			}
			return NextResponse.json(
				{ error: "Render failed", status: pngRes.status, detail },
				{ status: 500 }
			);
		}

		// Detect type/extension from the render response
		const { contentType, ext } = pickExtAndType(
			pngRes.headers.get("content-type")
		);

		const arrayBuf = await pngRes.arrayBuffer();
		const key = `${user.vrKpId}/vrkp-card-${Date.now()}.${ext}`;

		// Upload to R2 with the correct ContentType
		const put = new PutObjectCommand({
			Bucket: process.env.R2_VRKP_CARD_BUCKET!,
			Key: key,
			Body: Buffer.from(arrayBuf),
			ContentType: contentType,
		});
		const r2Resp = await r2.send(put);

		const publicUrl = `${process.env.R2_VRKP_CARD_PUBLIC_BASE}/${key}`;

		await prisma.vRKP_Card.create({
			data: {
				userId: session.user.id,
				cardUrl: publicUrl,
				cardNumber: user.vrKpId,
				cardIssuedAt: new Date(),
				createdAt: new Date(),
			},
		});

		return NextResponse.json({
			publicUrl,
			etag: r2Resp.ETag ?? null,
			contentType,
		});
	} catch (err: any) {
		// Common network issues show up as ECONNRESET/UND_ERR_SOCKET/aborted
		return NextResponse.json(
			{ error: "Upload failed", detail: err?.message ?? String(err) },
			{ status: 500 }
		);
	}
}
