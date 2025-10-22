"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaLeaf } from "react-icons/fa";
import { AnimatePresence, motion } from "motion/react";

const GetVrKpCard = ({ vrkpcard }: { vrkpcard: string | null }) => {
	const [loading, setLoading] = useState(false);
	const [card, setCard] = useState<string | null>(vrkpcard);
	const [view, setView] = useState(false);
	const router = useRouter();
	const getCard = async () => {
		setLoading(true);
		const res = await fetch(`/api/uploads/vrkp-card/cloudflare`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
		});
		if (!res.ok) {
			setLoading(false);
			toast.error("Failed to issue VRKP Card.");
			throw new Error(await res.text());
		}
		const data = await res.json();
		setLoading(false);
		setCard(data.cardUrl);
		toast.success("VRKP Card issued successfully!");
	};
	async function handleDownload() {
		if (!card) return;
		const res = await fetch(card);
		const blob = await res.blob();
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = "VRKP-Card.webp";
		a.click();
		URL.revokeObjectURL(url);
	}

	return (
		<>
			<article
				key={card}
				className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
				{/* Flag rail */}
				<div className="absolute inset-y-0 left-0 w-2">
					<div className="h-1/3 bg-[#FF9933]" />
					<div className="h-1/3 bg-white" />
					<div className="h-1/3 bg-[#138808]" />
				</div>

				{/* Faint Ashoka Chakra watermark */}

				<div className="pl-4 md:pl-5">
					<div className="flex items-start gap-4 p-6">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f0faf9] ring-1 ring-[#045e5a]/20">
							<FaLeaf className="text-[#045e5a] text-3xl" />
						</div>
						<div className="flex-1">
							<div className="flex flex-wrap items-center gap-3">
								<h2 className="text-lg font-semibold text-gray-900">
									VRKP Identity Card
								</h2>
							</div>

							{/* Placeholder preview area */}
							<div className="mt-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-4">
								<div
									className={
										`flex items-center gap-y-2 justify-between` +
										(card ? " flex-col" : "")
									}>
									<AnimatePresence initial={false} mode="wait">
										{card &&
											(view ? (
												<motion.div
													initial={{ opacity: 0, scale: 0.8 }}
													animate={{ opacity: 1, scale: 1 }}
													transition={{ duration: 0.3 }}
													exit={{ opacity: 0, scale: 0.8 }}>
													<Image
														src={card}
														alt="VRKP Card"
														width={600}
														height={400}
														className="border"
													/>
												</motion.div>
											) : (
												<>
													<p className="text-sm text-gray-500">
														View your Card by clicking on view{" "}
													</p>
												</>
											))}
									</AnimatePresence>
									{!card && (
										<p className="text-sm text-gray-500">
											Get your VRKP Identity Card here.
										</p>
									)}
									{card ? (
										<div className="flex gap-4 mt-4">
											<button
												onClick={() => setView((prev) => !prev)}
												className="rounded-lg bg-gradient-to-r from-[#FF9933] via-[#0b5ba7] to-[#138808] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
												{view ? "Hide Card" : "View Card"}
											</button>
											<button
												onClick={handleDownload}
												className="rounded-lg bg-gradient-to-r from-[#FF9933] via-[#0b5ba7] to-[#138808] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
												Download
											</button>
										</div>
									) : (
										<button
											onClick={getCard}
											className="rounded-lg bg-gradient-to-r from-[#FF9933] via-[#0b5ba7] to-[#138808] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
											{loading ? "Issuing VRKP Card..." : "Get VRKP Card"}
										</button>
									)}
								</div>
							</div>
						</div>
					</div>

					{/* Flag underline accent */}
					<div className="grid grid-cols-3">
						<div className="h-1 bg-[#FF9933]" />
						<div className="h-1 bg-[#0b5ba7]" />
						<div className="h-1 bg-[#138808]" />
					</div>
				</div>
			</article>
		</>
	);
};

export default GetVrKpCard;
