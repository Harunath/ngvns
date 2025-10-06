"use client";
import { signOut } from "next-auth/react";

function DirectLogout() {
	signOut({ callbackUrl: "/login" });
	return <div>Logging out...</div>;
}

export default DirectLogout;
