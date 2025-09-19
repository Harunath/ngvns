import React from "react";
import Link from "next/link";
import PaymentButton from "../../../../components/auth/register/PaymentButton";

export default function Page() {
	return (
		<main className="min-h-[100dvh] bg-neutral-950 text-white">
			{/* background glow */}
			<div
				aria-hidden
				className="pointer-events-none absolute inset-0 -z-10"
				style={{
					background: `
            radial-gradient(800px 500px at 20% 10%, rgba(34,197,94,0.25), transparent 70%),
            radial-gradient(900px 600px at 80% 90%, rgba(59,130,246,0.25), transparent 70%)
          `,
					filter: "blur(60px)",
				}}
			/>

			<header className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 font-bold">
							<span>VR</span>
						</div>
						<div>
							<p className="text-xs uppercase tracking-widest text-emerald-300">
								VR KISAN PARIVAAR
							</p>
							<h1 className="text-lg font-semibold tracking-tight">
								Membership Checkout
							</h1>
						</div>
					</div>

					<p className="hidden text-sm text-white/70 sm:block">
						Secure &amp; encrypted checkout
					</p>
				</div>
			</header>

			<section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
				<div className="grid gap-6 lg:grid-cols-3">
					{/* Summary / Plan */}
					<div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)_inset] lg:col-span-2">
						<h2 className="mb-4 text-xl font-semibold tracking-tight">
							VR KISAN PARIVAAR Membership Summary
						</h2>

						<div className="mb-6 grid gap-4 sm:grid-cols-2">
							<div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
								<p className="text-sm text-white/70">Amount</p>
								<p className="mt-1 text-3xl font-bold">₹ 4,999</p>
								<p className="ml-1 align-middle text-sm font-medium text-white/60">
									(+ GST 5% = ₹ 249.95)
								</p>
								<p className="mt-1 align-middle text-sm font-medium text-white/60">
									Total ₹ 5,248.95
								</p>
							</div>

							<div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
								<p className="text-sm text-white/70">Plan</p>
								<p className="mt-1 text-lg font-semibold">VR KISAN PARIVAAR</p>
								<p className="mt-1 text-sm text-white/70">One-time payment</p>
							</div>
						</div>

						<div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
							<p className="mb-3 text-sm font-semibold uppercase tracking-wider text-white/70">
								What you get
							</p>
							<ul className="grid gap-2 sm:grid-cols-2">
								<li className="flex items-start gap-2">
									<span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
									<span className="text-sm text-white/90">
										Member-only updates &amp; early access to programs
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
									<span className="text-sm text-white/90">
										Event invitations &amp; community networking
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
									<span className="text-sm text-white/90">
										Exclusive resources &amp; guidance
									</span>
								</li>
								<li className="flex items-start gap-2">
									<span className="mt-1 inline-block h-2 w-2 rounded-full bg-emerald-400" />
									<span className="text-sm text-white/90">
										Priority support for members
									</span>
								</li>
							</ul>
						</div>
					</div>

					{/* CTA / Next Step */}
					<aside className="rounded-2xl border border-white/10 bg-white/[0.05] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.05)_inset]">
						<h3 className="text-lg font-semibold tracking-tight">Next step</h3>
						<p className="mt-1 text-sm text-white/70">
							Review the amount and proceed to the payment gateway.
						</p>

						<div className="mt-6 space-y-3">
							<div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
								<span className="text-sm text-white/70">Total</span>
								<span className="text-xl font-bold">₹ 5,248.95</span>
							</div>

							{/* Replace the Link href with your payment initiation route when ready */}
							<PaymentButton />

							<p className="text-xs leading-5 text-white/60">
								By continuing, you agree to our{" "}
								<Link
									href="/legals/terms-and-conditions"
									className="underline decoration-white/30 underline-offset-2">
									Terms
								</Link>{" "}
								and{" "}
								<Link
									href="/legals/privacy-policy"
									className="underline decoration-white/30 underline-offset-2">
									Privacy Policy
								</Link>
								.
							</p>
						</div>

						<div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4">
							<p className="text-xs text-white/70">
								Need help? Email{" "}
								<a
									href="mailto:support@vrkisanparivaar.com"
									className="font-medium text-white underline decoration-white/30 underline-offset-2">
									support@vrkisanparivaar.com
								</a>
							</p>
							<p className="mt-2 text-[11px] text-white/50">
								Payments are processed by a secure PCI-DSS compliant provider.
							</p>
						</div>
					</aside>
				</div>

				{/* Trust row */}
				<div className="mx-auto mt-10 grid max-w-6xl gap-3 sm:grid-cols-3">
					<div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-white/80">
						256-bit SSL Encryption
					</div>
					<div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-white/80">
						No hidden fees
					</div>
					<div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center text-sm text-white/80">
						Instant confirmation
					</div>
				</div>
			</section>
		</main>
	);
}
