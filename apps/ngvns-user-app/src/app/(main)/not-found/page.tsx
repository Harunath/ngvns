"use client";
import Link from "next/link";
import { FaExclamationTriangle } from "react-icons/fa";

export default function NotFound() {
	return (
		<main className="flex flex-col items-center justify-center min-h-screen bg-white text-slate-800 px-6">
			<FaExclamationTriangle className="text-6xl text-orange-500 mb-6" />
			<h1 className="text-4xl font-bold mb-2">Page Not Found</h1>
			<p className="text-lg text-slate-600 mb-6 text-center max-w-md">
				Sorry, the page you're looking for doesn't exist or has been moved.
			</p>
			<Link
				href="/"
				className="inline-block px-6 py-3 bg-orange-500 text-white rounded-md font-medium hover:bg-orange-600 transition">
				Go to Home
			</Link>
		</main>
	);
}
