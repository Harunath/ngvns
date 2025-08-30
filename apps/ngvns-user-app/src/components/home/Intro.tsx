"use client";
import React from "react";
import {
	FiFeather,
	FiZap,
	FiBriefcase,
	FiUsers,
	FiRepeat,
	FiActivity,
} from "react-icons/fi";

const focusItems = [
	{
		icon: <FiFeather />,
		text: "Improve farming through natural, chemical-free methods",
	},
	{ icon: <FiZap />, text: "Provide clean, renewable energy to rural areas" },
	{
		icon: <FiBriefcase />,
		text: "Create local jobs and support rural enterprises",
	},
	{
		icon: <FiUsers />,
		text: "Support women's leadership and financial inclusion",
	},
	{
		icon: <FiRepeat />,
		text: "Convert agricultural waste into productive resources",
	},
	{
		icon: <FiActivity />,
		text: "Ensure better care and productivity in livestock",
	},
];

const Intro = () => {
	return (
		<section className="bg-slate-100 py-16 px-6 md:px-12 lg:px-24">
			<div className="max-w-5xl mx-auto">
				<h2 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3 border-b-2 border-gray-300 pb-2">
					Welcome to{" "}
					<span className="text-[#ff6600]">
					VR Kisan Parivaar
					</span>
				</h2>

				<p className="text-base md:text-lg text-green-700 font-semibold mb-6">
					Self-Reliant Villages | Natural Farming | Green Energy | Rural
					Livelihoods
				</p>

				<p className="text-gray-800 text-[17px] mb-10 leading-relaxed">
					VR Kisan Parivaar is a rural development organization
					dedicated to empowering villages through sustainable practices and
					community-driven progress.
				</p>

				<div className="bg-white border-l-4 border-[#1c9a43] rounded-xl shadow-lg p-6">
					<h3 className="text-xl font-bold text-[#1a1a1a] mb-5 underline decoration-orange-500 underline-offset-4">
						Our Focus Areas
					</h3>

					<ul className="space-y-4 text-gray-800 text-[16px]">
						{focusItems.map((item, index) => (
							<li
								key={index}
								className="flex items-start gap-4 hover:bg-green-50 rounded-md p-2 transition">
								<span className="text-[#ff6600] text-xl mt-1">{item.icon}</span>
								<span>{item.text}</span>
							</li>
						))}
					</ul>
				</div>

				<p className="text-lg md:text-xl text-[#1a1a1a] mt-10 font-medium leading-relaxed">
					<span className="text-[#ff6600] font-semibold">Our vision:</span>{" "}
					Villages that thrive naturally, sustainably, and independently
				</p>
			</div>
		</section>
	);
};

export default Intro;
