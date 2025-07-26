"use client";

import Image from "next/image";
import Link from "next/link";

const news = [
	{
		title: "Village Solar Grid Inaugurated in Nizamabad",
		date: "June 28, 2025",
		summary:
			"Clean energy reaches over 120 rural households through our latest solar microgrid project.",
		link: "/news/village-solar-grid",
		image:
			"https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478381/2183826_gyjzkz.jpg",
	},
	{
		title: "Women’s Livelihood Workshop – July Edition",
		date: "July 5, 2025",
		summary:
			"Empowering 40+ rural women with dairy training, financial literacy, and local marketing skills.",
		link: "/events/women-livelihood-workshop",
		image:
			"https://res.cloudinary.com/dgulr1hgd/image/upload/v1751479105/International-Women_s-Day-22_ji0lt7.jpg",
	},
	{
		title: "Natural Farming Champions Felicitated",
		date: "July 1, 2025",
		summary:
			"Celebrating over 500 acres brought under regenerative agriculture across Telangana villages.",
		link: "/news/farming-awards",
		image:
			"https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478304/OIP_x8fvlo.jpg",
	},
];

export default function News() {
	return (
		<section className="bg-white py-20 px-4 sm:px-10 lg:px-24">
			<h2 className="text-3xl md:text-4xl font-bold text-black text-center mb-12">
				📢 Latest Updates & Events
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
				{news.map((item, index) => (
					<div
						key={index}
						className="bg-[#fefefe] border border-gray-300 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300">
						<div className="relative h-48 w-full">
							<Image
								src={item.image}
								alt={item.title}
								fill
								className="object-cover"
							/>
						</div>
						<div className="p-5 text-left">
							<p className="text-xs text-gray-500 mb-1">{item.date}</p>
							<h3 className="text-lg font-semibold text-black mb-2">
								{item.title}
							</h3>
							<p className="text-sm text-gray-800 mb-4">{item.summary}</p>
							<Link
								href={item.link}
								className="text-sm font-medium text-orange-600 hover:underline">
								Read more →
							</Link>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
