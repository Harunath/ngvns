// /components/logs/roles/SuperAdminLogs.tsx
"use client";
import DynamicLogs from "../DynamicLogs";
export default function SuperAdminLogs({ endpoint }: { endpoint: string }) {
	if (!["super-admin", "superdev"].includes(endpoint)) {
		throw new Error("Invalid endpoint for SuperAdminLogs");
	}
	return (
		<DynamicLogs
			title="Super Admin Logs"
			endpoint={`/api/${endpoint}/logs/super-admin`}
			// baseQuery can include target role if needed: { role: "command-admin" }
			initialLimit={20}
		/>
	);
}
