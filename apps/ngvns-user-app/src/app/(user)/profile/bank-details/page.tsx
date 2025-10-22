import React from "react";
import BankAccountDetails from "../../../../components/user/bank/BankAccountDetails";
import { authOptions } from "../../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function page() {
	const session = await getServerSession(authOptions);
	if (!session || !session.user || !session.user.id) {
		redirect("/logout");
	}
	return (
		<div>
			<BankAccountDetails userId={session?.user.id} />
		</div>
	);
}

export default page;
