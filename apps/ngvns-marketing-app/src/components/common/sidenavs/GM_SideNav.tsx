import { FiFileText, FiUsers, FiShield, FiSettings } from "react-icons/fi";
import SideNav from "./SideNav";

const GM_SideNav = () => {
	return (
		<div>
			<SideNav
				title="General Manager"
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
								href: "/general-manager/managers",
							},
							{
								label: "Team Leaders",
								href: "/general-manager/team-leaders",
							},
							{
								label: "Agents",
								href: "/general-manager/agents",
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
								href: "/general-manager/settings/profile",
							},
						],
					},
				]}
				initialOpenId="logs"
			/>
		</div>
	);
};

export default GM_SideNav;
