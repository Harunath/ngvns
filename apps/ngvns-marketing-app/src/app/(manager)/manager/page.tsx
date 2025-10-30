// app/(marketing)/dashboard/page.tsx

import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth/auth";
import MarketingJoinStats from "../../../components/marketing/MarketingJoinStats";
import Referral from "../../../components/common/Referral";
import ReferralCount from "../../../components/common/ReferralCount";

export default async function Page() {
	const session = await getServerSession(authOptions);

	if (!session?.user?.teamId) {
		return <div className="p-6">Please sign in to access your dashboard.</div>;
	}

	return (
		<main className="p-4 sm:p-6">
			<ReferralCount />
			<h1 className="text-2xl font-bold">Marketing Joins</h1>
			<p className="mt-1 text-sm text-gray-600">
				Counts are computed by IST midnight boundaries.
			</p>
			<div className="mt-6">
				<MarketingJoinStats teamId={session.user.teamId} />
			</div>
			<Referral />
		</main>
	);
}
