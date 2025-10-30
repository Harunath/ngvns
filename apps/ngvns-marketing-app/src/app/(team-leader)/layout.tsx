import { Suspense } from "react";
import RoleGuard from "../../components/auth/RoleGuard";
import { MarketingRole } from "@ngvns2025/db/client";
import LayoutLoader from "../../components/common/LayoutLoader";
import TeamLeaderNav from "../../components/common/navs/TeamLeaderNav";
import TL_SideNav from "../../components/common/sidenavs/TL_SideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<RoleGuard allowed={[MarketingRole.TEAM_LEADER]}>
			<div className="min-h-screen">
				<TeamLeaderNav />
				<div className="flex">
					<div className="min-w-[300px]">
						<TL_SideNav />
					</div>

					<div className="flex-1">
						<Suspense fallback={<LayoutLoader />}>{children}</Suspense>
					</div>
				</div>
			</div>
		</RoleGuard>
	);
}
