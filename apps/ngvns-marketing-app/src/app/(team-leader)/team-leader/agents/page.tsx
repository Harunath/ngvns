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
		session.user.role !== MarketingRole.TEAM_LEADER ||
		!session?.user.teamId
	) {
		redirect("/logout");
		return <div>Forbidden </div>;
	}
	const executives = await prisma.marketingMember.findMany({
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

	return (
		<div className="p-4 min-w-xl w-full h-full bg-neutral-100 ">
			<h2>
				Executives ({executives.length})
				<Link
					href={"/team-leader/agents/create"}
					className="ml-4 text-sm text-blue-600 underline">
					Add New Executive
				</Link>
			</h2>
			{executives.length > 0 ? (
				executives.map((exe) => (
					<div key={exe.id} className="p-4 m-2 border rounded">
						<h2 className="text-lg font-bold">{exe.user.fullname}</h2>
						<p className="text-sm text-gray-600">Email: {exe.user.email}</p>
						<p className="text-sm text-gray-600">ID: {exe.user.id}</p>
					</div>
				))
			) : (
				<p>No Executives found.</p>
			)}
		</div>
	);
};

export default page;
