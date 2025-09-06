"use client";
// components/OnboardingFlow.tsx
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import UserForm from "./UserForm";
import VerifyPhone from "./VerifyPhone";
import VerifyEmail from "./VerifyEmail";
import TandC from "./TandC";
import { useOnboardingStore } from "../../../lib/store/useOnboardingStore";
import toast from "react-hot-toast";

const steps = ["form", "phone", "email", "tandc"] as const;
type Step = (typeof steps)[number];

const OnboardingFlow = () => {
	const [step, setStep] = useState<Step>("form");
	const { data } = useOnboardingStore();

	useEffect(() => {
		const savedStep = localStorage.getItem("onboarding-step") as Step;
		if (savedStep && steps.includes(savedStep)) {
			setStep(savedStep);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("onboarding-step", step);
	}, [step]);

	const handleNext = () => {
		const currentIndex = steps.indexOf(step);
		if (currentIndex < steps.length - 1) {
			setStep(steps[currentIndex + 1] as Step);
		} else {
			toast.success("🎉 Onboarding completed successfully!");
			localStorage.removeItem("onboarding-step");
		}
	};

	const pageVariants = {
		initial: { opacity: 0, y: 30 },
		animate: { opacity: 1, y: 0 },
		exit: { opacity: 0, y: -20 },
	};

	return (
		<div className="min-h-screen flex flex-col bg-slate-100 relative">
			<header className="w-full py-6 text-center bg-white shadow-sm sticky top-0 z-10">
				<h1 className="text-3xl font-semibold text-slate-800">
					Welcome to Onboarding
				</h1>
			</header>

			<main className="flex-1 flex items-center justify-center p-4">
				<div className="w-full max-w-3xl">
					<AnimatePresence mode="wait">
						{step === "form" && (
							<motion.div
								key="form"
								variants={pageVariants}
								initial="initial"
								animate="animate"
								exit="exit"
								transition={{ duration: 0.4 }}
								className="space-y-6">
								<UserForm />
								{data && (
									<div className="text-center">
										<button
											onClick={handleNext}
											className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
											Next: Verify Phone
										</button>
									</div>
								)}
							</motion.div>
						)}

						{step === "phone" && (
							<motion.div
								key="phone"
								variants={pageVariants}
								initial="initial"
								animate="animate"
								exit="exit"
								transition={{ duration: 0.4 }}
								className="space-y-6">
								<VerifyPhone />
								<div className="text-center">
									<button
										onClick={handleNext}
										className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
										Next: Verify Email
									</button>
								</div>
							</motion.div>
						)}

						{step === "email" && (
							<motion.div
								key="email"
								variants={pageVariants}
								initial="initial"
								animate="animate"
								exit="exit"
								transition={{ duration: 0.4 }}
								className="space-y-6">
								<VerifyEmail />
								<div className="text-center">
									<button
										onClick={handleNext}
										className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
										Next: Terms & Conditions
									</button>
								</div>
							</motion.div>
						)}

						{step === "tandc" && (
							<motion.div
								key="tandc"
								variants={pageVariants}
								initial="initial"
								animate="animate"
								exit="exit"
								transition={{ duration: 0.4 }}>
								<TandC />
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</main>
		</div>
	);
};

export default OnboardingFlow;
