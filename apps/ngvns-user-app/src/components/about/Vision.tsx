"use client";

import React from "react";
import { FaLeaf, FaHandshake, FaChartLine } from "react-icons/fa";

const Vision = () => {
	return (
		<section className="bg-slate-100 py-16 px-4 md:px-12 text-center">
			<p className="mx-auto  inline-block rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-xs font-semibold tracking-widest text-emerald-800">
				OUR VISION
			</p>

			<div className="max-w-4xl mt-8 mx-auto bg-green-100 rounded-2xl shadow-md p-6 md:p-10 text-lg text-slate-800 leading-relaxed border border-green-300">
				To create a sustainable agricultural ecosystem that empowers farmers and
				promotes eco-friendly practices for future generations.
			</div>

			<div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-10 max-w-4xl mx-auto text-center">
				<div>
					<FaLeaf className="text-green-600 text-4xl mx-auto mb-3" />
					<p className="text-slate-800 font-medium">
						Promote Natural & Smart Farming
					</p>
				</div>
				<div>
					<FaHandshake className="text-green-600 text-4xl mx-auto mb-3" />
					<p className="text-slate-800 font-medium">
						Connect Rural India to Corporate Sector
					</p>
				</div>
				<div>
					<FaChartLine className="text-green-600 text-4xl mx-auto mb-3" />
					<p className="text-slate-800 font-medium">
						Drive Profitability & Innovation
					</p>
				</div>
			</div>
		</section>
	);
};

export default Vision;
