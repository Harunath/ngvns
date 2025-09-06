"use client";
import {
	FaUsers,
	FaLeaf,
	FaStar,
	FaHandsHelping,
	FaHeart,
	FaUserCheck,
	FaUserFriends,
	FaSeedling,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Link from "next/link";

export default function BecomeMember() {
	return (
		<section className="bg-emerald-50 py-20 px-6 md:px-12 lg:px-28 text-slate-800">
			<div className="max-w-6xl mx-auto text-center">
				<motion.h2
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-5xl md:text-6xl font-extrabold text-black mb-6">
					BECOME A MEMBER
				</motion.h2>

				<motion.p
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="text-lg md:text-xl font-medium text-slate-700 mb-12 leading-relaxed">
					<span className="block font-semibold text-2xl text-green-900 mb-2">
						Join the Movement. Grow with Us.
					</span>
					Support a mission rooted in nature, led by people, and focused on the
					future.
				</motion.p>

				<div className="grid md:grid-cols-2 gap-12 mb-16 text-left">
					{/* Why Join */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="bg-white border-l-4 shadow-2xl border-orange-500 p-8 rounded-lg">
						<h3 className="text-2xl font-bold text-black mb-6">Why Join?</h3>
						<div className="space-y-5">
							<FeatureItem
								icon={<FaUsers className="text-emerald-600 text-xl" />}
								text="Be part of an impactful grassroots movement."
							/>
							<FeatureItem
								icon={<FaStar className="text-emerald-600 text-xl" />}
								text="Receive updates, training invites, and event access."
							/>
							<FeatureItem
								icon={<FaHandsHelping className="text-emerald-600 text-xl" />}
								text="Contribute your time, skills, or knowledge."
							/>
							<FeatureItem
								icon={<FaLeaf className="text-emerald-600 text-xl" />}
								text="Help build self-sustaining, green villages."
							/>
						</div>
					</motion.div>

					{/* Who Can Join */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="bg-emerald-100 p-8 rounded-lg border border-emerald-200 shadow-2xl">
						<h3 className="text-2xl font-bold text-black mb-6">
							Who Can Join?
						</h3>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<MemberTag icon={<FaUserCheck />} label="Farmers" />
							<MemberTag icon={<FaHeart />} label="Women’s Groups" />
							<MemberTag icon={<FaStar />} label="Rural Youth" />
							<MemberTag icon={<FaUserFriends />} label="Local Entrepreneurs" />
							<MemberTag icon={<FaSeedling />} label="Rural Dev Supporters" />
						</div>
					</motion.div>
				</div>

				<Link
					href="/join"
					className="inline-block px-10 py-4 bg-orange-500 text-white text-lg font-semibold rounded-md shadow-md hover:bg-orange-600 transition duration-300">
					Join Now
				</Link>
			</div>
		</section>
	);
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
	return (
		<motion.div
			whileHover={{ scale: 1.02 }}
			className="flex items-start space-x-4 transition">
			<div className="p-3 bg-emerald-100 rounded-full shadow-sm text-xl">
				{icon}
			</div>
			<p className="text-slate-800 text-base md:text-lg leading-relaxed">
				{text}
			</p>
		</motion.div>
	);
}

function MemberTag({ icon, label }: { icon: React.ReactNode; label: string }) {
	return (
		<motion.div
			whileHover={{ scale: 1.04 }}
			className="flex items-center space-x-3 px-4 py-3 bg-white rounded-lg shadow-sm border border-emerald-200 hover:shadow-md transition">
			<span className="text-orange-500 text-xl">{icon}</span>
			<span className="text-black font-medium text-base">{label}</span>
		</motion.div>
	);
}
