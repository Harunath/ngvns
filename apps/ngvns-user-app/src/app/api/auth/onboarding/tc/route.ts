// app/api/onboarding/accept-tc/route.ts
import { NextRequest } from "next/server";
import prisma from "@ngvns2025/db/client";
import { ok, bad } from "../../../../../lib/responses";

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { phone } = body;
		if (!phone) return bad("Missing required fields", 400);
		const onboardingId = await prisma.onboarding.findFirst({
			where: { phone },
			select: { id: true },
		});

		if (!onboardingId) return bad("Onboarding user not found", 404);
		const ob = await prisma.onboarding.findUnique({
			where: { phone },
		});
		if (!ob) return bad("Onboarding user not found", 404);
		if (ob.onBoardingFinished) return bad("Already finished", 400);
		const latestTnC = await prisma.tnCVersion.findFirst({
			where: { active: true },
			orderBy: { createdAt: "desc" },
		});
		if (!latestTnC) return bad("No active T&C found", 500);
		await prisma.tnCAcceptance.upsert({
			where: {
				onboardingId: ob.id,
				tncVersionId: latestTnC.id,
			},
			create: {
				tncVersionId: latestTnC.id,
				onboardingId: ob.id,
				acceptedAt: new Date(),
			},
			update: {
				acceptedAt: new Date(),
			},
		});

		return ok({ message: "T&C accepted", step: "payment" });
	} catch (e: any) {
		return bad(e?.message ?? "Invalid payload", 400);
	}
}
