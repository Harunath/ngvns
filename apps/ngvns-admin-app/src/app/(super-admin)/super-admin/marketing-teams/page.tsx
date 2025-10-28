// app/super-admin/marketing-teams/page.tsx
import prisma from "@ngvns2025/db/client";
import Link from "next/link";
// import { ArrowRight } from "";
import { FaArrowRight } from "react-icons/fa";

export const revalidate = 300; // revalidate every 5 minutes

export default async function MarketingTeamsPage() {
	const teams = await prisma.marketingTeam.findMany({
		select: {
			id: true,
			name: true,
			description: true,
			details: true,
		},
	});

	return (
		<div className="min-h-screen w-full bg-neutral-50 px-6 py-10">
			<div className="mx-auto max-w-6xl">
				<div className="flex items-center justify-between mb-8">
					<h1 className="text-2xl font-bold text-gray-800">
						Marketing Teams ({teams.length})
					</h1>
					<Link
						href="/super-admin/marketing-teams/add"
						className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-all">
						+ Add New Team
					</Link>
				</div>

				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
					{teams.map((team) => {
						const details =
							typeof team.details === "object"
								? team.details
								: JSON.parse(String(team.details || "{}"));

						return (
							<Link
								key={team.id}
								href={`/super-admin/marketing-teams/${team.id}`}
								className="group rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-all">
								<div className="flex items-center justify-between">
									<h2 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
										{team.name}
									</h2>
									<FaArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition" />
								</div>

								<p className="mt-2 text-sm text-gray-600">
									{team.description || "No description provided."}
								</p>

								{/* Details JSON */}
								{details && (
									<div className="mt-4 space-y-1 text-sm">
										{details.Area && (
											<p>
												<span className="font-medium text-gray-800">Area:</span>{" "}
												{details.Area}
											</p>
										)}
										{details.Head && (
											<p>
												<span className="font-medium text-gray-800">Head:</span>{" "}
												{details.Head}
											</p>
										)}
										{details["Other info"] && (
											<p className="text-gray-700 italic">
												{details["Other info"]}
											</p>
										)}
									</div>
								)}

								<p className="mt-4 text-xs text-gray-400 break-all">
									ID: {team.id}
								</p>
							</Link>
						);
					})}
				</div>
			</div>
		</div>
	);
}
