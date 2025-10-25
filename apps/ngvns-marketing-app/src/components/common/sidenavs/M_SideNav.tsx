import { FiFileText, FiUsers, FiShield, FiSettings } from "react-icons/fi";
import SideNav from "./SideNav";

const M_SideNav = () => {
	return (
		<div>
			<SideNav
				title="Manager"
				sections={[
					// {
					// 	id: "logs",
					// 	label: "Logs",
					// 	icon: <FiFileText className="h-4 w-4" />,
					// 	items: [
					// 		{
					// 			label: "Super Admin Logs",
					// 			href: "/super-admin/logs/super-admin",
					// 		},
					// 		{
					// 			label: "Command Admin Logs",
					// 			href: "/super-admin/logs/command-admin",
					// 		},
					// 		{
					// 			label: "Finance Admin Logs",
					// 			href: "/super-admin/logs/finance-admin",
					// 		},
					// 		{
					// 			label: "Data Entry Logs",
					// 			href: "/super-admin/logs/data-entry",
					// 		},
					// 	],
					// },
					// {
					// 	id: "users",
					// 	label: "Users",
					// 	icon: <FiUsers className="h-4 w-4" />,
					// 	href: "/super-admin/user-list",
					// },
					{
						id: "team-members",
						label: "Team Members",
						icon: <FiUsers className="h-4 w-4" />,
						items: [
							{
								label: "Managers",
								href: "/manager/managers",
							},
							{
								label: "Team Leaders",
								href: "/manager/team-leaders",
							},
							{
								label: "Agents",
								href: "/manager/agents",
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
								href: "/manager/settings/profile",
							},
						],
					},
				]}
				initialOpenId="logs"
			/>
		</div>
	);
};

export default M_SideNav;
