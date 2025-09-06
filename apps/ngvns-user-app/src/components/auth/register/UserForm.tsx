"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useOnboardingStore } from "../../../lib/store/useOnboardingStore";

// ---------- Zod schema ----------
const schema = z.object({
	referralId: z.string().min(1, "Referral ID is required"),
	fullname: z.string().min(1, "Full name is required"),
	relationType: z.enum(["", "s/o", "d/o", "w/o"]),
	relationName: z.string().min(1, "Relation name is required"),
	dob: z.string().min(1, "Date of birth is required"),
	address: z.string().min(1, "Address is required"),
	phone: z
		.string()
		.min(10, "Phone number is required")
		.regex(/^\d{10}$/, "Phone must be 10 digits"),
	email: z.string().email("Invalid email"),
	aadhaar: z
		.string()
		.min(12, "Aadhaar number is required")
		.regex(/^\d{12}$/, "Aadhaar must be 12 digits"),
	gender: z.enum(["None", "Male", "Female", "Other"]),
	userPhoto: z.string().min(1, "User photo URL required"),
	nominieeName: z.string().min(1, "Nominee name is required"),
	nominieeDob: z.string().min(1, "Nominee DOB is required"),
	relationship: z.string().min(1, "Relationship is required"),
});

type FormData = z.infer<typeof schema>;

// ---------- Local (dummy) validator ----------
// Replace this with your real validation later (still no API calls now).
function validateReferralLocally(id: string) {
	// Example rule set:
	// - 6 to 12 uppercase letters/digits
	// - Or specific test IDs allowed
	const allowList = new Set(["VALID123", "TEST999", "DEMO777"]);
	if (allowList.has(id)) return true;
	if (!/^[A-Z0-9]{6,12}$/.test(id)) return false;
	// lightweight checksum for demo (stable, deterministic)
	let sum = 0;
	for (const ch of id) sum += ch.charCodeAt(0);
	return sum % 7 === 0;
}

export default function UserForm() {
	const searchParams = useSearchParams();
	const { setData } = useOnboardingStore();

	// Read referralId from URL (supports ?ref=, ?refId=, ?referralId=)
	const referralFromUrl = useMemo(() => {
		const candidates = [
			searchParams?.get("ref"),
			searchParams?.get("refId"),
			searchParams?.get("referralId"),
		].filter(Boolean) as string[];
		return candidates[0] ?? "";
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
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			referralId: referralFromUrl ?? "",
			relationType: "" as "" | "s/o" | "d/o" | "w/o",
			gender: "None" as "None" | "Male" | "Female" | "Other",
		},
	});

	// reflect referral from URL into form on mount / changes
	useEffect(() => {
		if (referralFromUrl) {
			setValue("referralId", referralFromUrl);
			// auto-validate if present in URL
			const ok = validateReferralLocally(referralFromUrl.toUpperCase());
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [referralFromUrl]);

	const referralId = (watch("referralId") || "").toUpperCase();

	const checkReferral = () => {
		const isValid = validateReferralLocally(referralId);
		setReferralValid(isValid);
		setCheckedOnce(true);
		if (isValid) toast.success("Referral ID is valid");
		else {
			setError("referralId", {
				type: "manual",
				message: "Invalid Referral ID",
			});
			toast.error("Invalid Referral ID");
		}
	};

	const resetReferral = () => {
		setReferralValid(false);
		setCheckedOnce(false);
		setValue("referralId", "");
	};

	const onSubmit = async (data: FormData) => {
		console.log("Submitting form data:", data);
		if (!referralValid) {
			setError("referralId", {
				type: "manual",
				message: "Please validate your referral ID",
			});
			toast.error("Please validate your referral ID first");
			return;
		}

		// Simulate work (no API calls as requested)
		await new Promise((r) => setTimeout(r, 500));

		// Save to Zustand
		setData(data);

		toast.success("Form saved locally!");
		console.log("Stored in Zustand:", data);
	};

	return (
		<div className="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 bg-white text-slate-900">
			{/* Header / Stepper */}
			<div className="mb-6">
				<h2 className="text-2xl font-semibold tracking-tight">
					User Onboarding
				</h2>
				<p className="mt-1 text-sm text-slate-700">
					First, validate your referral. Once valid, complete your profile.
				</p>
			</div>

			{/* Card */}
			<div className="rounded-2xl border border-slate-200 shadow-sm">
				{/* Step 1: Referral */}
				<div className="border-b border-slate-200 p-4 sm:p-6">
					<div className="mb-4 flex items-center justify-between">
						<div className="flex items-center gap-3">
							<span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500 text-sm font-semibold">
								1
							</span>
							<h3 className="text-lg font-semibold">Referral Validation</h3>
						</div>
						{referralValid ? (
							<span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
								Valid
							</span>
						) : checkedOnce ? (
							<span className="rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700">
								Not valid
							</span>
						) : null}
					</div>

					<div className="grid gap-3 sm:grid-cols-[1fr_auto]">
						<input
							type="text"
							{...register("referralId")}
							onChange={(e) =>
								setValue("referralId", e.target.value.toUpperCase())
							}
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

					<p className="mt-2 text-sm">
						For testing, try:{" "}
						<span className="font-semibold text-blue-700">VALID123</span>,{" "}
						<span className="font-semibold text-blue-700">TEST999</span>,{" "}
						<span className="font-semibold text-blue-700">DEMO777</span>
					</p>

					{errors.referralId && (
						<p className="mt-2 text-sm font-medium text-rose-600">
							{errors.referralId.message}
						</p>
					)}
				</div>

				{/* Step 2: Details (only if referral is valid) */}
				<form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-6">
					<div className="mb-4 flex items-center gap-3">
						<span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500 text-sm font-semibold">
							2
						</span>
						<h3 className="text-lg font-semibold">Personal Details</h3>
					</div>

					{!referralValid ? (
						<div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
							Validate your referral to continue.
						</div>
					) : (
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
							<div className="col-span-1 md:col-span-2">
								<label className="mb-1 block text-sm font-medium">
									Full Name
								</label>
								<input
									type="text"
									{...register("fullname")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.fullname && (
									<p className="mt-1 text-sm font-medium text-rose-600">
										{errors.fullname.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium">
									Relation Type
								</label>
								<select
									{...register("relationType")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
									<option value="">Select</option>
									<option value="s/o">S/O</option>
									<option value="d/o">D/O</option>
									<option value="w/o">W/O</option>
								</select>
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium">
									Relation Name
								</label>
								<input
									type="text"
									{...register("relationName")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.relationName && (
									<p className="mt-1 text-sm font-medium text-rose-600">
										{errors.relationName.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium">
									Date of Birth
								</label>
								<input
									type="date"
									{...register("dob")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.dob && (
									<p className="mt-1 text-sm font-medium text-rose-600">
										{errors.dob.message}
									</p>
								)}
							</div>

							<div className="md:col-span-2">
								<label className="mb-1 block text-sm font-medium">
									Address
								</label>
								<textarea
									rows={3}
									{...register("address")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.address && (
									<p className="mt-1 text-sm font-medium text-rose-600">
										{errors.address.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium">Phone</label>
								<input
									type="text"
									{...register("phone")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.phone && (
									<p className="mt-1 text-sm font-medium text-rose-600">
										{errors.phone.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium">Email</label>
								<input
									type="email"
									{...register("email")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.email && (
									<p className="mt-1 text-sm font-medium text-rose-600">
										{errors.email.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium">
									Aadhaar
								</label>
								<input
									type="text"
									{...register("aadhaar")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.aadhaar && (
									<p className="mt-1 text-sm font-medium text-rose-600">
										{errors.aadhaar.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium">Gender</label>
								<select
									{...register("gender")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
									<option value="None">None</option>
									<option value="Male">Male</option>
									<option value="Female">Female</option>
									<option value="Other">Other</option>
								</select>
							</div>

							<div className="md:col-span-2">
								<label className="mb-1 block text-sm font-medium">
									User Photo URL
								</label>
								<input
									type="text"
									{...register("userPhoto")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.userPhoto && (
									<p className="mt-1 text-sm font-medium text-rose-600">
										{errors.userPhoto.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium">
									Nominee Name
								</label>
								<input
									type="text"
									{...register("nominieeName")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.nominieeName && (
									<p className="mt-1 text-sm font-medium text-rose-600">
										{errors.nominieeName.message}
									</p>
								)}
							</div>

							<div>
								<label className="mb-1 block text-sm font-medium">
									Nominee DOB
								</label>
								<input
									type="date"
									{...register("nominieeDob")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.nominieeDob && (
									<p className="mt-1 text-sm font-medium text-rose-600">
										{errors.nominieeDob.message}
									</p>
								)}
							</div>

							<div className="md:col-span-2">
								<label className="mb-1 block text-sm font-medium">
									Relationship
								</label>
								<input
									type="text"
									{...register("relationship")}
									className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
								/>
								{errors.relationship && (
									<p className="mt-1 text-sm font-medium text-rose-600">
										{errors.relationship.message}
									</p>
								)}
							</div>

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
				</form>
			</div>
		</div>
	);
}
