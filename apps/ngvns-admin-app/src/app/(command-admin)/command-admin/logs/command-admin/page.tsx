import CommandAdminLogs from "../../../../../components/common/logs/roles/CommandAdminLogs";

export default function Page() {
	return (
		<div className="p-4 md:p-6">
			<CommandAdminLogs endpoint="command-admin" />
		</div>
	);
}
