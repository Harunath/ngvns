import type { Metadata } from "next";
import Link from "next/link";

// Indian tricolor palette (accessible on white)
const COLORS = {
	saffron: "#FF671F",
	green: "#046A38",
	navy: "#0A1F44", // subtle heading color (not pure black)
};

export const metadata: Metadata = {
	title: "Our Work | VR KISAN PARIVAAR",
	description:
		"Explore VR KISAN PARIVAAR initiatives: Self-Sustainable Villages, Natural Farming, Green Energy, Rural Employment, Women Empowerment, Agri-Waste Management, and Livestock Management.",
};

const LINKS: [string, string][] = [
	["Self-Sustainable Villages", "/our-work/self-sustainable-villages"],
	["Natural Farming", "/our-work/natural-farming"],
	["Green Energy", "/our-work/green-energy"],
	["Rural Employment", "/our-work/rural-employment"],
	["Women Empowerment", "/our-work/women-empowerment"],
	["Agri-Waste Management", "/our-work/agri-waste"],
	["Livestock Management", "/our-work/livestock"],
];

export default async function OurWorkPage() {
	return (
		<div className="bg-white">
			{/* Top tricolor accent */}
			<div
				className="h-1 w-full"
				style={{
					background: `linear-gradient(90deg, ${COLORS.saffron}, white 50%, ${COLORS.green})`,
				}}
			/>

			<main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
				{/* Breadcrumbs */}
				<nav aria-label="Breadcrumb" className="mb-6">
					<ol className="flex items-center gap-2 text-sm text-neutral-600">
						<li>
							<Link
								href="/"
								className="hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-300 rounded">
								Home
							</Link>
						</li>
						<li aria-hidden="true" className="select-none">
							/
						</li>
						<li className="text-neutral-700">Our Work</li>
					</ol>
				</nav>

				{/* Heading + intro */}
				<header className="mb-10">
					<h1
						className="text-3xl sm:text-4xl font-semibold tracking-tight"
						style={{ color: COLORS.navy }}>
						Our Work
					</h1>

					{/* Underline in tricolor */}
					<div
						className="mt-3 h-1 w-28 rounded"
						style={{
							background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.saffron} 33%, #E5E7EB 33%, #E5E7EB 66%, ${COLORS.green} 66%)`,
						}}
						aria-hidden
					/>

					<p className="mt-4 max-w-3xl text-base leading-7 text-neutral-700">
						We drive sustainable rural development through focused programs.
						Explore each initiative to learn goals, methods, and impact stories.
					</p>
				</header>

				{/* Cards grid */}
				<section aria-labelledby="initiatives" className="mb-16">
					<h2 id="initiatives" className="sr-only">
						Initiatives
					</h2>
					<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
						{LINKS.map(([title, href], i) => (
							<li key={href}>
								<Link
									href={href}
									className="group block rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition
                             hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-300">
									{/* Chakra-like badge */}
									<div className="mb-3 flex items-center gap-2">
										<span
											aria-hidden
											className="inline-block h-2.5 w-2.5 rounded-full"
											style={{
												background: i % 2 === 0 ? COLORS.saffron : COLORS.green,
											}}
										/>
										<span className="text-xs font-medium text-neutral-600">
											Initiative
										</span>
									</div>

									<h3 className="text-lg font-semibold text-neutral-800">
										{title}
									</h3>

									<p className="mt-2 text-sm leading-6 text-neutral-700">
										Learn more about our work in{" "}
										<span
											className="px-1.5 py-0.5 rounded"
											style={{
												backgroundColor: "#FFF6F0",
												color: COLORS.saffron,
											}}>
											{title}
										</span>
										.
									</p>

									{/* subtle bottom accent bar on hover */}
									<div
										className="mt-4 h-0.5 w-full rounded transition-[opacity,transform] opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0"
										style={{
											background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.green})`,
										}}
										aria-hidden
									/>
								</Link>
							</li>
						))}
					</ul>
				</section>

				{/* CTA strip */}
				<section
					className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8 shadow-sm"
					aria-label="Get involved">
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<h3 className="text-xl font-semibold text-neutral-900">
								Get Involved
							</h3>
							<p className="mt-1 text-neutral-700">
								Partner with us, volunteer, or support a program to amplify
								impact.
							</p>
						</div>
						<div className="flex flex-wrap gap-3">
							<Link
								href="/contact"
								className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium border border-neutral-300 text-neutral-800 hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-300">
								Contact Us
							</Link>
							<Link
								href="/donate"
								className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white"
								style={{
									background: `linear-gradient(90deg, ${COLORS.saffron}, ${COLORS.green})`,
								}}>
								Donate
							</Link>
						</div>
					</div>
				</section>
			</main>

			{/* Bottom tricolor accent */}
			<div
				className="h-1 w-full mt-10"
				style={{
					background: `linear-gradient(90deg, ${COLORS.green}, white 50%, ${COLORS.saffron})`,
				}}
			/>
		</div>
	);
}
