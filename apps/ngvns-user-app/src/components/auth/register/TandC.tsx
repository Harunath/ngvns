"use client";
import { useRouter } from "next/navigation";
// components/TandC.tsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

type Props = {
	onAccept?: (accepted: boolean) => void;
	onBoardingPhone: string;
};

export default function TandC({ onAccept, onBoardingPhone }: Props) {
	const [accepted, setAccepted] = useState(false);
	const [showTerms, setShowTerms] = useState(false);
	const [terms, setTerms] = useState({
		id: "",
		version: "",
		content: "",
		active: false,
		createdAt: "",
		updatedAt: "",
	});
	const [Loading, setLoading] = useState(false);
	const router = useRouter();
	const handleAcceptChange = (checked: boolean) => {
		setAccepted(checked);
		onAccept?.(checked);
	};

	const handleContinue = async () => {
		try {
			if (accepted) {
				const res = await fetch("/api/auth/onboarding/tc", {
					method: "POST",
					body: JSON.stringify({
						phone: onBoardingPhone,
						accepted: true,
						tcId: terms.id,
					}),
				});
				if (!res.ok) {
					toast.error("Failed to record acceptance");
					return;
				}
				if (res) {
					toast.success("You accepted the Terms & Conditions");
					toast.success("Proceeding to payment");
					router.push("/join/payment");
				} else {
					toast.error("Failed to record acceptance");
				}
			} else {
				toast.error("You must accept to continue");
			}
		} catch (error) {
			toast.error("Error accepting Terms & Conditions");
		}
	};
	const getTc = async () => {
		try {
			setLoading(true);
			const res = await fetch("/api/t-and-c");
			if (res.ok) {
				const data = await res.json();
				setTerms(data.tc);
			} else {
				console.error("Failed to fetch Terms & Conditions");
			}
		} catch (error) {
			console.error("Error fetching Terms & Conditions:", error);
		} finally {
			setLoading(false);
		}
	};
	useEffect(() => {
		getTc();
	}, []);

	return (
		<div className="mx-auto max-w-lg">
			<div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
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
			{!Loading ? (
				showTerms && (
					<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
						<div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl">
							<div className="border-b border-slate-200 px-6 py-4">
								<h3 className="text-lg font-semibold">
									Terms & Conditions{" "}
									<span>
										{terms.version
											? "version : " + terms.version
											: "loading..."}
									</span>
								</h3>
							</div>

							<div className="max-h-[70vh] overflow-y-auto px-6 py-4">
								{/* <ol className="list-decimal space-y-3 pl-4 text-sm text-slate-700">
								{termsContent.map((item, i) => (
									<li key={i}>{item}</li>
								))}
							</ol> */}
								<div className="list-decimal space-y-3 pl-4 text-sm text-slate-700">
									{terms.content.length > 0 ? (
										terms.content.split("\n").map((line, index) => (
											<p key={index} className="mb-2">
												{line}
											</p>
										))
									) : (
										<p className=" text-sm text-red-600">
											something went wrong...!
										</p>
									)}
								</div>
								<div>
									<p className="mt-4 text-xs text-slate-400">
										Updated at: {terms.updatedAt}
									</p>
								</div>
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
				)
			) : (
				<p>Loading...</p>
			)}
		</div>
	);
}
