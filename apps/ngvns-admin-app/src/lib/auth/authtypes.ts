import { AdminRole } from "@ngvns2025/db/client";
import "next-auth";
declare module "next-auth" {
	interface User {
		id: string;
		phone: string;
		email: string;
		fullname: string;
		role: AdminRole;
	}

	interface Session {
		user: User; // Link the extended User type here
	}
}
