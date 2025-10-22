import prisma from "@ngvns2025/db/client";
import React from "react";
import { decrypt } from "../../../../../lib/user/bank-crypto";
import Link from "next/link";

const page = async ({
	params,
}: {
	params: Promise<{ bankAccountId: string }>;
}) => {
	const { bankAccountId } = await params;
	if (!bankAccountId) {
		return <div>Bank account not found</div>;
	}
	const bankAccount = await prisma.bankDetails.findUnique({
		where: { id: bankAccountId },
	});
	if (!bankAccount) {
		return <div>Bank account not found</div>;
	}
	bankAccount.accountNumberEnc = decrypt(bankAccount.accountNumberEnc);
	return (
		<div className=" bg-neutral-100 p-6 rounded-lg shadow-md">
			<h1 className="text-2xl font-bold mb-4">Bank Account Details</h1>
			<div className="p-6 rounded-lg border">
				<Link
					href={`/profile/bank-details/${bankAccount.id}/edit`}
					className="text-blue-600 underline mb-4 inline-block">
					Edit Bank Account
				</Link>
				<hr className="my-4" />
				<p>
					<strong>Account Holder Name:</strong> {bankAccount.accountHolderName}
				</p>
				<p>
					<strong>Account Number:</strong> **** **** ****{" "}
					{bankAccount.accountNumberEnc.slice(-4)}
				</p>
				<p>
					<strong>IFSC:</strong> {bankAccount.ifscCode}
				</p>
				<p>
					<strong>Bank Name:</strong> {bankAccount.bankName}
				</p>
				<p>
					<strong>Branch:</strong> {bankAccount.branch}
				</p>
				<p>
					<strong>Account Type:</strong> {bankAccount.accountType}
				</p>
			</div>
		</div>
	);
};

export default page;
