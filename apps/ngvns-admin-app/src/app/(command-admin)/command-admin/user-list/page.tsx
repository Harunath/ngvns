import UsersPageClient from "../../../../components/command-admin/users/UsersPageClient";

export default function UsersPage() {
	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="mx-auto w-full max-w-7xl px-4 py-8">
				<header className="mb-6">
					<h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
						Users
					</h1>
					<p className="text-sm text-neutral-500">
						Search, filter, and inspect user details except contact details
						(Command Admin).
					</p>
				</header>

				<UsersPageClient />
			</div>
		</div>
	);
}
