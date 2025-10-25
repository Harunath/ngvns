import { FiFileText, FiUsers, FiShield, FiSettings } from "react-icons/fi";
import SideNav from "./SideNav";

const A_SideNav = () => {
	return (
		<div>
			<SideNav
				title="Command Admin"
				sections={[
					{
						id: "logs",
						label: "Logs",
						icon: <FiFileText className="h-4 w-4" />,
						items: [
							{
								label: "Command Admin Logs",
								href: "/command-admin/logs/command-admin",
							},
							{
								label: "Finance Admin Logs",
								href: "/command-admin/logs/finance-admin",
							},
							{
								label: "Data Entry Logs",
								href: "/command-admin/logs/data-entry",
							},
						],
					},
					{
						id: "users",
						label: "Users",
						icon: <FiUsers className="h-4 w-4" />,
						href: "/command-admin/user-list",
					},
					{
						id: "admins",
						label: "Admins",
						icon: <FiShield className="h-4 w-4" />,
						items: [
							{
								label: "Finance Admins",
								href: "/command-admin/admins/finance-admin",
							},
							{
								label: "Data Entry Admins",
								href: "/command-admin/admins/data-entry",
							},
						],
					},
					{
						id: "settings",
						label: "Settings",
						icon: <FiSettings className="h-4 w-4" />,
						items: [
							{
								label: "Profile Settings",
								href: "/command-admin/settings/profile",
							},
						],
					},
				]}
				initialOpenId="logs"
			/>
		</div>
	);
};

export default A_SideNav;
