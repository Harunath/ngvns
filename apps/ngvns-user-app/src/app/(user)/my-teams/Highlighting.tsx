"use client";
import React from "react";
import { motion } from "framer-motion";

export default function Highlighting() {
	return (
		<motion.p
			className="mt-2 text-sm font-medium"
			initial={{ color: "#FF9933" }} // saffron
			animate={{ color: ["#FF9933", "#0b5ba7", "#138808"] }} // saffron -> chakra -> green
			transition={{ duration: 2.4, repeat: Infinity }}>
			Invite 5 people to start earning ₹ 600 per referral. Till then your
			earnings are only ₹ 300 per referral
		</motion.p>
	);
}
