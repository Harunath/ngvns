"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";

type Log = {
	id: string;
	createdAt: string;
	targetUserId: string | null;
	ip: string | null;
	metadata: any;
	actor: { id: string; fullname: string; email: string; role: string } | null;
};

export default function PasswordResetPage({ id }: { id: string }) {
	const [pwd, setPwd] = useState("");
	const [confirm, setConfirm] = useState("");
	const [see, setSee] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
		null
	);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setMsg(null);

		if (!id) {
			setMsg({ type: "err", text: "Provide a userId." });
			return;
		}
		if (pwd.length < 8) {
			setMsg({ type: "err", text: "Password must be at least 8 characters." });
			return;
		}
		if (pwd !== confirm) {
			setMsg({ type: "err", text: "Passwords do not match." });
			return;
		}

		setSubmitting(true);
		try {
			const r = await fetch(
				`/api/super-admin/users/${encodeURIComponent(id)}/password`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ newPassword: pwd }),
				}
			);
			if (!r.ok) {
				const j = await r.json().catch(() => ({}));
				throw new Error(j.error ?? "Failed to reset password.");
			}
			setMsg({ type: "ok", text: "Password reset successfully." });
			setPwd("");
			setConfirm("");
		} catch (err: any) {
			setMsg({ type: "err", text: err.message || "Something went wrong." });
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<div className="min-h-screen bg-neutral-50 px-4 py-8">
			<div className="mx-auto max-w-3xl space-y-8">
				<header className="flex items-center justify-between">
					<div>
						<h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
							Admin · Reset User Password
						</h1>
						<p className="text-sm text-neutral-500">
							Provide a userId and a new password. This action is logged.
						</p>
					</div>
				</header>

				<motion.section
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="rounded-2xl border bg-white p-6 shadow-sm">
					<form onSubmit={onSubmit} className="space-y-5">
						<div className="">
							<div className="mb-1 block text-sm font-medium text-neutral-700">
								user id : {id}
								{see ? (
									<FaRegEyeSlash
										className="h-5 w-5"
										onClick={() => setSee(false)}
									/>
								) : (
									<FaEye className="h-5 w-5" onClick={() => setSee(true)} />
								)}
							</div>
							{/* <label className="block">
								<span className="mb-1 block text-sm font-medium text-neutral-700">
									User ID
								</span>
								<input
									value={userId}
									onChange={(e) => setUserId(e.target.value)}
									placeholder="usr_..."
									className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none ring-0 focus:border-neutral-900"
								/>
							</label> */}

							<label className="block">
								<span className="mb-1 block text-sm font-medium text-neutral-700">
									New Password
								</span>
								<input
									type={see ? "text" : "password"}
									value={pwd}
									onChange={(e) => setPwd(e.target.value)}
									placeholder="••••••••"
									className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none ring-0 focus:border-neutral-900"
								/>
							</label>

							<label className="block sm:col-span-2">
								<span className="mb-1 block text-sm font-medium text-neutral-700">
									Confirm Password
								</span>
								<input
									type={see ? "text" : "password"}
									value={confirm}
									onChange={(e) => setConfirm(e.target.value)}
									placeholder="••••••••"
									className="w-full rounded-xl border border-neutral-200 px-3 py-2 outline-none ring-0 focus:border-neutral-900"
								/>
							</label>
						</div>

						{msg && (
							<motion.div
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								className={`rounded-xl px-3 py-2 text-sm ${
									msg.type === "ok"
										? "bg-emerald-50 text-emerald-700 border border-emerald-200"
										: "bg-rose-50 text-rose-700 border border-rose-200"
								}`}>
								{msg.text}
							</motion.div>
						)}

						<div className="flex items-center gap-3">
							<button
								type="submit"
								disabled={submitting}
								className="rounded-xl bg-neutral-900 px-4 py-2 text-white transition disabled:opacity-60 hover:bg-neutral-800">
								{submitting ? "Updating..." : "Reset Password"}
							</button>
							<span className="text-xs text-neutral-500">
								Resets immediately and creates an audit log.
							</span>
						</div>
					</form>
				</motion.section>
			</div>
		</div>
	);
}
