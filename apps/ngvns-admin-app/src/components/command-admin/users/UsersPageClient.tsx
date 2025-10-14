"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Filters, { FiltersState } from "./Filters";
import UserList from "./UserList";
import { buildQS } from "../../../lib/ui/query";
import type { UsersApiResponse, UserItem } from "../../../lib/types/users";

export default function UsersPageClient() {
	const [filters, setFilters] = useState<FiltersState>({
		id: "",
		vrKpId: "",
		name: "",
		q: "",
		createdFrom: "",
		createdTo: "",
		sortBy: "createdAt",
		sortDir: "desc",
		limit: 20,
	});

	const [loading, setLoading] = useState(false);
	const [list, setList] = useState<UserItem[]>([]);
	const [total, setTotal] = useState<number | null>(null);
	const [nextCursor, setNextCursor] = useState<string | null>(null);
	const firstLoad = useRef(true);

	const qs = useMemo(() => {
		return buildQS({
			...filters,
		});
	}, [filters]);

	async function load(initial = false) {
		setLoading(true);
		try {
			const res = await fetch(`/api/super-admin/users${qs}`, {
				cache: "no-store",
			});
			if (!res.ok) throw new Error(await res.text());
			const data: UsersApiResponse = await res.json();

			setList(data.data);
			setTotal(data.total);
			setNextCursor(data.nextCursor);
		} finally {
			setLoading(false);
		}
	}

	async function loadMore() {
		if (!nextCursor) return;
		setLoading(true);
		try {
			const res = await fetch(
				`/api/super-admin/users${qs}&cursor=${nextCursor}`,
				{
					cache: "no-store",
				}
			);
			if (!res.ok) throw new Error(await res.text());
			const data: UsersApiResponse = await res.json();

			setList((prev) => [...prev, ...data.data]);
			setTotal(data.total);
			setNextCursor(data.nextCursor);
		} finally {
			setLoading(false);
		}
	}

	// Debounce filters -> fetch
	useEffect(() => {
		const t = setTimeout(
			() => {
				load(true);
			},
			firstLoad.current ? 0 : 300
		);
		firstLoad.current = false;
		return () => clearTimeout(t);
	}, [qs]);

	return (
		<div className="space-y-6">
			<Filters
				value={filters}
				onChange={setFilters}
				onSubmit={() => load(true)}
			/>

			<section className="rounded-2xl border bg-white p-3 shadow-sm">
				<AnimatePresence initial={false} mode="wait">
					{loading && list.length === 0 ? (
						<motion.div
							key="skeleton"
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 6 }}
							className="grid gap-3">
							{Array.from({ length: 6 }).map((_, i) => (
								<div
									key={i}
									className="h-20 animate-pulse rounded-xl bg-neutral-100"
								/>
							))}
						</motion.div>
					) : (
						<motion.div
							key="list"
							initial={{ opacity: 0, y: 6 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 6 }}>
							<UserList items={list} total={total ?? undefined} />
							<div className="mt-4 flex items-center justify-between">
								<p className="text-xs text-neutral-500">
									{total !== null
										? `${list.length} of ${total} shown`
										: `${list.length} shown`}
								</p>
								<button
									onClick={loadMore}
									disabled={!nextCursor || loading}
									className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-40"
									aria-disabled={!nextCursor || loading}>
									Load more
								</button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</section>
		</div>
	);
}
