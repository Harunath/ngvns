// app/api/user/vrkp-card/route.ts
import { createCanvas, loadImage } from "canvas";
import type { CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from "canvas";
import sharp from "sharp";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Body = {
	vrkpid: string;
	name: string;
	dob: string;
	createdAt: string;
	issuedAt: string;
	userPhoto: string; // URL or data URL
};
// helper to draw rounded-rect image
function drawRoundedImage(
	ctx: NodeCanvasRenderingContext2D,
	img: any,
	x: number,
	y: number,
	w: number,
	h: number,
	r = 28
) {
	ctx.save();
	ctx.beginPath();
	ctx.moveTo(x + r, y);
	ctx.lineTo(x + w - r, y);
	ctx.quadraticCurveTo(x + w, y, x + w, y + r);
	ctx.lineTo(x + w, y + h - r);
	ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
	ctx.lineTo(x + r, y + h);
	ctx.quadraticCurveTo(x, y + h, x, y + h - r);
	ctx.lineTo(x, y + r);
	ctx.quadraticCurveTo(x, y, x + r, y);
	ctx.closePath();
	ctx.clip();

	// subtle shadow
	ctx.shadowColor = "rgba(0,0,0,0.18)";
	ctx.shadowBlur = 12;
	ctx.drawImage(img, x, y, w, h);

	ctx.restore();

	// (optional) white border
	ctx.lineWidth = 6;
	ctx.strokeStyle = "rgba(255,255,255,0.9)";
	ctx.stroke();
}

export async function POST(req: Request) {
	try {
		const { vrkpid, name, dob, createdAt, issuedAt, userPhoto } =
			(await req.json()) as Body;

		if (!vrkpid || !name || !dob || !createdAt || !issuedAt || !userPhoto) {
			return NextResponse.json(
				{ error: "Missing parameters" },
				{ status: 400 }
			);
		}

		// canvas
		const width = 1920;
		const height = 1080;
		const canvas = createCanvas(width, height);
		const ctx = canvas.getContext("2d");

		// background
		const bgUrl =
			"https://pub-98a0b13dd37c4b7b84e18b52d9c03d5e.r2.dev/users/vrkp-card-template.png";
		const bgImage = await loadImage(bgUrl);
		ctx.drawImage(bgImage, 0, 0, width, height);

		// --- USER PHOTO ---
		// fetch raw bytes (avoid cross-host CORS headaches)
		const photoResp = await fetch(userPhoto, { cache: "no-store" });
		if (!photoResp.ok)
			throw new Error(`userPhoto fetch failed: ${photoResp.status}`);
		const photoBuf = Buffer.from(await photoResp.arrayBuffer());

		// auto-orient and square crop to fit the slot nicely
		const AVATAR_W = 560; // tweak to your template
		const AVATAR_H = 560;
		const AVATAR_X = 215; // left/top offsets to match your template
		const AVATAR_Y = 350;

		const squared = await sharp(photoBuf)
			.rotate() // respect EXIF
			.resize(AVATAR_W, AVATAR_H, { fit: "cover", position: "attention" })
			.toBuffer();

		const userImg = await loadImage(squared);
		drawRoundedImage(ctx, userImg, AVATAR_X, AVATAR_Y, AVATAR_W, AVATAR_H, 30);

		// --- TEXT ---
		ctx.fillStyle = "#0f172a";
		ctx.font = "800 52px Inter";
		ctx.fillText("VRKP ID", 910, 446);
		ctx.fillText(":" + " " + vrkpid, 1210, 446);

		ctx.fillText("Name", 910, 566);
		ctx.fillText(
			":" + " " + (name.length > 20 ? name.slice(0, 20) : name),
			1210,
			566
		);

		ctx.fillText("DOB", 910, 690);
		ctx.fillText(":" + " " + dob, 1210, 690);

		ctx.fillText("Reg Date", 910, 810);
		ctx.fillText(":" + " " + createdAt, 1210, 810);

		// rotated issued date (left vertical)
		ctx.save();
		ctx.translate(140, 960);
		ctx.rotate(-Math.PI / 2);
		ctx.font = "800 44px Inter";
		ctx.fillText(`ISSUED DATE : ${issuedAt}`, 0, 0);
		ctx.restore();

		// PNG → WebP (smaller)
		const webpBuffer = await sharp(canvas.toBuffer("image/png"))
			.webp({ quality: 85 })
			.toBuffer();

		return new NextResponse(new Uint8Array(webpBuffer), {
			status: 200,
			headers: {
				"Content-Type": "image/webp",
				"Content-Disposition": "inline; filename=vrkp-card.webp",
			},
		});
	} catch (err: any) {
		console.error("Error generating card:", err);
		return NextResponse.json(
			{ error: "Failed to generate card", detail: err?.message ?? String(err) },
			{ status: 500 }
		);
	}
}
