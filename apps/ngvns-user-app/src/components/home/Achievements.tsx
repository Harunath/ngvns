"use client";

import {
	FaUsers,
	FaHandHoldingHeart,
	FaSolarPanel,
	FaLeaf,
} from "react-icons/fa";

const stats = [
	{
		icon: <FaUsers />,
		value: "120+",
		label: "Villages Empowered",
		color: "text-[#FF9933]", // Orange
	},
	{
		icon: <FaHandHoldingHeart />,
		value: "5,000+",
		label: "Women Benefited",
		color: "text-[#138808]", // Green
	},
	{
		icon: <FaSolarPanel />,
		value: "300+",
		label: "Clean Energy Units",
		color: "text-[#FF9933]", // Orange
	},
	{
		icon: <FaLeaf />,
		value: "3,500+",
		label: "Acres Under Natural Farming",
		color: "text-[#138808]", // Green
	},
];

export default function Achievements() {
	return (
		<section className="bg-white py-20 px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 2xl:px-48">
			<h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-14">
				🏆 Our Achievements
			</h2>

			<div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
				{stats.map((item, idx) => (
					<div
						key={idx}
						className="bg-[#f9f9f9] rounded-2xl shadow-md border border-gray-100 p-6 text-center transition hover:-translate-y-1 hover:shadow-lg duration-300">
						<div className="flex justify-center mb-4">
							<div className={`text-4xl ${item.color}`}>{item.icon}</div>
						</div>
						<h3 className="text-3xl font-extrabold text-black">{item.value}</h3>
						<p className="mt-2 text-sm text-gray-700 font-medium">
							{item.label}
						</p>
					</div>
				))}
			</div>
		</section>
	);
}
