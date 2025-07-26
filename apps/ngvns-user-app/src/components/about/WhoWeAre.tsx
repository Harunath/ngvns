"use client";
import React from "react";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

const WhoWeAre = () => {
	const points = [
		"Driven by the vision of self-reliant, thriving villages.",
		"Inspired by the wisdom of nature and simplicity.",
		"Empowered by the strength of local communities.",
		"Led by farmers, youth, field workers, and changemakers.",
		"Focused on practical, scalable rural transformation.",
	];

	return (
		<section className="bg-white py-20 px-6 md:px-12 lg:px-24 ">
			<div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
				{/* Text Section */}
				<div>
					<h2 className="text-4xl font-bold text-[#1a1a1a] mb-6 leading-tight">
						Who <span className="text-orange-600">We Are</span>
					</h2>

					<p className="text-gray-800 text-lg mb-6">
						<span className="font-semibold text-[#1a1a1a]">
							Nava Grameen Vikas Nirman Society
						</span>{" "}
						is a grassroots organization committed to empowering rural India
						through self-sustaining development models.
					</p>

					<ul className="space-y-4 mt-4">
						{points.map((point, idx) => (
							<li key={idx} className="flex items-start ">
								<span className="bg-slate-100 ">
									<FaCheckCircle className="text-orange-600 mt-1 mr-3" />
								</span>
								<span>{point}</span>
							</li>
						))}
					</ul>
				</div>

				{/* Image */}
				<div className="relative w-full h-72 md:h-[420px] rounded-xl overflow-hidden shadow-md ">
					<Image
						src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478381/2183826_gyjzkz.jpg"
						alt="Community-driven rural development"
						fill
						className="object-cover"
						priority
					/>
				</div>
			</div>
		</section>
	);
};

export default WhoWeAre;
