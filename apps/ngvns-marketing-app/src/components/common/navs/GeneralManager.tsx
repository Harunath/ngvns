import React from "react";
import Nav from "./Nav";

const GeneralManagerNav = () => {
	return (
		<div>
			<Nav
				navItems={[
					{ label: "dashboard", href: "/general-manager/" },
					{ label: "profile", href: "/general-manager/profile" },
				]}
			/>
		</div>
	);
};

export default GeneralManagerNav;
