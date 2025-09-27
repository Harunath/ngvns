import React from "react";
import { authOptions } from "../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import Referral from "../../../components/user/profile/referral/Referral";
import Logout from "../../../components/auth/Logout";

const page = async () => {
	const session = await getServerSession(authOptions);

	return (
		<div>
			<h1>Dashboard</h1>
			<div>
				{session ? (
					<div>
						<p>Welcome, {session.user?.name}</p>
						<p>Email: {session.user?.email}</p>
						<p>Phone: {session.user?.phone}</p>
						<Referral />
						<Logout />
					</div>
				) : (
					<p>You are not logged in.</p>
				)}
			</div>
		</div>
	);
};

export default page;
