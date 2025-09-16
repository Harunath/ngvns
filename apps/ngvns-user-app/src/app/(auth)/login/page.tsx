// app/(auth)/login/page.tsx
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { Suspense } from "react";
import LoginWithPhone from "../../../components/auth/login/LoginPage";

export default function Page() {
	return (
		<Suspense fallback={<Loading />}>
			<LoginWithPhone />
		</Suspense>
	);
}

function Loading() {
	return <div>Loading...</div>;
}
