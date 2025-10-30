"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { FaSearch } from "react-icons/fa";

type Props = {
	defaultFromIstYmd: string;
	defaultToIstYmd: string;
	onFetch: (fromIstYmd: string, toIstYmd: string) => void;
};

export default function DateRangeControls({
	defaultFromIstYmd,
	defaultToIstYmd,
	onFetch,
}: Props) {
	const [from, setFrom] = useState(defaultFromIstYmd);
	const [to, setTo] = useState(defaultToIstYmd);

	return (
		<div className="flex flex-col gap-3 sm:flex-row sm:items-end">
			<div className="flex flex-col">
				<label className="text-xs font-medium text-gray-700">From (IST)</label>
				<input
					type="date"
					value={from}
					onChange={(e) => setFrom(e.target.value)}
					className="mt-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
			<div className="flex flex-col">
				<label className="text-xs font-medium text-gray-700">
					To (IST, exclusive)
				</label>
				<input
					type="date"
					value={to}
					onChange={(e) => setTo(e.target.value)}
					className="mt-1 rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>
			<motion.button
				whileTap={{ scale: 0.98 }}
				onClick={() => onFetch(from, to)}
				className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">
				<span className="inline-flex items-center gap-2">
					<FaSearch /> Fetch
				</span>
			</motion.button>
		</div>
	);
}
