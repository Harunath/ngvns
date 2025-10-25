import React from "react";
import Nav from "./Nav";

const AgentNav = () => {
	return (
		<div>
			<Nav
				navItems={[
					{ label: "dashboard", href: "/agent" },
					{ label: "profile", href: "/agent/profile" },
				]}
			/>
		</div>
	);
};

export default AgentNav;
