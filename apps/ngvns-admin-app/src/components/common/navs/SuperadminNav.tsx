import React from "react";
import Nav from "./Nav";

const SuperadminNav = () => {
	return (
		<div>
			<Nav
				navItems={[
					{ label: "dashboard", href: "/super-admin/" },
					{ label: "list", href: "/super-admin/user-list" },
					{ label: "payouts", href: "/super-admin/payouts" },
					{ label: "profile", href: "/super-admin/profile" },
				]}
			/>
		</div>
	);
};

export default SuperadminNav;
