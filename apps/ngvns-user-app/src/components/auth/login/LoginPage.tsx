"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export default function LoginWithPhone() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const { status, data } = useSession();

	const [phone, setPhone] = useState("");
	const [password, setPassword] = useState("");
	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// If already authenticated, bounce to dashboard
	useEffect(() => {
		if (status === "authenticated" && data?.user) {
			router.replace("/dashboard");
		}
	}, [status, data?.user, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);

		if (!phone.trim() || !password) {
			setError("Please enter your phone and password.");
			return;
		}

		setSubmitting(true);
		try {
			// Optional: support callbackUrl from query (?callbackUrl=/somewhere)
			const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

			const res = await signIn("credentials", {
				redirect: false,
				phone: phone.trim(),
				password,
				callbackUrl,
			});

			if (!res) {
				setError("Unexpected error. Please try again.");
			} else if (res.error) {
				setError(res.error || "Invalid credentials.");
			} else if (res.ok) {
				// If NextAuth gave us a URL, prefer it; else go to dashboard
				router.replace(res.url || callbackUrl);
			}
		} catch (err) {
			setError("Something went wrong. Please try again.");
		} finally {
			setSubmitting(false);
		}
	};

	// Prevent form flash when session is already loading/valid
	if (status === "authenticated") return null;

	return (
		<div className="min-h-[70vh] flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="rounded-2xl border border-gray-200 shadow-sm p-6 bg-white">
					<header className="mb-6">
						<h1 className="text-2xl font-semibold tracking-tight">
							Welcome back
						</h1>
						<p className="mt-1 text-sm text-gray-500">
							Sign in with your phone number and password.
						</p>
					</header>

					{error && (
						<div className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label
								htmlFor="phone"
								className="block text-sm font-medium text-gray-700">
								Phone
							</label>
							<input
								id="phone"
								name="phone"
								type="tel"
								inputMode="tel"
								autoComplete="tel"
								placeholder="e.g. 9876543210"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-gray-900"
							/>
						</div>

						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700">
								Password
							</label>
							<input
								id="password"
								name="password"
								type="password"
								autoComplete="current-password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="mt-1 block w-full rounded-xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-gray-900"
							/>
						</div>

						<button
							type="submit"
							disabled={submitting}
							className="w-full rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-70">
							{submitting ? "Signing in..." : "Sign in"}
						</button>
					</form>

					<div className="mt-6 flex items-center justify-between text-sm">
						<Link
							href="/join"
							className="font-medium text-gray-900 hover:underline">
							Become a member
						</Link>
						{/* <a
							href="/forgot-password"
							className="text-gray-500 hover:text-gray-900 hover:underline">
							Forgot password?
						</a> */}
					</div>
				</div>

				{/* <p className="mt-4 text-center text-xs text-gray-500">
					By continuing, you agree to our{" "}
					<a href="/terms" className="underline hover:text-gray-900">
						Terms
					</a>{" "}
					&{" "}
					<a href="/privacy" className="underline hover:text-gray-900">
						Privacy Policy
					</a>
					.
				</p> */}
			</div>
		</div>
	);
}
