import React from "react";
import CommandAdminNav from "../../components/common/navs/CommandAdmin";
import CA_SideNav from "../../components/common/sidenavs/CA_SideNav";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<CommandAdminNav />
			<div className=" flex gap-x-2">
				<div>
					<CA_SideNav />
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
}

export default layout;
