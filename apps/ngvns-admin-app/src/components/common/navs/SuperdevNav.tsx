import React from "react";
import Nav from "./Nav";

const SuperdevNav = () => {
	return (
		<div>
			<Nav
				navItems={[
					{ label: "dashboard", href: "/superdev" },
					{ label: "list", href: "/superdev/user-list" },
					{ label: "payouts", href: "/superdev/payouts" },
					{ label: "profile", href: "/superdev/profile" },
				]}
				cta={{ label: "Register", href: "/superdev/register" }}
			/>
		</div>
	);
};

export default SuperdevNav;
