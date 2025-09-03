"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { easeInOut } from "framer-motion";
import {
	FaWind,
	FaSeedling,
	FaUsers,
	FaIndustry,
	FaHandsHelping,
} from "react-icons/fa";


export default function Hero() {
	return (
		<section className="h-screen w-screen bg-linear-to-b/hsl from-orange-300 from-[25%] via-white via-50% to-green-400 to-75% flex items-center justify-center">
			<div className="max-w-screen-xl w-full mx-auto px-4 py-10 flex flex-col items-center text-center">
				<h4 className="text-3xl sm:text-4xl font-semibold text-white uppercase tracking-widest mb-3">
					VR KISAN PARIVAAR
				</h4>

				<h1 className="text-4xl md:text-5xl font-extrabold text-[#001f3f] leading-tight mb-4">
					Building Sustainable Futures for Rural India
				</h1>

				<p className="text-zinc-700 text-base md:text-lg max-w-2xl mb-8">
					Empowering villages through clean energy, sustainable farming,
					women-led initiatives, and rural employment. Together, we shape a
					self-reliant and green Bharat.
				</p>

				<div className="flex flex-col sm:flex-row gap-4 mb-10">
					<Link href="/join">
						<button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full font-semibold transition shadow">
							Become a Member
						</button>
					</Link>
					<Link href="/our-work">
						<button className="bg-[#138808] hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition shadow">
							Explore Our Work
						</button>
					</Link>
				</div>

				{/* Single-item, auto-advancing carousel with layered animated backgrounds */}
				<div className="w-full max-w-3xl">
					<SingleCarousel items={CAROUSEL_ITEMS} intervalMs={10000} />
				</div>
			</div>
		</section>
	);
}

type Item = {
	icon: React.ComponentType<{ className?: string }>;
	title: string;
	description: string;
};

function SingleCarousel({
	items,
	intervalMs = 5000,
}: {
	items: Item[];
	intervalMs?: number;
}) {
	const [index, setIndex] = useState(0);

	useEffect(() => {
		const id = setInterval(
			() => setIndex((i) => (i + 1) % items.length),
			intervalMs
		);
		return () => clearInterval(id);
	}, [items.length, intervalMs]);

	const current = useMemo(() => items[index], [items, index]);

	const variants = {
		initial: { opacity: 0, x: 12, y: 8, scale: 0.98 },
		animate: {
			opacity: 1,
			x: 0,
			y: 0,
			scale: 1,
			transition: { duration: 0.35, ease: easeInOut },
		},
		exit: {
			opacity: 0,
			x: -12,
			y: -8,
			scale: 0.98,
			transition: { duration: 0.25, ease: easeInOut },
		},
	};

	return (
		<div className="relative">
			{/* Layered animated backgrounds (subtle parallax) */}
			<div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-3xl">
				{/* Soft angled glow band (moves left) */}
				<div
					className="absolute -inset-x-1/2 top-0 h-[160%] rotate-6 opacity-30"
					style={{
						background:
							"linear-gradient(90deg, rgba(255,140,0,0) 0%, rgba(255,140,0,0.18) 40%, rgba(255,140,0,0) 80%)",
						animation: "panLeft 18s linear infinite",
					}}
				/>
				{/* Radial green pulses (moves right) */}
				<div
					className="absolute -inset-y-1/2 left-0 w-[180%] opacity-25"
					style={{
						background:
							"radial-gradient(40% 40% at 20% 50%, rgba(19,136,8,0.18), transparent), radial-gradient(35% 35% at 80% 50%, rgba(19,136,8,0.12), transparent)",
						animation: "panRight 22s linear infinite",
					}}
				/>
				{/* Fine white stripes (very subtle, moves left slower) */}
				<div
					className="absolute inset-0 opacity-[0.15]"
					style={{
						background:
							"repeating-linear-gradient(90deg, rgba(255,255,255,0.6) 0px, rgba(255,255,255,0.6) 1px, transparent 1px, transparent 12px)",
						animation: "panLeft 40s linear infinite",
					}}
				/>
			</div>

			<div className="rounded-3xl [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)]">
				<AnimatePresence mode="wait" initial={false}>
					{current && (
						<motion.div
							key={current.title}
							variants={variants}
							initial="initial"
							animate="animate"
							exit="exit">
							<div className="rounded-2xl border border-zinc-200 bg-white/90 p-6 shadow-sm backdrop-blur text-left">
								<div className="mb-3 flex items-center gap-3">
									<current.icon className="h-6 w-6 text-[#138808]" />
									<h3 className="text-lg font-semibold text-zinc-900">
										{current.title}
									</h3>
								</div>
								<p className="text-sm text-zinc-600">{current.description}</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

const CAROUSEL_ITEMS: Item[] = [
	{
		icon: FaWind,
		title: "Clean Energy Microgrids",
		description: "Solar + wind hybrids powering farms and small businesses.",
	},
	{
		icon: FaSeedling,
		title: "Sustainable Farming",
		description:
			"Soil health, drip irrigation, and regenerative practices for resilient yields.",
	},
	{
		icon: FaUsers,
		title: "Women-led SHGs",
		description:
			"Micro-entrepreneurship and self-help groups creating local opportunities.",
	},
	{
		icon: FaIndustry,
		title: "Rural Employment",
		description:
			"Skill hubs connecting youth to agri-tech and local industries.",
	},
	{
		icon: FaHandsHelping,
		title: "Community Health",
		description: "Sanitation, nutrition, and healthcare awareness initiatives.",
	},
];
