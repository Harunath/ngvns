import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth/auth";
import { AdminRole } from "@ngvns2025/db/client";

export async function roleGuard(
	req: NextRequest,
	{ allowed }: { allowed: AdminRole[] }
): Promise<{ session: any } | NextResponse> {
	console.log("Role guard invoked for roles:", allowed);
	const session = await getServerSession(authOptions);

	if (!session?.user?.role) {
		return NextResponse.json(
			{ ok: false, error: "Unauthorized" },
			{ status: 401 }
		);
	}

	if (!allowed.includes(session.user.role as AdminRole)) {
		return NextResponse.json(
			{ ok: false, error: "Forbidden" },
			{ status: 403 }
		);
	}

	return { session };
}

/**
 * Extracts query parameters for filtering logs (role, from, to, pagination)
 */
export function extractLogFilters(req: NextRequest) {
	const url = new URL(req.url);
	const role = url.searchParams.get("role") as AdminRole | null;
	const from = url.searchParams.get("from");
	const to = url.searchParams.get("to");
	const page = parseInt(url.searchParams.get("page") || "1");
	const limit = parseInt(url.searchParams.get("limit") || "20");

	const where: any = {};
	if (role) where.role = role;
	if (from && to) where.createdAt = { gte: new Date(from), lte: new Date(to) };
	else if (from) where.createdAt = { gte: new Date(from) };
	else if (to) where.createdAt = { lte: new Date(to) };

	const skip = (page - 1) * limit;
	const take = limit;

	return { where, skip, take, page, limit };
}
