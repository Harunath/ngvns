import prisma from "@ngvns2025/db/client";
import { NextResponse } from "next/server";

export const GET = async () => {
	try {
		const tc = await prisma.tnCVersion.findFirst({ where: { active: true } });
		if (!tc)
			return NextResponse.json(
				{ error: "No active T&C found" },
				{ status: 404 }
			);
		return NextResponse.json({ tc });
	} catch (e) {
		console.error(e);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
};
