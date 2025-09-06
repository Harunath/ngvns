"use client";
import { useRouter } from "next/navigation";
// components/TandC.tsx
import React, { useState } from "react";
import toast from "react-hot-toast";

type Props = {
	onAccept?: (accepted: boolean) => void;
};

const termsContent = [
	"You agree to provide accurate and complete information during onboarding.",
	"Your data will be used for identity verification and service enhancement.",
	"You may not use our platform for any unlawful or harmful activity.",
	"You consent to receive communications regarding verification and services.",
	"We are not liable for third-party misuse or external data breaches.",
	"You can contact us anytime to request deletion of your data.",
	"Continued use implies acceptance of all policy changes.",
	"All disputes will be governed by applicable local laws.",
];

export default function TandC({ onAccept }: Props) {
	const [accepted, setAccepted] = useState(false);
	const [showTerms, setShowTerms] = useState(false);
	const router = useRouter();
	const handleAcceptChange = (checked: boolean) => {
		setAccepted(checked);
		onAccept?.(checked);
		router.push("/join/payment");
	};

	const handleContinue = () => {
		if (accepted) {
			toast.success("You accepted the Terms & Conditions");
			// navigation is handled by parent (OnboardingFlow)
		} else {
			toast.error("You must accept to continue");
		}
	};

	return (
		<div className="mx-auto max-w-lg">
			<div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
				<h2 className="text-lg font-semibold">Terms & Conditions</h2>
				<p className="mt-1 text-sm text-slate-700">
					Please review and accept our terms before continuing.
				</p>
				<div className="flex items-center justify-center px-4">
					<div className="w-full max-w-lg rounded-2xl bg-white ">
						<div className="border-b border-slate-200 px-6 py-4">
							<h3 className="text-lg font-semibold">Terms & Conditions</h3>
						</div>

						<div className="max-h-[70vh] overflow-y-auto px-6 py-4">
							<ol className="list-decimal space-y-3 pl-4 text-sm text-slate-700">
								{termsContent.map((item, i) => (
									<li key={i}>{item}</li>
								))}
							</ol>
						</div>
					</div>
				</div>
				<div className="mt-4 flex items-start gap-2">
					<input
						type="checkbox"
						id="agree"
						checked={accepted}
						onChange={(e) => handleAcceptChange(e.target.checked)}
						className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
					/>
					<label htmlFor="agree" className="text-sm text-slate-800">
						I agree to the{" "}
						<button
							type="button"
							onClick={() => setShowTerms(true)}
							className="text-blue-600 underline hover:text-blue-700">
							Terms and Conditions
						</button>
					</label>
				</div>

				<button
					type="button"
					onClick={handleContinue}
					disabled={!accepted}
					className={[
						"mt-6 inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 font-medium",
						accepted
							? "bg-emerald-600 text-white hover:bg-emerald-700"
							: "bg-emerald-600/50 text-white/80 cursor-not-allowed",
					].join(" ")}>
					Continue
				</button>
			</div>

			{/* Modal for Terms */}
			{showTerms && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
					<div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
						<div className="border-b border-slate-200 px-6 py-4">
							<h3 className="text-lg font-semibold">Terms & Conditions</h3>
						</div>

						<div className="max-h-[70vh] overflow-y-auto px-6 py-4">
							<ol className="list-decimal space-y-3 pl-4 text-sm text-slate-700">
								{termsContent.map((item, i) => (
									<li key={i}>{item}</li>
								))}
							</ol>
						</div>

						<div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
							<button
								type="button"
								onClick={() => setShowTerms(false)}
								className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
								Close
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
