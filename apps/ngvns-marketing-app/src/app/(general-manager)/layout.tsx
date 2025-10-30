import { Suspense } from "react";
import RoleGuard from "../../components/auth/RoleGuard";
import { MarketingRole } from "@ngvns2025/db/client";
import GeneralManagerNav from "../../components/common/navs/GeneralManager";
import GM_SideNav from "../../components/common/sidenavs/GM_SideNav";
import LayoutLoader from "../../components/common/LayoutLoader";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<RoleGuard allowed={[MarketingRole.GENERAL_MANAGER]}>
			<div className="min-h-screen">
				<GeneralManagerNav />
				<div className="flex">
					<div className="min-w-[300px]">
						<GM_SideNav />
					</div>

					<div className="flex-1">
						<Suspense fallback={<LayoutLoader />}>{children}</Suspense>
					</div>
				</div>
			</div>
		</RoleGuard>
	);
}
