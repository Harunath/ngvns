import FinanceAdminLogs from "../../../../../components/common/logs/roles/FinanceAdminLogs";

export default function Page() {
	return (
		<div className="p-4 md:p-6">
			<FinanceAdminLogs endpoint="super-admin" />
		</div>
	);
}
