import React from "react";
import SuperdevNav from "../../components/common/navs/SuperdevNav";
import Nav from "../../components/common/navs/Nav";
import SuperadminNav from "../../components/common/navs/SuperadminNav";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<SuperdevNav />

			{children}
		</div>
	);
}

export default layout;
