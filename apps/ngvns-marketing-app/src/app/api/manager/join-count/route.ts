import { NextRequest, NextResponse } from "next/server";
import prisma from "@ngvns2025/db/client";

/** IST is UTC+05:30, no DST */
const IST_OFFSET_MIN = 5 * 60 + 30;

/** Convert an IST civil date (YYYY-MM-DD) midnight to a UTC Date */
function istMidnightToUtc(yyyy_mm_dd: string) {
	const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
	// IST midnight => UTC previous day 18:30 (subtract 5h30m)
	if (!y || !m || !d) {
		throw new Error(`Invalid date string: ${yyyy_mm_dd}`);
	}
	const dt = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
	dt.setUTCMinutes(dt.getUTCMinutes() - IST_OFFSET_MIN);
	return dt;
}

/** Build IST midnight boundaries from query or presets (week,sunday->sunday) */
function getRangeUtc(params: URLSearchParams) {
	const from = params.get("from"); // YYYY-MM-DD in IST
	const to = params.get("to"); // YYYY-MM-DD in IST (exclusive)
	const preset = params.get("preset"); // "last-sun-to-this-sun"

	if (from && to) {
		return {
			gte: istMidnightToUtc(from),
			lt: istMidnightToUtc(to),
		};
	}

	if (preset === "last-sun-to-this-sun") {
		// Compute last Sunday 00:00 IST to this Sunday 00:00 IST
		const now = new Date();
		// Convert now to IST “wall clock” (add 5h30m) so getUTCDay() reflects IST day
		const nowIst = new Date(now.getTime() + IST_OFFSET_MIN * 60_000);
		const dayIst = nowIst.getUTCDay(); // 0=Sunday
		// get the IST date for "today" in IST
		const y = nowIst.getUTCFullYear();
		const m = nowIst.getUTCMonth();
		const d = nowIst.getUTCDate();

		// find this Sunday's IST midnight (go back dayIst days)
		const thisSunIst = new Date(Date.UTC(y, m, d, 0, 0, 0));
		thisSunIst.setUTCDate(thisSunIst.getUTCDate() - dayIst);
		// last Sunday's IST midnight is 7 days earlier
		const lastSunIst = new Date(thisSunIst);
		lastSunIst.setUTCDate(lastSunIst.getUTCDate() - 7);

		// Convert those IST midnights to UTC by subtracting 5h30m
		const lt = new Date(thisSunIst.getTime() - IST_OFFSET_MIN * 60_000);
		const gte = new Date(lastSunIst.getTime() - IST_OFFSET_MIN * 60_000);
		return { gte, lt };
	}

	throw new Error(
		"Provide from/to (YYYY-MM-DD) or preset=last-sun-to-this-sun"
	);
}

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);
		const teamId = searchParams.get("teamId");
		if (!teamId) {
			return NextResponse.json(
				{ ok: false, error: "teamId_required" },
				{ status: 400 }
			);
		}

		const range = getRangeUtc(searchParams);

		const count = await prisma.user.count({
			where: {
				byMarketingTeamId: teamId,
				createdAt: {
					gte: range.gte, // inclusive
					lt: range.lt, // exclusive
				},
			},
		});

		return NextResponse.json({
			ok: true,
			teamId,
			rangeUtc: { gte: range.gte.toISOString(), lt: range.lt.toISOString() },
			count,
		});
	} catch (err: any) {
		return NextResponse.json(
			{ ok: false, error: err.message ?? "unknown_error" },
			{ status: 400 }
		);
	}
}
