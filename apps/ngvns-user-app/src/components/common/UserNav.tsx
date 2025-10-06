"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import AuthButton from "../auth/login/AuthButton";
import { FiUser } from "react-icons/fi";
import Logout from "../auth/Logout";

export default function UserNavbar() {
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
		<header className="bg-transparent text-black sticky top-0 z-50 backdrop-blur-md backdrop-saturate-150 shadow-lg">
			<div className="w-full px-4 md:px-8 h-16 md:h-20 flex items-center justify-between">
				{/* Logo */}
				<Link href="/" className="flex items-center ml-4 md:ml-8">
					<Image
						src="https://res.cloudinary.com/diaoy3wzi/image/upload/v1756982391/vrKP-4_no_bg_jndjxt.png"
						alt="VR KP Logo"
						width={180}
						height={60}
						className="h-12 md:h-16 w-auto object-contain"
						priority
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
					className={`absolute md:static top-16 left-0 w-full md:w-auto px-6 md:px-0 py-4 md:py-0 md:flex items-center gap-6 text-md  font-semibold ${
						isOpen ? "block bg-white text-black" : "hidden md:block"
					}`}>
					<Link href="/" className="block py-2 md:py-0 hover:text-orange-500">
						Home
					</Link>
					<Link
						href="/my-teams"
						className="block py-2 md:py-0 hover:text-orange-500">
						My Teams
					</Link>
					<Link
						href="/my-earnings"
						className="block py-2 md:py-0 hover:text-orange-500">
						My Earnings
					</Link>

					<Link
						href="/profile"
						className="block py-2 md:py-0 hover:text-orange-500">
						My Profile
					</Link>

					{/* Become a Member */}
					{/* <Link href="/member">
						<button className="mt-4 md:mt-0 bg-[#138808] hover:bg-green-700 text-white px-4 py-2 rounded-full transition">
							Become a Member
						</button>
					</Link> */}
					{/* <AuthButton /> */}
					<div className="relative" ref={dropdownRef}>
						<button
							onClick={() => setIsDropdownOpen(!isDropdownOpen)}
							className="mt-4 md:mt-0 bg-[#138808] hover:bg-green-700 text-white px-4 py-2 rounded-full transition">
							<FiUser />
						</button>
						{isDropdownOpen && (
							<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
								<Link
									href="/my-docs"
									className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
									My Documents
								</Link>

								<Link
									href="/settings/password"
									className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
									Change Password
								</Link>

								<Logout />
							</div>
						)}
					</div>
				</nav>
			</div>
		</header>
	);
}
