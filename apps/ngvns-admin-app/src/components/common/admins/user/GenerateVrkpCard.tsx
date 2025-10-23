"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface GenerateVrkpCardProps {
	userId: string;
	role: "super-admin" | "command-admin";
}

const GenerateVrkpCard = ({ userId, role }: GenerateVrkpCardProps) => {
	const router = useRouter();
	const [loading, setLoading] = React.useState(false);
	if (role !== "super-admin" && role !== "command-admin") {
		router.push("/");
		return <div>You do not have permission to generate VRKP Cards.</div>;
	}
	const handleGenerateCard = async () => {
		try {
			setLoading(true);
			const response = await fetch(`/api/${role}/users/vrkp-card`, {
				method: "POST",
				body: JSON.stringify({ userId }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await response.json();
			if (response.ok) {
				toast.success("VRKP Card generated successfully: " + data.publicUrl);
				router.refresh();
			} else {
				toast.error("Error generating VRKP Card: " + data.error);
			}
		} catch (error) {
			console.error("Error:", error);
			alert("An unexpected error occurred.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			<button
				className=" px-2 py-1 border rounded bg-blue-500 text-neutral-100 hover:bg-blue-600"
				onClick={handleGenerateCard}>
				{loading ? "Generating..." : "Generate VRKP Card"}
			</button>
		</div>
	);
};

export default GenerateVrkpCard;
