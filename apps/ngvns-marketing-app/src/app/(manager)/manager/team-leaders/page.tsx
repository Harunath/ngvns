import prisma, { MarketingRole } from "@ngvns2025/db/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { authOptions } from "../../../../lib/auth/auth";
import Link from "next/link";

const page = async () => {
	const session = await getServerSession(authOptions);
	if (
		!session?.user?.id ||
		!session.user.role ||
		session.user.role !== MarketingRole.MANAGER ||
		!session?.user.teamId
	) {
		redirect("/logout");
		return <div>Forbidden </div>;
	}
	const team_leaders = await prisma.marketingMember.findMany({
		where: {
			role: MarketingRole.TEAM_LEADER,
			teamId: session.user.teamId,
		},
		select: {
			id: true,
			userId: true,
			user: { select: { id: true, fullname: true, email: true } },
		},
		orderBy: { createdAt: "desc" },
		take: 5,
	});

	return (
		<div className="p-4 min-w-xl w-full h-full bg-neutral-100 ">
			<h2>
				team_leaders ({team_leaders.length})
				<Link
					href={"/manager/team-leaders/create"}
					className="ml-4 text-sm text-blue-600 underline">
					Add New TL
				</Link>
			</h2>
			{team_leaders.length > 0 ? (
				team_leaders.map((team_leader) => (
					<div key={team_leader.id} className="p-4 m-2 border rounded">
						<h2 className="text-lg font-bold">{team_leader.user.fullname}</h2>
						<p className="text-sm text-gray-600">
							Email: {team_leader.user.email}
						</p>
						<p className="text-sm text-gray-600">ID: {team_leader.user.id}</p>
					</div>
				))
			) : (
				<p>No team leaders found.</p>
			)}
		</div>
	);
};

export default page;
