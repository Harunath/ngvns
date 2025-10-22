// components/bank/BankAccountDetails.tsx
"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AccountType } from "@ngvns2025/db/client";

type BankData = {
	id: string;
	accountHolderName: string;
	accountNumberMasked: string;
	ifsc: string;
	bankName?: string;
	branch?: string;
	accountType?: AccountType;
	upiId?: string | null;
	isPrimary?: boolean;
	createdAt?: string;
};

export default function BankAccountDetails({ userId }: { userId: string }) {
	const [data, setData] = useState<BankData | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		async function load() {
			setLoading(true);
			try {
				const res = await fetch(`/api/user/me/${userId}/bank-account`);
				const json = await res.json();
				if (res.ok) {
					setData(json.data);
				} else {
					console.error(json);
				}
			} catch (err) {
				console.error(err);
			} finally {
				setLoading(false);
			}
		}
		load();
	}, [userId]);

	if (loading) return <div className="p-4">Loading bank details…</div>;
	if (!data) return <div className="p-4">No bank account added yet.</div>;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="rounded-lg bg-white p-6 shadow">
			<div className="flex items-start justify-between">
				<div>
					<h3 className="text-lg font-semibold">{data.accountHolderName}</h3>
					<p className="mt-1 text-sm text-gray-600">
						{data.bankName ?? "Bank"}
					</p>
				</div>
				<div className="text-right text-sm">
					<span className="block text-xs text-gray-500">Primary</span>
					<span className="mt-1 block font-medium">
						{data.isPrimary ? "Yes" : "No"}
					</span>
				</div>
			</div>

			<dl className="mt-4 grid grid-cols-1 gap-2 text-sm">
				<div>
					<dt className="text-xs text-gray-500">Account</dt>
					<dd className="font-medium">{data.accountNumberMasked}</dd>
				</div>

				<div>
					<dt className="text-xs text-gray-500">IFSC</dt>
					<dd className="font-medium">{data.ifsc}</dd>
				</div>

				{data.branch && (
					<div>
						<dt className="text-xs text-gray-500">Branch</dt>
						<dd className="font-medium">{data.branch}</dd>
					</div>
				)}

				{data.upiId && (
					<div>
						<dt className="text-xs text-gray-500">UPI</dt>
						<dd className="font-medium">{data.upiId}</dd>
					</div>
				)}
			</dl>
		</motion.div>
	);
}
