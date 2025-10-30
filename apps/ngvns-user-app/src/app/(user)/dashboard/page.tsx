import React from "react";
import { authOptions } from "../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import Referral from "../../../components/user/profile/referral/Referral";

const page = async () => {
	const session = await getServerSession(authOptions);

	return (
		<div className="mx-auto max-w-2xl px-4 py-10 bg-neutral-100">
			<div className="flex items-center justify-between">
				<h1 className=" ">Dashboard</h1>
				{/* <Link href="/settings" className="text-emerald-600 hover:underline">
					<FiSettings className="inline ml-1 mb-1" />
				</Link> */}
			</div>
			<div className="mt-6 space-y-4">
				{session ? (
					<div className="space-y-2">
						<p>Welcome, {session.user?.name}</p>
						<p>Email: {session.user?.email}</p>
						<p>Phone: {session.user?.phone}</p>
						<Referral />
					</div>
				) : (
					<p>You are not logged in.</p>
				)}
			</div>
		</div>
	);
};

export default page;
