import React from "react";
import TeamLeaderNav from "../../components/common/navs/TeamLeaderNav";
import TL_SideNav from "../../components/common/sidenavs/TL_SideNav";

function layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<TeamLeaderNav />
			<div className=" flex gap-x-2">
				<div>
					<TL_SideNav />
				</div>
				<div>{children}</div>
			</div>
		</div>
	);
}

export default layout;
