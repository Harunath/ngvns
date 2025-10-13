"use client";

import Image from "next/image";

const COLORS = {
	saffron: "#FF9933",
	green: "#138808",
	chakra: "#0A3A82",
};

export default function NaturalFarmingPage() {
	return (
		<main className="min-h-screen bg-white text-slate-900 px-4 py-16 md:px-10">
			{/* top tricolor accent */}
			<div
				className="mx-auto max-w-6xl h-1 rounded-full mb-10"
				style={{
					background:
						"linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
				}}
			/>

			<div className="mx-auto max-w-6xl space-y-14">
				<section className="grid md:grid-cols-2 gap-10 items-center">
					<div className="space-y-5">
						<div className="inline-flex items-center gap-3">
							<span className="text-sm font-semibold tracking-widest text-orange-600 border rounded-full px-3 py-1 uppercase">
								Natural Farming
							</span>
						</div>

						<div
							className="border-l-4 pl-4"
							style={{ borderColor: COLORS.green }}>
							<p className="text-lg md:text-xl leading-relaxed text-slate-700">
								Our initiative promotes sustainable agriculture that nurtures
								the soil, protects biodiversity, and ensures healthier
								livelihoods . By encouraging farmers to work in harmony with the
								environment, we aim to create resilient rural communities and a
								greener future.
							</p>
						</div>
					</div>

					{/* Right: Image (your provided snippet, adapted to Next/Image best practices) */}
					<div className="w-full">
						<Image
							src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1752471456/4f4a1a9d7c51499e0f4d28ec5e128022_jjhwgw.jpg"
							alt="Natural Farming"
							width={700}
							height={500}
							className="rounded-xl shadow-lg object-cover w-full h-auto"
							sizes="(max-width: 768px) 100vw, 50vw"
							priority
						/>
					</div>
				</section>

				{/* divider */}
				<div className="mx-auto h-px w-full bg-gradient-to-r from-transparent via-[#0A3A82]/20 to-transparent" />

				{/* ---------- OUR APPROACH ---------- */}
				<section className="space-y-8">
					<h2
						className="text-3xl font-bold text-center"
						style={{ color: COLORS.chakra }}>
						Our Approach
					</h2>

					<div className="grid md:grid-cols-3 gap-6">
						{/* Card 1 */}
						<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
							<h3
								className="text-lg font-semibold mb-3"
								style={{ color: COLORS.saffron }}>
								• Chemical -Free Cultivation
							</h3>
							<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
								<li>
									Educating farmers on natural farming techniques that reduce or
									eliminate chemical inputs, improving soil health and crop
									quality.
								</li>
							</ul>
						</div>

						{/* Card 2 */}
						<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
							<h3
								className="text-lg font-semibold mb-3"
								style={{ color: COLORS.chakra }}>
								• Soil and Pest Management
							</h3>
							<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
								<li>
									Encouraging the use of bio -fertilizers, compost, and herbal
									pest control to maintain ecological balance and sustain
									productivity.
								</li>
							</ul>
						</div>

						{/* Card 3 */}
						<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
							<h3
								className="text-lg font-semibold mb-3"
								style={{ color: COLORS.green }}>
								• Seed Preservation
							</h3>
							<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
								<li>
									Protecting indigenous seeds and promoting seed banks to
									safeguard biodiversity and ensure resources for future
									generations.
								</li>
							</ul>
						</div>
					</div>
				</section>

				{/* bottom tricolor accent */}
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
