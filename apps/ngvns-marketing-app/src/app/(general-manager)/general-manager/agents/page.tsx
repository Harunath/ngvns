import prisma, { MarketingRole } from "@ngvns2025/db/client";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { authOptions } from "../../../../lib/auth/auth";

const page = async () => {
	const session = await getServerSession(authOptions);
	if (
		!session?.user?.id ||
		!session.user.role ||
		session.user.role !== MarketingRole.GENERAL_MANAGER ||
		!session?.user.teamId
	) {
		redirect("/logout");
		return <div>Forbidden </div>;
	}
	const agents = await prisma.marketingMember.findMany({
		where: {
			role: MarketingRole.AGENT,
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
	if (!agents.length) return <div>No agents found</div>;
	return (
		<div className="p-4 min-w-xl w-full h-full bg-neutral-100 ">
			<h2>agents ({agents.length})</h2>
			{agents.map((agent) => (
				<div key={agent.id} className="p-4 m-2 border rounded">
					<h2 className="text-lg font-bold">{agent.user.fullname}</h2>
					<p className="text-sm text-gray-600">Email: {agent.user.email}</p>
					<p className="text-sm text-gray-600">ID: {agent.user.id}</p>
				</div>
			))}
		</div>
	);
};

export default page;
