"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";
function Logout() {
	const [loading, setLoading] = useState(false);

	return (
		<button
			className="p-2 text-neutral-300 bg-red-400 hover:text-neutral-800 hover:bg-red-200"
			onClick={() => {
				setLoading(true);
				signOut({ callbackUrl: "/login" });
			}}>
			{loading ? "Signing out..." : "Logout"}
		</button>
	);
}

export default Logout;
