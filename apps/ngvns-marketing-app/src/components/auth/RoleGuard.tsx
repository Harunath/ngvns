import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth/auth";
import { MarketingRole } from "@ngvns2025/db/client";
import Forbidden from "./Forbidden";

type Props = {
	allowed: MarketingRole[]; // e.g., [MarketingRole.GENERAL_MANAGER]
	children: ReactNode;
};

export default async function RoleGuard({ allowed, children }: Props) {
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		// not logged in → go to login
		redirect("/logout"); // adjust to your route
	}

	const role = session.user.role as MarketingRole;
	if (!allowed.includes(role)) {
		// logged in but doesn’t have permission → show 403
		return <Forbidden />;
	}

	return <>{children}</>;
}
