"use client";
import { motion } from "framer-motion";

export default function LayoutLoader() {
	return (
		<div className="flex min-h-[60vh] items-center justify-center">
			<div className="relative">
				{/* Orbiting dots */}
				<motion.div
					className="absolute inset-0"
					initial={{ rotate: 0 }}
					animate={{ rotate: 360 }}
					transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}>
					<div className="h-16 w-16 rounded-full border-2 border-transparent border-t-white/80" />
				</motion.div>

				{/* Pulsing core */}
				<motion.div
					className="h-12 w-12 rounded-2xl bg-white/90"
					initial={{ scale: 0.85, opacity: 0.8 }}
					animate={{ scale: [0.85, 1, 0.85], opacity: [0.8, 1, 0.8] }}
					transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
				/>
			</div>
		</div>
	);
}
