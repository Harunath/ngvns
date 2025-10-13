import DataEntryLogs from "../../../../../components/common/logs/roles/DataEntryLogs";

export default function Page() {
	return (
		<div className="p-4 md:p-6">
			<DataEntryLogs endpoint="command-admin" />
		</div>
	);
}
