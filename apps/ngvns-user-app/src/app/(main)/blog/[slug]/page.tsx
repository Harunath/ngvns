// import { notFound } from "next/navigation";
// import * as GiIcons from "react-icons/gi";
// import * as FaIcons from "react-icons/fa";
// import * as RiIcons from "react-icons/ri";
// import * as BsIcons from "react-icons/bs";
// import { blogPosts } from "../../../data/BlogPosts";
// import { IconType } from "react-icons";
// import Image from "next/image";

// const iconMap: { [key: string]: IconType } = {
// 	...GiIcons,
// 	...FaIcons,
// 	...RiIcons,
// 	...BsIcons,
// };

// type Params = {
// 	slug: string;
// };

// interface BlogPostPageProps {
// 	params: Promise<{ slug: string }>;
// }
// export default async function BlogPostPage({ params }: BlogPostPageProps) {
// 	const { slug } = await params;
// 	const blog = blogPosts.find((p) => p.slug === slug);
// 	if (!blog) return notFound();

// 	const Icon = iconMap[blog.icon] || FaIcons.FaRegNewspaper;

// 	return (
// 		<main className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
// 			<article className="bg-gray-50 rounded-xl shadow-md p-6 md:p-10">
// 				<header className="mb-8">
// 					<div className="flex items-center gap-4 mb-4">
// 						<Icon className="text-4xl text-green-700" />
// 						<h1 className="text-3xl md:text-4xl font-bold">{blog.title}</h1>
// 					</div>
// 					<p className="text-lg text-gray-600">{blog.description}</p>
// 				</header>

// 				{blog.image && (
// 					<div className="mb-10">
// 						<Image
// 							src={blog.image}
// 							alt={blog.title}
// 							width={1000}
// 							height={600}
// 							className="rounded-lg shadow-sm w-full object-cover"
// 						/>
// 					</div>
// 				)}

// 				<section className="mb-10">
// 					<h2 className="text-xl font-semibold text-gray-800 mb-4">
// 						Useful Resources
// 					</h2>
// 					<ul className="space-y-3">
// 						{blog.links.map((link, idx) => (
// 							<li key={idx}>
// 								<a
// 									href={link.url}
// 									target="_blank"
// 									rel="noopener noreferrer"
// 									className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors font-medium">
// 									<span className="mr-2">🔗</span>
// 									{link.label}
// 								</a>
// 							</li>
// 						))}
// 					</ul>
// 				</section>

// 				{blog.hashtags?.length > 0 && (
// 					<section>
// 						<h3 className="text-md font-medium text-gray-700 mb-2">Tags:</h3>
// 						<div className="flex flex-wrap gap-2">
// 							{blog.hashtags.map((tag) => (
// 								<span
// 									key={tag}
// 									className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
// 									{tag}
// 								</span>
// 							))}
// 						</div>
// 					</section>
// 				)}
// 			</article>
// 		</main>
// 	);
// }

import React from "react";

function page() {
	return <div>page</div>;
}

export default page;
