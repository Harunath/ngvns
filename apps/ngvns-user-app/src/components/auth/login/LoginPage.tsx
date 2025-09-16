// "use client";

// import { useState, useEffect } from "react";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { FcGoogle } from "react-icons/fc";
// import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
// import { useSession } from "next-auth/react";
// import Link from "next/link";
// import Image from "next/image";

// export default function LoginPage() {
// 	const [email, setEmail] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [showPassword, setShowPassword] = useState(false);
// 	const [error, setError] = useState("");
// 	const [loading, setLoading] = useState(false);
// 	const router = useRouter();
// 	const { data: session } = useSession();
// 	useEffect(() => {
// 		setLoading(true);
// 		if (session && session.user) {
// 			const getUser = async () => {
// 				const res = await fetch(`/api/user/${session.user.id}`);
// 				const data = await res.json();
// 				if (data.message == "success") {
// 					if (data.data.registrationCompleted) {
// 						router.push("/");
// 					} else {
// 						router.push("/register");
// 					}
// 				}
// 			};
// 			getUser();
// 		}
// 		setLoading(false);
// 	}, [session]);
// 	const handleGoogleSignIn = async () => {
// 		setLoading(true);
// 		try {
// 			await signIn("google", { callbackUrl: "/" });
// 		} catch (error) {
// 			console.error("Google sign-in failed: ", error);
// 			setError("Google sign-in failed.");
// 		} finally {
// 			setLoading(false);
// 		}
// 	};

// 	const handleCredentialsSignIn = async (e: React.FormEvent) => {
// 		e.preventDefault();
// 		setLoading(true);
// 		setError("");

// 		const result = await signIn("credentials", {
// 			redirect: false,
// 			email,
// 			password,
// 		});

// 		if (result?.error) {
// 			setError(result.error);
// 		} else {
// 			router.push("/");
// 		}
// 		setLoading(false);
// 	};

// 	return (
// 		<div className="flex min-h-screen items-center justify-center bg-slate-100">
// 			<div className="grid grid-cols-1 md:grid-cols-2 max-w-5xl w-full bg-white overflow-hidden border shadow-lg">
// 				<div className="hidden md:block">
// 					<Image
// 						src="https://res.cloudinary.com/dsq4uyqbb/image/upload/v1741761028/ac695890-7f2c-492f-8365-e12189e69fd4_fz9dxr.webp"
// 						alt="Login Visual"
// 						className="h-full w-full object-cover"
// 						width={600}
// 						height={600}
// 					/>
// 				</div>

// 				<div className="p-8 md:p-12 flex flex-col justify-center">
// 					<div className="mb-6">
// 						<h1 className="text-2xl font-bold text-black">
// 							<span className="text-red-600">
// 								Biz
// 								<span className="text-black inline-flex items-center">
// 									-Network<span className="text-sm align-top">®</span>
// 								</span>
// 							</span>
// 						</h1>
// 					</div>

// 					<p className="mb-6 text-slate-600">Please enter your details</p>

// 					{error && <p className="text-red-500 text-sm mb-4">{error}</p>}

// 					<button
// 						onClick={handleGoogleSignIn}
// 						className="w-full flex items-center justify-center gap-2 bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-700 hover:bg-slate-100 mb-4"
// 						disabled={loading}>
// 						<FcGoogle className="text-2xl" />
// 						{loading ? "Signing in..." : "Sign in with Google"}
// 					</button>

// 					<div className="relative my-4 text-center">
// 						<span className="bg-white px-2 text-slate-500 relative z-10">
// 							or
// 						</span>
// 						<div className="absolute inset-0 flex items-center">
// 							<div className="w-full border-t border-slate-300" />
// 						</div>
// 					</div>

// 					<form onSubmit={handleCredentialsSignIn} className="space-y-4">
// 						<input
// 							type="email"
// 							placeholder="Email address"
// 							className="w-full border border-slate-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-red-600"
// 							value={email}
// 							onChange={(e) => setEmail(e.target.value)}
// 							required
// 						/>

// 						<div className="relative">
// 							<input
// 								type={showPassword ? "text" : "password"}
// 								placeholder="Password"
// 								className="w-full border border-slate-300 p-2 rounded-lg focus:outline-none focus:ring focus:ring-red-600"
// 								value={password}
// 								onChange={(e) => setPassword(e.target.value)}
// 								required
// 							/>
// 							<button
// 								type="button"
// 								onClick={() => setShowPassword(!showPassword)}
// 								className="absolute inset-y-0 right-3 flex items-center text-red-600">
// 								{showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
// 							</button>
// 						</div>

// 						<button
// 							type="submit"
// 							className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-200"
// 							disabled={loading}>
// 							{loading ? "Signing in..." : "Sign in"}
// 						</button>
// 					</form>
// 					<p className=" text-xs mt-2">
// 						Don&apos;t have an account?{" "}
// 						<Link className=" text-green-500 font-medium" href="/register">
// 							Sign up
// 						</Link>
// 					</p>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

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
						<a
							href="/join"
							className="font-medium text-gray-900 hover:underline">
							Become a member
						</a>
						<a
							href="/forgot-password"
							className="text-gray-500 hover:text-gray-900 hover:underline">
							Forgot password?
						</a>
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
