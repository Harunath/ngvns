import React from "react";
import prisma from "@ngvns2025/db/client";
import { authOptions } from "../../../lib/auth/auth";
import { getServerSession } from "next-auth";
import { unstable_cache } from "next/cache";

const getUserTree = unstable_cache(
	async (userId: string) => {
		// counts
		const [l1, l2, l3] = await Promise.all([
			prisma.user.count({
				where: {
					parentReferralId: (
						await prisma.user.findUnique({
							where: { id: userId },
							select: { vrKpId: true },
						})
					)?.vrKpId,
					deleted: false,
				},
			}),
			prisma.user.count({ where: { parentBId: userId, deleted: false } }),
			prisma.user.count({ where: { parentCId: userId, deleted: false } }),
		]);

		// last few joins (optional)
		// const recent = await prisma.user.findMany({
		// 	where: {
		// 		OR: [{ parentBId: userId }, { parentCId: userId }],
		// 		deleted: false,
		// 	},
		// 	orderBy: { createdAt: "desc" },
		// 	take: 10,
		// 	select: { id: true, fullname: true, vrKpId: true, createdAt: true },
		// });

		return {
			l1,
			l2,
			l3,
			// recent
		};
	},
	[`user-tree`], // cache tag per user
	{
		revalidate: 60 * 60, // fallback TTL (1h) if you don’t manually revalidate
	}
);

export default async function Page() {
	let level1 = 300;
	let level2 = 200;
	let level3 = 180;
	const session = await getServerSession(authOptions);
	if (!session?.user?.id) {
		return <div>Please sign in to access your board.</div>;
	}

	const data = await getUserTree(session.user.id);

	return (
		<div className="flex flex-col items-center justify-center px-4 py-10 bg-neutral-100">
			<h1 className="text-xl font-semibold">Refer Trees</h1>

			<section>
				<h2 className="font-medium">Direct Joins {data.l1}</h2>
				{/* <ul className="list-disc ml-6 border-2 border-blue-300 flex h-10 w-fit rounded-full overflow-hidden">
					{[0, 1, 2, 3, 4].map((i) =>
						i < user._count.directJoin % 5 ? (
							<div
								key={i}
								className="h-full w-10 bg-blue-400 border-r-1 border-blue-300"
							/>
						) : (
							<div
								key={i}
								className="h-full w-10 bg-blue-200 border-r-1 border-blue-300"
							/>
						)
					)}
				</ul> */}
				<Chart count={data.l1} by={5} />
				<p className="mt-2 text-sm font-semibold">
					{data.l1} * {level1} ={" ₹ "}
					{data.l1 * level1}
					{" /-"}
				</p>
			</section>

			<section>
				<h2 className="font-medium">B Level ({data.l2})</h2>
				<Chart count={data.l2} by={25} />
				<p className="mt-2 text-sm font-semibold">
					{data.l2} * {level2} ={" ₹ "}
					{data.l2 * level2}
					{" /-"}
				</p>
			</section>

			<section>
				<h2 className="font-medium">C Level ({data.l3})</h2>

				<Chart count={data.l3} by={125} />
				<p className="mt-2 text-sm font-semibold">
					{data.l3} * {level3} ={" ₹ "}
					{data.l3 * level3}
					{" /-"}
				</p>
			</section>
		</div>
	);
}

function Chart({ count, by }: { count: number; by: number }) {
	const percentage = ((count % by) / by) * 100;

	return (
		<div className="w-full rounded-full bg-neutral-100 border-2 border-blue-300 overflow-clip">
			<div
				className="h-4 bg-blue-300 rounded-full transition-all"
				style={{ width: `${percentage}%` }}
			/>
		</div>
	);
}
