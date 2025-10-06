"use client";
import React, { useState } from "react";
import { signOut } from "next-auth/react";

function Logout() {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);

	if (open) {
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center">
				{/* Backdrop */}
				<div
					className="absolute inset-0 bg-neutral-400/60 backdrop-blur-sm"
					onClick={() => setOpen(false)}
				/>
				{/* Modal */}
				<div className="relative bg-white p-6 rounded-lg shadow-lg z-10 w-full max-w-sm">
					<p className="mb-4">Are you sure you want to logout?</p>
					<div className="flex justify-end space-x-4">
						<button
							className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
							onClick={() => setOpen(false)}>
							Cancel
						</button>
						<button
							className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
							onClick={() => {
								setLoading(true);
								signOut({ callbackUrl: "/login" });
							}}>
							{loading ? "Signing out..." : "Logout"}
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<button
			className="mx-auto w-full px-2 py-1 text-neutral-100 bg-red-600 hover:text-neutral-800 hover:bg-red-200 rounded"
			onClick={() => setOpen(true)}>
			{loading ? "Signing out..." : "Logout"}
		</button>
	);
}

export default Logout;
