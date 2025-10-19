// app/api/user/vrkp-card/route.ts
import { createCanvas, loadImage, registerFont } from "canvas";
import type { CanvasRenderingContext2D as NodeCanvasRenderingContext2D } from "canvas";
import sharp from "sharp";
import { NextResponse } from "next/server";

// app/api/user/vrkp-card/route.ts
import path from "path";
import fs from "fs";

export const runtime = "nodejs";

function mustExist(p: string) {
	if (!fs.existsSync(p)) {
		throw new Error(`Font file not found at: ${p}`);
	}
}

// 👉 Resolve relative to this app's CWD (the app root at runtime)
const REGULAR_PATH = path.join(
	process.cwd(),
	"public",
	"fonts",
	"static",
	"Inter_28pt-Regular.ttf"
);
const BOLD_PATH = path.join(
	process.cwd(),
	"public",
	"fonts",
	"static",
	"Inter_28pt-Bold.ttf"
);

// Helpful log once to verify
console.log("[font] regular:", REGULAR_PATH);
console.log("[font] bold   :", BOLD_PATH);

mustExist(REGULAR_PATH);
mustExist(BOLD_PATH);

registerFont(REGULAR_PATH, { family: "Inter" });
registerFont(BOLD_PATH, { family: "Inter", weight: "bold" });

// ... rest of your code unchanged ...

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

		// ...after drawRoundedImage(ctx, userImg, ...);
		ctx.shadowColor = "transparent"; // <-- turn off image shadow for crisp text
		ctx.shadowBlur = 0;
		ctx.fillStyle = "#0f172a";
		ctx.textAlign = "left";
		ctx.textBaseline = "alphabetic";

		// choose readable sizes (Inter-Bold is weight 700)
		const FONT_LABEL = "700 60px Inter"; // labels: VRKP ID, Name, DOB, Reg Date
		const FONT_VALUE = "700 64px Inter"; // values: : VR500..., : Harunath...
		const FONT_ISSUED = "700 50px Inter"; // rotated issued date

		// small helper to keep spacing consistent (adds colon block)
		function drawRow(
			label: string,
			value: string,
			y: number,
			xLabel = 910,
			xColon = 1180,
			xValue = 1210
		) {
			ctx.font = FONT_LABEL;
			ctx.fillText(label, xLabel, y);

			ctx.font = FONT_VALUE;
			ctx.fillText(":", xColon, y);
			ctx.fillText(value, xValue, y);
		}

		// --- TEXT ---
		drawRow("VRKP ID", vrkpid, 460); // slightly lower than your 446 for balance
		drawRow("Name", name.length > 26 ? name.slice(0, 26) + "…" : name, 585);
		drawRow("DOB", dob, 710);
		drawRow("Reg Date", createdAt, 835);

		// rotated issued date (left vertical)
		ctx.save();
		ctx.translate(140, 960);
		ctx.rotate(-Math.PI / 2);
		ctx.font = FONT_ISSUED;
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
