import { NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client"; // adjust path to your prisma client

export const runtime = "nodejs";

/**
 * POST /api/marketing-teams
 * Body: { name: string; description: string; details?: object }
 */
export async function POST(req: Request) {
	try {
		const body = await req.json();

		const { name, description, details } = body;

		// --- Basic Validation ---
		if (!name || !description) {
			return NextResponse.json(
				{ error: "Name and description are required." },
				{ status: 400 }
			);
		}

		// --- Check duplicate team name ---
		const existing = await prisma.marketingTeam.findUnique({
			where: { name },
		});

		if (existing) {
			return NextResponse.json(
				{ error: "A team with this name already exists." },
				{ status: 409 }
			);
		}

		// --- Create team ---
		const team = await prisma.marketingTeam.create({
			data: {
				name,
				description,
				details: details ? details : {},
			},
		});

		return NextResponse.json(
			{
				success: true,
				message: "Marketing Team created successfully.",
				team,
			},
			{ status: 201 }
		);
	} catch (error: any) {
		console.error("[MARKETING_TEAM_POST_ERROR]", error);

		return NextResponse.json(
			{
				error: "Internal server error while creating marketing team.",
				details:
					process.env.NODE_ENV === "development" ? error.message : undefined,
			},
			{ status: 500 }
		);
	}
}
