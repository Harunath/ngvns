"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

type User = {
	id: string;
	fullname: string;
	email: string;
	phone?: string | null;
};

type Props = { teamId: string };

export default function FetchingUser({ teamId }: Props) {
	const [query, setQuery] = React.useState<string>("");
	const [user, setUser] = React.useState<User | null>(null);
	const [isSearching, setIsSearching] = React.useState(false);
	const [isAssigning, setIsAssigning] = React.useState(false);
	const [hasSearchedOnce, setHasSearchedOnce] = React.useState(false);

	const controllerRef = React.useRef<AbortController | null>(null);
	const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

	// Fetch by ID (your current API). If you later switch to email/name search,
	// point this to the correct endpoint and pass query accordingly.
	const getUserById = async (id: string) => {
		if (!id.trim()) {
			setUser(null);
			return;
		}

		// cancel any in-flight
		controllerRef.current?.abort();
		controllerRef.current = new AbortController();

		setIsSearching(true);
		try {
			const res = await fetch(`/api/super-admin/users/${id}`, {
				signal: controllerRef.current.signal,
			});

			if (!res.ok) {
				let msg = "Failed to fetch user.";
				try {
					const data = await res.json();
					if (data?.error) msg = data.error;
				} catch {}
				throw new Error(msg);
			}

			const data = await res.json();
			if (!data?.user) {
				setUser(null);
				toast.info("No user found for the given ID.");
			} else {
				setUser(data.user as User);
			}
		} catch (err: any) {
			if (err?.name !== "AbortError") {
				console.error(err);
				toast.error(err?.message || "Error fetching user.");
			}
		} finally {
			setIsSearching(false);
			setHasSearchedOnce(true);
		}
	};

	// Debounced search
	React.useEffect(() => {
		if (!query) {
			setUser(null);
			setHasSearchedOnce(false);
			if (debounceRef.current) clearTimeout(debounceRef.current);
			return;
		}
		if (debounceRef.current) clearTimeout(debounceRef.current);
		debounceRef.current = setTimeout(() => getUserById(query), 450);
		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [query]);

	const handleAssignManager = async () => {
		if (!user?.id) {
			toast.warn("Please search and select a valid user first.");
			return;
		}
		setIsAssigning(true);
		try {
			const res = await fetch(
				`/api/super-admin/marketing-team/assign-manager`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ marketingTeamId: teamId, managerId: user.id }),
				}
			);

			if (!res.ok) {
				let msg = "Failed to assign manager.";
				try {
					const data = await res.json();
					if (data?.error) msg = data.error;
				} catch {}
				throw new Error(msg);
			}

			toast.success(`Assigned ${user.fullname} as Manager successfully.`);
			setUser(null);
			setQuery("");
			setHasSearchedOnce(false);
		} catch (err: any) {
			console.error(err);
			toast.error(err?.message || "Error assigning manager.");
		} finally {
			setIsAssigning(false);
		}
	};

	const reset = () => {
		controllerRef.current?.abort();
		setQuery("");
		setUser(null);
		setHasSearchedOnce(false);
	};

	return (
		<div className="w-full max-w-3xl rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
			<div className="mb-4">
				<h2 className="text-lg font-semibold text-neutral-900">
					Assign Team Manager
				</h2>
				<p className="mt-1 text-sm text-neutral-600">
					Search a user by their <span className="font-medium">ID</span> and
					assign them as the manager for this team.
				</p>
			</div>

			{/* Search input */}
			<div className="relative">
				<input
					type="text"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Enter User ID..."
					className="w-full rounded-xl border border-neutral-300 bg-white px-10 py-2.5 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
				/>
				{/* icon */}
				<svg
					className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor">
					<circle cx="11" cy="11" r="7" strokeWidth="2" />
					<path d="M20 20l-3.5-3.5" strokeWidth="2" />
				</svg>

				{query && (
					<button
						onClick={reset}
						className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg px-2 py-1 text-xs text-neutral-600 hover:bg-neutral-100">
						Clear
					</button>
				)}
			</div>

			{/* States */}
			<div className="mt-6 min-h-[120px]">
				{/* Loading */}
				{isSearching && (
					<div className="rounded-xl border border-neutral-200 p-4">
						<div className="flex items-start gap-4">
							<div className="h-12 w-12 animate-pulse rounded-full bg-neutral-200" />
							<div className="flex-1">
								<div className="h-4 w-1/3 animate-pulse rounded bg-neutral-200" />
								<div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-neutral-200" />
								<div className="mt-2 h-3 w-1/4 animate-pulse rounded bg-neutral-200" />
							</div>
						</div>
					</div>
				)}

				{/* Empty / Hint */}
				{!isSearching && !user && !hasSearchedOnce && (
					<div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-6 text-sm text-neutral-600">
						Start typing a user ID to search…
					</div>
				)}

				{/* No result */}
				{!isSearching && !user && hasSearchedOnce && (
					<div className="rounded-xl border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
						No user selected. Try another ID.
					</div>
				)}

				{/* Result */}
				<AnimatePresence>
					{!isSearching && user && (
						<motion.div
							initial={{ opacity: 0, y: 8 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -8 }}
							transition={{ duration: 0.2 }}
							className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
							<div className="flex items-start gap-4">
								<div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-sm font-semibold text-neutral-700">
									{user.fullname?.[0]?.toUpperCase() || "U"}
								</div>
								<div className="flex-1">
									<div className="flex items-center justify-between">
										<h3 className="text-base font-semibold text-neutral-900">
											{user.fullname}
										</h3>
										<span className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
											ID: {user.id}
										</span>
									</div>
									<div className="mt-1 text-sm text-neutral-700">
										<div>
											<span className="text-neutral-500">Email:</span>{" "}
											{user.email}
										</div>
										{user.phone ? (
											<div>
												<span className="text-neutral-500">Phone:</span>{" "}
												{user.phone}
											</div>
										) : null}
									</div>

									<div className="mt-4 flex flex-wrap items-center gap-3">
										<button
											onClick={() => setUser(null)}
											className="rounded-lg border border-neutral-300 bg-white px-3.5 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50">
											Search Again
										</button>

										<button
											onClick={handleAssignManager}
											disabled={isAssigning}
											className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70">
											{isAssigning ? (
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
													Assigning…
												</>
											) : (
												<>Assign {user.fullname} as Manager</>
											)}
										</button>
									</div>
								</div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			{/* Include once globally in layout if you prefer */}
			<ToastContainer
				position="top-right"
				closeOnClick
				draggable
				pauseOnHover
			/>
		</div>
	);
}
