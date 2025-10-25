import { MarketingRole } from "@ngvns2025/db/client";
import "next-auth";
declare module "next-auth" {
	interface User {
		id: string;
		phone: string;
		email: string;
		fullname: string;
		marketingMemberId: string;
		role: MarketingRole;
		teamId: string;
	}

	interface Session {
		user: User; // Link the extended User type here
	}
}
