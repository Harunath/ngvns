import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../../lib/auth/auth";
import ChangePasswordForm from "../../../../components/user/settings/password/_ChangePasswordForm";

export default async function PasswordSettingsPage() {
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		redirect("/login"); // or throw notFound()
	}

	return (
		<div className="mx-auto max-w-lg px-4 py-10">
			<h1 className="text-2xl font-semibold">Change Password</h1>
			<p className="mt-2 text-sm text-gray-600">
				Update your password. You’ll need your current password to continue.
			</p>
			<div className="mt-8">
				<ChangePasswordForm />
			</div>
		</div>
	);
}
