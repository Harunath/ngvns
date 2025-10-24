"use client";

import Image from "next/image";
import Link from "next/link";

const COLORS = {
	saffron: "#FF9933",
	green: "#138808",
	chakra: "#0A3A82",
};

export default function WomenEmpowermentPage() {
	return (
		<main className="min-h-screen bg-white text-slate-900 px-5 py-16 md:px-10">
			{/* Top tricolor accent */}
			<div
				className="mx-auto mb-12 h-1 w-full max-w-6xl rounded-full"
				style={{
					background:
						"linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
				}}
			/>

			<div className="mx-auto max-w-6xl space-y-16">
				{/* ---------- HERO SECTION ---------- */}
				<section className="grid items-center gap-10 md:grid-cols-2">
					{/* Text */}
					<div className="space-y-6">
						<span className="rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-sm font-semibold tracking-widest text-orange-600 uppercase">
							Women Empowerment
						</span>

						<p className="text-lg mt-6 md:text-xl leading-relaxed text-slate-700">
							Putting women at the heart of rural progress, our programs
							strengthen confidence, self-reliance, and leadership to drive
							lasting change in communities.
						</p>
					</div>

					{/* Image */}
					<div className="w-full">
						<Image
							src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1751479105/International-Women_s-Day-22_ji0lt7.jpg"
							alt="Women Empowerment"
							width={800}
							height={450}
							className="w-full rounded-2xl object-cover shadow-lg"
							sizes="(max-width: 768px) 100vw, 50vw"
							priority
						/>
					</div>
				</section>

				{/* Divider */}
				<div className="mx-auto h-px w-full bg-gradient-to-r from-transparent via-[#0A3A82]/20 to-transparent" />

				{/* ---------- MAIN CONTENT CARDS ---------- */}
				<section className="grid gap-8 md:grid-cols-3">
					{/* SHG Formation & Training */}
					<div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition hover:shadow-md">
						<h2
							className="mb-3 text-lg font-semibold md:text-xl"
							style={{ color: COLORS.saffron }}>
							• SHG Formation & Training
						</h2>
						<ul className="list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
							<li>
								Create and mentor Self-Help Groups to foster collaboration,
								financial independence, and collective growth.
							</li>
						</ul>
					</div>

					{/* Microfinance & Enterprise Support */}
					<div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition hover:shadow-md">
						<h2
							className="mb-3 text-lg font-semibold md:text-xl"
							style={{ color: COLORS.chakra }}>
							• Microfinance & Enterprise Support
						</h2>
						<ul className="list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
							<li>
								Provide access to credit, tools, and mentorship to help women
								start and sustain successful local businesses.
							</li>
						</ul>
					</div>

					{/* Literacy, Leadership & Skill Development */}
					<div className="rounded-2xl border border-neutral-200 bg-white p-7 shadow-sm transition hover:shadow-md">
						<h2
							className="mb-3 text-lg font-semibold md:text-xl"
							style={{ color: COLORS.green }}>
							• Literacy, Leadership & Skill Development
						</h2>
						<ul className="list-disc space-y-2 pl-5 text-slate-700 leading-relaxed">
							<li>
								Equip women with essential skills, leadership training, and
								vocational knowledge to thrive personally and professionally.
							</li>
						</ul>
					</div>
				</section>

				{/* ---------- CLOSING PARAGRAPH ---------- */}
				<section className="mx-auto max-w-5xl text-center">
					<div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
						<p className="text-lg leading-relaxed text-slate-700">
							Empowered women uplift families, enhance children’s education, and
							drive economic growth. Our mission is to enable every woman to
							become a changemaker in her community.
						</p>
					</div>

					<div className="pt-6">
						<Link
							href="/contact"
							className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold shadow-md transition hover:shadow-lg"
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
					className="mx-auto mt-12 h-1 w-full max-w-6xl rounded-full"
					style={{
						background:
							"linear-gradient(90deg, #FF9933 0%, #FFFFFF 50%, #138808 100%)",
					}}
				/>
			</div>
		</main>
	);
}
