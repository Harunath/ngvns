// components/bank/AddBankAccount.tsx
"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { toast } from "react-toastify";

const formSchema = z.object({
	accountHolderName: z.string().min(2, "Enter full name"),
	accountNumber: z.string().min(6, "Enter valid account number"),
	ifsc: z.string().min(4, "Enter IFSC"),
	bankName: z.string().optional(),
	branch: z.string().optional(),
	accountType: z.enum(["SAVINGS", "CURRENT"]).optional(),
	upiId: z.string().optional().nullable(),
	isPrimary: z.boolean().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function AddBankAccount({ userId }: { userId: string }) {
	const router = useRouter();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({ resolver: zodResolver(formSchema) });

	async function onSubmit(values: FormData) {
		try {
			const res = await fetch(`/api/user/me/${userId}/bank-account`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			});

			const data = await res.json();
			if (!res.ok) {
				console.error(data);
				toast.error(data?.error || "Failed to add bank account");
				return;
			}
			// success — navigate or refresh
			toast.success("Bank account added successfully");
			reset();
			router.refresh();
			// optionally push to details page or show toast
		} catch (err) {
			console.error(err);
			toast.error("Network error");
		}
	}

	return (
		<motion.form
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			onSubmit={handleSubmit(onSubmit)}
			className="space-y-4 rounded-lg bg-white p-6 shadow">
			<div>
				<label className="text-sm font-medium">Account holder name</label>
				<input
					{...register("accountHolderName")}
					className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
					placeholder="As per bank records"
				/>
				{errors.accountHolderName && (
					<p className="text-xs text-red-500">
						{errors.accountHolderName.message}
					</p>
				)}
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label className="text-sm font-medium">Account number</label>
					<input
						{...register("accountNumber")}
						className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
						inputMode="numeric"
						placeholder="1234567890"
					/>
					{errors.accountNumber && (
						<p className="text-xs text-red-500">
							{errors.accountNumber.message}
						</p>
					)}
				</div>

				<div>
					<label className="text-sm font-medium">IFSC</label>
					<input
						{...register("ifsc")}
						className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
						placeholder="SBIN0001234"
					/>
					{errors.ifsc && (
						<p className="text-xs text-red-500">{errors.ifsc.message}</p>
					)}
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<div>
					<label className="text-sm font-medium">Bank name</label>
					<input
						{...register("bankName")}
						className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
					/>
				</div>
				<div>
					<label className="text-sm font-medium">Branch</label>
					<input
						{...register("branch")}
						className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-end">
				<div>
					<label className="text-sm font-medium">Account type</label>
					<select
						{...register("accountType")}
						className="mt-1 w-full rounded-md border px-3 py-2 text-sm">
						<option value="SAVINGS">Savings</option>
						<option value="CURRENT">Current</option>
					</select>
				</div>

				<div>
					<label className="text-sm font-medium">UPI (optional)</label>
					<input
						{...register("upiId")}
						className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
						placeholder="name@bank"
					/>
				</div>
			</div>

			<div className="flex items-center justify-between">
				<label className="flex items-center gap-2 text-sm">
					<input
						{...register("isPrimary", { value: true })}
						type="checkbox"
						className="h-4 w-4"
					/>
					Set as primary
				</label>

				<button
					type="submit"
					disabled={isSubmitting}
					className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
					{isSubmitting ? "Saving..." : "Save bank account"}
				</button>
			</div>
		</motion.form>
	);
}
