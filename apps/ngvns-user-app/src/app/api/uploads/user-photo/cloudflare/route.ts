import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import crypto from "crypto";

const r2 = new S3Client({
	region: "auto", // required for R2
	endpoint: process.env.R2_S3_ENDPOINT, // e.g. https://<account_id>.r2.cloudflarestorage.com`,
	forcePathStyle: true,
	credentials: {
		accessKeyId: process.env.R2_ACCESS_KEY_ID!,
		secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
	},
});

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		const bytes = Buffer.from(await file.arrayBuffer());

		const key = `users/${crypto.randomUUID()}-${file.name}`;
		const cmd = new PutObjectCommand({
			Bucket: "vrkp-user-image",
			Key: key,
			Body: bytes,
		});
		const r = await r2.send(cmd);

		console.log("R2 upload response", r);

		const publicUrl = `${process.env.R2_PUBLIC_BASE}/${key}`;

		return NextResponse.json({ publicUrl });
	} catch (err: any) {
		console.error("Upload failed", err);
		return NextResponse.json(
			{ error: "Upload failed", detail: err.message },
			{ status: 500 }
		);
	}
}
