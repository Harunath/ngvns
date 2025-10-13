"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import clsx from "clsx";

type NavItem = {
	label: string;
	href: string;
	external?: boolean;
};

type NavProps = {
	navItems: NavItem[];
	cta?: NavItem;
	logoSrc?: string;
	className?: string;
};

export default function Nav({
	navItems,
	cta,
	logoSrc = "https://res.cloudinary.com/diaoy3wzi/image/upload/v1756982391/vrKP-4_no_bg_jndjxt.png",
	className,
}: NavProps) {
	const pathname = usePathname();
	const [open, setOpen] = useState(false);
	const panelRef = useRef<HTMLButtonElement>(null);

	// Close on route change & on Escape
	useEffect(() => {
		const handleClick = (e: MouseEvent) => {
			if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
				setOpen(false);
			}
		};
		window.addEventListener("click", handleClick);
		return () => window.removeEventListener("click", handleClick);
	}, []);
	useEffect(() => setOpen(false), [pathname]);
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => {
			if (e.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);

	const isActive = (href: string) => {
		if (href === "/") return pathname === "/";
		return pathname?.startsWith(href);
	};

	return (
		<header
			className={clsx(
				"sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60",
				className
			)}>
			<nav
				aria-label="Primary"
				className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 md:py-4">
				{/* Brand / Logo */}
				<Link href="/" className="group inline-flex items-center gap-2">
					<Image
						src={logoSrc}
						alt="Logo"
						width={180}
						height={60}
						priority
						className="h-10 w-auto md:h-12 object-contain transition-transform duration-200 group-hover:scale-[1.02]"
					/>
				</Link>

				{/* Desktop Nav */}
				<div className="hidden items-center gap-6 md:flex">
					<ul className="flex items-center gap-2">
						{navItems.map((item) => {
							const active = isActive(item.href);
							const A = item.external ? "a" : Link;
							return (
								<li key={item.href} className="relative">
									<A
										href={item.href}
										target={item.external ? "_blank" : undefined}
										rel={item.external ? "noreferrer noopener" : undefined}
										className={clsx(
											"px-3 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900",
											active && "text-neutral-900"
										)}>
										<span className="relative">
											{item.label}
											{/* Animated underline for active link */}
											<AnimatePresence initial={false}>
												{active && (
													<motion.span
														layoutId="nav-underline"
														className="absolute -bottom-1 left-0 h-[2px] w-full rounded bg-neutral-900"
														initial={{ opacity: 0 }}
														animate={{ opacity: 1 }}
														exit={{ opacity: 0 }}
														transition={{
															type: "spring",
															stiffness: 500,
															damping: 40,
														}}
													/>
												)}
											</AnimatePresence>
										</span>
									</A>
								</li>
							);
						})}
					</ul>

					{/* Optional CTA */}
					{cta && (
						<Link
							href={cta.href}
							target={cta.external ? "_blank" : undefined}
							rel={cta.external ? "noreferrer noopener" : undefined}
							className="inline-flex items-center rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow">
							{cta.label}
						</Link>
					)}
				</div>

				{/* Mobile Toggle */}
				<button
					ref={panelRef}
					type="button"
					aria-label="Toggle menu"
					aria-controls="mobile-menu"
					aria-expanded={open}
					onClick={() => setOpen((v) => !v)}
					className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-neutral-300 md:hidden">
					<svg
						viewBox="0 0 24 24"
						className="h-5 w-5"
						role="img"
						aria-hidden="true">
						{open ? (
							<path
								d="M6 18L18 6M6 6l12 12"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						) : (
							<path
								d="M4 6h16M4 12h16M4 18h16"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
							/>
						)}
					</svg>
				</button>
			</nav>

			{/* Mobile Sheet */}
			<AnimatePresence>
				{open && (
					<motion.aside
						id="mobile-menu"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="md:hidden">
						{/* Backdrop click to close */}
						<motion.button
							aria-label="Close menu"
							onClick={() => setOpen(false)}
							className="fixed inset-0 bg-black/30"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						/>

						{/* Panel */}
						<motion.div
							role="dialog"
							aria-modal="true"
							initial={{ y: -24, opacity: 0, scale: 0.98 }}
							animate={{ y: 0, opacity: 1, scale: 1 }}
							exit={{ y: -24, opacity: 0, scale: 0.98 }}
							transition={{ type: "spring", stiffness: 260, damping: 28 }}
							className="absolute left-0 right-0 top-0 z-50 mx-3 mt-2 rounded-2xl border border-neutral-200 bg-white p-3 shadow-xl">
							<motion.ul
								initial={{ opacity: 0, y: -8 }}
								animate={{
									opacity: 1,
									y: 0,
									transition: {
										type: "spring",
										stiffness: 400,
										damping: 30,
									},
								}}
								exit={{ opacity: 0, y: -8 }}
								className="flex flex-col">
								{navItems.map((item, i) => {
									const active = isActive(item.href);
									const A = item.external ? "a" : Link;
									return (
										<motion.li
											key={item.href}
											initial={{ opacity: 0, y: -8 }}
											animate={{
												opacity: 1,
												y: 0,
												transition: {
													type: "spring",
													stiffness: 400,
													damping: 30,
												},
											}}
											transition={{ delay: i * 0.03 }}>
											<A
												href={item.href}
												target={item.external ? "_blank" : undefined}
												rel={item.external ? "noreferrer noopener" : undefined}
												className={clsx(
													"block rounded-xl px-4 py-3 text-[15px] font-medium",
													active
														? "bg-neutral-100 text-neutral-900"
														: "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
												)}>
												{item.label}
											</A>
										</motion.li>
									);
								})}

								{cta && (
									<motion.li
										initial={{ opacity: 0, y: -8 }}
										animate={{
											opacity: 1,
											y: 0,
											transition: {
												type: "spring",
												stiffness: 400,
												damping: 30,
											},
										}}
										className="pt-1">
										<Link
											href={cta.href}
											target={cta.external ? "_blank" : undefined}
											rel={cta.external ? "noreferrer noopener" : undefined}
											className="block rounded-xl bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800">
											{cta.label}
										</Link>
									</motion.li>
								)}
							</motion.ul>
						</motion.div>
					</motion.aside>
				)}
			</AnimatePresence>
		</header>
	);
}
