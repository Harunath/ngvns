// /components/logs/roles/FinanceAdminLogs.tsx
"use client";
import DynamicLogs from "../DynamicLogs";
export default function FinanceAdminLogs({ endpoint }: { endpoint: string }) {
	if (
		!["super-admin", "finance-admin", "superdev", "command-admin"].includes(
			endpoint
		)
	) {
		throw new Error("Invalid endpoint for FinanceAdminLogs");
	}
	return (
		<DynamicLogs
			title="Finance Admin Logs"
			endpoint={`/api/${endpoint}/logs/finance-admin`}
			initialLimit={20}
		/>
	);
}
