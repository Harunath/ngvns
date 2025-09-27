// app/(dashboard)/referral/page.tsx (or wherever your page lives)
import { getServerSession } from "next-auth";
import Link from "next/link";

import ShareReferral from "./ShareReferral";
import { authOptions } from "../../../../lib/auth/auth";

import { headers } from "next/headers";

export async function getBaseUrl() {
	const h = await headers(); // 👈 await here

	const env = process.env.NEXT_PUBLIC_APP_URL;
	if (env) return env.endsWith("/") ? env : env + "/";

	const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
	const proto =
		h.get("x-forwarded-proto") ??
		(host.includes("localhost") ? "http" : "https");

	return `${proto}://${host}/`;
}

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
	const base = getBaseUrl();
	const referralUrl = `${base}join?ref=${encodeURIComponent(code)}`;

	return (
		<div className="p-6">
			<ShareReferral referralUrl={referralUrl} code={code} />
		</div>
	);
}
