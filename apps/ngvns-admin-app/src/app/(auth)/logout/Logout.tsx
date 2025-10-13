"use client";
import { signOut } from "next-auth/react";
import React from "react";
import { motion } from "motion/react";

export default function Logout() {
	signOut({ callbackUrl: "/login" });
	return (
		<div>
			<p className=" text-2xl font-bold text-center">
				signing out
				<motion.span
					initial={{ opacity: 0 }}
					animate={{ opacity: [0, 1, 1, 1] }}
					transition={{
						duration: 1,
						repeat: Infinity,
						repeatType: "mirror",
						ease: "easeInOut",
					}}>
					.
				</motion.span>
				<motion.span
					initial={{ opacity: 0 }}
					animate={{ opacity: [0, 0, 1, 1] }}
					transition={{
						duration: 1,
						repeat: Infinity,
						repeatType: "mirror",
						ease: "easeInOut",
					}}>
					.
				</motion.span>
				<motion.span
					initial={{ opacity: 0 }}
					animate={{ opacity: [0, 0, 0, 1] }}
					transition={{
						duration: 1,
						repeat: Infinity,
						repeatType: "mirror",
						ease: "easeInOut",
					}}>
					.
				</motion.span>
			</p>
		</div>
	);
}
