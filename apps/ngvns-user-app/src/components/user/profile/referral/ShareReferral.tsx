// app/(dashboard)/referral/ShareReferral.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	FaFacebook,
	FaLinkedin,
	FaTelegram,
	FaTwitter,
	FaWhatsapp,
} from "react-icons/fa";

type Props = { referralUrl: string; code: string };

export default function ShareReferral({ referralUrl, code }: Props) {
	9;
	const [copied, setCopied] = useState(false);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(referralUrl);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {}
	};

	const webShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: "Join VR KISAN PARIVAAR",
					text: "Use my referral link to join!",
					url: referralUrl,
				});
			} catch {}
		} else {
			copy();
		}
	};

	// Prebuilt share links
	const encoded = encodeURIComponent(referralUrl);
	const textEncoded = encodeURIComponent("Join via my referral link:");
	const links = [
		{
			name: "WhatsApp",
			icon: <FaWhatsapp className="h-5 w-5 text-green-400" />,
			href: `https://wa.me/?text=${textEncoded}%20${encoded}`,
		},
		{
			name: "Telegram",
			icon: <FaTelegram className="h-5 w-5 text-blue-400" />,
			href: `https://t.me/share/url?url=${encoded}&text=${textEncoded}`,
		},
		{
			name: "Facebook",
			icon: <FaFacebook className="h-5 w-5 text-blue-600" />,
			href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
		},
		{
			name: "X (Twitter)",
			icon: <FaTwitter className="h-5 w-5 text-neutral-900" />,
			href: `https://twitter.com/intent/tweet?url=${encoded}&text=${textEncoded}`,
		},
		{
			name: "LinkedIn",
			icon: <FaLinkedin className="h-5 w-5 text-blue-400" />,
			href: `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`,
		},
	];

	return (
		<div className="max-w-xl rounded-2xl border border-gray-200 p-5 shadow-sm">
			<h2 className="text-xl font-semibold">Your Referral</h2>

			<div className="mt-3 grid gap-2">
				<div className="text-sm text-gray-600">Referral Code</div>
				<div className="rounded-lg border bg-gray-50 px-3 py-2 font-mono text-sm">
					{code}
				</div>

				<div className="text-sm text-gray-600 mt-3">Referral URL</div>
				<div className="flex items-center gap-2">
					<input
						readOnly
						value={referralUrl}
						className="w-full rounded-lg border px-3 py-2 font-mono text-xs focus:outline-none"
					/>
					<button
						onClick={copy}
						className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50">
						{copied ? "Copied" : "Copy"}
					</button>
					<button
						onClick={webShare}
						className="rounded-lg bg-black px-3 py-2 text-sm text-white hover:opacity-90"
						title="Share via native share">
						Share
					</button>
				</div>
			</div>

			<motion.div
				className="mt-5"
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ type: "spring", stiffness: 260, damping: 22 }}>
				<div className="text-sm text-gray-600 mb-2">Share on</div>
				<div className="flex flex-wrap gap-2">
					{links.map((l) => (
						<a
							key={l.name}
							href={l.href}
							target="_blank"
							rel="noreferrer"
							className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50">
							{l.icon}
							{/* {l.name} */}
						</a>
					))}
					<button
						onClick={webShare}
						className="rounded-xl border px-3 py-2 text-sm hover:bg-gray-50"
						title="Device Share Sheet">
						Device Share
					</button>
				</div>
			</motion.div>
		</div>
	);
}
