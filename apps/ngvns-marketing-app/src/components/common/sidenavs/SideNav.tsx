"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { AnimatePresence, motion } from "motion/react";

/** ===== Types ===== */
export type SideNavItem = {
	label: string;
	href: string;
};

export type SideNavSection = {
	id: string; // unique
	label: string;
	href?: string; // if provided and no items => navigates
	icon?: React.ReactNode; // optional leading icon
	items?: SideNavItem[]; // optional sub-links
};

export type SideNavProps = {
	title?: string; // small heading above nav
	sections: SideNavSection[];
	initialOpenId?: string; // which section is open by default
	openId?: string; // controlled
	onOpenChange?: (id: string | null) => void;
	className?: string;
	widthClassName?: string; // override width (default w-72)
};

/** ===== Component ===== */
export default function SideNav({
	title = "",
	sections,
	initialOpenId,
	openId,
	onOpenChange,
	className,
	widthClassName = "w-72",
}: SideNavProps) {
	const pathname = usePathname();

	// Uncontrolled state fallback
	const [uncontrolledOpen, setUncontrolledOpen] = React.useState<string | null>(
		initialOpenId ?? null
	);
	const isControlled = openId !== undefined;
	const currentOpen = isControlled ? openId! : uncontrolledOpen;

	const setOpen = (id: string | null) => {
		if (isControlled) onOpenChange?.(id);
		else setUncontrolledOpen(id);
	};

	// Auto-open parent if a child matches the current route
	React.useEffect(() => {
		const matched = sections.find((s) =>
			s.items?.some(
				(it) => pathname === it.href || pathname.startsWith(it.href + "/")
			)
		);
		if (matched && matched.id !== currentOpen) setOpen(matched.id);
	}, [pathname, sections]); // eslint-disable-line

	const toggle = (id: string) => setOpen(currentOpen === id ? null : id);

	return (
		<aside
			className={clsx(
				"sticky top-0 hidden h-[100dvh] shrink-0 border-r border-neutral-200 bg-white/70 backdrop-blur md:block",
				widthClassName,
				className
			)}
			aria-label="Secondary navigation">
			<div className="flex h-full flex-col">
				{title ? (
					<div className="px-4 pb-2 pt-4">
						<h2 className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
							{title}
						</h2>
					</div>
				) : null}

				<nav className="scrollbar-thin flex-1 overflow-y-auto px-2 py-2">
					<ul className="space-y-1">
						{sections.map((section) => {
							const hasChildren = !!section.items?.length;
							const isOpen = hasChildren && currentOpen === section.id;

							// If section has no children but has href, render as Link row
							if (!hasChildren && section.href) {
								const active =
									pathname === section.href ||
									pathname.startsWith(section.href + "/");
								return (
									<li key={section.id} className="rounded-xl">
										<Link
											href={section.href}
											className={clsx(
												"group flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition",
												active
													? "bg-blue-400 text-white"
													: "text-neutral-700 hover:bg-blue-200 hover:text-neutral-900"
											)}>
											<span className="inline-flex items-center gap-2">
												{section.icon}
												{section.label}
											</span>
										</Link>
									</li>
								);
							}

							// Otherwise render accordion header (button) + animated panel
							return (
								<li key={section.id} className="rounded-xl">
									<button
										type="button"
										onClick={() =>
											hasChildren ? toggle(section.id) : undefined
										}
										className={clsx(
											"group flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition",
											"text-neutral-700 hover:bg-blue-200 hover:text-neutral-900",
											isOpen && "bg-blue-400 text-neutral-900"
										)}
										aria-expanded={isOpen}
										aria-controls={`${section.id}-panel`}>
										<span className="inline-flex items-center gap-2">
											{section.icon}
											{section.label}
										</span>

										{hasChildren ? (
											<motion.svg
												viewBox="0 0 24 24"
												width="18"
												height="18"
												className="opacity-70"
												animate={{ rotate: isOpen ? 180 : 0 }}
												transition={{ duration: 0.18, ease: "easeInOut" }}>
												<path
													d="M6 9l6 6 6-6"
													stroke="currentColor"
													strokeWidth="2"
													fill="none"
													strokeLinecap="round"
													strokeLinejoin="round"
												/>
											</motion.svg>
										) : null}
									</button>

									<AnimatePresence initial={false}>
										{hasChildren && isOpen && (
											<motion.div
												id={`${section.id}-panel`}
												key={`${section.id}-panel`}
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{
													type: "spring",
													stiffness: 260,
													damping: 30,
												}}
												className="overflow-hidden">
												<ul className="mb-2 mt-1 space-y-1 pl-8">
													{section.items!.map((item) => {
														const active =
															pathname === item.href ||
															pathname.startsWith(item.href + "/");
														return (
															<li key={item.href}>
																<Link
																	href={item.href}
																	className={clsx(
																		"group flex items-center justify-between rounded-lg px-3 py-2 text-sm",
																		active
																			? "bg-neutral-900 text-white"
																			: "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
																	)}>
																	<span className="flex items-center gap-2">
																		<motion.span
																			layout
																			className={clsx(
																				"h-1.5 w-1.5 rounded-full",
																				active
																					? "bg-blue-500"
																					: "bg-blue-300 group-hover:bg-neutral-400"
																			)}
																		/>
																		{item.label}
																	</span>
																	{/* Tiny active indicator */}
																	<AnimatePresence>
																		{active && (
																			<motion.span
																				layoutId="sidenav-active-pill"
																				className="h-5 rounded-full bg-blue-300 px-2 text-xs"
																				initial={{ opacity: 0 }}
																				animate={{ opacity: 1 }}
																				exit={{ opacity: 0 }}>
																				•
																			</motion.span>
																		)}
																	</AnimatePresence>
																</Link>
															</li>
														);
													})}
												</ul>
											</motion.div>
										)}
									</AnimatePresence>
								</li>
							);
						})}
					</ul>
				</nav>

				<div className="border-t border-neutral-200 px-4 py-3">
					<p className="text-xs text-neutral-500">VRKP • Admin</p>
				</div>
			</div>
		</aside>
	);
}
