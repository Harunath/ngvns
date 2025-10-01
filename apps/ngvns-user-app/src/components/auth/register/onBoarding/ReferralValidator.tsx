"use client";

import { motion } from "motion/react";
import StepHeader from "./StepHeader";
import React from "react";
import { toast } from "react-toastify";
import {
	FieldError,
	UseFormRegister,
	UseFormSetError,
	UseFormSetValue,
} from "react-hook-form";
import { validateReferralLocally } from "../../../../utils/referral";
import type { OnboardingFormData } from "../../../../lib/validators/onboarding";

export default function ReferralValidator({
	referralId,
	register,
	setValue,
	setError,
	error,
	referralValid,
	setReferralValid,
	checkedOnce,
	setCheckedOnce,
	refLoading,
	verifyReferral,
}: {
	referralId: string;
	register: UseFormRegister<OnboardingFormData>;
	setValue: UseFormSetValue<OnboardingFormData>;
	setError: UseFormSetError<OnboardingFormData>;
	error?: FieldError;
	referralValid: boolean;
	setReferralValid: (v: boolean) => void;
	checkedOnce: boolean;
	setCheckedOnce: (v: boolean) => void;
	refLoading?: boolean;
	verifyReferral: () => Promise<void>;
}) {
	const checkReferral = async () => {
		// const isValid = validateReferralLocally(referralId.toUpperCase());
		// setReferralValid(isValid);
		await verifyReferral();
		setCheckedOnce(true);
	};

	const resetReferral = () => {
		setReferralValid(false);
		setCheckedOnce(false);
		setValue("referralId", "");
	};

	return (
		<motion.div
			className="border-b border-slate-200 p-4 sm:p-6"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.3 }}>
			<StepHeader
				step={1}
				title="Referral Validation"
				chip={
					referralValid ? (
						<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
							Valid
						</span>
					) : checkedOnce ? (
						<span>
							{refLoading ? (
								<span className="rounded-full bg-neutral-500 px-3 py-1 text-xs font-medium text-yellow-300">
									Checking...
								</span>
							) : (
								<span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
									"Invalid "
								</span>
							)}
						</span>
					) : null
				}
			/>
			<div className="grid gap-3 sm:grid-cols-[1fr_auto]">
				<input
					type="text"
					{...register("referralId")}
					onChange={(e) => setValue("referralId", e.target.value.toUpperCase())}
					placeholder="Enter referral ID (or use URL)"
					className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
				/>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={checkReferral}
						className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 sm:w-auto">
						Validate
					</button>
					{referralValid && (
						<button
							type="button"
							onClick={resetReferral}
							className="inline-flex w-full items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-slate-800 hover:bg-slate-50 sm:w-auto">
							Change
						</button>
					)}
				</div>
			</div>

			{process.env.NEXT_PUBLIC_NODE_ENV !== "production" && (
				<p className="mt-2 text-sm">
					For testing, try:{" "}
					<span className="font-semibold text-blue-700">VALID123</span>,{" "}
					<span className="font-semibold text-blue-700">TEST999</span>,{" "}
					<span className="font-semibold text-blue-700">DEMO777</span>
				</p>
			)}

			{error && !referralValid && checkedOnce && (
				<p className="mt-2 text-sm font-medium text-rose-600">
					{error.message}
				</p>
			)}
		</motion.div>
	);
}
