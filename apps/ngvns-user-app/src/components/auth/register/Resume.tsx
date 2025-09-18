"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "../../../lib/store/useOnboardingStore";
import { useStepState } from "../../../lib/store/useStepState";

export default function ResumePage() {
	const router = useRouter();
	const setData = useOnboardingStore((s) => s.setData);
	const { setStep } = useStepState();

	const [mode, setMode] = useState<"phone" | "otp">("phone");
	const [phone, setPhone] = useState("");
	const [otp, setOtp] = useState("");
	const [sampleOtp, setSampleOtp] = useState(""); // for dev only
	const [loading, setLoading] = useState(false);
	const [msg, setMsg] = useState<string>("");

	const sendOtp = async () => {
		if (!phone.trim()) {
			setMsg("Please enter a phone number.");
			return;
		}
		setLoading(true);
		setMsg("");
		try {
			const res = await fetch("/api/auth/onboarding/resume", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone }),
			});
			const json = await res.json();
			if (!res.ok || json?.ok === false) {
				throw new Error(json?.error || "Failed to send OTP");
			}
			process.env.NEXT_PUBLIC_NODE_ENV === "development" &&
				setSampleOtp(json.otp);
			setMode("otp");
			setMsg("OTP sent. Please check your phone.");
		} catch (e: any) {
			setMsg(e.message || "Something went wrong.");
		} finally {
			setLoading(false);
		}
	};

	const verifyOtp = async () => {
		if (!otp.trim()) {
			setMsg("Please enter the OTP.");
			return;
		}
		setLoading(true);
		setMsg("");
		try {
			const res = await fetch("/api/auth/onboarding/resume/verify", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ phone, otp }),
			});
			if (!res.ok) {
				throw new Error("Invalid OTP");
			}
			const json = await res.json();
			const { user, currentStep } = json;
			setData(user);
			if (currentStep) {
				setStep(currentStep);
				console.log("Resuming at step:", currentStep);
			}

			// go to the right step page
			router.replace(`/register`);
		} catch (e: any) {
			setMsg(e.message || "Verification failed.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="mx-auto max-w-md p-6">
			<h1 className="text-2xl font-semibold mb-4">Resume Onboarding</h1>

			{mode === "phone" && (
				<div className="space-y-4">
					<label className="block">
						<span className="text-sm text-neutral-700">Phone number</span>
						<input
							type="tel"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
							placeholder="e.g. 9876543210"
							className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring"
							inputMode="tel"
						/>
					</label>
					<button
						onClick={sendOtp}
						disabled={loading}
						className="w-full rounded-xl border p-3 font-medium hover:bg-neutral-50 active:scale-[0.99] disabled:opacity-60">
						{loading ? "Sending…" : "Send OTP"}
					</button>
				</div>
			)}

			{mode === "otp" && (
				<div className="space-y-4">
					<label className="block">
						<span className="text-sm text-gray-600">Enter OTP</span>
						<input
							type="text"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							placeholder="6-digit code"
							className="mt-1 w-full rounded-xl border p-3 outline-none focus:ring tracking-widest"
							inputMode="numeric"
						/>
					</label>
					<button
						onClick={verifyOtp}
						disabled={loading}
						className="w-full rounded-xl border p-3 font-medium hover:bg-gray-50 active:scale-[0.99] disabled:opacity-60">
						{loading ? "Verifying…" : "Verify & Continue"}
					</button>
					<button
						onClick={sendOtp}
						disabled={loading}
						className="w-full rounded-xl p-3 text-sm text-gray-600 hover:underline disabled:opacity-60">
						Resend OTP
					</button>
				</div>
			)}
			{process.env.NEXT_PUBLIC_NODE_ENV === "development" && sampleOtp && (
				<p className="mt-2 text-sm text-gray-500">
					<em>Sample OTP (dev only): {sampleOtp}</em>
				</p>
			)}
			{!!msg && <p className="mt-4 text-sm text-gray-500">{msg}</p>}
		</div>
	);
}
