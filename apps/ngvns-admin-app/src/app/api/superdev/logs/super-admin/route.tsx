import { NextRequest, NextResponse } from "next/server";
import prisma, { AdminRole } from "@ngvns2025/db/client";
import { roleGuard, extractLogFilters } from "../../../../../utils/api/logs";

export async function GET(req: NextRequest) {
	console.log("Request received at super-admin logs page.tsx");
	const guard = await roleGuard(req, { allowed: [AdminRole.ROOT] });
	if ("status" in guard) return guard; // if unauthorized, return response directly
	const { session } = guard;

	const { where, skip, take, page, limit } = extractLogFilters(req);
	console.log("all good till db call");
	const [logs, total] = await Promise.all([
		prisma.adminAuditLog.findMany({
			where: { ...where, actor: { is: { role: AdminRole.SUPER } } },
			include: { actor: { select: { id: true, fullname: true, role: true } } },
			skip,
			take,
			orderBy: { createdAt: "desc" },
		}),
		prisma.adminAuditLog.count({ where }),
	]);
	console.log("DB call successful, returning response");
	return NextResponse.json({
		ok: true,
		logs,
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
	});
}
