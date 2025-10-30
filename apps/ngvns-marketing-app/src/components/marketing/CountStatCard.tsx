"use client";
import { motion } from "framer-motion";
import { FaUsers, FaRegCalendarAlt } from "react-icons/fa";
import { prettyIstRange } from "../../lib/time/ist";

type Props = {
	title?: string;
	count: number | null;
	fromIstYmd: string;
	toIstYmd: string;
	loading?: boolean;
	error?: string | null;
};

export default function CountStatCard({
	title = "Joined Users",
	count,
	fromIstYmd,
	toIstYmd,
	loading,
	error,
}: Props) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			className="rounded-2xl border bg-white p-4 sm:p-5 shadow-sm">
			<div className="flex items-start justify-between gap-3">
				<div className="flex items-center gap-2">
					<div className="rounded-xl border p-2">
						<FaUsers className="text-gray-700" />
					</div>
					<h3 className="text-base font-semibold text-gray-900">{title}</h3>
				</div>
				<FaRegCalendarAlt className="text-gray-500" />
			</div>

			<div className="mt-4">
				{loading ? (
					<div className="h-10 w-28 animate-pulse rounded-lg bg-gray-200" />
				) : error ? (
					<p className="text-sm text-red-600">{error}</p>
				) : (
					<p className="text-4xl font-bold tracking-tight text-gray-900">
						{typeof count === "number" ? count : "—"}
					</p>
				)}
				<p className="mt-2 text-xs text-gray-600">
					{prettyIstRange(fromIstYmd, toIstYmd)}
				</p>
			</div>
		</motion.div>
	);
}
