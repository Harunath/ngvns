// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import { blogPosts } from "../../data/BlogPosts";
// import * as GiIcons from "react-icons/gi";
// import * as FaIcons from "react-icons/fa";
// import * as RiIcons from "react-icons/ri";
// import * as BsIcons from "react-icons/bs";
// import { IconType } from "react-icons";

// const iconMap: { [key: string]: IconType } = {
// 	...GiIcons,
// 	...FaIcons,
// 	...RiIcons,
// 	...BsIcons,
// };

// export default function BlogPage() {
// 	return (
// 		<section className="px-6 py-16 bg-slate-100">
// 			<div className="max-w-3xl mx-auto">
// 				<h1 className="text-3xl font-bold text-gray-800 text-center mb-6">
// 					Government Initiatives Blog
// 				</h1>
// 				<p className="text-gray-600 text-base text-center mb-12">
// 					Empowering Rural India through Policy, Progress, and Innovation.
// 					Explore how government-backed schemes are transforming villages and
// 					farming communities.
// 				</p>

// 				{blogPosts.map((post) => {
// 					const Icon = iconMap[post.icon] || FaIcons.FaRegNewspaper;
// 					const hashtags = post.title
// 						.split(" ")
// 						.slice(0, 3)
// 						.map((word) => `#${word.replace(/[^\w]/g, "")}`);

// 					return (
// 						<Link
// 							href={`/blog/${post.slug}`}
// 							key={post.slug}
// 							className="mb-12 bg-white border rounded-2xl shadow-2xl  transition overflow-hidden block">
// 							<div className="relative h-56 w-full">
// 								{/* <Image
// 									src={
// 										post.image ||
// 										"https://res.cloudinary.com/demo/image/upload/v1711111111/blog-placeholder.jpg"
// 									}
// 									alt={post.title}
// 									fill
// 									className="object-cover"
// 								/> */}
// 							</div>

// 							<div className="p-6">
// 								<div className="flex items-center gap-2 text-green-700 mb-3">
// 									<Icon className="text-2xl" />
// 									<span className="text-xs bg-green-100 px-2 py-1 rounded-full font-medium">
// 										Government Scheme
// 									</span>
// 								</div>

// 								<h2 className="text-xl font-semibold text-gray-800 mb-2">
// 									{post.title}
// 								</h2>

// 								<p className="text-sm text-gray-600 mb-4">{post.description}</p>

// 								<div className="flex flex-wrap gap-2 text-xs text-blue-600 font-medium">
// 									{hashtags.map((tag, idx) => (
// 										<span key={idx} className="hover:underline">
// 											{tag}
// 										</span>
// 									))}
// 								</div>

// 								<div className="mt-4 text-sm text-orange-600 font-semibold">
// 									Read More →
// 								</div>
// 							</div>
// 						</Link>
// 					);
// 				})}
// 			</div>
// 		</section>
// 	);
// }
import React from "react";

function page() {
	return <div>page</div>;
}

export default page;
