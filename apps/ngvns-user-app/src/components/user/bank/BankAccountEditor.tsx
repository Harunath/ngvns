// components/bank/BankAccountEditor.tsx
"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion, scale } from "framer-motion";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const schema = z.object({
	accountHolderName: z.string().min(2, "Full name required"),
	accountNumber: z.string().min(6, "Valid account number").optional(), // optional: only if changing
	ifsc: z.string().min(4, "IFSC required"),
	bankName: z.string().optional(),
	branch: z.string().optional(),
	accountType: z.enum(["SAVINGS", "CURRENT"]),
	upiId: z.string().nullable().optional(),
	isPrimary: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

type Loaded = {
	id: string;
	accountHolderName: string;
	accountNumberMasked: string;
	ifsc: string;
	bankName?: string;
	branch?: string;
	accountType: "SAVINGS" | "CURRENT";
	upiId?: string | null;
	isPrimary: boolean;
	verified: boolean;
};

export default function BankAccountEditor({
	userId,
	bankAccountId,
}: {
	userId: string;
	bankAccountId: string;
}) {
	const [loaded, setLoaded] = useState<Loaded | null>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();
	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			accountHolderName: "",
			accountNumber: "",
			ifsc: "",
			bankName: "",
			branch: "",
			accountType: "SAVINGS",
			upiId: "",
			isPrimary: false,
		},
	});

	useEffect(() => {
		(async () => {
			setLoading(true);
			try {
				const res = await fetch(
					`/api/user/me/${userId}/bank-account/${bankAccountId}`
				);
				const json = await res.json();
				if (res.ok && json.data) {
					const d = json.data as Loaded;
					setLoaded(d);
					reset({
						accountHolderName: d.accountHolderName,
						accountNumber: d.accountNumberMasked, // keep empty (only fill if changing)
						ifsc: d.ifsc,
						bankName: d.bankName || "",
						branch: d.branch || "",
						accountType: d.accountType,
						upiId: d.upiId || "",
						isPrimary: d.isPrimary,
					});
				}
			} finally {
				setLoading(false);
			}
		})();
	}, [userId, bankAccountId, reset]);

	async function onSubmit(values: FormData) {
		const res = await fetch(
			`/api/user/me/${userId}/bank-account/${bankAccountId}`,
			{
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(values),
			}
		);
		const json = await res.json();
		if (!res.ok) {
			console.error(json);
			toast.error(json?.error || "Update failed");
			return;
		}
		setLoaded((prev) =>
			prev
				? {
						...prev,
						accountHolderName: values.accountHolderName,
						ifsc: values.ifsc,
						bankName: values.bankName,
						branch: values.branch,
						accountType: values.accountType,
						upiId: values.upiId ?? null,
						isPrimary: !!values.isPrimary,
					}
				: prev
		);
		toast.success("Bank account updated successfully");
		router.refresh();
	}

	async function onDelete() {
		if (!confirm("Delete this bank account? This cannot be undone.")) return;
		const res = await fetch(
			`/api/user/me/${userId}/bank-account/${bankAccountId}`,
			{
				method: "DELETE",
			}
		);
		const json = await res.json();
		if (!res.ok) {
			console.error(json);
			toast.error(json?.error || "Delete failed");
			return;
		}
		toast.success("Bank account deleted successfully");
		// Navigate away or refresh list
		router.back(); // or router.push('/profile'); adjust to your flow
	}

	if (loading) return <div className="p-4">Loading…</div>;
	if (!loaded) return <div className="p-4">Bank account not found.</div>;

	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			className="space-y-6">
			<div className="rounded-lg bg-white p-6 shadow">
				<div className="mb-4 flex items-center justify-between">
					<div>
						<h3 className="text-lg font-semibold">
							{loaded.accountHolderName}
						</h3>
						<p className="text-sm text-gray-600">
							{loaded.bankName || "Bank"} • {loaded.accountNumberMasked}
						</p>
					</div>
					<AnimatePresence>
						{openDeleteModal ? (
							<motion.div
								key="modal"
								layoutId="delete-button" // 👈 same layoutId as the button
								className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-2xl bg-neutral-950/20">
								<motion.div
									className="rounded-xl bg-white p-6 text-center shadow-xl"
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									exit={{ opacity: 0, scale: 0.9 }}
									transition={{ type: "spring", duration: 0.4 }}>
									<p className="text-sm font-medium text-gray-800">
										Are you sure you want to delete this bank account?
									</p>
									<div className="mt-4 flex justify-center gap-3">
										<button
											onClick={() => setOpenDeleteModal(false)}
											className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 bg-white">
											Cancel
										</button>
										<button
											onClick={() => alert("Deleted")}
											className="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white">
											Confirm Delete
										</button>
									</div>
								</motion.div>
							</motion.div>
						) : (
							<motion.button
								key="button"
								layoutId="delete-button" // 👈 same layoutId
								onClick={() => setOpenDeleteModal(true)}
								className="rounded-md border border-red-600 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50">
								Delete
							</motion.button>
						)}
					</AnimatePresence>
				</div>

				<form
					onSubmit={handleSubmit(onSubmit)}
					className="grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="col-span-2">
						<label className="text-sm font-medium">Account holder name</label>
						<input
							{...register("accountHolderName")}
							className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
						/>
						{errors.accountHolderName && (
							<p className="text-xs text-red-500">
								{errors.accountHolderName.message}
							</p>
						)}
					</div>

					<div>
						<label className="text-sm font-medium">
							New account number (optional)
						</label>
						<input
							{...register("accountNumber")}
							className="mt-1 w-full rounded-md border px-3 py-2 text-sm"
							placeholder="Leave blank to keep existing"
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
						/>
						{errors.ifsc && (
							<p className="text-xs text-red-500">{errors.ifsc.message}</p>
						)}
					</div>

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

					<div className="col-span-2 flex items-center justify-between pt-2">
						<label className="flex items-center gap-2 text-sm">
							<input
								type="checkbox"
								{...register("isPrimary")}
								className="h-4 w-4"
							/>
							Set as primary
						</label>
						<button
							type="submit"
							disabled={isSubmitting}
							className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">
							{isSubmitting ? "Saving…" : "Save changes"}
						</button>
					</div>
				</form>
			</div>
		</motion.div>
	);
}
