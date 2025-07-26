"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../../public/logo.png";
import Image from "next/image";

export default function Navbar() {
	const [isOpen, setIsOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	return (
		<header className="fixed left-0 right-0 top-0 text-black z-50 backdrop-blur-3xl backdrop-saturate-150 shadow-lg">
			<div className="w-full px-4 h-24 flex items-center justify-between">
				{/* Logo */}
				<Link
					href="/"
					className="text-lg md:text-2xl font-bold text-orange-500 hover:text-orange-600 transition">
					<Image
						src={logo}
						className="h-30 w-auto backdrop-saturate-200"
						height={100}
						width={100}
						alt="NAVA GRAMEEN"
					/>
				</Link>

				{/* Hamburger for mobile */}
				<div className="md:hidden">
					<button onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? (
							<FaTimes className="text-black text-xl" />
						) : (
							<FaBars className="text-black text-xl" />
						)}
					</button>
				</div>

				{/* Nav Links */}
				<nav
					className={`absolute md:static top-24 left-0 w-full md:w-auto px-6 md:px-0 py-4 md:py-0 md:flex items-center gap-6 text-md font-normal ${
						isOpen ? "block bg-white text-black" : "hidden md:block"
					}`}>
					<Link href="/" className="block py-2 md:py-0 hover:text-orange-500">
						Home
					</Link>
					<Link
						href="/about"
						className="block py-2 md:py-0 hover:text-orange-500">
						About Us
					</Link>

					{/* Our Work Dropdown */}
					<div className="relative block py-2 md:py-0" ref={dropdownRef}>
						<button
							onClick={() => setIsDropdownOpen((prev) => !prev)}
							className="hover:text-orange-500 focus:outline-none">
							Our Work ▾
						</button>
						{isDropdownOpen && (
							<div className="absolute left-0 mt-2 bg-black/90 text-white rounded shadow-lg w-64 z-50">
								<ul className="p-2 space-y-1">
									{(
										[
											[
												"Self-Sustainable Villages",
												"/our-work/self-sustainable-villages",
											],
											["Natural Farming", "/our-work/natural-farming"],
											["Green Energy", "/our-work/green-energy"],
											["Rural Employment", "/our-work/rural-employment"],
											["Women Empowerment", "/our-work/women-empowerment"],
											["Agri-Waste Management", "/our-work/agri-waste"],
											["Livestock Management", "/our-work/livestock"],
										] as [string, string][]
									).map(([label, href]) => (
										<li key={label}>
											<Link
												href={href}
												className="block px-4 py-2 text-sm hover:bg-orange-600 hover:text-white rounded transition"
												onClick={() => {
													setIsDropdownOpen(false);
													setIsOpen(false);
												}}>
												{label}
											</Link>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>

					<Link
						href="/blog"
						className="block py-2 md:py-0 hover:text-orange-500">
						Blog
					</Link>
					<Link
						href="/contact"
						className="block py-2 md:py-0 hover:text-orange-500">
						Contact
					</Link>

					{/* Become a Member */}
					<Link href="/register">
						<button className="mt-4 md:mt-0 bg-[#138808] hover:bg-green-700 text-white px-4 py-2 rounded-full transition">
							Become a Member
						</button>
					</Link>
				</nav>
			</div>
		</header>
	);
}
