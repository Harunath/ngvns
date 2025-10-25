import { FiFileText, FiUsers, FiShield, FiSettings } from "react-icons/fi";
import SideNav from "./SideNav";

const TL_SideNav = () => {
	return (
		<div>
			<SideNav
				title="Command Admin"
				sections={[
					// {
					// 	id: "logs",
					// 	label: "Logs",
					// 	icon: <FiFileText className="h-4 w-4" />,
					// 	items: [
					// 		{
					// 			label: "Command Admin Logs",
					// 			href: "/command-admin/logs/command-admin",
					// 		},
					// 		{
					// 			label: "Finance Admin Logs",
					// 			href: "/command-admin/logs/finance-admin",
					// 		},
					// 		{
					// 			label: "Data Entry Logs",
					// 			href: "/command-admin/logs/data-entry",
					// 		},
					// 	],
					// },
					// {
					// 	id: "users",
					// 	label: "Users",
					// 	icon: <FiUsers className="h-4 w-4" />,
					// 	href: "/command-admin/user-list",
					// },
					{
						id: "team-members",
						label: "Team Members",
						icon: <FiUsers className="h-4 w-4" />,
						items: [
							{
								label: "Team leaders",
								href: "/team-leader/team-leaders",
							},
							{
								label: "Data Entry Admins",
								href: "/team-leader/agents",
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
								href: "/team-leader/settings/profile",
							},
						],
					},
				]}
				initialOpenId="logs"
			/>
		</div>
	);
};

export default TL_SideNav;
