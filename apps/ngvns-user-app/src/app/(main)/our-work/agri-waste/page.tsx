"use client";

import Image from "next/image";

const COLORS = {
	saffron: "#FF9933",
	green: "#138808",
	chakra: "#0A3A82",
};

export default function AgriWasteManagementPage() {
	return (
		<main className="min-h-screen bg-white text-slate-900 px-4 py-16 md:px-10">
			{/* Top tricolor accent */}
			<div
				className="mx-auto max-w-6xl h-1 rounded-full mb-10"
				style={{
					background:
						"linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
				}}
			/>

			<div className="mx-auto max-w-6xl space-y-14">
				{/* ---------- HERO (Title + Image side-by-side) ---------- */}
				<section className="grid md:grid-cols-2 gap-10 items-center">
					{/* Left: Text */}
					<div className="space-y-5">
						<h1
							className="text-3xl md:text-4xl font-extrabold leading-tight"
							style={{ color: COLORS.chakra }}>
							Agri-Waste Management
						</h1>

						<p className="text-lg md:text-xl leading-relaxed text-slate-700">
							Turning agricultural waste into wealth to promote eco-friendly
							farming and environmental sustainability.
						</p>
					</div>

					{/* Right: Image */}
					<div className="w-full">
						<Image
							src="https://res.cloudinary.com/diaoy3wzi/image/upload/v1759741645/ChatGPT_Image_Oct_6_2025_02_32_28_PM_yazhtp.png"
							alt="Agri-Waste Management"
							width={800}
							height={450}
							className="rounded-xl shadow-lg object-cover w-full h-auto"
							sizes="(max-width: 768px) 100vw, 50vw"
							priority
						/>
					</div>
				</section>

				{/* Divider */}
				<div className="mx-auto h-px w-full bg-gradient-to-r from-transparent via-[#0A3A82]/20 to-transparent" />

				{/* ---------- MAIN CONTENT CARDS ---------- */}
				<section className="grid md:grid-cols-3 gap-6">
					{/* Composting & Organic Manure */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.saffron }}>
							• Composting & Organic Manure
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Convert crop residues into nutrient-rich compost to improve soil
								health and fertility.
							</li>
						</ul>
					</div>

					{/* Biogas Generation */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.chakra }}>
							• Biogas Generation
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Transform agricultural waste into clean energy for kitchens and
								small enterprises.
							</li>
						</ul>
					</div>

					{/* Eco-Friendly Products */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.green }}>
							• Eco-Friendly Products
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Create sustainable products from farm waste, generating
								additional income for farmers.
							</li>
						</ul>
					</div>
				</section>

				{/* ---------- CLOSING PARAGRAPH ---------- */}
				<section className="max-w-5xl mx-auto">
					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<p className="text-lg leading-relaxed text-slate-700 text-center">
							Our approach reduces pollution, restores soil fertility, and
							creates local green enterprises, enabling farmers to benefit
							economically and ecologically.
						</p>
					</div>
				</section>

				{/* Bottom tricolor accent */}
				<div
					className="mx-auto max-w-6xl h-1 rounded-full"
					style={{
						background:
							"linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
					}}
				/>
			</div>
		</main>
	);
}
