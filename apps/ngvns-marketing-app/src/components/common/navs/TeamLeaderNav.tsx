import React from "react";
import Nav from "./Nav";

const TeamLeaderNav = () => {
	return (
		<div>
			<Nav
				navItems={[
					{ label: "dashboard", href: "/team-leader/" },
					{ label: "profile", href: "/team-leader/settings/profile" },
				]}
			/>
		</div>
	);
};

export default TeamLeaderNav;
