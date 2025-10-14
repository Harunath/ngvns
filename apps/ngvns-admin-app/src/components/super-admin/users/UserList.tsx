"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import UserCard from "./UserCard";
import type { UserItem } from "../../../lib/types/users";

export default function UserList({
	items,
	total,
}: {
	items: UserItem[];
	total?: number;
}) {
	if (items.length === 0) {
		return (
			<div className="flex h-48 items-center justify-center">
				<p className="text-sm text-neutral-500">No users match your filters.</p>
			</div>
		);
	}

	return (
		<div className="grid gap-3">
			{total !== undefined && <p>Total {total}</p>}
			{items.map((u, i) => (
				<motion.div
					key={u.id}
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.18, delay: i * 0.02 }}>
					<Link
						href={`/super-admin/user-list/${u.id}`}
						className="block focus:outline-none">
						<UserCard user={u} />
					</Link>
				</motion.div>
			))}
		</div>
	);
}
