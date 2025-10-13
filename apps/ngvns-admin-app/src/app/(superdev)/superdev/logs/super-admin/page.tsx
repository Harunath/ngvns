// /app/super-admin/logs/super-admin/page.tsx
import SuperAdminLogs from "../../../../../components/common/logs/roles/SuperAdminLogs";

export default function Page() {
	return (
		<div className="p-4 md:p-6">
			<SuperAdminLogs endpoint="superdev" />
		</div>
	);
}
