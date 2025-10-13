// /components/logs/roles/CommandAdminLogs.tsx
"use client";
import DynamicLogs from "../DynamicLogs";

export default function CommandAdminLogs({ endpoint }: { endpoint: string }) {
	if (!["super-admin", "command-admin", "superdev"].includes(endpoint)) {
		throw new Error("Invalid endpoint for CommandAdminLogs");
	}
	return (
		<DynamicLogs
			title="Command Admin Logs"
			endpoint={`/api/${endpoint}/logs/command-admin`}
			initialLimit={20}
		/>
	);
}
