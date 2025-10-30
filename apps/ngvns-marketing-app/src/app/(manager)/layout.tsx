import { Suspense } from "react";
import RoleGuard from "../../components/auth/RoleGuard";
import { MarketingRole } from "@ngvns2025/db/client";
import LayoutLoader from "../../components/common/LayoutLoader";
import ManagerNav from "../../components/common/navs/Manager";
import M_SideNav from "../../components/common/sidenavs/M_SideNav";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<RoleGuard allowed={[MarketingRole.MANAGER]}>
			<div className="min-h-screen">
				<ManagerNav />
				<div className="flex">
					<div className="min-w-[300px]">
						<M_SideNav />
					</div>

					<div className="">
						<Suspense fallback={<LayoutLoader />}>{children}</Suspense>
					</div>
				</div>
			</div>
		</RoleGuard>
	);
}
