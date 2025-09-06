"use client";

import React from "react";
import { FaLeaf, FaHandshake, FaChartLine } from "react-icons/fa";

const Vision = () => {
	return (
		<section className="bg-slate-100 py-16 px-4 md:px-12 text-center">
			<h2 className="text-3xl md:text-4xl font-bold text-black mb-8">
				Our <span className="text-orange-600">Vision</span>
			</h2>

			<div className="max-w-4xl mx-auto bg-green-100 rounded-2xl shadow-md p-6 md:p-10 text-lg text-slate-800 leading-relaxed border border-green-300">
				To create villages that are independent, sustainable, and full of
				opportunities for all.
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
