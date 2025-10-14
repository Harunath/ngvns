"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export type FiltersState = {
	vrKpId: string;
	name: string;
	q: string;
	pincode: string;
	createdFrom: string; // ISO
	createdTo: string; // ISO
	sortBy: "createdAt" | "fullname";
	sortDir: "asc" | "desc";
	limit: number;
};

export default function Filters({
	value,
	onChange,
	onSubmit,
}: {
	value: FiltersState;
	onChange: (s: FiltersState) => void;
	onSubmit?: () => void;
}) {
	const [open, setOpen] = useState(true);

	// small helper to update
	function set<K extends keyof FiltersState>(key: K, v: FiltersState[K]) {
		onChange({ ...value, [key]: v });
	}

	// sync Enter key on main search
	useEffect(() => {
		const handler = (e: KeyboardEvent) => {
			if (e.key === "Enter") onSubmit?.();
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onSubmit]);

	return (
		<section className="rounded-2xl border bg-white shadow-sm">
			<header className="flex items-center justify-between px-4 py-3">
				<div>
					<h2 className="text-base font-semibold text-neutral-900">Filters</h2>
					<p className="text-xs text-neutral-500">
						Search by phone, email, id, VRKP ID, name, and created date.
					</p>
				</div>
				<button
					onClick={() => setOpen((o) => !o)}
					className="rounded-lg border px-3 py-1.5 text-xs font-medium text-neutral-700 hover:bg-neutral-50">
					{open ? "Hide" : "Show"}
				</button>
			</header>

			<motion.div
				initial={false}
				animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
				transition={{ duration: 0.2, ease: "easeInOut" }}
				className="overflow-hidden border-t">
				<div className="grid gap-4 p-4 md:grid-cols-3">
					{/* Row 1 */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-neutral-600">
							Quick search
						</label>
						<input
							value={value.q}
							onChange={(e) => set("q", e.target.value)}
							placeholder="Name, email, phone, id, VRKP ID"
							className="w-full rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-neutral-600">Name</label>
						<input
							value={value.name}
							onChange={(e) => set("name", e.target.value)}
							placeholder="Full name"
							className="w-full rounded-xl border px-3 py-2 text-sm focus:border-neutral-400"
						/>
					</div>

					{/* <div className="space-y-1.5">
						<label className="text-xs font-medium text-neutral-600">
							Email
						</label>
						<input
							value={value.email}
							onChange={(e) => set("email", e.target.value)}
							placeholder="email@example.com"
							className="w-full rounded-xl border px-3 py-2 text-sm focus:border-neutral-400"
						/>
					</div> */}

					{/* Row 2 */}
					{/* <div className="space-y-1.5">
						<label className="text-xs font-medium text-neutral-600">
							Phone
						</label>
						<input
							value={value.phone}
							onChange={(e) => set("phone", e.target.value)}
							placeholder="9xxx..."
							className="w-full rounded-xl border px-3 py-2 text-sm focus:border-neutral-400"
						/>
					</div> */}

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-neutral-600">
							Pincode
						</label>
						<input
							value={value.pincode}
							onChange={(e) => set("pincode", e.target.value)}
							placeholder="pincode..."
							className="w-full rounded-xl border px-3 py-2 text-sm focus:border-neutral-400"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-neutral-600">
							VRKP ID
						</label>
						<input
							value={value.vrKpId}
							onChange={(e) => set("vrKpId", e.target.value)}
							placeholder="VRKP123..."
							className="w-full rounded-xl border px-3 py-2 text-sm focus:border-neutral-400"
						/>
					</div>

					{/* Row 3 */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-neutral-600">
							Created from
						</label>
						<input
							type="datetime-local"
							value={value.createdFrom}
							onChange={(e) => set("createdFrom", e.target.value)}
							className="w-full rounded-xl border px-3 py-2 text-sm focus:border-neutral-400"
						/>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-neutral-600">
							Created to
						</label>
						<input
							type="datetime-local"
							value={value.createdTo}
							onChange={(e) => set("createdTo", e.target.value)}
							className="w-full rounded-xl border px-3 py-2 text-sm focus:border-neutral-400"
						/>
					</div>

					<div className="grid grid-cols-3 gap-2">
						<div className="space-y-1.5">
							<label className="text-xs font-medium text-neutral-600">
								Sort by
							</label>
							<select
								value={value.sortBy}
								onChange={(e) => set("sortBy", e.target.value as any)}
								className="w-full rounded-xl border px-3 py-2 text-sm">
								<option value="createdAt">Created at</option>
								<option value="fullname">Full name</option>
							</select>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-medium text-neutral-600">
								Direction
							</label>
							<select
								value={value.sortDir}
								onChange={(e) => set("sortDir", e.target.value as any)}
								className="w-full rounded-xl border px-3 py-2 text-sm">
								<option value="desc">Desc</option>
								<option value="asc">Asc</option>
							</select>
						</div>

						<div className="space-y-1.5">
							<label className="text-xs font-medium text-neutral-600">
								Limit
							</label>
							<input
								type="number"
								min={1}
								max={100}
								value={value.limit}
								onChange={(e) => set("limit", Number(e.target.value))}
								className="w-full rounded-xl border px-3 py-2 text-sm"
							/>
						</div>
					</div>
				</div>

				<div className="flex items-center justify-end gap-2 border-t px-4 py-3">
					<button
						onClick={() =>
							onChange({
								pincode: "",
								// phone: "",
								// email: "",
								vrKpId: "",
								name: "",
								q: "",
								createdFrom: "",
								createdTo: "",
								sortBy: "createdAt",
								sortDir: "desc",
								limit: 20,
							})
						}
						className="rounded-xl border px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
						Reset
					</button>
					<button
						onClick={onSubmit}
						className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800">
						Apply
					</button>
				</div>
			</motion.div>
		</section>
	);
}
