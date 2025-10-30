import { FiFileText, FiUsers, FiShield, FiSettings } from "react-icons/fi";
import SideNav from "./SideNav";

const A_SideNav = () => {
	return (
		<div>
			<SideNav
				title="Executive"
				sections={[
					{
						id: "agents",
						label: "Executives",
						icon: <FiUsers className="h-4 w-4" />,
						href: "/agent/agents",
					},
					{
						id: "settings",
						label: "Settings",
						icon: <FiSettings className="h-4 w-4" />,
						items: [
							{
								label: "Profile Settings",
								href: "/agent/settings/profile",
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
