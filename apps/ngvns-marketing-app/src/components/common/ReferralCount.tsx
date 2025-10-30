import React from "react";
import { authOptions } from "../../lib/auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@ngvns2025/db/client";

const ReferralCount = async () => {
	const session = await getServerSession(authOptions);
	if (!session || !session.user || !session.user.role) {
		redirect("/logout");
	}
	const count = await prisma.marketingMember.findUnique({
		where: { id: session.user.marketingMemberId },
		select: {
			_count: {
				select: {
					AcquiredUsers: true,
				},
			},
		},
	});
	return (
		<div className=" flex items-center justify-center border bg-neutral-50 min-w-3xs p-4 m-4 rounded-md text-lg font-medium">
			Referred Users Count:
			<span className="ml-2 text-blue-600 text-xl font-extrabold">
				{count?._count.AcquiredUsers ?? 0}
			</span>
		</div>
	);
};

export default ReferralCount;
