"use client";
import React from "react";
import { FiCheckCircle } from "react-icons/fi";

const points = [
	"Naturally grown",
	"Sustainably processed",
	"Globally competitive",
	"Environmentally responsible",
];

const EcoProducts: React.FC = () => {
	return (
		<section className="relative overflow-hidden bg-gradient-to-b from-white via-slate-50 to-emerald-50 py-16">
			{/* Subtle decorative background */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0"
				style={{
					background:
						"radial-gradient(60% 60% at 10% 10%, rgba(16,185,129,0.06), transparent 70%), radial-gradient(40% 40% at 90% 20%, rgba(249,115,22,0.06), transparent 70%)",
				}}
			/>

			<div className="relative mx-auto max-w-6xl px-6">
				{/* Header */}
				<div className="mx-auto mb-10 max-w-3xl text-center">
					<h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
						Eco-Friendly Products <br className="hidden sm:block" />
						<span className="text-orange-600 ">from Scratch</span>
					</h2>
					<p className="mt-4 text-base text-zinc-700 sm:text-lg">
						We specialize in farm-to-market solutions that ensure every product
						is:
					</p>
				</div>

				{/* Checklist grid */}
				<ul className="mx-auto grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
					{points.map((point) => (
						<li
							key={point}
							className="flex items-start gap-3 rounded-xl border border-zinc-200 bg-white/90 p-4 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md">
							<FiCheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-emerald-600" />
							<span className="text-sm font-medium text-zinc-800">{point}</span>
						</li>
					))}
				</ul>

				{/* Footer CTA */}
				<div className="mx-auto mt-12 max-w-2xl rounded-xl border border-emerald-200 bg-white/70 p-6 text-center shadow-sm backdrop-blur">
					<p className="text-sm text-zinc-700">
						From soil to shelf, our commitment is to deliver{" "}
						<span className="font-semibold text-emerald-700">
							natural, sustainable, and globally competitive
						</span>{" "}
						agri-products for a better tomorrow.
					</p>
				</div>
			</div>
		</section>
	);
};

export default EcoProducts;
