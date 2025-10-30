"use client";
import { motion } from "framer-motion";
import { redirect } from "next/navigation";

export default function Forbidden() {
	redirect("/login");
	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-8 text-center shadow-xl">
				<h1 className="text-2xl font-semibold text-white">403 – Forbidden</h1>
				<p className="mt-2 text-neutral-400">
					You don&apos;t have access to view this page.
				</p>
			</motion.div>
		</div>
	);
}
