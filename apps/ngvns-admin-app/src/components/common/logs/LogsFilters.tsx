"use client";

import * as React from "react";
import { motion } from "motion/react";

export type LogsFiltersValue = {
	from?: string;
	to?: string;
	limit: number;
};

type LogsFiltersProps = {
	value: LogsFiltersValue;
	onChange: (next: LogsFiltersValue) => void;
	className?: string;
};

export default function LogsFilters({
	value,
	onChange,
	className,
}: LogsFiltersProps) {
	const [local, setLocal] = React.useState<LogsFiltersValue>(value);

	React.useEffect(() => setLocal(value), [value]);

	const apply = () => onChange(local);

	return (
		<motion.div
			initial={{ opacity: 0, y: -6 }}
			animate={{ opacity: 1, y: 0 }}
			className={className}>
			<div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-4">
					<div className="flex flex-col">
						<label className="text-xs font-medium text-neutral-600">From</label>
						<input
							type="date"
							value={local.from ?? ""}
							onChange={(e) =>
								setLocal((s) => ({ ...s, from: e.target.value || undefined }))
							}
							className="mt-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-xs font-medium text-neutral-600">To</label>
						<input
							type="date"
							value={local.to ?? ""}
							onChange={(e) =>
								setLocal((s) => ({ ...s, to: e.target.value || undefined }))
							}
							className="mt-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-xs font-medium text-neutral-600">
							Limit
						</label>
						<input
							type="number"
							min={5}
							max={200}
							value={local.limit}
							onChange={(e) => {
								const n = Number(e.target.value || 20);
								setLocal((s) => ({
									...s,
									limit: Number.isNaN(n) ? 20 : Math.max(1, Math.min(200, n)),
								}));
							}}
							className="mt-1 rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500"
						/>
					</div>

					<div className="flex items-end">
						<button
							onClick={apply}
							className="inline-flex w-full items-center justify-center rounded-xl bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800">
							Apply Filters
						</button>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
