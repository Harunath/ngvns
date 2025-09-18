"use client";
// components/VerifyEmail.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useOnboardingStore } from "../../../lib/store/useOnboardingStore";

type Props = {
	onVerified?: () => void;
	goNext: () => void; // optional callback for parent flow
};

const RESEND_COOLDOWN = 30;
const OTP_LENGTH = 6;
const MOCK_OTP = "654321";

export default function VerifyEmail({ onVerified, goNext }: Props) {
	const { data } = useOnboardingStore();
	const email = data?.email || "";

	const [otpSent, setOtpSent] = useState(false);
	const [sending, setSending] = useState(false);

	const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));
	const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
	const [verifying, setVerifying] = useState(false);

	const [cooldown, setCooldown] = useState(0);

	// Mask email for display
	const maskedEmail = useMemo(() => {
		if (!email) return "";
		const [user, domain] = email.split("@");
		if (!domain) return email;
		const visible = user ? (user[0] ?? "") : "";
		return `${visible}${"*".repeat(Math.max(0, (user?.length ?? 0) - 1))}@${domain}`;
	}, [email]);

	useEffect(() => {
		if (cooldown <= 0) return;
		const id = setInterval(() => setCooldown((c) => c - 1), 1000);
		return () => clearInterval(id);
	}, [cooldown]);

	const sendOtp = async () => {
		if (!email) {
			toast.error("Email is missing in onboarding data");
			return;
		}
		try {
			setSending(true);
			// await new Promise((r) => setTimeout(r, 600)); // simulate
			const result = await fetch("/api/auth/onboarding/email-otp", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email }),
			});
			if (!result.ok) throw new Error("Failed to send OTP");
			const resData = await result.json();
			console.log("OTP send response:", resData);

			setOtpSent(true);
			setCooldown(RESEND_COOLDOWN);
			setDigits(Array(OTP_LENGTH).fill(""));
			requestAnimationFrame(() => inputsRef.current[0]?.focus());
			toast.success(`OTP sent to ${maskedEmail}`);
		} catch {
			toast.error("Failed to send OTP");
		} finally {
			setSending(false);
		}
	};

	const handleChange = (idx: number, val: string) => {
		const only = val.replace(/\D/g, "").slice(0, 1);
		setDigits((prev) => {
			const next = [...prev];
			next[idx] = only;
			return next;
		});
		if (only && idx < OTP_LENGTH - 1) {
			inputsRef.current[idx + 1]?.focus();
		}
	};

	const handleKeyDown = (
		idx: number,
		e: React.KeyboardEvent<HTMLInputElement>
	) => {
		if (e.key === "Backspace" && !digits[idx] && idx > 0) {
			inputsRef.current[idx - 1]?.focus();
		}
		if (e.key === "ArrowLeft" && idx > 0) {
			inputsRef.current[idx - 1]?.focus();
		}
		if (e.key === "ArrowRight" && idx < OTP_LENGTH - 1) {
			inputsRef.current[idx + 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
		const text = e.clipboardData.getData("text").replace(/\D/g, "");
		if (!text) return;
		e.preventDefault();
		const arr = Array(OTP_LENGTH)
			.fill("")
			.map((_, i) => text[i] ?? "");
		setDigits(arr);
		const lastIdx = Math.min(text.length, OTP_LENGTH) - 1;
		if (lastIdx >= 0) inputsRef.current[lastIdx]?.focus();
	};

	const verifyOtp = async () => {
		const code = digits.join("");
		if (code.length !== OTP_LENGTH) {
			toast.error("Please enter the complete OTP");
			return;
		}
		try {
			// await new Promise((r) => setTimeout(r, 600)); // simulate
			if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
				const result = await fetch("/api/auth/onboarding/email-otp/verify", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, code }),
				});
				if (!result.ok) throw new Error("Failed to verify OTP");
				const resData = await result.json();
				setVerifying(true);
				goNext();
			}
			if (code === MOCK_OTP) {
				toast.success("Email verified successfully!");
				onVerified?.();
				goNext();
			} else {
				toast.error("Invalid OTP");
			}
		} catch {
			toast.error("Verification failed");
		} finally {
			setVerifying(false);
		}
	};

	return (
		<div className="mx-auto max-w-md">
			<div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
				<div className="border-b border-slate-200 px-4 py-3 sm:px-6">
					<h3 className="text-lg font-semibold">Email Verification</h3>
					<p className="mt-1 text-sm text-slate-700">
						We’ve sent a 6-digit code to your email address.
					</p>
				</div>

				<div className="p-4 sm:p-6">
					<div className="mb-4">
						<label className="mb-1 block text-sm font-medium">Email</label>
						<input
							type="text"
							value={maskedEmail}
							readOnly
							className="w-full cursor-not-allowed rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-slate-900"
						/>
						{!email && (
							<p className="mt-1 text-sm font-medium text-rose-600">
								Email missing — go back and add it in the form.
							</p>
						)}
					</div>

					{!otpSent ? (
						<button
							onClick={sendOtp}
							disabled={!email || sending}
							className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700 disabled:opacity-60">
							{sending ? "Sending OTP…" : "Send OTP"}
						</button>
					) : (
						<>
							<div className="mt-2 flex items-center justify-between">
								<p className="text-sm text-slate-700">
									OTP sent.{" "}
									<span className="font-medium">Enter the code below.</span>
								</p>
								<button
									type="button"
									onClick={sendOtp}
									disabled={cooldown > 0 || sending}
									className="text-sm font-medium text-blue-700 disabled:text-slate-400">
									{cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
								</button>
							</div>

							<div className="mt-4 grid grid-cols-6 gap-2">
								{digits.map((d, i) => (
									<input
										key={i}
										type="text"
										inputMode="numeric"
										pattern="\d*"
										maxLength={1}
										value={d}
										onChange={(e) => handleChange(i, e.target.value)}
										onKeyDown={(e) => handleKeyDown(i, e)}
										onPaste={handlePaste}
										ref={(el) => {
											inputsRef.current[i] = el;
										}}
										className="h-12 w-full rounded-lg border border-slate-300 text-center text-lg tracking-widest outline-none focus:ring-2 focus:ring-blue-500"
									/>
								))}
							</div>

							<button
								onClick={verifyOtp}
								disabled={verifying}
								className="mt-5 inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
								{verifying ? "Verifying…" : "Submit OTP"}
							</button>

							<p className="mt-3 text-center text-xs text-slate-600">
								Demo code for testing:{" "}
								<span className="font-semibold">654321</span>
							</p>
						</>
					)}
				</div>
			</div>
		</div>
	);
}
