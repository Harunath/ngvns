"use client";

import React from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type Details = {
	area: string;
	head: string;
	otherInfo: string;
};

export default function AddMarketingTeam() {
	const [name, setName] = React.useState("");
	const [description, setDescription] = React.useState("");
	const [details, setDetails] = React.useState<Details>({
		area: "",
		head: "",
		otherInfo: "",
	});
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const reset = () => {
		setName("");
		setDescription("");
		setDetails({ area: "", head: "", otherInfo: "" });
	};

	const handleSubmit = async () => {
		// Basic validation
		if (!name.trim() || !description.trim()) {
			toast.warn("Name and Description are required.");
			return;
		}

		setIsSubmitting(true);
		const controller = new AbortController();

		try {
			const res = await fetch("/api/super-admin/marketing-team", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: name.trim(),
					description: description.trim(),
					details,
				}),
				signal: controller.signal,
			});

			if (!res.ok) {
				let msg = "Failed to add Marketing Team.";
				try {
					const data = await res.json();
					if (data?.error) msg = data.error;
				} catch {}
				toast.error(msg);
				return;
			}

			toast.success("Marketing Team added successfully!");
			reset();
		} catch (err: any) {
			if (err?.name !== "AbortError") {
				console.error(err);
				toast.error("An error occurred while adding the Marketing Team.");
			}
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-neutral-50 py-10">
			<div className="mx-auto w-full max-w-3xl px-4">
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.25 }}
					className="mb-8">
					<h1 className="text-2xl font-semibold text-neutral-900">
						Add Marketing Team
					</h1>
					<p className="mt-1 text-sm text-neutral-600">
						Create a team and define its area, head, and any additional notes.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3, delay: 0.05 }}
					className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
					{/* Name */}
					<div className="mb-5">
						<label
							htmlFor="name"
							className="mb-2 block text-sm font-medium text-neutral-800">
							Team Name <span className="text-red-600">*</span>
						</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Eg: Hyderabad Central"
							className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
						/>
						<p className="mt-1 text-xs text-neutral-500">
							A unique, human-friendly name for this team.
						</p>
					</div>

					{/* Description */}
					<div className="mb-5">
						<label
							htmlFor="description"
							className="mb-2 block text-sm font-medium text-neutral-800">
							Description <span className="text-red-600">*</span>
						</label>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="What this team does, scope, responsibilities..."
							rows={4}
							className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
						/>
					</div>

					<div className="grid gap-5 md:grid-cols-3">
						{/* Area */}
						<div className="md:col-span-1">
							<label
								htmlFor="area"
								className="mb-2 block text-sm font-medium text-neutral-800">
								Area
							</label>
							<input
								id="area"
								type="text"
								value={details.area}
								onChange={(e) =>
									setDetails((d) => ({ ...d, area: e.target.value }))
								}
								placeholder="Eg: Telangana / Zone-1"
								className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
							/>
						</div>

						{/* Head */}
						<div className="md:col-span-1">
							<label
								htmlFor="head"
								className="mb-2 block text-sm font-medium text-neutral-800">
								Head
							</label>
							<input
								id="head"
								type="text"
								value={details.head}
								onChange={(e) =>
									setDetails((d) => ({ ...d, head: e.target.value }))
								}
								placeholder="Eg: Raghav Sharma"
								className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
							/>
						</div>

						{/* Other Info */}
						<div className="md:col-span-1">
							<label
								htmlFor="otherInfo"
								className="mb-2 block text-sm font-medium text-neutral-800">
								Other Info
							</label>
							<input
								id="otherInfo"
								type="text"
								value={details.otherInfo}
								onChange={(e) =>
									setDetails((d) => ({ ...d, otherInfo: e.target.value }))
								}
								placeholder="Optional notes"
								className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
							/>
						</div>
					</div>

					{/* Actions */}
					<div className="mt-8 flex items-center gap-3">
						<motion.button
							whileTap={{ scale: 0.98 }}
							onClick={handleSubmit}
							disabled={isSubmitting}
							className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70">
							{isSubmitting ? (
								<>
									<svg
										className="mr-2 h-4 w-4 animate-spin"
										viewBox="0 0 24 24"
										fill="none">
										<circle
											className="opacity-25"
											cx="12"
											cy="12"
											r="10"
											stroke="currentColor"
											strokeWidth="4"
										/>
										<path
											className="opacity-75"
											fill="currentColor"
											d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
										/>
									</svg>
									Saving…
								</>
							) : (
								"Add Team"
							)}
						</motion.button>

						<button
							type="button"
							onClick={reset}
							disabled={isSubmitting}
							className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-70">
							Reset
						</button>
					</div>
				</motion.div>
			</div>

			{/* Toasts */}
			<ToastContainer
				position="top-right"
				closeOnClick
				draggable
				pauseOnHover
			/>
		</div>
	);
}
