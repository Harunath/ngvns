import prisma from "@ngvns2025/db/client";
import Link from "next/link";
import React from "react";

const page = async () => {
	const teams = await prisma.marketingTeam.findMany({
		select: {
			id: true,
			name: true,
			description: true,
		},
	});
	return (
		<div className="p-4 min-w-xl w-full h-full bg-neutral-100 ">
			<h2>Marketing Teams ({teams.length})</h2>
			<Link href="/super-admin/marketing-teams/add" className="btn-primary">
				Add New Marketing Team
			</Link>
			<hr className="my-4" />
			{teams.map((team) => (
				<div key={team.id} className="p-4 m-2 border rounded">
					<Link
						href={`/super-admin/marketing-teams/${team.id}`}
						key={team.id}
						className="block p-4 mb-2 bg-white rounded shadow hover:bg-gray-50">
						<h2 className="text-lg font-bold">{team.name}</h2>
						<p className="text-sm text-gray-600">ID: {team.id}</p>
						<p className="text-sm text-gray-600">
							Description: {team.description}
						</p>
					</Link>
				</div>
			))}
		</div>
	);
};

export default page;
