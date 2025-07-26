"use client";

import Image from "next/image";

const galleryItems = [
	{
		title: "Self-Sustainable Villages",
		img: "https://res.cloudinary.com/dgulr1hgd/image/upload/v1751479028/wp2445613_xbirq9.jpg",
		description: "Empowered communities with local planning and resilience.",
	},
	{
		title: "Natural Farming",
		img: "https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478304/OIP_x8fvlo.jpg",
		description: "Organic practices and indigenous seed conservation.",
	},
	{
		title: "Green Energy",
		img: "https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478381/2183826_gyjzkz.jpg",
		description: "Solar, biogas, and clean energy in rural areas.",
	},
	{
		title: "Rural Employment",
		img: "https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478526/india-rural-economy-16-9_nriovz.jpg",
		description: "Livelihood generation through skills and enterprise.",
	},
	{
		title: "Women Empowerment",
		img: "https://res.cloudinary.com/dgulr1hgd/image/upload/v1751479105/International-Women_s-Day-22_ji0lt7.jpg",
		description: "Financial inclusion and leadership development.",
	},
	{
		title: "Agri-Waste Management",
		img: "https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478696/compost-with-agricultural-waste_ennccp.jpg",
		description: "Turning crop waste into compost and energy.",
	},
	{
		title: "Livestock Management",
		img: "https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478845/livestock_management_header_xgifse.jpg",
		description: "Sustainable animal husbandry and vet support.",
	},
];

export default function Gallery() {
	return (
		<section className="bg-[#f9f9f9] py-16 px-4 sm:px-6 lg:px-12 text-center">
			<h2 className="text-3xl md:text-4xl font-bold text-black mb-12">
				🌾 Our Impact in Action
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
				{galleryItems.map((item, idx) => (
					<div
						key={idx}
						className="relative group flex flex-col rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white hover:shadow-lg transition duration-300">
						{/* Image */}
						<Image
							src={item.img}
							alt={item.title}
							width={500}
							height={300}
							className="w-full h-64 object-cover"
						/>

						{/* Overlay Description - On Hover */}
						<div className="absolute inset-0 bg-orange-600 bg-opacity-70 flex items-center justify-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
							<p className="text-sm sm:text-base text-white">
								{item.description}
							</p>
						</div>

						{/* Title Always Visible - Background */}
						<div className="absolute bottom-0 left-0 w-full py-3 text-center bg-orange-600 z-10">
							<h3 className="text-sm sm:text-base font-bold text-white tracking-wide uppercase">
								{item.title}
							</h3>
						</div>
					</div>
				))}
			</div>
		</section>
	);
}
