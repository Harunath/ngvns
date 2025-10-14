import React from "react";
import { authOptions } from "../../../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";

async function page() {
	const session = await getServerSession(authOptions);
	if (!session) {
		redirect("logout");
	}
	return (
		<div className="p-4 min-w-xl w-full h-full bg-neutral-100 ">
			<div className=" flex justify-between">
				{" "}
				<h2>{session.user?.fullname + " " + session.user.role} Profile</h2>{" "}
				<Link
					href="/logout"
					className="px-2 py-1 text-white bg-red-400 rounded-xl">
					Logout
				</Link>
			</div>
			<div className="p-4 border rounded bg-neutral-100 my-4 space-y-2">
				<p>Name : {session.user.fullname}</p>
				<p>Email: {session.user?.email}</p>
				<p>Phone: {session.user?.phone}</p>
				<p>Role: {session.user?.role}</p>
			</div>
		</div>
	);
}

export default page;
