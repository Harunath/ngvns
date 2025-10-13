import { NextRequest, NextResponse } from "next/server";
import prisma, { AdminRole } from "@ngvns2025/db/client";
import { roleGuard, extractLogFilters } from "../../../../../utils/api/logs";

export async function GET(req: NextRequest) {
	const guard = await roleGuard(req, { allowed: [AdminRole.SUPER] });
	if ("status" in guard) return guard; // if unauthorized, return response directly
	const { session } = guard;

	const { where, skip, take, page, limit } = extractLogFilters(req);

	const [logs, total] = await Promise.all([
		prisma.adminAuditLog.findMany({
			where: { ...where, actor: { is: { role: AdminRole.FINANCE } } },
			include: { actor: { select: { id: true, fullname: true, role: true } } },
			skip,
			take,
			orderBy: { createdAt: "desc" },
		}),
		prisma.adminAuditLog.count({ where }),
	]);

	return NextResponse.json({
		ok: true,
		logs,
		meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
	});
}
