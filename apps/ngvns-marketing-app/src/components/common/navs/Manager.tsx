import React from "react";
import Nav from "./Nav";

const ManagerNav = () => {
	return (
		<div>
			<Nav
				navItems={[
					{ label: "dashboard", href: "/manager/" },
					{ label: "profile", href: "/manager/profile" },
				]}
			/>
		</div>
	);
};

export default ManagerNav;
