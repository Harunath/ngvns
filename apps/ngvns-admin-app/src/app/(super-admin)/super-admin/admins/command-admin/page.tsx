import prisma, { AdminRole } from "@ngvns2025/db/client";
import React from "react";

const page = async () => {
	const commandAdmins = await prisma.admin.findMany({
		where: { role: AdminRole.COMMAND },
		select: {
			id: true,
			fullname: true,
			email: true,
			phone: true,
			auditLogs: {
				select: {
					id: true,
					action: true,
					createdAt: true,
				},
				orderBy: { createdAt: "desc" },
				take: 5,
			},
		},
	});
	if (!commandAdmins.length) return <div>No command admins found</div>;
	return (
		<div className="p-4 min-w-xl w-full h-full bg-neutral-100 ">
			<h2>Command Admins ({commandAdmins.length})</h2>
			{commandAdmins.map((admin) => (
				<div key={admin.id} className="p-4 m-2 border rounded">
					<h2 className="text-lg font-bold">{admin.fullname}</h2>
					<p className="text-sm text-gray-600">Email: {admin.email}</p>
					<p className="text-sm text-gray-600">ID: {admin.id}</p>
					<div>
						<h3 className="mt-4 font-semibold">Recent Audit Logs:</h3>
						{admin.auditLogs.length === 0 ? (
							<p className="text-sm text-gray-500">No recent logs.</p>
						) : (
							<ul className="list-disc list-inside">
								{admin.auditLogs.map((log) => (
									<li key={log.id} className="text-sm text-gray-700">
										<span className="font-mono">{log.action}</span> -{" "}
										<span className="text-xs text-gray-500">
											{new Date(log.createdAt).toLocaleString()}
										</span>
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			))}
		</div>
	);
};

export default page;
