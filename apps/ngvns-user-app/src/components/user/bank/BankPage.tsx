import React from "react";
import { authOptions } from "../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@ngvns2025/db/client";
import Link from "next/link";

const BankPage = async () => {
	const session = await getServerSession(authOptions);
	if (!session || !session.user) {
		redirect("/logout");
	}
	const accounts = await prisma.bankDetails.findMany({
		where: { userId: session.user.id },
		orderBy: { createdAt: "desc" },
	});
	return (
		<div className="p-6 bg-neutral-100 rounded-lg shadow-md">
			<div className="flex items-center justify-between px-2">
				<h2 className="text-xl font-semibold mb-4">Bank Accounts</h2>
				{accounts.length === 0 ? (
					<Link href="/profile/bank-details/add">Add</Link>
				) : (
					<Link href="/profile/bank-details" className="text-gray-600">
						View
					</Link>
				)}
			</div>
			<ul className=" border p-2 rounded">
				{accounts.length === 0 ? (
					<div className="py-2 px-1 text-gray-600">No bank accounts found.</div>
				) : (
					accounts.map((acc) => (
						<Link
							href={`/profile/bank-details/${acc.id}`}
							key={acc.id}
							className="py-2 px-1 border-b last:border-0">
							<li key={acc.id}>
								{acc.accountHolderName} - {acc.bankName} - {acc.accountType} -{" "}
								{acc.createdAt.toDateString()}
							</li>
						</Link>
					))
				)}
			</ul>
		</div>
	);
};

export default BankPage;
