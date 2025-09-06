"use client";
import React from "react";

interface PageHeroProps {
	title: string;
	subtitle?: string;
	imageUrl: string;
	breadcrumb?: string;
}

const PageHero: React.FC<PageHeroProps> = ({
	title,
	subtitle,
	imageUrl,
	breadcrumb = "Home",
}) => {
	return (
		<section
			className="relative bg-fixed bg-center bg-cover h-[60vh] flex items-center justify-center text-center"
			style={{ backgroundImage: `url(${imageUrl})` }}>
			<div className="absolute inset-0 bg-black/20"></div>

			<div className="relative z-10 text-white px-4">
				<nav className="text-sm text-white mb-3">
					<span className="text-orange-500 font-medium">{breadcrumb}</span>
					&nbsp;&gt;&nbsp;
					<span className="text-slate-300 font-medium">{title}</span>
				</nav>
				<h1 className="text-4xl md:text-5xl font-extrabold mb-2">
					<span className="text-orange-500">{title.charAt(0)}</span>
					{title.slice(1)}
				</h1>
				{subtitle && (
					<p className="text-lg md:text-xl font-light text-slate-200 max-w-3xl mx-auto">
						{subtitle}
					</p>
				)}
			</div>
		</section>
	);
};

export default PageHero;
