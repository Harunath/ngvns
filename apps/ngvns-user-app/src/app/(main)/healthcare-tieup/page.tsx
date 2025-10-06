// app/healthcare-tieup/page.tsx
import Link from "next/link";

export const metadata = {
	title: "VR Kisan Parivaar × Unity Life Healthcare — Tie-Up",
	description:
		"VR Kisan Parivaar is tied up with Unity Life Healthcare to provide healthcare services and accidental insurance benefits to members.",
};

export default function Page() {
	return (
		<main className="min-h-[100dvh] bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900">
			<section className="mx-auto max-w-5xl px-4 py-12 md:py-16">
				{/* Header / BreadCrumb */}
				<div className="mb-8">
					<Link
						href="/join"
						className="text-sm text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white">
						← Back to Join
					</Link>
				</div>

				{/* Hero */}
				<div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 bg-white/90 dark:bg-slate-950/60 shadow-xl shadow-slate-900/5 p-6 md:p-10">
					<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
						<div>
							<span className="inline-flex items-center gap-2 rounded-full border border-emerald-200/70 bg-emerald-50 px-3 py-1 text-[11px] font-semibold tracking-wide text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-900/20 dark:text-emerald-200">
								Partnership Announcement
							</span>
							<h1 className="mt-3 text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
								VR Kisan Parivaar + Unity Life Healthcare
							</h1>
							<p className="mt-3 max-w-2xl text-lg text-slate-700 dark:text-slate-300">
								We&apos;re happy to share that{" "}
								<strong>VR Kisan Parivaar</strong> is{" "}
								<strong>tied up with Unity Life Healthcare</strong> to provide
								members with dedicated healthcare services and accidental
								insurance benefits.
							</p>
						</div>

						<div className="flex items-center gap-4">
							<a
								href="https://www.unitylifehealthcare.com/"
								target="_blank"
								rel="noopener noreferrer"
								className="inline-flex items-center justify-center rounded-xl border border-[#138808] bg-[#138808] px-4 py-3 text-sm font-medium text-white hover:bg-[#0b5e05] hover:-translate-y-0.5 transition dark:border-[#1aff1a] dark:bg-[#1aff1a] dark:text-slate-900 dark:hover:bg-[#17d117]">
								Visit Unity Life Healthcare
							</a>
						</div>
					</div>

					{/* Benefits */}
					<div className="mt-8 grid gap-6 md:grid-cols-2">
						{/* Card 1 */}
						<div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 p-6">
							<div className="flex items-start gap-4">
								<div className="mt-1 rounded-lg bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200 p-2">
									{/* shield-check icon */}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
										strokeWidth={1.5}>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M12 6.75c-2.438 0-4.5-.938-6-2.25 0 6.563 3.281 11.813 6 12.75 2.719-.938 6-6.188 6-12.75-1.5 1.313-3.563 2.25-6 2.25Z"
										/>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="m9.75 12 1.5 1.5 3-3"
										/>
									</svg>
								</div>
								<div>
									<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
										₹5 Lakhs Personal Accidental Insurance (5 Years)
									</h2>
									<p className="mt-2 text-slate-700 dark:text-slate-300">
										Coverage up to <strong>₹5,00,000/-</strong> in case of an
										accident; <strong>permanent</strong> and{" "}
										<strong>partial disabilities</strong> are also covered for a{" "}
										<strong>5-year</strong> period.
									</p>
								</div>
							</div>
						</div>

						{/* Card 2 */}
						<div className="rounded-xl border border-slate-200/70 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40 p-6">
							<div className="flex items-start gap-4">
								<div className="mt-1 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 p-2">
									{/* stethoscope icon */}
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-6 w-6"
										viewBox="0 0 24 24"
										stroke="currentColor"
										fill="none"
										strokeWidth={1.5}>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											d="M5 3v6a4 4 0 1 0 8 0V3M9 21a4 4 0 0 0 4-4v-2m-8 6a4 4 0 0 1-4-4v-2m16 0h1a3 3 0 1 1 0 6h-1a5 5 0 0 1-5-5v-1"
										/>
									</svg>
								</div>
								<div>
									<h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
										Health Care Services for 3 Years
									</h2>
									<p className="mt-2 text-slate-700 dark:text-slate-300">
										Access partnered healthcare benefits with a{" "}
										<strong>3-year</strong> health care services plan through
										Unity Life Healthcare.
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Notes / Footer */}
					<div className="mt-8 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800 p-5">
						<p className="text-sm text-slate-600 dark:text-slate-400">
							<span className="font-medium">Note:</span> Benefits are provided
							via Unity Life Healthcare. Terms, conditions, and eligibility may
							apply as per the provider/insurer. Please refer to official
							documents for complete details in{" "}
							<a
								href="https://www.unitylifehealthcare.com/legals/terms-and-conditions"
								target="_blank"
								rel="noopener noreferrer"
								className=" text-blue-400 italic hover:underline">
								ULHC
							</a>
							.
						</p>
					</div>
				</div>
			</section>
		</main>
	);
}
