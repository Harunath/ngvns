// "use client";
// import React from "react";
// import {
// 	FiFeather,
// 	FiZap,
// 	FiBriefcase,
// 	FiUsers,
// 	FiRepeat,
// 	FiActivity,
// } from "react-icons/fi";

// const focusItems = [
// 	{
// 		icon: <FiFeather />,
// 		text: "Improve farming through natural, chemical-free methods",
// 	},
// 	{ icon: <FiZap />, text: "Provide clean, renewable energy to rural areas" },
// 	{
// 		icon: <FiBriefcase />,
// 		text: "Create local jobs and support rural enterprises",
// 	},
// 	{
// 		icon: <FiUsers />,
// 		text: "Support women's leadership and financial inclusion",
// 	},
// 	{
// 		icon: <FiRepeat />,
// 		text: "Convert agricultural waste into productive resources",
// 	},
// 	{
// 		icon: <FiActivity />,
// 		text: "Ensure better care and productivity in livestock",
// 	},
// ];

// const Intro = () => {
// 	return (
// 		<section className="bg-slate-100 py-16 px-6 md:px-12 lg:px-24">
// 			<div className="max-w-5xl mx-auto">
// 				<h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 border-b-2 border-gray-300 pb-2">
// 					Welcome to{" "}
// 					<span className="text-[#ff6600]">
// 					VR Kisan Parivaar
// 					</span>
// 				</h2>

// 				<p className="text-base md:text-lg text-green-700 font-semibold mb-6">
// 					Self-Reliant Villages | Natural Farming | Green Energy | Rural
// 					Livelihoods
// 				</p>

// 				<p className="text-gray-800 text-[17px] mb-10 leading-relaxed">
// 					VR Kisan Parivaar is a rural development organization
// 					dedicated to empowering villages through sustainable practices and
// 					community-driven progress.
// 				</p>

// 				<div className="bg-white border-l-4 border-[#1c9a43] rounded-xl shadow-lg p-6">
// 					<h3 className="text-xl font-bold text-[#1a1a1a] mb-5 underline decoration-orange-500 underline-offset-4">
// 						Our Focus Areas
// 					</h3>

// 					<ul className="space-y-4 text-gray-800 text-[16px]">
// 						{focusItems.map((item, index) => (
// 							<li
// 								key={index}
// 								className="flex items-start gap-4 hover:bg-green-50 rounded-md p-2 transition">
// 								<span className="text-[#ff6600] text-xl mt-1">{item.icon}</span>
// 								<span>{item.text}</span>
// 							</li>
// 						))}
// 					</ul>
// 				</div>

// 				<p className="text-lg md:text-xl text-[#1a1a1a] mt-10 font-medium leading-relaxed">
// 					<span className="text-[#ff6600] font-semibold">Our vision:</span>{" "}
// 					Villages that thrive naturally, sustainably, and independently
// 				</p>
// 			</div>
// 		</section>
// 	);
// };

// export default Intro;
"use client";
import React from "react";
import {
	FiFeather,
	FiRepeat,
	FiPackage,
	FiGlobe,
	FiShield,
	FiTrendingUp,
} from "react-icons/fi";

const pillars = [
	{
		icon: <FiFeather />,
		title: "Natural Farming",
		text: "Regenerative, chemical-free cultivation that restores soil health and conserves water.",
	},
	{
		icon: <FiRepeat />,
		title: "Bio-waste Utilization",
		text: "Converting crop residue into compost, biogas, and eco-products to reduce pollution.",
	},
	{
		icon: <FiPackage />,
		title: "Food Processing",
		text: "Nutrition-preserving processing (e.g., dehydration) that boosts shelf life and value.",
	},
	{
		icon: <FiGlobe />,
		title: "Market Access",
		text: "Connecting farmers to national and global buyers for fair, consistent returns.",
	},
];

const highlights = [
	{ icon: <FiShield />, label: "Quality-first, traceable supply chains" },
	{ icon: <FiTrendingUp />, label: "Rural livelihoods & fair pricing" },
];

const Intro = () => {
	return (
		<section className="bg-gradient-to-b from-white via-slate-50 to-emerald-50 py-16 px-6 md:px-12 lg:px-24">
			<div className="mx-auto max-w-6xl">
				{/* Eyebrow */}
				<div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
					Redefining Agriculture • Empowering Farmers • Sustaining the Future
				</div>

				{/* Heading */}
				<h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-zinc-900">
					🌾 Welcome to{" "}
					<span className="text-orange-600 ">
						VR Kisan Parivaar
					</span>
				</h2>

				{/* Lead copy */}
				<p className="mt-4 text-[17px] leading-relaxed text-zinc-800">
					VR Kisan Parivaar is committed to transforming agriculture through
					sustainable practices that uplift farmers, create rural livelihoods,
					and protect our environment. By integrating{" "}
					<span className="font-semibold">natural farming</span>,{" "}
					<span className="font-semibold">bio-waste utilization</span>,{" "}
					<span className="font-semibold">food processing</span>, and{" "}
					<span className="font-semibold">global market access</span>, we are
					building a resilient agricultural ecosystem that ensures prosperity
					for farmers and nourishment for society.
				</p>

				{/* Highlights */}
				<div className="mt-6 flex flex-wrap gap-2">
					{highlights.map((h, i) => (
						<span
							key={i}
							className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-semibold text-zinc-700 shadow-sm">
							<span className="text-emerald-600">{h.icon}</span>
							{h.label}
						</span>
					))}
				</div>

				{/* Pillars Card */}
				<div className="mt-10 rounded-2xl border border-emerald-200 bg-white/80 p-6 shadow-sm backdrop-blur">
					<h3 className="text-xl font-bold text-zinc-900">Our Core Pillars</h3>
					<ul className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2">
						{pillars.map((p, idx) => (
							<li
								key={idx}
								className="group rounded-xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
								<div className="mb-2 flex items-center gap-3">
									<span className="text-xl text-orange-600">{p.icon}</span>
									<h4 className="text-base font-semibold text-zinc-900">
										{p.title}
									</h4>
								</div>
								<p className="text-sm leading-relaxed text-zinc-700">
									{p.text}
								</p>
							</li>
						))}
					</ul>
				</div>

				{/* Vision */}
				<div className="mt-10 rounded-xl border-l-4 border-emerald-600 bg-white p-5 shadow-sm">
					<p className="text-lg md:text-xl font-medium text-zinc-900 leading-relaxed">
						<span className="text-orange-600 font-semibold">Our vision:</span>{" "}
						Villages that thrive naturally, sustainably, and independently -
						with strong farmer incomes and climate-positive growth.
					</p>
				</div>
			</div>
		</section>
	);
};

export default Intro;
