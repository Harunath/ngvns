"use client";
import { FaLeaf, FaBolt, FaUsers, FaFemale, FaHorseHead } from "react-icons/fa";

const missionPoints = [
	{
		title: "Eco-friendly and Natural Farming",
		description:
			"We promote sustainable, chemical-free farming practices that restore soil health and biodiversity.",
		icon: <FaLeaf />,
	},
	{
		title: "Clean Energy for Rural Areas",
		description:
			"We encourage the adoption of solar and renewable energy in rural homes and agricultural spaces.",
		icon: <FaBolt />,
	},
	{
		title: "Local Employment & Entrepreneurship",
		description:
			"We support rural job creation and self-employment through skill-building and opportunities.",
		icon: <FaUsers />,
	},
	{
		title: "Women-led Development",
		description:
			"We empower women through inclusive growth, leadership, and financial literacy programs.",
		icon: <FaFemale />,
	},
	{
		title: "Responsible Livestock & Agri Use",
		description:
			"We ensure the sustainable use of livestock and agri-resources for long-term productivity.",
		icon: <FaHorseHead />,
	},
];

export default function Mission() {
	return (
		<section className="bg-white py-20 px-4">
			<div className="max-w-7xl mx-auto text-center">
				<h2 className="text-black text-3xl font-bold mb-2 uppercase tracking-wide">
					Our <span className="text-orange-600">Mission</span>
				</h2>
				<h3 className="text-xl font-bold text-[#333] mb-12">
					Promoting a Sustainable and Inclusive Rural India
				</h3>

				<div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
					{missionPoints.map((item, index) => (
						<div
							key={index}
							className="group bg-[#1d6a43] text-white rounded-2xl px-6 py-8 relative flex flex-col items-center justify-between shadow-xl hover:scale-105 transition-transform duration-300">
							{/* Icon */}
							<div className="absolute -top-7 bg-[#ff7f11] rounded-full p-4 shadow-md">
								<span className="text-white text-2xl group-hover:animate-pulse group-hover:scale-125 transition-transform duration-300">
									{item.icon}
								</span>
							</div>

							{/* Title and Description */}
							<div className="mt-8 text-center">
								<h4 className="text-lg font-semibold mb-2">{item.title}</h4>
								<div className="h-1 w-10 bg-[#ff7f11] mx-auto mb-4 rounded-full" />
								<p className="text-sm text-gray-100 leading-relaxed">
									{item.description}
								</p>
							</div>

							{/* Arrow */}
							<div className="mt-6">
								<span className="inline-block text-[#ff7f11] text-lg transform transition-transform group-hover:translate-x-1">
									→
								</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
