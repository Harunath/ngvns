"use client";
import { motion } from "framer-motion";
import { presetLast7Days, presetToday1Day } from "../../lib/time/ist";

type Props = {
	onSelect: (fromIstYmd: string, toIstYmd: string, label: string) => void;
};

export default function PresetRangeButtons({ onSelect }: Props) {
	return (
		<div className="flex flex-wrap gap-2">
			<motion.button
				whileTap={{ scale: 0.98 }}
				onClick={() => {
					const { from, to } = presetToday1Day();
					onSelect(from, to, "Today (1 day)");
				}}
				className="rounded-xl border px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50">
				Today (1 day)
			</motion.button>
			<motion.button
				whileTap={{ scale: 0.98 }}
				onClick={() => {
					const { from, to } = presetLast7Days();
					onSelect(from, to, "Last 7 days");
				}}
				className="rounded-xl border px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-gray-50">
				Last 7 days
			</motion.button>
		</div>
	);
}
