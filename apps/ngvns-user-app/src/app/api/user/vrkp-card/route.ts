import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import fs from "node:fs/promises";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth/auth";
import prisma from "@ngvns2025/db/client";
// import path from "node:path";
// import template from "../../../../../public/vrkp-card-template.png";

// use a runtime-resolved path to the public template so we can read the binary at runtime
// const TEMPLATE_PATH = path.join(process.cwd(), "public/vrkp-card-template.png");
const path =
	"https://pub-98a0b13dd37c4b7b84e18b52d9c03d5e.r2.dev/users/vrkp-card-template.png";

function escapeXML(str: string) {
	return str
		.replace(/&/g, "&amp;")
		.replace(/"/g, "&quot;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

/** Build an SVG overlay for the right-column values */
function buildMainTextSVG({
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
	// Template is 1920x1080. These coordinates align values to the right column.
	// Tweak x/y if your template spacing changes.
	const width = 1920,
		height = 1080;
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
		{
			text: "Name",
			x: 910,
			y: 566,
			size: 52,
			weight: 800,
			color: "#0f172a",
		}, // Name
		{ text: name, x: 1210, y: 566, size: 52, weight: 800, color: "#0f172a" }, // Name
		{ text: "DOB", x: 910, y: 690, size: 46, weight: 700, color: "#0f172a" }, // Dob
		{ text: dob, x: 1210, y: 690, size: 46, weight: 700, color: "#0f172a" }, // Dob
		{
			text: "Reg Date",
			x: 910,
			y: 810,
			size: 46,
			weight: 700,
			color: "#0f172a",
		}, // Reg Date
		{ text: regDate, x: 1210, y: 810, size: 46, weight: 700, color: "#0f172a" }, // Reg Date
	]
		.map(
			(l) => `
    <text x="${l.x}" y="${l.y}" text-anchor="start"
      fill="${l.color}"
      font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"
      font-size="${l.size}"
      font-weight="${l.weight}"
      dominant-baseline="middle">${escapeXML(l.text)}</text>
  `
		)
		.join("");

	return Buffer.from(
		`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      ${items}
    </svg>`,
		"utf-8"
	);
}

/** Vertical "ISSUED DATE : ..." on the left side */
function buildIssuedDateSVG(issuedDate: string) {
	const width = 1920,
		height = 1080;

	// shift down by 200px to leave room for logo
	const topMargin = 200;
	const yPosition = 760 + topMargin;

	return Buffer.from(
		`<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(140, ${yPosition}) rotate(-90)">
        <text x="0" y="0"
          fill="#0f172a"
          font-family="Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial"
          font-size="44"
          font-weight="800"
          letter-spacing="2">ISSUED DATE : ${escapeXML(issuedDate)}</text>
      </g>
    </svg>`,
		"utf-8"
	);
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
	// const TEMPLATE_PATH = path.join(
	// 	process.cwd(),
	// 	"public",
	// 	"vrkp-card-template.png"
	// );

	// 1) Base template
	let templateBuf: Buffer;
	try {
		const res = await fetch(path, { cache: "force-cache" });
		if (!res.ok) throw new Error("Template fetch failed");
		templateBuf = Buffer.from(await res.arrayBuffer());
		// const filePath = path.join(
		// 	process.cwd(),
		// 	"public",
		// 	"vrkp-card-template.png"
		// );
		// templateBuf = await fs.readFile(filePath);
	} catch (err) {
		console.error("Error loading template:", err);
		return new Response(
			JSON.stringify({
				error: "Template not found " + " (" + (err as Error).message + ")",
			}),
			{ status: 500 }
		);
	}
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
	const rightText = buildMainTextSVG({
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
	const issuedText = buildIssuedDateSVG(
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
}
