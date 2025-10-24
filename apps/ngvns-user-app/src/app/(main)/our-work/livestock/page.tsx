"use client";

import Image from "next/image";
import Link from "next/link";

const COLORS = {
	saffron: "#FF9933",
	green: "#138808",
	chakra: "#0A3A82",
};

export default function LivestockManagementPage() {
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
						<span className="rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold tracking-widest text-orange-600 uppercase">
							Livestock Management
						</span>

						<p className="text-lg mt-8 md:text-xl leading-relaxed text-slate-700">
							Healthy livestock lead to better nutrition, higher incomes, and
							stronger rural communities .
						</p>
					</div>

					{/* Right: Image */}
					<div className="w-full">
						<Image
							src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478845/livestock_management_header_xgifse.jpg"
							alt="Livestock Management"
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
					{/* Veterinary Services & Health Camps */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.saffron }}>
							• Veterinary Services & Health Camps
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Provide access to animal healthcare, vaccinations, and
								treatments as needed.
							</li>
						</ul>
					</div>

					{/* Fodder & Shelter Support */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.chakra }}>
							• Fodder & Shelter Support
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Assist farmers with fodder cultivation and improved housing for
								livestock.
							</li>
						</ul>
					</div>

					{/* Training in Animal Husbandry */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.green }}>
							• Training in Animal Husbandry
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Equip farmers with skills in dairy farming, poultry, and goat
								care to boost productivity and income.
							</li>
						</ul>
					</div>
				</section>

				{/* ---------- CLOSING PARAGRAPH ---------- */}
				<section className="max-w-5xl mx-auto">
					<div className="rounded-xl border border-neutral-200 bg-white px-5 py-4 shadow-sm mx-auto max-w-3xl">
						<p className="text-center text-base md:text-lg leading-snug text-slate-700">
							We work with farmers to improve animal productivity and
							livelihoods, while promoting sustainable and ethical livestock
							practices.
						</p>
					</div>

					<div className="text-center pt-4">
						<Link
							href="/contact"
							className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold shadow-md hover:shadow-lg transition"
							style={{ backgroundColor: COLORS.chakra, color: "#FFFFFF" }}>
							<span>Join Us</span>
							<svg
								width="18"
								height="18"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								className="opacity-90">
								<path strokeWidth="2" d="M5 12h14M13 5l7 7-7 7" />
							</svg>
						</Link>
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
