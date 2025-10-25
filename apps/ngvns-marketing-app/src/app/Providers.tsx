"use client";
import { SessionProvider } from "next-auth/react";
import React, { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS

const Providers = ({ children }: { children: ReactNode }) => {
	return (
		<div className="text-neutral-950 bg-neutral-200">
			<ToastContainer
				position="top-right"
				autoClose={2000} // Close after 5 seconds
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme="light" // Options: 'light', 'dark', 'colored'
			/>
			<SessionProvider>{children}</SessionProvider>
		</div>
	);
};

export default Providers;
