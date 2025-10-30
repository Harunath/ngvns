import React from "react";
import Nav from "./Nav";

const GeneralManagerNav = () => {
	return (
		<div>
			<Nav
				navItems={[
					{ label: "dashboard", href: "/general-manager/" },
					{ label: "profile", href: "/general-manager/settings/profile" },
				]}
			/>
		</div>
	);
};

export default GeneralManagerNav;
