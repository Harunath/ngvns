import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

export async function POST(req: Request) {
	try {
		const formData = await req.formData();
		const file = formData.get("file") as File | null;

		if (!file) {
			return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
		}

		// Convert File → Buffer
		const bytes = Buffer.from(await file.arrayBuffer());
		console.log({ bytes });
		const timestamp = Math.round(new Date().getTime() / 1000);
		const folder = `user-photos`;

		const signature = cloudinary.utils.api_sign_request(
			{
				timestamp,
				folder,
			},
			process.env.CLOUDINARY_API_SECRET!
		);
		formData.append("file", file);
		formData.append("api_key", process.env.CLOUDINARY_API_KEY!);
		formData.append("timestamp", String(timestamp));
		formData.append("signature", signature);
		formData.append("folder", folder);

		const res = await fetch(
			`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME!}/image/upload`,
			{
				method: "POST",
				body: formData,
			}
		);
		const data = await res.json();
		const publicUrl = data.secure_url;
		return NextResponse.json(
			{
				publicUrl,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Cloudinary Signature Error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
