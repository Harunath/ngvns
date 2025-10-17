import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "node:fs/promises";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth/auth";
import prisma from "@ngvns2025/db/client";
import path from "node:path";
// import template from "../../../../../public/vrkp-card-template.png";

// use a runtime-resolved path to the public template so we can read the binary at runtime
// const TEMPLATE_PATH = path.join(process.cwd(), "public/vrkp-card-template.png");
const temp_url =
	"https://pub-98a0b13dd37c4b7b84e18b52d9c03d5e.r2.dev/users/vrkp-card-template.png";

async function getFontDataUrl() {
	const p = path.join(
		process.cwd(),
		"public",
		"fonts",
		"Inter_28pt-Regular.ttf"
	);
	const buf = await fs.readFile(p);
	const b64 = buf.toString("base64");
	return `data:font/ttf;base64,${b64}`;
}

function escapeXML(str: string) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

async function buildMainTextSVG({
	vrkpid,
	name,
	dob,
	regDate,
}: {
	vrkpid: string;
	name: string;
	dob: string;
	regDate: string;
}) {
	const width = 1920,
		height = 1080;
	const fontUrl = await getFontDataUrl();

	const items = [
		{
			text: "VRKP ID",
			x: 910,
			y: 446,
			size: 52,
			weight: 800,
			color: "#0f172a",
		},
		{ text: vrkpid, x: 1210, y: 446, size: 52, weight: 800, color: "#0f172a" },
		{ text: "Name", x: 910, y: 566, size: 52, weight: 800, color: "#0f172a" },
		{ text: name, x: 1210, y: 566, size: 52, weight: 800, color: "#0f172a" },
		{ text: "DOB", x: 910, y: 690, size: 46, weight: 700, color: "#0f172a" },
		{ text: dob, x: 1210, y: 690, size: 46, weight: 700, color: "#0f172a" },
		{
			text: "Reg Date",
			x: 910,
			y: 810,
			size: 46,
			weight: 700,
			color: "#0f172a",
		},
		{ text: regDate, x: 1210, y: 810, size: 46, weight: 700, color: "#0f172a" },
	]
		.map(
			(l) => `
      <text x="${l.x}" y="${l.y}"
        fill="${l.color}"
        font-family="InterLocal, sans-serif"
        font-size="${l.size}"
        font-weight="${l.weight}"
        dominant-baseline="alphabetic">${escapeXML(l.text)}</text>`
		)
		.join("");

	const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
     xmlns="http://www.w3.org/2000/svg">
  <style>
    @font-face {
      font-family: 'InterLocal';
      src: url('${fontUrl}') format('truetype');
      font-weight: 100 900;
      font-style: normal;
      font-display: block;
    }
    text { paint-order: stroke fill; }
  </style>
  ${items}
</svg>`;

	return Buffer.from(svg, "utf-8");
}

async function buildIssuedDateSVG(issuedDate: string) {
	const width = 1920,
		height = 1080;
	const fontUrl = await getFontDataUrl();
	const topMargin = 200;
	const yPosition = 760 + topMargin;

	const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"
     xmlns="http://www.w3.org/2000/svg">
  <style>
    @font-face {
      font-family: 'InterLocal';
      src: url('${fontUrl}') format('truetype');
      font-weight: 100 900;
      font-style: normal;
      font-display: block;
    }
  </style>
  <g transform="translate(140, ${yPosition}) rotate(-90)">
    <text x="0" y="0"
      fill="#0f172a"
      font-family="InterLocal, sans-serif"
      font-size="44"
      font-weight="800"
      letter-spacing="2">ISSUED DATE : ${escapeXML(issuedDate)}</text>
  </g>
</svg>`;
	return Buffer.from(svg, "utf-8");
}

async function loadBufferFromUrl(url: string) {
	// Works for same-origin URLs or public images.
	try {
		const res = await fetch(url);
		if (!res.ok) throw new Error(`Failed to fetch photo: ${res.status}`);

		const blob = await res.blob();
		return blob.arrayBuffer().then((ab) => Buffer.from(ab));
	} catch {
		new Error("Failed to fetch user photo");
	}
}

export async function POST(req: NextRequest) {
	// const { name, dob, regDate, issuedDate, photoUrl } =
	// 	(await req.json()) as Payload;

	const session = await getServerSession(authOptions);
	if (!session) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
	});
	if (!user) {
		return NextResponse.json({ error: "User not found" }, { status: 404 });
	}
	const existingCard = await prisma.vRKP_Card.findUnique({
		where: { userId: session.user.id },
	});

	if (existingCard) {
		return NextResponse.json(
			{
				error: "Card already issued",
				card: existingCard.cardUrl ? existingCard.cardUrl : "",
			},
			{ status: 400 }
		);
	}

	// 1) Base template
	let templateBuf: Buffer;
	try {
		const res = await fetch(temp_url, { cache: "force-cache" });
		if (!res.ok) throw new Error("Template fetch failed");
		templateBuf = Buffer.from(await res.arrayBuffer());
		console.log("Template loaded, size:", templateBuf.length);
	} catch (err) {
		console.error("Error loading template:", err);
		return new Response(
			JSON.stringify({
				error: "Template not found " + " (" + (err as Error).message + ")",
			}),
			{ status: 500 }
		);
	}
	try {
		const base = sharp(templateBuf); // 1920x1080

		// 2) User photo → resize & cover into the slot (approx 420×520 at x=180,y=360)
		// Adjust size/pos if your template differs.
		const slot = { w: 420, h: 520, left: 290, top: 350 };
		const photoBuf = await loadBufferFromUrl(user?.userPhoto!);
		if (!photoBuf) {
			return new NextResponse(
				JSON.stringify({ error: "Failed to load user photo" }),
				{ status: 500 }
			);
		}
		const photo = await sharp(photoBuf)
			.resize(slot.w, slot.h, { fit: "cover", position: "attention" })
			.toBuffer();

		// 3) Text overlays
		const rightText = await buildMainTextSVG({
			vrkpid: ": " + session.user.vrKpId!,
			name: ": " + user?.fullname!,
			dob:
				": " +
				new Date(user?.dob!).toLocaleDateString("en-GB", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				}),
			regDate:
				": " +
				new Date(user?.createdAt!).toLocaleDateString("en-GB", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
				}),
		});
		const issuedText = await buildIssuedDateSVG(
			new Date().toLocaleDateString("en-GB", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
			})
		);

		// 4) Composite
		const out = await base
			.composite([
				{ input: photo, left: slot.left, top: slot.top },
				{ input: rightText, left: 0, top: 0 },
				{ input: issuedText, left: 0, top: 0 },
			])
			.webp()
			.toBuffer();
		console.log("Generated card image, size:", out.length);
		const uploadResponse = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/uploads/vrkp-card/cloudflare`,
			{
				method: "POST",
				body: (() => {
					const formData = new FormData();
					formData.append(
						"file",
						new Blob([new Uint8Array(out)], { type: "image/webp" }),
						`vrkp-card-${user.vrKpId}-${Date.now()}.webp`
					);
					return formData;
				})(),
			}
		);

		const uploadJson = await uploadResponse.json();

		await prisma.vRKP_Card.create({
			data: {
				userId: session.user.id,
				cardUrl: uploadJson.publicUrl,
				cardNumber: session.user.vrKpId,
				cardIssuedAt: new Date(),
				createdAt: new Date(),
			},
		});

		return NextResponse.json(
			{ cardUrl: uploadJson.publicUrl },
			{
				status: 201,
			}
		);
	} catch (err) {
		console.error("Error generating card:", err);
		return new Response(
			JSON.stringify({
				error: "Card generation failed " + " (" + (err as Error).message + ")",
			}),
			{ status: 500 }
		);
	}
}
