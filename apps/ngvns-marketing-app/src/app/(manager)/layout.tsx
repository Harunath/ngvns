import React from "react";
import ManagerNav from "../../components/common/navs/Manager";
import M_SideNav from "../../components/common/sidenavs/M_SideNav";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<ManagerNav />
			<div className=" flex gap-x-2">
				<div>
					<M_SideNav />
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
}

export default layout;
