"use client";
import React from "react";
import { motion } from "framer-motion"; // <-- use framer-motion

function Highlighting() {
	return (
		<motion.p
			className="mt-2 text-sm"
			initial={{ color: "blue" }}
			animate={{ color: ["green", "red", "blue"] }}
			transition={{
				duration: 3,
				repeatType: "reverse",
				repeat: Infinity,
			}}>
			Invite 5 people to start earning ₹ 600 per referral. Till then your
			earnings are only ₹ 300 per referral
		</motion.p>
	);
}

export default Highlighting;
