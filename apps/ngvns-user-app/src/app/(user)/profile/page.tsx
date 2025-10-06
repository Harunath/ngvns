import React from "react";
import dynamic from "next/dynamic";
import { authOptions } from "../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import prisma from "@ngvns2025/db/client";
import Referral from "../../../components/user/profile/referral/Referral";

const ProfileClient = dynamic(
	() => import("../../../components/user/profile/ProfileClient")
);

export default async function Page() {
	const session = await getServerSession(authOptions);
	if (!session) redirect("/logout");
	const user = await prisma.user.findUnique({
		where: { id: session.user.id },
		select: { id: true, address: true },
	});
	if (!user) redirect("/logout");
	return (
		<div className="min-h-screen bg-neutral-100 px-4 py-10">
			<div className="mx-auto w-full max-w-3xl">
				<header className="text-center">
					<h1 className="text-2xl font-semibold text-gray-900">
						{session.user.fullname}&apos;s Profile
					</h1>
					<div className="mx-auto mt-3 grid max-w-xs grid-cols-3 gap-1">
						<div className="h-1 rounded bg-[#FF9933]" />
						<div className="h-1 rounded bg-[#0b5ba7]" />
						<div className="h-1 rounded bg-[#138808]" />
					</div>
				</header>
				<ProfileClient />
				<div className="mx-auto max-w-3xl px-6 py-10">
					<h2 className="mt-6 text-2xl font-semibold text-gray-800">
						Your Address:{" "}
						{user.address ? user.address.addressLine : "Not Provided"}
					</h2>
				</div>
				<Referral />
			</div>
		</div>
	);
}
