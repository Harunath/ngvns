// app/(dashboard)/referral/page.tsx (or wherever your page lives)
import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "../../lib/auth/auth";
import ShareReferral from "./ShareReferral";

export default async function Referral() {
	const session = await getServerSession(authOptions);
	const user = session?.user as { id: string; vrKpId?: string } | undefined;

	if (!session || !user) {
		return (
			<div className="p-6">
				<p className="mb-4">Please login to view your referral details.</p>
				<Link href="/login" className="text-blue-600 underline">
					Go to Login
				</Link>
			</div>
		);
	}

	const code = user.vrKpId || user.id;
	const base = process.env.NEXT_PUBLIC_BASE_URL;
	console.log("base url resolved to : ", base);
	const referralUrl = `${base}/register?ref=${encodeURIComponent(code)}`;

	return (
		<div className="p-6">
			<ShareReferral referralUrl={referralUrl} code={code} />
		</div>
	);
}
