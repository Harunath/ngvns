// /components/logs/roles/DataEntryLogs.tsx
"use client";
import DynamicLogs from "../DynamicLogs";
export default function DataEntryLogs({ endpoint }: { endpoint: string }) {
	if (
		![
			"super-admin",
			"command-admin",
			"finance-admin",
			"data-entry",
			"superdev",
		].includes(endpoint)
	) {
		throw new Error("Invalid endpoint for DataEntryLogs");
	}
	return (
		<DynamicLogs
			title="Data Entry Logs"
			endpoint={`/api/${endpoint}/logs/data-entry`}
			initialLimit={20}
		/>
	);
}
