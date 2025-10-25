"use client";

import Image from "next/image";
import Link from "next/link";

const COLORS = {
	saffron: "#FF9933",
	green: "#138808",
	chakra: "#0A3A82",
};

export default function RuralEmploymentPage() {
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
				{/* ---------- HERO (Title + Image side-by-side on md+) ---------- */}
				<section className="grid md:grid-cols-2 gap-10 items-center">
					{/* Left: Title & Intro */}
					<div className="space-y-5">
						<span className="rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold tracking-widest text-orange-600 uppercase">
							Rural Employment
						</span>

						<div className="rounded-2xl border mt-8 bg-white p-5 shadow-sm">
							<p className="text-lg md:text-xl leading-relaxed text-slate-700">
								At VR KISAN PARIVAAR, we believe strong villages are built on
								thriving local economies . Our Rural Employment initiatives
								unlock the potential of rural communities by creating dignified,
								sustainable livelihood opportunities that benefit youth, women,
								and families alike.
							</p>
						</div>
					</div>

					{/* Right: Image (as provided) */}
					<div className="w-full">
						<Image
							src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478526/india-rural-economy-16-9_nriovz.jpg"
							alt="Rural Employment"
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

				{/* ---------- CONTENT CARDS (exact content only) ---------- */}
				<section className="grid md:grid-cols-3 gap-6">
					{/* Skill Training & Digital Literacy */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.saffron }}>
							• Skill Training & Digital Literacy
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Equip youth and women with practical skills, vocational
								training, and digital tools to access employment and
								entrepreneurial opportunities.
							</li>
						</ul>
					</div>

					{/* Support for Local Enterprises */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.chakra }}>
							• Support for Local Enterprises
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Strengthen small businesses and micro - enterprises with
								mentorship, resources, and guidance to ensure growth and
								sustainability.
							</li>
						</ul>
					</div>

					{/* Market Linkages */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.green }}>
							• Market Linkages
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Connect village products directly to buyers, expanding market
								access and increasing income for local producers.
							</li>
						</ul>
					</div>
				</section>

				{/* ---------- CLOSING PARAGRAPH (exact content) ---------- */}
				<section className="max-w-5xl mx-auto">
					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<p className="text-lg leading-relaxed text-slate-700">
							By focusing on practical skills, entrepreneurship, and local
							market connections, we help villagers build incomes that stay
							within their communities. These programs not only generate jobs
							but also create a sense of pride, stability, and self-reliance in
							rural life.
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
