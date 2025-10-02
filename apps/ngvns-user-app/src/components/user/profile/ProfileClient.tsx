"use client";

import { useEffect, useMemo, useState } from "react";

type ProfileDTO = {
	user: {
		id: string;
		fullname: string;
		phone: string;
		email: string;
		vrKpId: string;
		relationType: string;
		relationName: string;
		gender: string;
		userPhoto: string; // remote URL in DB
		healthCard: boolean;
		createdAt: string;
		updatedAt: string;
	};
	version: number; // updatedAt.getTime()
};

const LS_KEY = "vrkp:profile";
const PHOTO_CACHE_NAME = "vrkp-profile-cache";
const PHOTO_CACHE_KEY = "/local/profile-photo"; // our own synthetic key
const PHOTO_VERSION_KEY = "vrkp:profile-photo-version";

export default function ProfileClient() {
	const [data, setData] = useState<ProfileDTO | null>(null);
	const [loading, setLoading] = useState(true);
	const [blobUrl, setBlobUrl] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// read from localStorage first (no network)
	useEffect(() => {
		try {
			const cached = localStorage.getItem(LS_KEY);
			if (cached) setData(JSON.parse(cached));
		} catch {}
		setLoading(false);
	}, []);

	// one-time fetch (optional) to populate cache if empty
	useEffect(() => {
		if (data) return; // we already have cached data
		(async () => {
			try {
				const res = await fetch("/api/user/me", { cache: "no-store" });
				if (!res.ok) throw new Error(await res.text());
				const fresh: ProfileDTO = await res.json();
				localStorage.setItem(LS_KEY, JSON.stringify(fresh));
				setData(fresh);
			} catch (e: any) {
				setError(e?.message || "Failed to load.");
			}
		})();
	}, [data]);

	// Manage the photo bytes in Cache Storage keyed by our own URL
	useEffect(() => {
		let revoke: string | null = null;

		(async () => {
			if (!data?.user?.userPhoto) return;

			const wantVersion = String(data.version);
			const haveVersion = localStorage.getItem(PHOTO_VERSION_KEY);

			// Try to read from our Cache Storage
			const hasCacheAPI = typeof window !== "undefined" && "caches" in window;
			if (!hasCacheAPI) {
				// Fallback: just show remote URL with version param (still no re-requests if R2 sets long cache)
				setBlobUrl(`${data.user.userPhoto}?v=${data.version}`);
				return;
			}

			const cache = await caches.open(PHOTO_CACHE_NAME);

			// If versions match, read the stored bytes and build a blob URL (no network)
			if (haveVersion === wantVersion) {
				const match = await cache.match(PHOTO_CACHE_KEY);
				if (match) {
					const blob = await match.blob();
					const url = URL.createObjectURL(blob);
					setBlobUrl(url);
					revoke = url;
					return;
				}
			}

			// Else (first time or version changed), fetch image once, store bytes, and use blob URL
			try {
				// Avoid browser HTTP cache: we want to control our own cache explicitly
				const imgRes = await fetch(`${data.user.userPhoto}?v=${data.version}`, {
					cache: "no-store",
				});
				if (!imgRes.ok) throw new Error("Image fetch failed");

				const imgBlob = await imgRes.blob();

				// Store in Cache Storage under our synthetic key
				const storedRes = new Response(imgBlob, {
					headers: { "Content-Type": imgBlob.type || "image/*" },
				});
				await cache.put(PHOTO_CACHE_KEY, storedRes);
				localStorage.setItem(PHOTO_VERSION_KEY, wantVersion);

				const url = URL.createObjectURL(imgBlob);
				setBlobUrl(url);
				revoke = url;
			} catch {
				// Fallback to remote URL
				setBlobUrl(`${data.user.userPhoto}?v=${data.version}`);
			}
		})();

		return () => {
			if (revoke) URL.revokeObjectURL(revoke);
		};
	}, [data?.user?.userPhoto, data?.version]);

	const user = data?.user;
	const since = useMemo(
		() => (user ? new Date(user.createdAt).toLocaleDateString() : ""),
		[user]
	);

	if (!user && loading) {
		return (
			<div className="mx-auto max-w-5xl p-4">
				<div className="animate-pulse space-y-4">
					<div className="h-28 rounded-2xl bg-gray-100" />
					<div className="grid gap-4 md:grid-cols-3">
						<div className="h-32 rounded-2xl bg-gray-100" />
						<div className="h-32 rounded-2xl bg-gray-100" />
						<div className="h-32 rounded-2xl bg-gray-100" />
					</div>
				</div>
			</div>
		);
	}

	if (error) {
		return <div className="p-4 text-red-600">Error: {error}</div>;
	}

	if (!user) return null;

	return (
		<div className="mx-auto max-w-6xl p-4 md:p-8">
			{/* Header */}
			<section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 to-white border">
				<div className="flex flex-col items-center gap-6 p-6 md:flex-row md:items-center md:gap-8 md:p-8">
					<div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white shadow bg-gray-100">
						{blobUrl ? (
							// Use <img> so blob: URLs work without Next/Image config
							<img
								src={blobUrl}
								alt={user.fullname}
								className="h-full w-full object-cover"
							/>
						) : (
							<div className="h-full w-full animate-pulse bg-gray-200" />
						)}
					</div>

					<div className="min-w-0 flex-1">
						<h1 className="truncate text-2xl font-semibold tracking-tight text-gray-900">
							{user.fullname}
						</h1>
						<p className="mt-1 text-gray-600">
							{user.relationType} • {user.relationName}
						</p>

						<div className="mt-3 flex flex-wrap gap-2 text-sm">
							<span className="rounded-full border bg-white px-3 py-1 text-gray-700">
								VRKP ID: <span className="font-medium">{user.vrKpId}</span>
							</span>
							<span className="rounded-full border bg-white px-3 py-1 text-gray-700">
								Phone: <span className="font-medium">{user.phone}</span>
							</span>
							<span className="rounded-full border bg-white px-3 py-1 text-gray-700">
								Health Card:{" "}
								<span
									className={
										user.healthCard
											? "font-medium text-teal-700"
											: "font-medium text-amber-700"
									}>
									{user.healthCard ? "Active" : "Inactive"}
								</span>
							</span>
							<span className="rounded-full border bg-white px-3 py-1 text-gray-700">
								Member Since: <span className="font-medium">{since}</span>
							</span>
						</div>
					</div>
				</div>
			</section>

			{/* Quick details */}
			<section className="mt-6 grid gap-4 md:grid-cols-3">
				<div className="rounded-2xl border bg-white p-5">
					<div className="text-sm text-gray-500">Email</div>
					<div className="truncate text-base font-medium text-gray-900">
						{user.email}
					</div>
				</div>
				<div className="rounded-2xl border bg-white p-5">
					<div className="text-sm text-gray-500">Gender</div>
					<div className="text-base font-medium text-gray-900">
						{user.gender}
					</div>
				</div>
				<div className="rounded-2xl border bg-white p-5">
					<div className="text-sm text-gray-500">VRKP ID</div>
					<div className="text-base font-medium text-gray-900">
						{user.vrKpId}
					</div>
				</div>
			</section>
		</div>
	);
}
