"use client";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
	{
		question: "What programs support rural sustainability?",
		answer:
			"We focus on clean energy, sustainable farming, skill training, women empowerment, and local entrepreneurship to build self-reliant villages.",
	},
	{
		question: "How can I contribute or volunteer?",
		answer:
			"You can join as a volunteer, donate resources, or partner with us through CSR initiatives to create real rural impact.",
	},
	{
		question: "Are your initiatives eco-friendly?",
		answer:
			"Yes, every project is designed with environmental sustainability in mind — from green energy to zero-waste agri practices.",
	},
];

export default function RuralImpactFaq() {
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	return (
		<section className="bg-white text-slate-900 px-6 py-16">
			<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
				{/* Left Block - Image + Heading + Content + CTA */}
				<motion.div
					initial={{ opacity: 0, x: -40 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5 }}
					viewport={{ once: true }}
					className="flex flex-col justify-center space-y-6">
					<div className="w-full max-h-[400px] overflow-hidden rounded-xl">
						<Image
							src="https://res.cloudinary.com/dip2khkyo/image/upload/v1739210128/contact-us-img_xfcru4.webp"
							alt="Rural India Initiative"
							width={600}
							height={400}
							className="w-full h-full object-cover rounded-xl"
						/>
					</div>

					<h3 className="text-2xl md:text-3xl font-bold leading-tight">
						Still Have Questions?{" "}
					</h3>

					<p className="text-slate-600 text-base">
						We&apos;re here to support you with sustainable development,
						innovative rural solutions, and community-driven initiatives -
						empowering villages to thrive.
					</p>
					<a
						href="tel:+919515934289"
						className="inline-block w-fit px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600 transition">
						Call Support
					</a>
				</motion.div>

				{/* Right Block - FAQ */}
				<motion.div
					initial="hidden"
					whileInView="visible"
					viewport={{ once: true }}
					variants={{
						hidden: { opacity: 0, y: 20 },
						visible: {
							opacity: 1,
							y: 0,
							transition: { staggerChildren: 0.15 },
						},
					}}>
					<h2 className="text-4xl font-bold leading-tight mb-4">
						FAQs on Rural Development
					</h2>
					<p className="text-slate-600 mb-6">
						Have questions about our work in rural India? Explore some of our
						most common queries below.
					</p>

					<div className="space-y-4">
						{faqs.map((faq, i) => (
							<motion.div
								key={i}
								variants={{
									hidden: { opacity: 0, y: 10 },
									visible: { opacity: 1, y: 0 },
								}}>
								<div
									onClick={() => setActiveIndex(activeIndex === i ? null : i)}
									className={`p-5 rounded-xl cursor-pointer transition flex flex-col gap-2 ${
										activeIndex === i
											? "bg-green-600 text-white"
											: "bg-slate-100 text-slate-700 hover:bg-slate-200"
									}`}>
									<div className="flex items-center justify-between">
										<h4 className="font-semibold text-lg">{faq.question}</h4>
										<motion.span
											animate={{ rotate: activeIndex === i ? 90 : 0 }}
											transition={{ duration: 0.3 }}
											className="text-2xl">
											➤
										</motion.span>
									</div>

									<AnimatePresence>
										{activeIndex === i && (
											<motion.p
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												transition={{ duration: 0.3 }}
												className="text-sm text-white">
												{faq.answer}
											</motion.p>
										)}
									</AnimatePresence>
								</div>
							</motion.div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	);
}
