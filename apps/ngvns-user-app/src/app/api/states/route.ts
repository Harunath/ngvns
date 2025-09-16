import prisma from "@ngvns2025/db/client";
import { NextResponse } from "next/server";

export const GET = async () => {
	try {
		const states = await prisma.states.findMany({
			where: { isActive: true },
		});
		return NextResponse.json(states);
	} catch (error) {
		console.log("Error in fetching states", error);
		return NextResponse.json(
			{ error: "Error in fetching states" },
			{ status: 500 }
		);
	}
};
