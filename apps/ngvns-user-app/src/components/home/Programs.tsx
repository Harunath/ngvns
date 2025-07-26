"use client";

import Link from "next/link";
import {
	FaSeedling,
	FaSolarPanel,
	FaWater,
	FaTractor,
	FaLeaf,
	FaFemale,
} from "react-icons/fa";

// 🐄 Custom SVG Cow Icon
const CowIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="currentColor"
		viewBox="0 0 24 24"
		className="w-10 h-10 text-[#138808]">
		<path d="M20.84 4.61c-.23-.05-.46-.08-.7-.08-.77 0-1.48.3-2.01.84l-.46.45-2.32-.44L13.5 2H10L8.54 5.38 6.17 5.83 5.71 5.37c-.55-.55-1.28-.84-2.06-.84-.23 0-.47.02-.7.08C2.15 4.8 1 6.08 1 7.6v.42c0 .73.29 1.42.8 1.94L5 13v3c0 1.5 1.04 2.74 2.43 2.97.4.63 1.11 1.03 1.9 1.03s1.5-.4 1.9-1.03h.54c.4.63 1.11 1.03 1.9 1.03s1.5-.4 1.9-1.03c1.39-.23 2.43-1.47 2.43-2.97v-3l3.2-3.05c.5-.52.8-1.21.8-1.94V7.6c0-1.52-1.15-2.8-2.66-2.99zM9.1 5h2.8l1.25 2.5-1.45 1.5H9.3L7.95 7.5 9.1 5zM3 8V7.6c0-.52.39-.97.9-1.04.28-.04.56.05.77.26l2.37 2.37 1.66 1.66c-.48.45-.82 1.06-.96 1.73L3.63 8.9C3.24 8.51 3 8.03 3 8zm8 10c-.28 0-.5-.22-.5-.5V17h1v.5c0 .28-.22.5-.5.5zm4 0c-.28 0-.5-.22-.5-.5V17h1v.5c0 .28-.22.5-.5.5zm3-7.25V16c0 .83-.67 1.5-1.5 1.5h-.5v-.5c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.5h-1v-.5c0-.83-.67-1.5-1.5-1.5S9 16.17 9 17v.5h-.5C7.67 17.5 7 16.83 7 16v-5.25c0-1.1.9-2 2-2h6c1.1 0 2 .9 2 2z" />
	</svg>
);

// 🔧 Programs List
const programs = [
	{
		title: "Self-Sustainable Villages",
		icon: <FaWater className="w-10 h-10 text-[#138808]" />,
		description:
			"Empowering villages with local planning, water, and energy systems.",
		link: "/our-work/self-sustainable-villages",
	},
	{
		title: "Natural Farming",
		icon: <FaSeedling className="w-10 h-10 text-[#138808]" />,
		description:
			"Promoting organic, regenerative practices and local seed conservation.",
		link: "/our-work/natural-farming",
	},
	{
		title: "Green Energy",
		icon: <FaSolarPanel className="w-10 h-10 text-[#138808]" />,
		description:
			"Clean solar, biogas and efficient energy for rural development.",
		link: "/our-work/green-energy",
	},
	{
		title: "Rural Employment",
		icon: <FaTractor className="w-10 h-10 text-[#138808]" />,
		description: "Skilling and microenterprise to reduce rural unemployment.",
		link: "/our-work/rural-employment",
	},
	{
		title: "Women Empowerment",
		icon: <FaFemale className="w-10 h-10 text-[#138808]" />,
		description:
			"Enabling women through SHGs, finance, and leadership training.",
		link: "/our-work/women-empowerment",
	},
	{
		title: "Agri-Waste Management",
		icon: <FaLeaf className="w-10 h-10 text-[#138808]" />,
		description: "Turning farm waste into compost, energy, and rural products.",
		link: "/our-work/agri-waste",
	},
	{
		title: "Livestock Management",
		icon: <CowIcon />,
		description:
			"Boosting animal health and productivity through scientific care.",
		link: "/our-work/livestock",
	},
];

export default function Programs() {
	return (
		<section className="bg-white py-16 px-4 sm:px-6 lg:px-12">
			<h2 className="text-3xl md:text-4xl font-bold text-center text-black mb-12">
				🌱 Our Mission in Action
			</h2>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				{programs.map((program, idx) => (
					<div
						key={idx}
						className="bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 text-center p-6 hover:border-orange-500 group">
						<div className="flex justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
							{program.icon}
						</div>
						<h3 className="text-2xl font-semibold text-black group-hover:text-orange-600 mb-2">
							{program.title}
						</h3>
						<p className="text-lg text-gray-600 mb-4">{program.description}</p>
						<Link
							href={program.link}
							className="inline-block text-md  font-semibold text-orange-600 ">
							Learn more →
						</Link>
					</div>
				))}
			</div>
		</section>
	);
}
