import prisma from "@ngvns2025/db/client";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";

// Server-rendered details page.
// Assumes auth is handled with middleware or layout for admin-only routes.
export default async function UserDetailsPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const p = await params;
	const user = await prisma.user.findUnique({
		where: { id: p.id },
		select: {
			id: true,
			fullname: true,
			vrKpId: true,
			email: true,
			phone: true,
			gender: true,
			dob: true,
			relationType: true,
			relationName: true,
			aadhaar: true,
			aadhaarVerified: true,
			emailVerified: true,
			createdAt: true,
			updatedAt: true,
			address: {
				select: {
					addressLine: true,
					addressLine2: true,
					State: true,
					pincode: true,
				},
			},
		},
	});

	if (!user) return notFound();

	return (
		<div className="min-h-screen bg-neutral-50">
			<div className="mx-auto w-full max-w-6xl px-4 py-8">
				<header className="mb-6">
					<h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
						{user.fullname}
					</h1>
					<p className="text-sm text-neutral-500">
						{user.vrKpId ? `VRKP: ${user.vrKpId} · ` : ""}
						{user.email} · {user.phone}
						<Link
							href={`/super-admin/user-list/${user.id}/password-reset`}
							className="ml-4 text-sm text-blue-600 hover:underline">
							Reset Password
						</Link>
					</p>
				</header>

				{/* Profile Header Card */}
				<section className="rounded-2xl border bg-white p-5 shadow-sm">
					<div className="grid gap-6 md:grid-cols-3">
						<div>
							<p className="text-xs text-neutral-500">User ID</p>
							<p className="font-medium">{user.id}</p>
						</div>
						<div>
							<p className="text-xs text-neutral-500">Created</p>
							<p className="font-medium">
								{format(new Date(user.createdAt), "dd MMM yyyy, HH:mm")}
							</p>
						</div>
						<div>
							<p className="text-xs text-neutral-500">Updated</p>
							<p className="font-medium">
								{format(new Date(user.updatedAt), "dd MMM yyyy, HH:mm")}
							</p>
						</div>
					</div>

					<div className="mt-6 grid gap-6 md:grid-cols-3">
						<div>
							<p className="text-xs text-neutral-500">Email</p>
							<p className="font-medium">{user.email}</p>
							<p className="text-xs text-neutral-500">
								{user.emailVerified ? "Verified" : "Not verified"}
							</p>
						</div>
						<div>
							<p className="text-xs text-neutral-500">Aadhaar</p>
							<p className="font-medium">{user.aadhaar || "-"}</p>
							<p className="text-xs text-neutral-500">
								{user.aadhaarVerified ? "Verified" : "Not verified"}
							</p>
						</div>
						<div>
							<p className="text-xs text-neutral-500">DOB / Gender</p>
							<p className="font-medium">
								{user.dob ? format(new Date(user.dob), "dd MMM yyyy") : "-"}{" "}
								{user.gender ? `· ${user.gender}` : ""}
							</p>
						</div>
					</div>

					<div className="mt-6">
						<p className="text-xs text-neutral-500">Address</p>
						<p className="font-medium">
							{[user.address?.addressLine, user.address?.addressLine2]
								.filter(Boolean)
								.join(", ") || "-"}
						</p>
						<p className="text-sm text-neutral-600">
							{[user.address?.State.name, user.address?.pincode]
								.filter(Boolean)
								.join(", ")}
						</p>
					</div>
				</section>

				{/* Future scope sections (placeholders for now) */}
				<div className="mt-6 grid gap-4 md:grid-cols-3">
					<section className="rounded-2xl border bg-white p-4 text-sm text-neutral-500">
						<p className="font-medium text-neutral-800">Payments</p>
						<p className="mt-1">Coming soon…</p>
					</section>
					<section className="rounded-2xl border bg-white p-4 text-sm text-neutral-500">
						<p className="font-medium text-neutral-800">Referrals</p>
						<p className="mt-1">Coming soon…</p>
					</section>
					<section className="rounded-2xl border bg-white p-4 text-sm text-neutral-500">
						<p className="font-medium text-neutral-800">Activity</p>
						<p className="mt-1">Coming soon…</p>
					</section>
				</div>
			</div>
		</div>
	);
}
