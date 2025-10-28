import React from "react";
import GeneralManagerNav from "../../components/common/navs/GeneralManager";
import GM_SideNav from "../../components/common/sidenavs/GM_SideNav";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<GeneralManagerNav />
			<div className=" flex gap-x-2">
				<div>
					<GM_SideNav />
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
}

export default layout;
