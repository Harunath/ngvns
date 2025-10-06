// app/(dashboard)/earnings/page.tsx
import prisma from "@ngvns2025/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth/auth";
import { redirect } from "next/navigation";
import React from "react";

// Helper: format INR neatly
const inr = (n: number) =>
	new Intl.NumberFormat("en-IN", {
		style: "currency",
		currency: "INR",
		maximumFractionDigits: 0,
	}).format(n);

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) redirect("/logout");

	const userId = session.user.id;

	// Get your VRKP id once, then use it in counts
	const me = await prisma.user.findUnique({
		where: { id: userId },
		select: { vrKpId: true },
	});

	const [c1, c2, c3] = await Promise.all([
		me?.vrKpId
			? prisma.user.count({
					where: { parentReferralId: me.vrKpId, deleted: false },
				})
			: Promise.resolve(0),
		prisma.user.count({ where: { parentBId: userId, deleted: false } }),
		prisma.user.count({ where: { parentCId: userId, deleted: false } }),
	]);

	// Build circles from live counts
	const CIRCLES = [
		{ id: 1, label: "Circle 1", rate: 600, count: c1, color: "#FF9933" }, // saffron
		{ id: 2, label: "Circle 2", rate: 200, count: c2, color: "#0b5ba7" }, // chakra blue
		{ id: 3, label: "Circle 3", rate: 180, count: c3, color: "#138808" }, // green
	] as const;

	const withTotals = CIRCLES.map((c) => ({ ...c, total: c.rate * c.count }));
	const grandTotal = withTotals.reduce((acc, c) => acc + c.total, 0);

	return (
		<div className="min-h-screen bg-neutral-100 px-6 py-10">
			<div className="mx-auto max-w-3xl">
				{/* Page Title with tricolor underline */}
				<header className="text-center">
					<h1 className="text-2xl font-semibold text-gray-900">
						{session.user.fullname}&apos;s Earnings
					</h1>
					<div className="mx-auto mt-3 grid max-w-xs grid-cols-3 gap-1">
						<div className="h-1 rounded bg-[#FF9933]" />
						<div className="h-1 rounded bg-[#0b5ba7]" />
						<div className="h-1 rounded bg-[#138808]" />
					</div>
				</header>

				{/* Grand Total card */}
				<section className="my-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
					<div className="relative">
						{/* Subtle Chakra watermark */}
						<svg
							viewBox="0 0 100 100"
							className="pointer-events-none absolute -right-6 -top-6 h-40 w-40 opacity-10"
							aria-hidden="true">
							<circle
								cx="50"
								cy="50"
								r="34"
								fill="none"
								stroke="#0b5ba7"
								strokeWidth="3"
							/>
							{Array.from({ length: 24 }).map((_, k) => {
								const a = (k * Math.PI) / 12;
								const x1 = 50 + 4 * Math.cos(a);
								const y1 = 50 + 4 * Math.sin(a);
								const x2 = 50 + 32 * Math.cos(a);
								const y2 = 50 + 32 * Math.sin(a);
								return (
									<line
										key={k}
										x1={x1}
										y1={y1}
										x2={x2}
										y2={y2}
										stroke="#0b5ba7"
										strokeWidth="2"
									/>
								);
							})}
							<circle cx="50" cy="50" r="3" fill="#0b5ba7" />
						</svg>

						{/* Flag gradient top rail */}
						<div className="h-1 w-full bg-[linear-gradient(90deg,#FF9933_0%,#FF9933_33%,#ffffff_33%,#ffffff_66%,#138808_66%,#138808_100%)]" />
						<div className="p-6">
							<p className="text-sm font-medium text-gray-600">
								Total Earnings
							</p>
							<p className="mt-1 text-3xl font-extrabold tracking-tight text-gray-900">
								{inr(grandTotal)}
							</p>
							<p className="mt-2 text-xs text-gray-500">
								Combined earnings from all circles based on your current
								referrals.
							</p>
						</div>
					</div>
				</section>

				{/* Circle cards: stacked one after another */}
				<div className="space-y-6">
					{withTotals.map((c) => (
						<article
							key={c.id}
							className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
							{/* Left flag rail */}
							<div className="absolute inset-y-0 left-0 w-2">
								<div className="h-1/3 bg-[#FF9933]" />
								<div className="h-1/3 bg-white" />
								<div className="h-1/3 bg-[#138808]" />
							</div>

							<div className="grid grid-cols-[auto,1fr] gap-4 p-6 pl-5">
								{/* Circle Badge */}
								<div
									className="flex h-14 w-14 items-center justify-center rounded-full text-white shadow"
									style={{
										background:
											"conic-gradient(#FF9933 0 120deg, #0b5ba7 120deg 240deg, #138808 240deg 360deg)",
									}}
									aria-hidden="true">
									<span className="rounded-full bg-white/90 px-3 py-1 text-sm font-bold text-gray-900 shadow-sm">
										{c.id}
									</span>
								</div>

								{/* Content */}
								<div>
									<div className="flex flex-wrap items-center gap-3">
										<h2 className="text-lg font-semibold text-gray-900">
											{c.label}
										</h2>
										<span
											className="rounded-full px-3 py-1 text-xs font-semibold text-white"
											style={{ backgroundColor: c.color }}>
											{inr(c.rate)} / person
										</span>
									</div>

									<div className="mt-3 grid grid-cols-3 gap-4 text-center sm:text-left">
										<div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
											<p className="text-xs text-gray-500">Members</p>
											<p className="text-xl font-bold text-gray-900">
												{c.count}
											</p>
										</div>
										<div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
											<p className="text-xs text-gray-500">Earnings</p>
											<p className="text-xl font-bold text-gray-900">
												{inr(c.total)}
											</p>
										</div>
										<div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
											<p className="text-xs text-gray-500">Status</p>
											<p className="text-sm font-semibold text-[#0b5ba7]">
												Active
											</p>
										</div>
									</div>

									{/* Decorative flag underline */}
									<div className="mt-4 grid grid-cols-3">
										<div className="h-1 bg-[#FF9933]" />
										<div className="h-1 bg-[#0b5ba7]" />
										<div className="h-1 bg-[#138808]" />
									</div>
								</div>
							</div>
						</article>
					))}
				</div>

				<p className="mt-8 text-xs text-gray-500">
					These totals are calculated from live referral counts.
				</p>
			</div>
		</div>
	);
}
