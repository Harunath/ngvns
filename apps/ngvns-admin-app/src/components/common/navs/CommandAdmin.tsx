import React from "react";
import Nav from "./Nav";

const CommandAdminNav = () => {
	return (
		<div>
			<Nav
				navItems={[
					{ label: "dashboard", href: "/command-admin/" },
					{ label: "list", href: "/command-admin/user-list" },
					{ label: "payouts", href: "/command-admin/payouts" },
					{ label: "profile", href: "/command-admin/profile" },
				]}
			/>
		</div>
	);
};

export default CommandAdminNav;
