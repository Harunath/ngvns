"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = {
	saffron: "#FF9933",
	green: "#138808",
	navy: "#0B3D91",
	ink: "#0f172a",
	ring: "#e2e8f0",
};

const ROLES = [
	"Business Head",
	"Senior Marketing Manager",
	"Team Leader",
	"Marketing Executive",
	"Digital Marketing",
	"HR",
	"Accountant",
];

function slugify(input: string) {
	return input
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/(^-|-$)+/g, "");
}

export default function CareersSection() {
	const [q, setQ] = useState("");
	const [dept, setDept] = useState("All");

	const departments = useMemo(
		() => [
			"All",
			"Leadership",
			"Marketing",
			"Sales",
			"HR",
			"Finance",
			"Digital",
		],
		[]
	);

	const filtered = useMemo(() => {
		const query = q.trim().toLowerCase();
		return ROLES.filter((r) => {
			const matchesQuery = !query || r.toLowerCase().includes(query);
			const map: Record<string, string[]> = {
				Leadership: ["Business Head"],
				Marketing: ["Senior Marketing Manager", "Marketing Executive"],
				Sales: ["Team Leader", "Marketing Executive"],
				HR: ["HR"],
				Finance: ["Accountant"],
				Digital: ["Digital Marketing"],
			};
			const inDept = dept === "All" || (map[dept] || []).includes(r);
			return matchesQuery && inDept;
		});
	}, [q, dept]);

	return (
		<main className="min-h-screen bg-gradient-to-b from-white via-[#f9fafb] to-[#f1f5f9]">
			{/* Top flag ribbon */}
			<div
				className="h-1 w-full"
				style={{
					backgroundImage: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.green})`,
				}}
			/>

			<section className="mx-auto max-w-6xl px-4 py-12">
				{/* Heading */}
				<header className="mb-10 text-center">
					<h1 className="text-4xl font-bold tracking-tight text-slate-900">
						Careers at <span className="text-[#138808]">VR Kisan Parivaar</span>
					</h1>
					<p className="mt-2 text-slate-600">
						Building rural-first impact at scale - join our mission-driven team.
					</p>
				</header>

				{/* Filters */}
				<div className="mb-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
					<div className="relative w-full sm:w-72">
						<input
							value={q}
							onChange={(e) => setQ(e.target.value)}
							placeholder="Search roles..."
							className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:ring-2 focus:ring-[#138808]/40"
						/>
						<span className="pointer-events-none absolute right-3 top-2.5 text-xs text-slate-400">
							⌘K
						</span>
					</div>

					<select
						value={dept}
						onChange={(e) => setDept(e.target.value)}
						className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm transition focus:ring-2 focus:ring-[#138808]/40">
						{departments.map((d) => (
							<option key={d} value={d}>
								{d}
							</option>
						))}
					</select>
				</div>

				{/* Role cards */}
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((role, i) => (
						<motion.div
							key={role}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.05 }}>
							<RoleCard role={role} />
						</motion.div>
					))}
				</div>

				{/* Empty state */}
				{filtered.length === 0 && (
					<div className="mt-16 rounded-2xl border border-dashed border-slate-300 bg-white/80 p-10 text-center backdrop-blur-sm">
						<p className="text-slate-700 font-medium">
							No roles match your filters.
						</p>
						<p className="mt-1 text-sm text-slate-500">
							Try clearing search or choosing a different department.
						</p>
					</div>
				)}
			</section>
		</main>
	);
}

/* ---------- Role Card Component with Modal ---------- */
function RoleCard({ role }: { role: string }) {
	const id = slugify(role);
	const [showModal, setShowModal] = useState(false);

	return (
		<>
			<motion.article
				whileHover={{ y: -4 }}
				className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-md transition-all duration-300 hover:shadow-lg hover:border-[#138808]/40">
				{/* Top accent border */}
				<div
					className="pointer-events-none absolute inset-x-0 top-0 h-1"
					style={{
						backgroundImage: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.navy}, ${COLORS.green})`,
					}}
				/>

				<h3 className="mb-3 text-lg font-semibold text-slate-900 group-hover:text-[#138808] transition-colors">
					{role}
				</h3>
				<p className="text-sm text-slate-500">
					Join our {(role.split(" ")[0] ?? "").toLowerCase()} team to make an
					impact in rural India.
				</p>

				<div className="mt-5">
					<button
						onClick={() => setShowModal(true)}
						className="inline-flex items-center justify-center rounded-lg bg-[#138808] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#0b5e05]">
						How to Apply →
					</button>
				</div>
			</motion.article>

			<AnimatePresence>
				{showModal && (
					<>
						{/* Backdrop */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
							onClick={() => setShowModal(false)}
						/>

						{/* Modal Content */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 40 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 40 }}
							transition={{ type: "spring", stiffness: 120 }}
							className="fixed inset-0 z-50 flex items-center justify-center p-4">
							<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
								<h2 className="text-xl font-semibold text-slate-900 mb-3">
									How to Apply for {role}
								</h2>
								<p className="text-sm text-slate-600 leading-relaxed">
									📧 Send your updated resume to{" "}
									<a
										href="mailto:career@vrkisanparivaar.com"
										className="text-[#138808] font-medium hover:underline">
										career@vrkisanparivaar.com
									</a>{" "}
									with the subject line <b>“Application for {role}”</b>.
								</p>

								<ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-slate-600">
									<li>Attach your latest CV (PDF or DOC format)</li>
									<li>Include a short cover note or introduction</li>
									<li>Mention your current location and notice period</li>
									<li>Portfolio or LinkedIn profile (if applicable)</li>
								</ul>

								<div className="mt-6 flex justify-end gap-3">
									<button
										onClick={() => setShowModal(false)}
										className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">
										Close
									</button>
									<a
										href="mailto:career@vrkisanparivaar.com"
										className="rounded-lg bg-[#138808] px-4 py-2 text-sm font-medium text-white hover:bg-[#0b5e05]">
										Email Resume
									</a>
								</div>
							</div>
						</motion.div>
					</>
				)}
			</AnimatePresence>
		</>
	);
}
