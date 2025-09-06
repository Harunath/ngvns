"use client";
// components/OnboardingFlow.tsx

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";

import UserForm from "./UserForm";
import VerifyPhone from "./VerifyPhone";
import VerifyEmail from "./VerifyEmail";
import TandC from "./TandC";

import { useOnboardingStore } from "../../../lib/store/useOnboardingStore";

const steps = ["form", "phone", "email", "tandc"] as const;
type Step = (typeof steps)[number];

const stepLabels: Record<Step, string> = {
	form: "Your Details",
	phone: "Verify Phone",
	email: "Verify Email",
	tandc: "Terms & Conditions",
};

const pageVariants = {
	initial: { opacity: 0, y: 24 },
	animate: { opacity: 1, y: 0 },
	exit: { opacity: 0, y: -16 },
};

export default function OnboardingFlow() {
	const { data } = useOnboardingStore();

	// local step state + persistence (you can also mirror this into Zustand if you prefer)
	const [step, setStep] = useState<Step>("form");

	// local, no-API gate flags for demo
	const [phoneVerified, setPhoneVerified] = useState(false);
	const [emailVerified, setEmailVerified] = useState(false);
	const [acceptedTnC, setAcceptedTnC] = useState(false);

	// Persist/restore step
	useEffect(() => {
		const saved = localStorage.getItem("onboarding-step") as Step | null;
		if (saved && steps.includes(saved)) setStep(saved);
	}, []);
	useEffect(() => {
		localStorage.setItem("onboarding-step", step);
	}, [step]);

	// Completion guards (no APIs)
	const canProceed = useMemo(() => {
		if (step === "form") return Boolean(data); // form saved to store
		if (step === "phone") return phoneVerified;
		if (step === "email") return emailVerified;
		if (step === "tandc") return acceptedTnC;
		return false;
	}, [step, data, phoneVerified, emailVerified, acceptedTnC]);

	const currentIndex = steps.indexOf(step);

	const goNext = () => {
		if (!canProceed) return;
		if (currentIndex < steps.length - 1) {
			const nextStep = steps[currentIndex + 1];
			if (nextStep !== undefined) {
				setStep(nextStep);
			}
		} else {
			toast.success("🎉 Onboarding completed successfully!");
			localStorage.removeItem("onboarding-step");
		}
	};

	const goPrev = () => {
		if (currentIndex > 0) {
			const prevStep = steps[currentIndex - 1];
			if (prevStep !== undefined) setStep(prevStep);
		}
	};

	const goTo = (target: Step) => {
		const targetIdx = steps.indexOf(target);
		// Only allow going to current or previous steps (no skipping ahead)
		if (targetIdx <= currentIndex) setStep(target);
	};

	const renderStepper = () => (
		<ol className="flex w-full max-w-3xl items-center gap-2">
			{steps.map((s, i) => {
				const isActive = s === step;
				const isDone = i < currentIndex;
				return (
					<li key={s} className="flex-1">
						<button
							type="button"
							onClick={() => goTo(s)}
							className={[
								"group flex w-full items-center gap-3 rounded-xl border px-3 py-2 transition",
								isActive
									? "border-blue-500 bg-blue-50"
									: isDone
										? "border-emerald-400 bg-emerald-50 hover:bg-emerald-100"
										: "border-slate-200 bg-white hover:bg-slate-50",
							].join(" ")}>
							<span
								className={[
									"flex h-7 w-7 items-center justify-center rounded-full border text-sm font-semibold",
									isActive
										? "border-blue-500 text-blue-700"
										: isDone
											? "border-emerald-500 text-emerald-700"
											: "border-slate-300 text-slate-600",
								].join(" ")}>
								{i + 1}
							</span>
							<span
								className={[
									"text-sm font-medium",
									isActive
										? "text-blue-800"
										: isDone
											? "text-emerald-800"
											: "text-slate-700",
								].join(" ")}>
								{stepLabels[s]}
							</span>
						</button>
					</li>
				);
			})}
		</ol>
	);

	return (
		<div className="min-h-screen w-full bg-white text-slate-900">
			{/* Header */}
			<header className="w-full border-b border-slate-200 bg-white">
				<div className="mx-auto flex max-w-5xl items-center justify-between p-4 sm:p-6">
					<div>
						<h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
							Welcome to Onboarding
						</h1>
						<p className="mt-0.5 text-sm text-slate-700">
							Complete each step to activate your membership.
						</p>
					</div>
					{/* Optional brand slot */}
					<div className="hidden sm:block text-sm font-medium text-slate-600">
						VR KISAN PARIVAAR
					</div>
				</div>
			</header>

			{/* Stepper */}
			<div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
				{renderStepper()}
			</div>

			{/* Main */}
			<main className="mx-auto w-full max-w-3xl p-4 sm:p-6">
				<div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
					<div className="border-b border-slate-200 px-4 py-3 sm:px-6">
						<h2 className="text-lg font-semibold">{stepLabels[step]}</h2>
					</div>

					<div className="p-4 sm:p-6">
						<AnimatePresence mode="wait">
							{step === "form" && (
								<motion.div
									key="form"
									variants={pageVariants}
									initial="initial"
									animate="animate"
									exit="exit"
									transition={{ duration: 0.3 }}
									className="space-y-6">
									<UserForm />
									{/* Next button enabled only if store has data */}
								</motion.div>
							)}

							{step === "phone" && (
								<motion.div
									key="phone"
									variants={pageVariants}
									initial="initial"
									animate="animate"
									exit="exit"
									transition={{ duration: 0.3 }}
									className="space-y-6">
									<VerifyPhone onVerified={() => setPhoneVerified(true)} />
								</motion.div>
							)}

							{step === "email" && (
								<motion.div
									key="email"
									variants={pageVariants}
									initial="initial"
									animate="animate"
									exit="exit"
									transition={{ duration: 0.3 }}
									className="space-y-6">
									<VerifyEmail onVerified={() => setEmailVerified(true)} />
								</motion.div>
							)}

							{step === "tandc" && (
								<motion.div
									key="tandc"
									variants={pageVariants}
									initial="initial"
									animate="animate"
									exit="exit"
									transition={{ duration: 0.3 }}>
									{/* T&C returns a boolean via prop; no API */}
									<TandC onAccept={(v: boolean) => setAcceptedTnC(v)} />
								</motion.div>
							)}
						</AnimatePresence>
					</div>

					{/* Footer controls */}
					<div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 sm:px-6">
						<button
							type="button"
							onClick={goPrev}
							disabled={currentIndex === 0}
							className="inline-flex items-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-800 hover:bg-slate-50 disabled:opacity-50">
							Back
						</button>

						<button
							type="button"
							onClick={goNext}
							disabled={!canProceed}
							className={[
								"inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium",
								canProceed
									? "bg-emerald-600 text-white hover:bg-emerald-700"
									: "bg-emerald-600/50 text-white/80 cursor-not-allowed",
							].join(" ")}>
							{step === "tandc" ? "Finish" : "Next"}
						</button>
					</div>
				</div>
			</main>
		</div>
	);
}
