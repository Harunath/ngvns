import prisma, { MarketingRole } from "@ngvns2025/db/client";
import Link from "next/link";
import React from "react";

const page = async ({
	params,
}: {
	params: Promise<{ marketing_team_id: string }>;
}) => {
	const { marketing_team_id: marketingTeamId } = await params;
	if (!marketingTeamId) {
		return <div>Invalid Marketing Team ID</div>;
	}
	const marketingTeam = await prisma.marketingTeam.findUnique({
		where: { id: marketingTeamId },
		include: {
			members: {
				where: { role: MarketingRole.MANAGER },
				select: {
					id: true,
					role: true,
					userId: true,
					user: { select: { id: true, fullname: true, email: true } },
				},
			},
		},
	});

	return (
		<div>
			Adding a Marketing Team
			<Link
				href={`/super-admin/marketing-teams/${marketingTeamId}/add-manager`}
				className=" border px-4 py-2 rounded bg-blue-500 text-white">
				Add Manager
			</Link>
			{marketingTeam ? (
				<div>
					<h1>Marketing Team ID: {marketingTeam.id}</h1>
					{marketingTeam.members.length > 0 ? (
						<ul>
							{marketingTeam.members.map((member) => (
								<li key={member.id}>
									Manager User ID: {member.userId}
									<br />
									Full Name: {member.user.fullname}
									<br />
									Email: {member.user.email}
								</li>
							))}
						</ul>
					) : (
						<p>No managers found for this marketing team.</p>
					)}
				</div>
			) : (
				<div>Marketing Team not found</div>
			)}
		</div>
	);
};

export default page;
