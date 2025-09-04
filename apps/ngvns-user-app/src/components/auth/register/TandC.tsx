"use client";
import { useRouter } from "next/navigation";
// components/TandC.tsx
import React, { useState } from "react";
import toast from "react-hot-toast";

const termsContent = [
	"1. You agree to provide accurate and complete information during onboarding.",
	"2. Your data will be used for identity verification and service enhancement.",
	"3. You may not use our platform for any unlawful or harmful activity.",
	"4. You consent to receive communications regarding verification and services.",
	"5. We are not liable for third-party misuse or external data breaches.",
	"6. You can contact us anytime to request deletion of your data.",
	"7. Continued use implies acceptance of all policy changes.",
	"8. All disputes will be governed by applicable local laws.",
];

const TandC = () => {
	const [accepted, setAccepted] = useState(false);
	const [showTerms, setShowTerms] = useState(false);

	const router = useRouter();

	const handleContinue = () => {
		router.push("/join/payment");
		if (accepted) toast.success("You accepted the Terms & Conditions");
	};

	return (
		<div className="max-w-xl mx-auto p-4">
			<div className="flex items-center gap-2 mb-4">
				<input
					type="checkbox"
					id="agree"
					checked={accepted}
					onChange={(e) => setAccepted(e.target.checked)}
					className="w-4 h-4"
				/>
				<label htmlFor="agree" className="text-sm">
					I agree to the{" "}
					<button
						type="button"
						className="text-blue-600 underline"
						onClick={() => setShowTerms(true)}>
						Terms and Conditions
					</button>
				</label>
			</div>

			<button
				className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
				disabled={!accepted}
				onClick={handleContinue}>
				Continue
			</button>

			{showTerms && (
				<div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
					<div className="bg-white w-full max-w-md h-[80vh] rounded shadow-lg p-6 relative overflow-y-auto">
						<h2 className="text-lg font-semibold mb-4">Terms & Conditions</h2>
						<ul className="list-disc list-inside space-y-2 text-sm">
							{termsContent.map((item, index) => (
								<li key={index}>{item}</li>
							))}
						</ul>
						<button
							className="absolute bottom-4 right-4 bg-red-600 text-white px-4 py-2 rounded"
							onClick={() => setShowTerms(false)}>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default TandC;
