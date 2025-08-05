"use client";

import Image from "next/image";
import Link from "next/link";

export default function Page() {
	return (
		<main className="min-h-screen bg-white text-gray-800 px-4 py-12 md:px-12">
			<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
				{/* Left Content */}
				<div>
					<h1 className="text-4xl font-bold text-black mb-4 leading-tight">
						Building Stronger Villages, Together
					</h1>
					<h2 className="text-2xl font-semibold text-orange-600 mb-4">
						Self-Sustainable Villages
					</h2>
					<p className="text-lg mb-6 text-gray-700 leading-relaxed">
						We believe that real development begins when villages take charge of
						their own growth. Through empowerment, innovation, and sustainable
						practices, we&apos;re transforming rural communities into thriving,
						self-reliant ecosystems.
					</p>

					<ul className="list-disc list-inside space-y-2 text-gray-700 font-medium">
						<li>
							<strong>Community Planning & Leadership:</strong> Training
							villagers to identify, manage, and execute local development.
						</li>
						<li>
							<strong>Water Conservation:</strong> Promoting rainwater
							harvesting, check dams, and smart irrigation techniques.
						</li>
						<li>
							<strong>Local Food Systems & Enterprises:</strong> Supporting
							kitchen gardens, organic farming, and micro-enterprises that
							generate employment and income.
						</li>
					</ul>

					<Link
						href="/contact"
						className="inline-block mt-8 bg-orange-500 text-white px-6 py-3 rounded-md font-semibold hover:bg-orange-600 transition">
						Get Involved
					</Link>
				</div>

				{/* Right Image */}
				<div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
					<Image
						src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1751479028/wp2445613_xbirq9.jpg"
						alt="Self Sustainable Village"
						fill
						className="object-cover"
					/>
				</div>
			</div>
		</main>
	);
}
