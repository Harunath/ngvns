"use client";
import { motion } from "framer-motion";

export default function LayoutSkeleton() {
	return (
		<div className="grid grid-cols-12 gap-3 p-3">
			{/* sidebar */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="col-span-12 md:col-span-3">
				<div className="h-[420px] rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900">
					<div className="h-full w-full animate-pulse rounded-xl bg-white/5" />
				</div>
			</motion.div>

			{/* main */}
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className="col-span-12 md:col-span-9 space-y-3">
				{Array.from({ length: 4 }).map((_, i) => (
					<div
						key={i}
						className="h-24 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900">
						<div className="h-full w-full animate-pulse rounded-xl bg-white/5" />
					</div>
				))}
			</motion.div>
		</div>
	);
}
