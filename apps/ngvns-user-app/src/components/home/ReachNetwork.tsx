"use client";
import React from "react";
import { FiMapPin, FiGlobe, FiUsers } from "react-icons/fi";

type Item = {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	text: string;
	accentFrom: string;
	accentTo: string;
};

const items: Item[] = [
	{
		icon: FiMapPin,
		title: "National Presence",
		text: "Exclusive agreements enabling distribution across 9 states in India.",
		accentFrom: "from-green-500/10",
		accentTo: "to-transparent",
	},
	{
		icon: FiGlobe,
		title: "Global Markets",
		text: "Export-ready products with demand in international supply chains.",
		accentFrom: "from-orange-500/10",
		accentTo: "to-transparent",
	},
	{
		icon: FiUsers,
		title: "Inclusive Growth",
		text: "Landowners, farmers, and partners all benefit through shared value creation.",
		accentFrom: "from-green-600/10",
		accentTo: "to-transparent",
	},
];

const ReachNetwork: React.FC = () => {
	return (
		<section className="relative overflow-hidden bg-white py-16">
			{/* Neutral, professional backdrop */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(60% 60% at 0% 0%, rgba(16,24,40,0.04), transparent 60%), radial-gradient(50% 50% at 100% 10%, rgba(16,24,40,0.04), transparent 60%)",
				}}
			/>

			<div className="relative mx-auto max-w-7xl px-6">
				{/* Header */}
				<div className="mx-auto mb-10 max-w-3xl text-center">
					<span className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-gradient-to-r from-green-50 to-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-700 shadow-sm">
						Our Reach & Network
					</span>
					<h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
						Scale with Purpose
					</h2>
					<p className="mx-auto mt-3 max-w-2xl text-base text-zinc-700 sm:text-lg">
						A trusted supply network that spans states and borders - built on
						quality, transparency, and shared prosperity.
					</p>
				</div>

				{/* Cards */}
				<ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
					{items.map(({ icon: Icon, title, text, accentFrom, accentTo }) => (
						<li
							key={title}
							className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
							{/* Subtle hover glow */}
							<div
								aria-hidden
								className={`pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-b ${accentFrom} ${accentTo} opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100`}
							/>

							<div className="relative z-10">
								<div className="mb-4 flex items-center gap-3">
									{/* Highlighted icon badge */}
									<span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-green-50 to-orange-50 ring-1 ring-green-200 group-hover:ring-orange-300 transition">
										<Icon className="h-5 w-5 text-green-700 group-hover:text-orange-600 transition" />
									</span>
									<h3 className="text-lg font-semibold text-zinc-900">
										{title}
									</h3>
								</div>
								<p className="text-sm leading-relaxed text-zinc-700">{text}</p>
							</div>

							{/* Bottom accent line */}
							<div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-green-500/30 via-orange-500/30 to-green-500/30 opacity-0 group-hover:opacity-100 transition" />
						</li>
					))}
				</ul>

				{/* CTA bar */}
				<div className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-gradient-to-r from-green-50 to-orange-50 p-5 text-center shadow-sm backdrop-blur sm:flex-row sm:text-left">
					<p className="text-sm text-zinc-700">
						Interested in distribution or export partnerships?
						<span className="ml-1 font-semibold text-zinc-900">
							Let’s connect.
						</span>
					</p>
					<a
						href="/contact"
						className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110">
						Contact Team
					</a>
				</div>
			</div>
		</section>
	);
};

export default ReachNetwork;
