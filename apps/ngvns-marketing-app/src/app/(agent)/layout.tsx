import { Suspense } from "react";
import RoleGuard from "../../components/auth/RoleGuard";
import { MarketingRole } from "@ngvns2025/db/client";
import LayoutLoader from "../../components/common/LayoutLoader";
import AgentNav from "../../components/common/navs/AgentNav";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<RoleGuard allowed={[MarketingRole.AGENT]}>
			<div className="min-h-screen">
				<AgentNav />
				<div className="flex">
					{/* <div className="w-[260px] shrink-0">
						<TL_SideNav />
					</div> */}

					<div className="flex-1">
						<Suspense fallback={<LayoutLoader />}>{children}</Suspense>
					</div>
				</div>
			</div>
		</RoleGuard>
	);
}
