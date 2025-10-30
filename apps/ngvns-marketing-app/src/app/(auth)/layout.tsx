import { Suspense } from "react";
import { MarketingRole } from "@ngvns2025/db/client";
import LayoutLoader from "../../components/common/LayoutLoader";
import { authOptions } from "../../lib/auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getServerSession(authOptions);
	if (session && session?.user) {
		if (session?.user?.id) {
			console.log("Already logged in as", session.user);
			if (session.user.role === MarketingRole.AGENT) redirect("/agent");
			else if (session.user.role === MarketingRole.TEAM_LEADER)
				redirect("/team-leader");
			else if (session.user.role === MarketingRole.MANAGER)
				redirect("/manager");
			else if (session.user.role === MarketingRole.GENERAL_MANAGER)
				redirect("/general-manager");
			else {
				redirect("/logout"); // logout and redirect to login
			}
		}
	}
	return (
		<div>
			<Suspense fallback={<LayoutLoader />}>{children}</Suspense>
		</div>
	);
}
