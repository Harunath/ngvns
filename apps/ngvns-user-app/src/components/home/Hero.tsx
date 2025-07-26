"use client";

import Link from "next/link";

export default function Hero() {
	return (
		<section className="h-screen w-screen bg-linear-to-b/hsl from-orange-300 from-[25%] via-white via-50% to-green-400 to-75% flex items-center justify-center">
			<div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center">
				<h4 className="text-sm font-semibold text-white uppercase tracking-widest mb-3">
					NAVA GRAMEEN VIKAS NIRMAN SOCIETY
				</h4>

				<h1 className="text-4xl md:text-5xl font-bold text-[#001f3f] leading-tight mb-6">
					Building Sustainable Futures for Rural India
				</h1>

				<p className="text-gray-600 text-md md:text-lg max-w-2xl mx-auto mb-10">
					Empowering villages through clean energy, sustainable farming,
					women-led initiatives, and rural employment. Together, we shape a
					self-reliant and green Bharat.
				</p>

				<div className="flex flex-col sm:flex-row gap-4">
					<Link href="/join">
						<button className="bg-orange-600 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow">
							Become a Member
						</button>
					</Link>
					<Link href="/our-work">
						<button className="bg-[#138808] hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow">
							Explore Our Work
						</button>
					</Link>
				</div>
			</div>
		</section>
	);
}
