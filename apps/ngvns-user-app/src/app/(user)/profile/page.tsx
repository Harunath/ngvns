import React from "react";
import dynamic from "next/dynamic";

const ProfileClient = dynamic(
	() => import("../../../components/user/profile/ProfileClient")
);

export default function Page() {
	return (
		<div className="min-h-screen bg-gray-50">
			<ProfileClient />
		</div>
	);
}
