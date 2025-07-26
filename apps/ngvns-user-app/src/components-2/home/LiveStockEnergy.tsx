"use client";

import Image from "next/image";
import Link from "next/link";
import { FaLeaf, FaRecycle } from "react-icons/fa";

export default function LiveStockEnergy() {
	return (
		<section className="bg-white text-black py-20 px-4 sm:px-8 lg:px-12 xl:px-24">
			<div className="max-w-screen-xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
				{/* Left Content */}
				<div>
					<h2 className="text-3xl md:text-4xl font-bold leading-tight mb-6">
						Livestock-Based Energy for Rural Sustainability
					</h2>

					<p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
						We&apos;re turning livestock movement and waste into clean energy
						for rural homes, farms, and tools.
					</p>

					<p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
						Through biogas units and rotary systems powered by cows and
						buffaloes, rural communities are generating electricity, cooking
						fuel, and reducing dependence on fossil fuels. This also improves
						sanitation and creates sustainable income opportunities.
					</p>

					<div className="grid sm:grid-cols-2 gap-6 mb-10">
						{/* Feature 1 */}
						<div className="flex items-start gap-4">
							<div className="text-[#FF9933] text-2xl mt-1">
								<FaRecycle />
							</div>
							<div>
								<h4 className="font-semibold text-black mb-1 text-base">
									Circular Resource Use
								</h4>
								<p className="text-sm text-gray-600 leading-relaxed">
									Biogas from livestock waste powers homes and small businesses.
								</p>
							</div>
						</div>

						{/* Feature 2 */}
						<div className="flex items-start gap-4">
							<div className="text-green-600 text-2xl mt-1">
								<FaLeaf />
							</div>
							<div>
								<h4 className="font-semibold text-black mb-1 text-base">
									Eco-Rotary Power
								</h4>
								<p className="text-sm text-gray-600 leading-relaxed">
									Cow-driven devices convert motion into usable mechanical
									energy.
								</p>
							</div>
						</div>
					</div>

					<div className="bg-[#f9f9f9] rounded-xl p-5 text-sm md:text-base text-gray-800 shadow-sm border border-gray-200">
						<strong className="text-black">Trusted Innovation:</strong> Our
						energy model is community-led, low-cost, and built for rural India.
					</div>

					<Link
						href="/our-work/livestock"
						className="inline-block mt-6 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 shadow-md">
						Read More →
					</Link>
				</div>

				{/* Right Image */}
				<div className="w-full rounded-xl overflow-hidden shadow-lg">
					<Image
						src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478845/livestock_management_header_xgifse.jpg"
						alt="Cow-powered energy systems"
						width={700}
						height={450}
						className="w-full h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[100%] object-cover object-center"
					/>
				</div>
			</div>
		</section>
	);
}
