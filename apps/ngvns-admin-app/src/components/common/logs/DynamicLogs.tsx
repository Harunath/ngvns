"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import type {
	LogsQuery,
	LogsResponse,
	LogRecord,
} from "../../../lib/types/logs";
import LogsFilters, { LogsFiltersValue } from "./LogsFilters";

type DynamicLogsProps = {
	/** API endpoint to fetch from (e.g. "/api/super-admin/logs" or "/api/command-admin/logs") */
	endpoint: string;
	/** Optional static conditions that should always be sent along (e.g. { role: "finance-admin" }) */
	baseQuery?: LogsQuery;
	/** Title for the card header */
	title?: string;
	/** Start page and limit defaults */
	initialPage?: number;
	initialLimit?: number;
	className?: string;
};

function buildQueryString(q: Record<string, any>) {
	const params = new URLSearchParams();
	Object.entries(q).forEach(([k, v]) => {
		if (v === undefined || v === null || v === "") return;
		params.set(k, String(v));
	});
	return params.toString();
}

export default function DynamicLogs({
	endpoint,
	baseQuery,
	title = "Logs",
	initialPage = 1,
	initialLimit = 20,
	className,
}: DynamicLogsProps) {
	const pathname = usePathname();
	const [page, setPage] = React.useState<number>(initialPage);
	const [filters, setFilters] = React.useState<LogsFiltersValue>({
		from: undefined,
		to: undefined,
		limit: initialLimit,
	});
	const [data, setData] = React.useState<LogsResponse | null>(null);
	const [loading, setLoading] = React.useState<boolean>(false);
	const [error, setError] = React.useState<string | null>(null);

	// refetch when endpoint, baseQuery, page, filters change
	React.useEffect(() => {
		const ctrl = new AbortController();
		const fetchLogs = async () => {
			setLoading(true);
			setError(null);
			try {
				const query: LogsQuery = {
					...baseQuery,
					from: filters.from,
					to: filters.to,
					page,
					limit: filters.limit,
				};
				const qs = buildQueryString(query as Record<string, any>);
				const res = await fetch(`${endpoint}?${qs}`, { signal: ctrl.signal });
				if (!res.ok) throw new Error(await res.text());
				const json: LogsResponse = await res.json();
				setData(json);
			} catch (err: any) {
				if (err.name !== "AbortError")
					setError(err?.message || "Failed to load logs");
			} finally {
				setLoading(false);
			}
		};
		fetchLogs();
		return () => ctrl.abort();
	}, [
		endpoint,
		JSON.stringify(baseQuery),
		page,
		filters.from,
		filters.to,
		filters.limit,
	]);

	const nextDisabled = !!data && page >= data.meta.totalPages;
	const prevDisabled = page <= 1;

	return (
		<section className={className}>
			{/* Header */}
			<div className="mb-3 flex items-center justify-between">
				<h2 className="text-lg font-semibold tracking-tight text-neutral-900">
					{title}
				</h2>
				<span className="text-sm text-neutral-500">
					{data ? `Total: ${data.meta.total}` : ""}
				</span>
			</div>

			{/* Filters */}
			<LogsFilters
				value={filters}
				onChange={(v) => {
					setFilters(v);
					setPage(1);
				}}
				className="mb-4"
			/>

			{/* Table Card */}
			<div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
				<div className="relative">
					{/* Loading bar */}
					<AnimatePresence initial={false}>
						{loading && (
							<motion.div
								className="absolute inset-x-0 top-0 h-0.5 bg-neutral-900/80"
								initial={{ scaleX: 0, originX: 0 }}
								animate={{ scaleX: 1 }}
								exit={{ opacity: 0 }}
								transition={{
									duration: 0.6,
									repeat: Infinity,
									repeatType: "reverse",
									ease: "easeInOut",
								}}
							/>
						)}
					</AnimatePresence>

					{/* Table */}
					<div className="w-full overflow-x-auto">
						<table className="min-w-full table-fixed border-separate border-spacing-0">
							<thead>
								<tr className="[&>th]:sticky [&>th]:top-0">
									<Th className="w-44">Time</Th>
									<Th className="w-36">Actor</Th>
									<Th className="w-36">Role</Th>
									<Th className="w-44">Action</Th>
									<Th className="w-80">Details</Th>
								</tr>
							</thead>
							<tbody>
								{error && (
									<tr>
										<td
											colSpan={6}
											className="px-4 py-6 text-center text-sm text-red-600">
											{error}
										</td>
									</tr>
								)}

								{!error && loading && (!data || data.logs.length === 0) && (
									<SkeletonRows rows={6} />
								)}

								{!error && !loading && data && data.logs.length === 0 && (
									<tr>
										<td
											colSpan={6}
											className="px-4 py-10 text-center text-sm text-neutral-500">
											No logs for the selected range.
										</td>
									</tr>
								)}

								{!error && data && data.logs.length > 0 && (
									<AnimatePresence initial={false}>
										{data.logs.map((log) => (
											<motion.tr
												key={log.id}
												initial={{ opacity: 0, y: 6 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0 }}
												transition={{ duration: 0.18 }}
												className="border-b last:border-b-0">
												<Td>{formatTime(log.createdAt)}</Td>
												<Td>{log.actor.fullname ?? log.actorId ?? "—"}</Td>
												<Td>
													<RoleBadge role={log.actor.role} />
												</Td>
												<Td className="font-medium">{log.targetType}</Td>
												<Td>
													{log.metadata ? (
														<code className="block max-w-[32rem] overflow-hidden text-ellipsis whitespace-pre text-xs text-neutral-700">
															{safeStringify(log.metadata)}
														</code>
													) : (
														<span className="text-neutral-400">—</span>
													)}
												</Td>
											</motion.tr>
										))}
									</AnimatePresence>
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					<div className="flex items-center justify-between border-t border-neutral-200 px-4 py-3">
						<button
							disabled={prevDisabled}
							onClick={() => setPage((p) => Math.max(1, p - 1))}
							className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40">
							Prev
						</button>
						<div className="text-sm text-neutral-600">
							{data ? `Page ${data.meta.page} of ${data.meta.totalPages}` : "—"}
						</div>
						<button
							disabled={nextDisabled}
							onClick={() => setPage((p) => p + 1)}
							className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm disabled:opacity-40">
							Next
						</button>
					</div>
				</div>
			</div>
		</section>
	);
}

function Th({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<th
			className={`z-10 border-b border-neutral-200 bg-white px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500 ${className}`}>
			{children}
		</th>
	);
}

function Td({
	children,
	className = "",
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<td className={`px-4 py-3 align-top text-sm text-neutral-800 ${className}`}>
			{children}
		</td>
	);
}

function SkeletonRows({ rows = 6 }: { rows?: number }) {
	return (
		<>
			{Array.from({ length: rows }).map((_, i) => (
				<tr key={i} className="border-b last:border-b-0">
					{Array.from({ length: 6 }).map((__, j) => (
						<td key={j} className="px-4 py-3">
							<div className="h-3 w-full animate-pulse rounded bg-neutral-200" />
						</td>
					))}
				</tr>
			))}
		</>
	);
}

function RoleBadge({ role }: { role: string }) {
	const map: Record<string, string> = {
		"super-admin": "bg-neutral-900 text-white",
		"command-admin": "bg-blue-600 text-white",
		"finance-admin": "bg-emerald-600 text-white",
		"data-entry": "bg-amber-600 text-white",
	};
	const cls = map[role] ?? "bg-neutral-300 text-neutral-900";
	return (
		<span className={`inline-flex rounded-full px-2 py-0.5 text-xs ${cls}`}>
			{role}
		</span>
	);
}

function formatTime(iso: string) {
	try {
		const d = new Date(iso);
		return d.toLocaleString();
	} catch {
		return iso;
	}
}

function safeStringify(obj: any) {
	try {
		return JSON.stringify(obj, null, 2);
	} catch {
		return String(obj);
	}
}
