// /types/logs.ts
export type AdminRole =
	| "super-admin"
	| "command-admin"
	| "finance-admin"
	| "data-entry";

export type LogRecord = {
	id: string;
	actorId?: string | null;
	targetType: string | null; // e.g. "User"
	action: string;
	actor: {
		id: string;
		fullname: string;
		role: AdminRole;
	}; // e.g. "USER_CREATED"
	metadata?: JSON | null;
	createdAt: string; // ISO string
};

export type LogsResponse = {
	ok: boolean;
	logs: LogRecord[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
};

export type LogsQuery = {
	role?: AdminRole; // optional filter on target role if your API supports it
	from?: string; // ISO date (YYYY-MM-DD or full ISO)
	to?: string; // ISO date
	page?: number;
	limit?: number;
};
