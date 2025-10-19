"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaLeaf } from "react-icons/fa";

const GetVrKpCard = () => {
	const [loading, setLoading] = useState(false);
	const [card, setCard] = useState<string | null>(null);
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
		router.push("/my-docs");
	};
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
									VRKP Card
								</h2>
							</div>

							{/* Placeholder preview area */}
							<div className="mt-4 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/60 p-4">
								<div
									className={
										`flex items-center gap-y-2 justify-between` +
										(card ? " flex-col" : "")
									}>
									{card ? (
										<Image
											src={card}
											alt="VRKP Card"
											width={600}
											height={400}
											className="border"
										/>
									) : (
										<p>Your VRKP Card has not been issued yet.</p>
									)}
									{card ? (
										<a
											href={card}
											download="VRKP-Card" // This attribute triggers the download
											target="_blank" // Optional: Opens the link in a new tab first (good practice for files)
											rel="noopener noreferrer" // Security best practice for target="_blank"
											className="rounded-lg bg-gradient-to-r from-[#FF9933] via-[#0b5ba7] to-[#138808] px-3 py-1.5 text-xs font-semibold text-white shadow-sm"
											aria-disabled
											title="Coming Soon">
											Download
										</a>
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
