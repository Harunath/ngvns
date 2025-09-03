"use client";
import React from "react";
import { FiArrowRight, FiFileText } from "react-icons/fi";

type Props = {
	brochureHref?: string; // e.g. "/vr-kisan-parivaar-brochure.pdf"
};

const JoinCTA: React.FC<Props> = ({ brochureHref = "/brochure.pdf" }) => {
	return (
		<section className="relative overflow-hidden bg-white py-16">
			{/* Subtle ambient background */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(60% 60% at 0% 0%, rgba(16,185,129,0.06), transparent 60%), radial-gradient(40% 40% at 100% 20%, rgba(249,115,22,0.06), transparent 60%)",
				}}
			/>

			<div className="relative mx-auto max-w-7xl px-6">
				<div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white/70 shadow-sm backdrop-blur">
					{/* Top stripe accent */}
					<div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-zinc-200 to-orange-500" />

					<div className="grid grid-cols-1 items-stretch gap-0 md:grid-cols-12">
						{/* Left: Message */}
						<div className="relative md:col-span-7 p-8 md:p-12">
							<span className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-zinc-700 shadow-sm">
								Join the Movement
							</span>

							<h2 className="mt-3 text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
								🚀 Join the VR Kisan Parivaar Movement
							</h2>

							<p className="mt-4 max-w-2xl text-base text-zinc-700 sm:text-lg">
								Be part of the agricultural revolution redefining food security
								and sustainability. Together, we can build a future where
								villages thrive, farmers prosper, and agriculture becomes the
								backbone of a greener economy.
							</p>

							<div className="mt-6 flex flex-col gap-3 sm:flex-row">
								<a
									href={brochureHref}
									className="inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800">
									<FiFileText className="h-5 w-5" />
									Download Our Brochure
								</a>

								<a
									href="/contact"
									className="inline-flex items-center justify-center gap-2 rounded-full border border-zinc-300 bg-white px-6 py-3 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-50">
									Talk to Our Team
									<FiArrowRight className="h-5 w-5" />
								</a>
							</div>
						</div>

						{/* Right: Decorative panel */}
						<div className="relative md:col-span-5">
							<div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-50 via-white to-orange-50" />
							<div className="relative h-full w-full p-8 md:p-10">
								<div className="relative h-full w-full overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
									{/* Animated accents */}
									<div
										aria-hidden
										className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-emerald-200/50 blur-2xl"
									/>
									<div
										aria-hidden
										className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-orange-200/50 blur-2xl"
									/>
									<div className="absolute inset-0 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]">
										<div
											className="absolute inset-0 opacity-40"
											style={{
												background:
													"repeating-linear-gradient(135deg, rgba(24,24,27,0.06) 0px, rgba(24,24,27,0.06) 1px, transparent 1px, transparent 12px)",
												animation: "pan 24s linear infinite",
											}}
										/>
									</div>

									{/* Value highlights */}
									<div className="relative z-10 grid grid-cols-1 gap-3 p-6">
										{[
											"Farmer-first, climate-positive model",
											"Traceable & quality-assured products",
											"Global market connections",
										].map((v) => (
											<div
												key={v}
												className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white/80 px-4 py-3 text-sm font-medium text-zinc-800 shadow-sm backdrop-blur">
												<span className="h-2 w-2 rounded-full bg-emerald-600" />
												{v}
											</div>
										))}
									</div>
								</div>
							</div>

							{/* local keyframes */}
							<style jsx>{`
								@keyframes pan {
									0% {
										transform: translateX(0);
									}
									100% {
										transform: translateX(-25%);
									}
								}
							`}</style>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};

export default JoinCTA;
