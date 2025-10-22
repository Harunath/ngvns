import prisma from "@ngvns2025/db/client";
import React from "react";
import BankAccountEditor from "../../../../../../components/user/bank/BankAccountEditor";
import { authOptions } from "../../../../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const page = async ({
	params,
}: {
	params: Promise<{ bankAccountId: string }>;
}) => {
	const session = await getServerSession(authOptions);
	if (!session || !session.user || !session.user.id) {
		redirect("/logout");
	}
	const { bankAccountId } = await params;
	if (!bankAccountId) {
		return <div>Bank account not found</div>;
	}
	const bankAccount = await prisma.bankDetails.findUnique({
		where: { id: bankAccountId },
		select: { id: true },
	});
	if (!bankAccount || !bankAccount.id) {
		return <div>Bank account not found</div>;
	}
	return (
		<div className=" bg-neutral-100 p-6 rounded-lg shadow-md">
			<h1 className="text-2xl font-bold mb-4">Bank Account Details</h1>
			<BankAccountEditor
				userId={session.user.id}
				bankAccountId={bankAccount.id}
			/>
		</div>
	);
};

export default page;
