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
		session.user.role !== MarketingRole.GENERAL_MANAGER ||
		!session?.user.teamId
	) {
		redirect("/logout");
		return <div>Forbidden </div>;
	}
	const managers = await prisma.marketingMember.findMany({
		where: {
			role: MarketingRole.MANAGER,
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
				Managers ({managers.length})
				<Link
					href={"/general-manager/managers/create"}
					className="ml-4 text-sm text-blue-600 underline">
					Add New Manager
				</Link>
			</h2>
			{managers.length > 0 ? (
				managers.map((manager) => (
					<div key={manager.id} className="p-4 m-2 border rounded">
						<h2 className="text-lg font-bold">{manager.user.fullname}</h2>
						<p className="text-sm text-gray-600">Email: {manager.user.email}</p>
						<p className="text-sm text-gray-600">ID: {manager.user.id}</p>
					</div>
				))
			) : (
				<div>No Managers found</div>
			)}
		</div>
	);
};

export default page;
