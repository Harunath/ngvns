// app/(auth)/register/page.tsx  (server component)
import { Suspense } from "react";
import OnboardingFlow from "../../../components/auth/register/OnboardingFlow";

export default function Page() {
	return (
		<Suspense
			fallback={<div className="p-6 text-sm text-neutral-600">Loading…</div>}>
			<OnboardingFlow />
		</Suspense>
	);
}
