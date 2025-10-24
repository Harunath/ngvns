import Link from "next/link";

const COLORS = {
	saffron: "#FF9933",
	green: "#138808",
	chakra: "#0A3A82",
};

export default function GreenEnergyPage() {
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
				{/* ---------- HEADER & INTRO ---------- */}
				<section className="space-y-6">
											<span className="rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold tracking-widest text-orange-600 uppercase">

						Green Energy
					</span>

					<div className="max-w-4xl mt-8 mx-auto">
						<div
							className="rounded-2xl border bg-white p-6 shadow-sm"
							style={{ borderColor: "#E5E7EB" }}>
							<p className="text-lg md:text-xl leading-relaxed text-slate-700 text-center">
								Clean, renewable power for a cleaner village life. Our green
								energy initiatives empower rural communities with sustainable
								solutions that reduce carbon footprints and improve daily
								living.
							</p>
						</div>
					</div>
				</section>

				{/* Divider */}
				<div className="mx-auto h-px w-full bg-gradient-to-r from-transparent via-[#0A3A82]/20 to-transparent" />

				{/* ---------- CONTENT CARDS ---------- */}
				<section className="grid md:grid-cols-2 gap-6">
					{/* Solar Solutions */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.saffron }}>
							• Solar Solutions
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Install solar lights, water pumps, and microgrids to power
								homes, farms, and schools.
							</li>
							<li>
								Reduce dependence on conventional electricity and lower energy
								costs.
							</li>
						</ul>
					</div>

					{/* Biogas Units */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.chakra }}>
							• Biogas Units
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Convert organic waste into clean energy for kitchens and small
								industries.
							</li>
							<li>
								Promote sustainable waste management and reduce greenhouse gas
								emissions.
							</li>
						</ul>
					</div>

					{/* Energy-Efficient Farm Tools */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.green }}>
							• Energy-Efficient Farm Tools
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Provide farmers with tools that save energy and improve
								productivity.
							</li>
							<li>
								Reduce emissions and labor intensity while supporting
								eco-friendly farming.
							</li>
						</ul>
					</div>

					{/* Community Training */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.chakra }}>
							• Community Training
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Equip villagers to operate and maintain green energy systems.
							</li>
							<li>
								Build local capacity for long-term, self-sustaining energy use.
							</li>
						</ul>
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
