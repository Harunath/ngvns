"use client";

import Image from "next/image";

const COLORS = {
	saffron: "#FF9933",
	green: "#138808",
	chakra: "#0A3A82",
};

export default function WomenEmpowermentPage() {
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
					{/* Left: Text Content */}
					<div className="space-y-5">
						<h1
							className="text-3xl md:text-4xl font-extrabold leading-tight"
							style={{ color: COLORS.chakra }}>
							Women Empowerment
						</h1>

						<p className="text-lg md:text-xl leading-relaxed text-slate-700">
							Putting women at the heart of rural progress, our programs
							strengthen confidence, self-reliance, and leadership to drive
							lasting change in communities.
						</p>
					</div>

					{/* Right: Image */}
					<div className="w-full">
						<Image
							src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1751479105/International-Women_s-Day-22_ji0lt7.jpg"
							alt="Women Empowerment"
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
					{/* SHG Formation & Training */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.saffron }}>
							• SHG Formation & Training
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Create and mentor Self-Help Groups to foster collaboration,
								financial independence, and collective growth.
							</li>
						</ul>
					</div>

					{/* Microfinance & Enterprise Support */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.chakra }}>
							• Microfinance & Enterprise Support
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Provide access to credit, tools, and guidance to help women
								start and sustain local businesses.
							</li>
						</ul>
					</div>

					{/* Literacy, Leadership & Skill Development */}
					<div className="rounded-2xl border bg-white p-6 shadow-sm hover:shadow-md transition">
						<h2
							className="text-lg md:text-xl font-semibold mb-3"
							style={{ color: COLORS.green }}>
							• Literacy, Leadership & Skill Development
						</h2>
						<ul className="list-disc pl-5 space-y-2 text-slate-700 leading-relaxed">
							<li>
								Equip women with essential skills, leadership training, and
								vocational knowledge to thrive personally and professionally.
							</li>
						</ul>
					</div>
				</section>

				{/* ---------- CLOSING PARAGRAPH ---------- */}
				<section className="max-w-5xl mx-auto">
					<div className="rounded-2xl border bg-white p-6 shadow-sm">
						<p className="text-lg leading-relaxed text-slate-700 text-center">
							Empowered women uplift families, enhance children’s education, and
							drive economic growth. Our mission is to enable every woman to
							become a changemaker in her community.
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
