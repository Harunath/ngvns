"use client";

import Image from "next/image";
import Link from "next/link";

const COLORS = {
	saffron: "#FF9933",
	green: "#138808",
	chakra: "#0A3A82",
};

export default function Page() {
	return (
		<main className="min-h-screen bg-white text-slate-900 px-4 py-16 md:px-10">
			{/* Thin tricolor accent at top */}
			<div
				className="mx-auto max-w-6xl h-1 rounded-full mb-10"
				style={{
					background:
						"linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
				}}
			/>

			<div className="max-w-6xl mx-auto flex flex-col space-y-16">
				<section className="grid md:grid-cols-2 gap-10 items-center">
					{/* Left: Text */}
					<div className="space-y-5">
						<div className="inline-flex items-center gap-3">
							<span className="rounded-full border px-3 py-1 text-sm font-semibold tracking-widest text-orange-600 uppercase">
								Self-Sustainable Villages
							</span>
						</div>

						<p className="text-lg md:text-xl text-slate-700 leading-relaxed">
							We believe real development begins when villages lead their own
							transformation. By fostering empowerment, innovation, and
							sustainable practices, we’re turning rural communities into
							thriving, self-reliant ecosystems where people live with dignity,
							opportunity, and harmony with nature.
						</p>
					</div>

					{/* Right: Image */}
					<div className="relative w-full h-[240px] sm:h-[320px] md:h-[360px] rounded-2xl overflow-hidden shadow-xl ring-1 ring-black/5">
						<Image
							src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1751479028/wp2445613_xbirq9.jpg"
							alt="Self Sustainable Village"
							fill
							className="object-cover "
							sizes="(max-width: 768px) 100vw, 50vw"
							priority
						/>
						{/* subtle top gradient for depth */}
						<div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
						{/* bottom tricolor hairline */}
						<div
							className="absolute bottom-0 left-0 right-0 h-1"
							style={{
								background: "linear-gradient(90deg, #FF9933, #FFFFFF, #138808)",
							}}
						/>
					</div>
				</section>

				{/* Divider (Ashoka Chakra blue) */}
				<div className="mx-auto h-px w-full max-w-6xl bg-gradient-to-r from-transparent via-[#0A3A82]/20 to-transparent" />

				{/* -------------------- WHAT WE DO -------------------- */}
				<section className="space-y-10">
					<h3
						className="text-3xl font-bold text-center"
						style={{ color: COLORS.chakra }}>
						What We Do
					</h3>

					{/* Row of subtle section tags */}
					<div className="flex flex-wrap items-center justify-center gap-2">
						{[
							"Planning & Leadership",
							"Water Conservation",
							"Local Food & Enterprises",
						].map((t, i) => (
							<span
								key={i}
								className="rounded-full border px-3 py-1 text-xs font-semibold"
								style={{
									borderColor:
										i === 0
											? COLORS.saffron
											: i === 1
												? COLORS.chakra
												: COLORS.green,
									color:
										i === 0
											? COLORS.saffron
											: i === 1
												? COLORS.chakra
												: COLORS.green,
								}}>
								{t}
							</span>
						))}
					</div>

					{/* Cards */}
					<div className="grid md:grid-cols-3 gap-6">
						{/* Community Planning & Leadership */}
						<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
							<h4
								className="text-lg font-semibold mb-3"
								style={{ color: COLORS.saffron }}>
								• Community Planning & Leadership
							</h4>
							<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
								<li>
									Train villagers to identify needs, map resources, and plan
									development strategically.
								</li>
								<li>
									Build leadership capacity among women and youth to ensure
									inclusive decision-making.
								</li>
								<li>
									Mentor local committees to coordinate projects, monitor
									progress, and maintain transparency at every stage.
								</li>
							</ul>
						</div>

						{/* Water Conservation */}
						<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
							<h4
								className="text-lg font-semibold mb-3"
								style={{ color: COLORS.chakra }}>
								• Water Conservation
							</h4>
							<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
								<li>
									Introduce smart irrigation methods like drip and sprinkler
									systems to save water and boost yields.
								</li>
								<li>
									Educate communities on watershed management and climate
									resilience.
								</li>
								<li>
									Promote rainwater harvesting and recharge wells to ensure
									year-round water security.
								</li>
							</ul>
						</div>

						{/* Local Food Systems & Enterprises */}
						<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
							<h4
								className="text-lg font-semibold mb-3"
								style={{ color: COLORS.green }}>
								• Local Food Systems & Enterprises
							</h4>
							<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
								<li>
									Promote and support natural farming practices to help farmers
									grow healthy, chemical-free produce.
								</li>
								<li>
									Help set up small-scale enterprises (food processing,
									handicrafts, agri-services) that generate employment and keep
									wealth within the village.
								</li>
								<li>
									Facilitate market linkages and cooperative models to increase
									income and reduce middlemen.
								</li>
							</ul>
						</div>
					</div>

					{/* CTA */}
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
					className="mx-auto max-w-6xl h-1 rounded-full mt-10"
					style={{
						background:
							"linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
					}}
				/>
			</div>
		</main>
	);
}
