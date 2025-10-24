"use client";
import React from "react";
import {
	FiFeather,
	FiPackage,
	FiGlobe,
	FiSettings,
	FiRefreshCw,
	FiShield,
	FiBriefcase,
} from "react-icons/fi";

type Item = {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	text: string;
};

const items: Item[] = [
	{
		icon: FiFeather,
		title: "Sustainable Farming",
		text: "Promoting eco-friendly, regenerative practices that protect soil, conserve water, and enhance biodiversity.",
	},
	{
		icon: FiPackage,
		title: "Dehydration Technology",
		text: "Using natural methods to preserve produce while retaining maximum nutrition and shelf life.",
	},
	{
		icon: FiGlobe,
		title: "Farmer Empowerment",
		text: "Connecting farmers to national and global markets to secure fair returns and opportunities.",
	},
	{
		icon: FiSettings,
		title: "Agricultural Innovation",
		text: "Combining scientific research and indigenous knowledge to create modern,sustainable solutions.",
	},
	{
		icon: FiRefreshCw,
		title: "Environmental Stewardship",
		text: "Transforming agricultural waste into energy, compost, and eco-friendly products to reduce pollution.",
	},
	{
		icon: FiShield,
		title: "Quality Assurance",
		text: "Maintaining strict standards for safe, nutritious, and export-ready produce.",
	},
	{
		icon: FiBriefcase,
		title: "Corporate Farming Model",
		text: "Developing scalable, profitable partnerships that benefit landowners, farmers, and rural communities.",
	},
];

const WhatWeDo: React.FC = () => {
	return (
		<section className="relative overflow-hidden bg-slate-50 py-10">
			{/* Subtle professional background */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(60% 60% at 10% 10%, rgba(16,185,129,0.08), transparent 60%), radial-gradient(50% 50% at 90% 20%, rgba(249,115,22,0.08), transparent 60%)",
				}}
			/>
			<div className="relative mx-auto max-w-7xl px-6">
				{/* Header */}
				<div className="mx-auto max-w-4xl text-center">
					<div className="mx-auto mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/60 px-3 py-1 text-xs font-semibold text-emerald-800">
						Our Capabilities
					</div>
					<h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
						<span className="text-orange-600 ">What We Do</span>
					</h2>
					<p className="mx-auto mt-3 max-w-3xl text-base text-zinc-700 sm:text-lg">
						VR Kisan Parivaar is working to create value across the agricultural
						ecosystem, from regenerative farming to premium market access, so
						that farmers prosper and the environment thrives.
					</p>
				</div>

				{/* Divider */}
				<div className="mx-auto mt-10 h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />

				{/* Content layout: left summary + right grid */}
				<div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12">
					{/* Summary / Value props */}
					<aside className="lg:col-span-4">
						<div className="sticky top-6 rounded-2xl border border-zinc-200 bg-white/80 p-6 shadow-sm backdrop-blur">
							<h3 className="text-lg font-semibold text-zinc-900">
								Outcome-First Approach
							</h3>
							<ul className="mt-4 space-y-3 text-sm text-zinc-700">
								<li className="flex items-start gap-2">
									<span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-emerald-600" />
									Climate-positive production and circular resource use
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-orange-600" />
									Higher farmer incomes via value-addition & market linkages
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-0.5 inline-block h-2 w-2 rounded-full bg-zinc-800" />
									Export-ready quality and transparent supply chains
								</li>
							</ul>

							<div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
								<p className="text-sm text-emerald-900">
									<span className="font-semibold">Impact at scale:</span> a
									repeatable model that benefits landowners, farmers, and
									communities alike.
								</p>
							</div>
						</div>
					</aside>

					{/* Cards grid */}
					<div className="lg:col-span-8">
						<ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
							{items.map(({ icon: Icon, title, text }) => (
								<li
									key={title}
									className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
									{/* Accent ring in flag gradient */}
									<div className="absolute -inset-px rounded-2xl opacity-0 ring-2 ring-transparent transition group-hover:opacity-100 group-hover:[background:linear-gradient(to_right,#ff9933,#ffffff,#138808)]" />

									<div className="relative z-10">
										<div className="mb-3 flex items-center gap-3">
											{/* Icon background in flag gradient */}
											<span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-orange-200 via-white to-green-200 ring-1 ring-zinc-200">
												<Icon className="h-5 w-5 text-emerald-800" />
											</span>
											<h3 className="text-base font-semibold text-zinc-900">
												{title}
											</h3>
										</div>
										<p className="text-sm leading-relaxed text-zinc-700">
											{text}
										</p>
									</div>

									{/* Decorative gradient bottom-right in flag colors */}
									<div
										aria-hidden
										className="pointer-events-none absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-gradient-to-tr from-orange-300 via-white to-green-400 opacity-70 blur-xl transition group-hover:opacity-90"
									/>
								</li>
							))}
						</ul>
					</div>
				</div>
			</div>
		</section>
	);
};

export default WhatWeDo;
