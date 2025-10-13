"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

type AdminRole = "ROOT" | "SUPER" | "COMMAND" | "FINANCE" | "DATA_ENTRY";

export default function AdminRegisterPage() {
	const router = useRouter();
	const [form, setForm] = useState({
		email: "",
		password: "",
		fullname: "",
		phone: "",
		role: "DATA_ENTRY" as AdminRole,
		inviteCode: "",
		showPassword: false,
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const res = await fetch("/api/superdev/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: form.email.trim(),
					password: form.password,
					fullname: form.fullname.trim(),
					phone: form.phone.trim(),
					role: form.role,
					inviteCode: form.inviteCode || undefined,
				}),
			});
			const data = await res.json();
			if (!res.ok) {
				if (data?.error === "unique_constraint") {
					toast.error(`Duplicate ${data.target?.join(", ")}`);
					return setError(`Duplicate ${data.target?.join(", ")}`);
				}
				if (data?.error === "validation_error") {
					toast.error("Please fix validation errors and try again.");
					return setError("Please fix validation errors and try again.");
				}
				if (data?.error === "invalid_invite_code") {
					toast.error("Invalid invite code.");
					return setError("Invalid invite code.");
				}
				toast.error("Failed to register. Try again.");
				return setError("Failed to register. Try again.");
			}
			// success: redirect to admin login (or dashboard)
			toast.success("Admin created successfully.");
			setForm({
				email: "",
				password: "",
				fullname: "",
				phone: "",
				role: "DATA_ENTRY" as AdminRole,
				inviteCode: "",
				showPassword: false,
			});
		} catch (err: any) {
			setError("Network error. Please try again.");
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="mx-auto max-w-lg px-4 py-10">
				<div className="rounded-2xl border bg-white p-6 shadow-sm">
					<h1 className="text-2xl font-semibold tracking-tight">
						Create Admin
					</h1>
					<p className="mt-1 text-sm text-neutral-600">
						Register a new admin account.
					</p>

					<form onSubmit={onSubmit} className="mt-6 space-y-4">
						{/* Full name */}
						<div>
							<label className="mb-1 block text-sm font-medium">
								Full name
							</label>
							<input
								className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
								value={form.fullname}
								onChange={(e) => set("fullname", e.target.value)}
								placeholder="Jane Doe"
								required
							/>
						</div>

						{/* Email */}
						<div>
							<label className="mb-1 block text-sm font-medium">Email</label>
							<input
								type="email"
								className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
								value={form.email}
								onChange={(e) => set("email", e.target.value)}
								placeholder="jane@company.com"
								required
							/>
						</div>

						{/* Phone */}
						<div>
							<label className="mb-1 block text-sm font-medium">Phone</label>
							<input
								inputMode="tel"
								className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
								value={form.phone}
								onChange={(e) =>
									set("phone", e.target.value.replace(/[^\d+]/g, ""))
								}
								placeholder="+91XXXXXXXXXX"
								required
							/>
						</div>

						{/* Password */}
						<div>
							<label className="mb-1 block text-sm font-medium">Password</label>
							<div className="flex items-center gap-2">
								<input
									type={form.showPassword ? "text" : "password"}
									className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
									value={form.password}
									onChange={(e) => set("password", e.target.value)}
									placeholder="Min 8 characters"
									required
								/>
								<button
									type="button"
									className="select-none rounded-lg border px-3 py-2 text-sm"
									onClick={() => set("showPassword", !form.showPassword)}>
									{form.showPassword ? "Hide" : "Show"}
								</button>
							</div>
						</div>

						{/* Role */}
						<div>
							<label className="mb-1 block text-sm font-medium">Role</label>
							<select
								className="w-full rounded-xl border bg-white px-3 py-2 outline-none focus:ring"
								value={form.role}
								onChange={(e) => set("role", e.target.value as any)}>
								<option value="DATA_ENTRY">Data Entry</option>
								<option value="FINANCE">Financial Admin</option>
								<option value="COMMAND">Command Admin</option>
								<option value="SUPER">Super Admin</option>
								<option value="ROOT">Root (break-glass)</option>
							</select>
							<p className="mt-1 text-xs text-neutral-500">
								Choose carefully. ROOT/SUPER should be rare.
							</p>
						</div>

						{/* Invite code (optional) */}
						{process.env.NEXT_PUBLIC_REQUIRE_ADMIN_INVITE === "1" && (
							<div>
								<label className="mb-1 block text-sm font-medium">
									Invite Code
								</label>
								<input
									className="w-full rounded-xl border px-3 py-2 outline-none focus:ring"
									value={form.inviteCode}
									onChange={(e) => set("inviteCode", e.target.value)}
									placeholder="Enter invite code"
								/>
							</div>
						)}

						{error && (
							<div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
								{error}
							</div>
						)}

						<button
							disabled={loading}
							className="w-full rounded-xl border bg-neutral-900 px-4 py-2 text-white hover:bg-neutral-800 disabled:opacity-60">
							{loading ? "Creating…" : "Create Admin"}
						</button>
					</form>

					<p className="mt-4 text-center text-xs text-neutral-500">
						By creating an admin account, you agree to internal policies.
					</p>
				</div>
			</div>
		</div>
	);
}
