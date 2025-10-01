"use client";

import * as React from "react";
import { toast } from "react-toastify";

type State = {
	currentPassword: string;
	newPassword: string;
	confirmPassword: string;
	loading: boolean;
	error: string | null;
	success: string | null;
};

export default function ChangePasswordForm() {
	const [state, setState] = React.useState<State>({
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
		loading: false,
		error: null,
		success: null,
	});

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setState((s) => ({ ...s, error: null, success: null }));

		// simple client-side guard
		if (
			!state.currentPassword ||
			!state.newPassword ||
			!state.confirmPassword
		) {
			setState((s) => ({ ...s, error: "All fields are required." }));
			return;
		}
		if (state.newPassword !== state.confirmPassword) {
			setState((s) => ({
				...s,
				error: "New password and confirm do not match.",
			}));
			return;
		}
		if (state.newPassword.length < 8) {
			setState((s) => ({
				...s,
				error: "New password must be at least 8 characters.",
			}));
			return;
		}

		setState((s) => ({ ...s, loading: true }));
		try {
			const res = await fetch("/api/user/settings/change-password", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					currentPassword: state.currentPassword,
					newPassword: state.newPassword,
				}),
			});

			const data = await res.json();
			if (!res.ok) {
				throw new Error(data?.error ?? "Something went wrong");
			}
			toast.success("Password updated successfully.");
			setState({
				currentPassword: "",
				newPassword: "",
				confirmPassword: "",
				loading: false,
				error: null,
				success: "Password updated successfully.",
			});
		} catch (err: any) {
			setState((s) => ({
				...s,
				loading: false,
				error: err?.message ?? "Failed to update password.",
			}));
		}
	}

	return (
		<form onSubmit={onSubmit} className="space-y-4">
			{state.error && (
				<div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
					{state.error}
				</div>
			)}
			{state.success && (
				<div className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
					{state.success}
				</div>
			)}

			<div className="space-y-1">
				<label className="block text-sm font-medium">Current password</label>
				<input
					type="password"
					className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
					value={state.currentPassword}
					onChange={(e) =>
						setState((s) => ({ ...s, currentPassword: e.target.value }))
					}
					autoComplete="current-password"
					required
				/>
			</div>

			<div className="space-y-1">
				<label className="block text-sm font-medium">New password</label>
				<input
					type="password"
					className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
					value={state.newPassword}
					onChange={(e) =>
						setState((s) => ({ ...s, newPassword: e.target.value }))
					}
					autoComplete="new-password"
					required
					minLength={8}
				/>
				<p className="text-xs text-gray-500">Use at least 8 characters.</p>
			</div>

			<div className="space-y-1">
				<label className="block text-sm font-medium">
					Confirm new password
				</label>
				<input
					type="password"
					className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-emerald-500"
					value={state.confirmPassword}
					onChange={(e) =>
						setState((s) => ({ ...s, confirmPassword: e.target.value }))
					}
					autoComplete="new-password"
					required
				/>
			</div>

			<button
				type="submit"
				disabled={state.loading}
				className="inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-white hover:bg-emerald-700 disabled:opacity-60">
				{state.loading ? "Updating..." : "Update Password"}
			</button>
		</form>
	);
}
