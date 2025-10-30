"use client";

import React from "react";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

type ApiUser = {
	id: string;
	fullname: string;
	phone?: string;
	vrKpId?: string;
	email?: string;
};

export default function AddingAgent() {
	const [userId, setUserId] = React.useState("");
	const [userData, setUserData] = React.useState<ApiUser | null>(null);
	const [loading, setLoading] = React.useState<"get" | "add" | null>(null);

	const handleGetUser = async (e?: React.FormEvent) => {
		e?.preventDefault();
		if (!userId.trim()) {
			toast.info("Enter a user ID first.");
			return;
		}
		try {
			setLoading("get");
			const res = await fetch("/api/team-leader/user/getuser", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: userId.trim() }),
			});

			if (!res.ok) {
				const err = await res.json().catch(() => ({}));
				throw new Error(err?.message || "Failed to fetch user.");
			}
			const data = (await res.json()) as ApiUser;
			setUserData(data);
			toast.success("User data fetched successfully!");
		} catch (err: any) {
			setUserData(null);
			toast.error(err?.message || "Error fetching user data.");
			console.error(err);
		} finally {
			setLoading(null);
		}
	};

	const handleAddTeamLeader = async () => {
		if (!userId.trim()) {
			toast.info("Enter a user ID first.");
			return;
		}
		try {
			setLoading("add");
			const res = await fetch("/api/team-leader/agents", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userId: userId.trim() }),
			});
			const data = await res.json().catch(() => ({}));

			if (res.ok) {
				toast.success("Executive added successfully!");
				setUserData(null);
				setUserId("");
			} else {
				toast.error(data?.message || "Failed to add Executive.");
			}
			console.log("Add Executive Response:", data);
		} catch (err: any) {
			toast.error("Error adding Executive.");
			console.error(err);
		} finally {
			setLoading(null);
		}
	};

	const resetUser = () => setUserData(null);

	return (
		<div className="min-h-[70vh] w-full bg-neutral-50 px-5 py-10">
			<div className="mx-auto max-w-3xl">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-gray-900">Add Executive</h1>
					<p className="mt-1 text-sm text-gray-600">
						Lookup a user by ID, preview their details, then assign them as a
						Manager.
					</p>
				</div>

				{/* Form Card */}
				<motion.form
					layout
					onSubmit={handleGetUser}
					className="rounded-2xl border bg-white p-6 shadow-sm"
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.25 }}>
					<div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
						<div>
							<label
								htmlFor="userId"
								className="mb-1 block text-sm font-medium text-gray-800">
								User ID
							</label>
							<input
								id="userId"
								type="text"
								placeholder="Enter user ID (e.g., uuid)"
								value={userId}
								onChange={(e) => setUserId(e.target.value)}
								className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none ring-0 transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
							/>
							<p className="mt-1 text-xs text-gray-500">
								We&apos;ll fetch user details with this identifier.
							</p>
						</div>

						<motion.button
							type="submit"
							whileTap={{ scale: 0.98 }}
							className="mt-1 inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
							disabled={loading === "get"}>
							{loading === "get" ? (
								<span className="inline-flex items-center gap-2">
									<Spinner /> Fetching…
								</span>
							) : (
								"Get User"
							)}
						</motion.button>
					</div>
				</motion.form>

				{/* Result */}
				<AnimatePresence initial={false}>
					{userData && (
						<motion.div
							layout
							key={userData.id}
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 8 }}
							transition={{ duration: 0.25 }}
							className="mt-6 rounded-2xl border bg-white p-6 shadow-sm">
							<div className="flex items-start justify-between gap-4">
								<div>
									<h2 className="text-lg font-semibold text-gray-900">
										{userData.fullname || "Unnamed User"}
									</h2>
									<dl className="mt-2 space-y-1 text-sm">
										<div className="flex gap-2">
											<dt className="min-w-16 text-gray-500">User ID:</dt>
											<dd className="break-all">{userData.id}</dd>
										</div>
										{userData.phone && (
											<div className="flex gap-2">
												<dt className="min-w-16 text-gray-500">Phone:</dt>
												<dd>{userData.phone}</dd>
											</div>
										)}
										{userData.email && (
											<div className="flex gap-2">
												<dt className="min-w-16 text-gray-500">Email:</dt>
												<dd>
													<a
														className="text-blue-600 underline underline-offset-2 hover:text-blue-700"
														href={`mailto:${userData.email}`}>
														{userData.email}
													</a>
												</dd>
											</div>
										)}
										{userData.vrKpId && (
											<div className="flex gap-2">
												<dt className="min-w-16 text-gray-500">VRKP:</dt>
												<dd className="font-medium">{userData.vrKpId}</dd>
											</div>
										)}
									</dl>
								</div>

								<div className="shrink-0">
									<span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
										Ready
									</span>
								</div>
							</div>

							<div className="mt-5 flex flex-wrap gap-3">
								<motion.button
									whileHover={{ y: -1 }}
									whileTap={{ scale: 0.98 }}
									onClick={handleAddTeamLeader}
									disabled={loading === "add"}
									className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
									{loading === "add" ? (
										<span className="inline-flex items-center gap-2">
											<Spinner /> Adding…
										</span>
									) : (
										"Add as Executive"
									)}
								</motion.button>

								<motion.button
									whileHover={{ y: -1 }}
									whileTap={{ scale: 0.98 }}
									onClick={resetUser}
									className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-sm transition hover:bg-gray-50">
									Reset User
								</motion.button>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}

/** Simple inline spinner to avoid external UI libs */
function Spinner() {
	return (
		<svg
			className="h-4 w-4 animate-spin"
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden>
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
				d="M4 12a8 8 0 0 1 8-8"
				stroke="currentColor"
				strokeWidth="4"
				strokeLinecap="round"
			/>
		</svg>
	);
}
