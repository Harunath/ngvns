"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthButton() {
	const { data: session, status } = useSession();
	const router = useRouter();

	const handleClick = () => {
		if (session?.user) {
			router.push("/dashboard");
		} else {
			router.push("/login");
		}
	};

	// While checking, avoid flicker
	if (status === "loading") {
		return (
			<button
				disabled
				className="rounded-lg bg-gray-300 px-4 py-2 text-sm text-gray-600 cursor-not-allowed">
				Loading...
			</button>
		);
	}

	return (
		<button
			onClick={handleClick}
			className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-black">
			{session?.user ? "Go to Dashboard" : "Login"}
		</button>
	);
}
