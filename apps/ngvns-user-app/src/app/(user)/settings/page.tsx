import Link from "next/link";
import React from "react";
import { FaAngleRight } from "react-icons/fa";

const page = () => {
	return (
		<div className="mx-auto max-w-lg px-4 py-10">
			<h1 className="text-2xl font-semibold">Settings</h1>
			<p className="mt-2 text-sm text-gray-600">
				Manage your account settings.
			</p>
			<div className="mt-8 space-y-6">
				{/* Other settings components can go here */}
				<div className="flex items-center justify-start rounded-md">
					<FaAngleRight />
					<Link
						href="/settings/password"
						className="text-emerald-600 hover:underline">
						Change Password
					</Link>
				</div>
			</div>
		</div>
	);
};

export default page;
