"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { AnimatePresence, motion } from "motion/react";

import { useOnboardingStore } from "../../../../lib/store/useOnboardingStore";
import {
	onboardingSchema,
	OnboardingFormData,
} from "../../../../lib/validators/onboarding";
import ReferralValidator from "./ReferralValidator";
import StepHeader from "./StepHeader";
import PersonalDetails from "./sections/PersonalDetails";
import AddressFields from "./sections/AddressFields";
import IdentityFields from "./sections/IdentityFields";
import NomineeFields from "./sections/NomineeFields";
import { validateReferralLocally } from "../../../../utils/referral";
import Link from "next/link";

export default function UserOnboardingForm({ goNext }: { goNext: () => void }) {
	const searchParams = useSearchParams();
	const { setData } = useOnboardingStore();

	const referralFromUrl = useMemo(() => {
		const candidates = [
			searchParams?.get("ref"),
			searchParams?.get("refId"),
			searchParams?.get("referralId"),
		].filter(Boolean) as string[];
		return (candidates[0] ?? "").toUpperCase();
	}, [searchParams]);

	const [referralValid, setReferralValid] = useState(false);
	const [checkedOnce, setCheckedOnce] = useState(false);

	const {
		register,
		handleSubmit,
		setError,
		setValue,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<OnboardingFormData>({
		resolver: zodResolver(onboardingSchema),
		defaultValues: {
			referralId: referralFromUrl ?? "",
			relationType: "",
			gender: "None",
			address: {
				addressLine1: "",
				addressLine2: "",
				stateId: "",
				pincode: "",
			},
		},
	});

	const verifyReferral = async () => {
		const refId = (watch("referralId") || "").toUpperCase().trim();
		if (!refId) {
			setError("referralId", {
				type: "manual",
				message: "Please enter a referral ID",
			});
			setReferralValid(false);
			return;
		}
		const res = await fetch("/api/auth/onboarding/verify-referral", {
			method: "POST",
			body: JSON.stringify({ referralId: refId }),
			headers: { "Content-Type": "application/json" },
		});
		if (!res.ok) {
			const data = await res.json();
			setError("referralId", {
				type: "manual",
				message: data?.message || "Referral ID is invalid",
			});
			setReferralValid(false);
			toast.error(data?.message || "Referral ID is invalid");
			return;
		}
		setReferralValid(true);
		toast.success("Referral ID is valid!");
	};

	// reflect referral from URL
	useEffect(() => {
		if (!referralFromUrl) return;
		setValue("referralId", referralFromUrl);
		if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
			verifyReferral();
			setCheckedOnce(true);
		} else {
			const ok = validateReferralLocally(referralFromUrl);
			setReferralValid(ok);
			setCheckedOnce(true);
			if (ok) toast.success("Referral ID auto-validated from URL");
			else {
				setError("referralId", {
					type: "manual",
					message: "Referral in URL is invalid. Please check it.",
				});
				toast.error("Referral in URL is invalid. Please check it.");
			}
		}
	}, [referralFromUrl, setValue, setError]);

	const referralId = (watch("referralId") || "").toUpperCase();

	const onSubmit = async (data: OnboardingFormData) => {
		if (!referralValid) {
			setError("referralId", {
				type: "manual",
				message: "Please validate your referral ID",
			});
			toast.error("Please validate your referral ID first");
			return;
		}
		if (process.env.NEXT_PUBLIC_NODE_ENV === "production") {
			const result = await fetch("/api/auth/onboarding", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data),
			});
			if (!result.ok) {
				toast.error("Failed to submit form. Please try again.");
				return;
			}
			toast.success("Form submitted successfully!");
			setData({
				...data,
				address: {
					addressLine1: data.address.addressLine1,
					addressLine2: data.address.addressLine2,
					pincode: String(data.address.pincode),
					stateId: data.address.stateId,
				},
			});
			toast.success("Form saved locally!");
			goNext();
		} else {
			setData(data);
			toast.success("Form saved locally!");
			goNext();
		}
	};

	return (
		<div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 bg-white text-slate-900">
			<div className="mb-6">
				<h2 className="text-2xl font-semibold tracking-tight">
					User Onboarding
				</h2>
				{!referralValid ? (
					<p className="mt-1 text-sm text-slate-700">
						First, validate your referral. Once valid, complete your profile.
					</p>
				) : (
					<p className="mt-1 text-sm text-green-600">Valid referral</p>
				)}
			</div>

			<div className="rounded-2xl border border-slate-200 shadow-sm">
				{/* Step 1: Referral */}
				<AnimatePresence>
					{!referralValid && (
						<ReferralValidator
							referralId={referralId}
							register={register}
							setValue={setValue}
							setError={setError}
							error={errors.referralId}
							referralValid={referralValid}
							setReferralValid={setReferralValid}
							checkedOnce={checkedOnce}
							setCheckedOnce={setCheckedOnce}
						/>
					)}
				</AnimatePresence>

				{/* Step 2: Details */}
				<AnimatePresence>
					<motion.form
						onSubmit={handleSubmit(onSubmit)}
						className="p-4 sm:p-6"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0, scale: 0.9 }}
						transition={{ duration: 0.3 }}>
						<StepHeader step={2} title="Personal Details" />
						{!referralValid ? (
							<div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
								Validate your referral to continue.
							</div>
						) : (
							<div className=" space-y-6">
								<PersonalDetails
									register={register}
									errors={errors}
									watch={watch}
								/>
								<AddressFields register={register} errors={errors} />
								<IdentityFields register={register} errors={errors} />
								<NomineeFields register={register} errors={errors} />

								<div className="md:col-span-2 flex items-center justify-end">
									<button
										type="submit"
										disabled={isSubmitting}
										className="inline-flex items-center rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-60">
										{isSubmitting ? "Saving…" : "Submit"}
									</button>
								</div>
							</div>
						)}
					</motion.form>
				</AnimatePresence>
			</div>
			<div>
				<p className="mt-4 text-xs text-slate-400">
					already initiated onboarding? click{" "}
					<Link className=" text-blue-400 italic" href="/register/resume">
						resume
					</Link>
				</p>
			</div>
		</div>
	);
}
