"use client";
import {
	FaLeaf,
	FaRecycle,
	FaBriefcase,
	FaIndustry,
	FaGlobeAsia,
} from "react-icons/fa";

export default function Mission() {
	return (
		<section className="relative overflow-hidden bg-white">
			{/* soft gradient background */}
			<div aria-hidden className="pointer-events-none absolute inset-0">
				<div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-emerald-100 blur-3xl opacity-60" />
				<div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-orange-100 blur-3xl opacity-60" />
			</div>

			<div className="mx-auto max-w-7xl px-4 py-20">
				<header className="text-center">
					<p className="mx-auto inline-block rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold tracking-widest text-emerald-800">
						OUR MISSION
					</p>
					<h2 className="mt-4 text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
						Building a sustainable, inclusive rural future
					</h2>
				</header>

				{/* centerpiece statement card */}
				<article className="relative mx-auto mt-10 max-w-5xl overflow-hidden rounded-3xl border border-neutral-200 bg-gradient-to-br from-neutral-50 to-white shadow-xl">
					{/* accent bar */}
					<div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-orange-500 to-amber-500" />

					<div className="relative p-8 sm:p-12">
						{/* decorative quote mark */}
						<div
							aria-hidden
							className="pointer-events-none absolute -top-10 -left-2 text-8xl font-black leading-none text-neutral-100 select-none">
							“
						</div>

						<p className="text-balance text-xl leading-relaxed text-black sm:text-2xl">
							To <strong>empower farmers</strong>, promote{" "}
							<strong>natural farming</strong>, utilize{" "}
							<strong>bio-waste efficiently</strong>, create{" "}
							<strong>employment opportunities</strong>, and advance{" "}
							<strong>food processing</strong> while expanding{" "}
							<strong>market opportunities globally</strong> through{" "}
							<strong>innovation and sustainability</strong>.
						</p>

						{/* keyword chips */}
						<div className="mt-8 flex flex-wrap items-center justify-center gap-3">
							<Tag icon={<FaLeaf className="size-3.5" />}>Natural Farming</Tag>
							<Tag icon={<FaRecycle className="size-3.5" />}>Bio-waste</Tag>
							<Tag icon={<FaBriefcase className="size-3.5" />}>Employment</Tag>
							<Tag icon={<FaIndustry className="size-3.5" />}>
								Food Processing
							</Tag>
							<Tag icon={<FaGlobeAsia className="size-3.5" />}>
								Global Markets
							</Tag>
						</div>

						{/* subtle progress/impact bar */}
						<div className="mt-10">
							<p className="text-center text-xs font-medium uppercase tracking-widest text-neutral-500">
								Impact pillars
							</p>
							<div className="mt-3 grid grid-cols-5 gap-2">
								{[
									{ label: "Farmers", tint: "bg-emerald-500" },
									{ label: "Farming", tint: "bg-emerald-400" },
									{ label: "Bio-waste", tint: "bg-amber-500" },
									{ label: "Employment", tint: "bg-emerald-500" },
									{ label: "Global", tint: "bg-orange-500" },
								].map((b, i) => (
									<div
										key={i}
										className="rounded-xl border border-neutral-200 p-2">
										<div className={`h-2 w-full rounded-full ${b.tint}`} />
										<p className="mt-2 text-center text-[11px] font-medium text-neutral-600">
											{b.label}
										</p>
									</div>
								))}
							</div>
						</div>
					</div>
				</article>

				{/* bottom note */}
				<p className="mx-auto mt-8 max-w-3xl text-center text-sm text-neutral-600">
					Our mission guides programs, partnerships, and investments to uplift
					rural communities with planet-first growth.
				</p>
			</div>
		</section>
	);
}

/* small helper for pill tags */
function Tag({
	children,
	icon,
}: {
	children: React.ReactNode;
	icon?: React.ReactNode;
}) {
	return (
		<span className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-700 shadow-sm transition hover:shadow">
			{icon}
			{children}
		</span>
	);
}
