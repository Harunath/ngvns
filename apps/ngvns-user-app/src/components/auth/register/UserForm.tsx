"use client";
// components/UserForm.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { useOnboardingStore } from "../../../lib/store/useOnboardingStore";

const schema = z.object({
	referralId: z.string().min(1, "Referral ID is required"),
	fullname: z.string().min(1, "Full name is required"),
	relationType: z.string(),
	relationName: z.string().min(1, "Relation name is required"),
	dob: z.string().min(1, "Date of birth is required"),
	address: z.string().min(1, "Address is required"),
	phone: z.string().min(10, "Phone number is required"),
	email: z.string().email("Invalid email"),
	aadhaar: z.string().min(12, "Aadhaar number is required"),
	gender: z.string(),
	userPhoto: z.string().min(1, "User photo URL required"),
	nominieeName: z.string().min(1, "Nominee name is required"),
	nominieeDob: z.string().min(1, "Nominee DOB is required"),
	relationship: z.string().min(1, "Relationship is required"),
});

type FormData = z.infer<typeof schema>;

function UserForm() {
	const [referralValid, setReferralValid] = useState(false);

	const {
		register,
		handleSubmit,
		setError,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
	});

	const referralId = watch("referralId");

	const checkReferral = async () => {
		// Dummy API call to validate referralId
		const isValid = referralId === "VALID123"; // replace with real API call
		if (isValid) {
			setReferralValid(true);
			toast.success("Referral ID is valid");
		} else {
			setReferralValid(false);
			toast.error("Invalid Referral ID");
		}
	};

	const { setData } = useOnboardingStore();

	const onSubmit = async (data: FormData) => {
		if (!referralValid) {
			toast.error("Please validate your referral ID first");
			return;
		}

		try {
			// Dummy API call
			await new Promise((res) => setTimeout(res, 1000));

			// Save data in Zustand
			setData(data);

			toast.success("Form submitted successfully!");
			console.log("Stored in Zustand:", data);
		} catch (err) {
			toast.error("Submission failed");
		}
	};

	return (
		<div className="max-w-2xl mx-auto p-4">
			<h2 className="text-xl font-semibold mb-4">User Onboarding Form</h2>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
				<div>
					<label className="block">Referral ID</label>
					<div className="flex gap-2">
						<input
							type="text"
							{...register("referralId")}
							className="border px-3 py-2 w-full"
						/>
						<button
							type="button"
							className="bg-blue-500 text-white px-4 py-2"
							onClick={checkReferral}>
							Check
						</button>
					</div>
					<p className=" text-sm italic">
						for testing use code :{" "}
						<span className="text-blue-500">VALID123</span>
					</p>
					{errors.referralId && (
						<p className="text-red-500 text-sm">{errors.referralId.message}</p>
					)}
				</div>

				{referralValid && (
					<>
						<div>
							<label className="block">Full Name</label>
							<input
								type="text"
								{...register("fullname")}
								className="border px-3 py-2 w-full"
							/>
							{errors.fullname && (
								<p className="text-red-500 text-sm">
									{errors.fullname.message}
								</p>
							)}
						</div>

						<div>
							<label className="block">Relation Type</label>
							<select
								{...register("relationType")}
								className="border px-3 py-2 w-full">
								<option value="">Select</option>
								<option value="Father">Father</option>
								<option value="Mother">Mother</option>
								<option value="Spouse">Spouse</option>
							</select>
						</div>

						<div>
							<label className="block">Relation Name</label>
							<input
								type="text"
								{...register("relationName")}
								className="border px-3 py-2 w-full"
							/>
							{errors.relationName && (
								<p className="text-red-500 text-sm">
									{errors.relationName.message}
								</p>
							)}
						</div>

						<div>
							<label className="block">Date of Birth</label>
							<input
								type="date"
								{...register("dob")}
								className="border px-3 py-2 w-full"
							/>
						</div>

						<div>
							<label className="block">Address (JSON)</label>
							<textarea
								{...register("address")}
								className="border px-3 py-2 w-full"
							/>
						</div>

						<div>
							<label className="block">Phone</label>
							<input
								type="text"
								{...register("phone")}
								className="border px-3 py-2 w-full"
							/>
							{errors.phone && (
								<p className="text-red-500 text-sm">{errors.phone.message}</p>
							)}
						</div>

						<div>
							<label className="block">Email</label>
							<input
								type="email"
								{...register("email")}
								className="border px-3 py-2 w-full"
							/>
							{errors.email && (
								<p className="text-red-500 text-sm">{errors.email.message}</p>
							)}
						</div>

						<div>
							<label className="block">Aadhaar</label>
							<input
								type="text"
								{...register("aadhaar")}
								className="border px-3 py-2 w-full"
							/>
						</div>

						<div>
							<label className="block">Gender</label>
							<select
								{...register("gender")}
								className="border px-3 py-2 w-full">
								<option value="None">None</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</select>
						</div>

						<div>
							<label className="block">User Photo URL</label>
							<input
								type="text"
								{...register("userPhoto")}
								className="border px-3 py-2 w-full"
							/>
						</div>

						<div>
							<label className="block">Nominee Name</label>
							<input
								type="text"
								{...register("nominieeName")}
								className="border px-3 py-2 w-full"
							/>
						</div>

						<div>
							<label className="block">Nominee DOB</label>
							<input
								type="date"
								{...register("nominieeDob")}
								className="border px-3 py-2 w-full"
							/>
						</div>

						<div>
							<label className="block">Relationship</label>
							<input
								type="text"
								{...register("relationship")}
								className="border px-3 py-2 w-full"
							/>
						</div>

						<button
							type="submit"
							className="bg-green-600 text-white px-4 py-2 mt-4 disabled:opacity-50"
							disabled={isSubmitting}>
							Submit
						</button>
					</>
				)}
			</form>
		</div>
	);
}

export default UserForm;
