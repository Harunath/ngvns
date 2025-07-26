"use client";

import Link from "next/link";
import {
	FaFacebookF,
	FaTwitter,
	FaInstagram,
	FaLinkedin,
} from "react-icons/fa";

export default function Footer() {
	return (
		<footer className="bg-[#001f3f] text-white w-full">
			<div className="w-full px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* About */}
				<div>
					<h2 className="text-lg font-bold text-[#FF9933] mb-4">
						NAVA GRAMEEN
					</h2>
					<p className="text-sm text-gray-300">
						Empowering rural India through sustainability, innovation, and
						inclusion. Together, we build self-reliant villages for a better
						tomorrow.
					</p>
				</div>

				{/* Quick Links */}
				<div>
					<h3 className="text-md font-semibold text-[#FF9933] mb-3">
						Quick Links
					</h3>
					<ul className="space-y-2 text-sm">
						<li>
							<Link href="/" className="hover:text-[#FF9933]">
								Home
							</Link>
						</li>
						<li>
							<Link href="/about" className="hover:text-[#FF9933]">
								About Us
							</Link>
						</li>
						<li>
							<Link href="/impact" className="hover:text-[#FF9933]">
								Impact
							</Link>
						</li>
						<li>
							<Link href="/contact" className="hover:text-[#FF9933]">
								Contact
							</Link>
						</li>
					</ul>
				</div>

				{/* Our Work */}
				<div>
					<h3 className="text-md font-semibold text-[#FF9933] mb-3">
						Our Work
					</h3>
					<ul className="space-y-2 text-sm text-gray-300">
						<li>
							<Link
								href="/our-work/self-sustainable-villages"
								className="hover:text-[#FF9933]">
								Self-Sustainable Villages
							</Link>
						</li>
						<li>
							<Link
								href="/our-work/natural-farming"
								className="hover:text-[#FF9933]">
								Natural Farming
							</Link>
						</li>
						<li>
							<Link
								href="/our-work/women-empowerment"
								className="hover:text-[#FF9933]">
								Women Empowerment
							</Link>
						</li>
						<li>
							<Link
								href="/our-work"
								className="hover:text-[#FF9933] font-medium text-white">
								→ View All Programs
							</Link>
						</li>
						<li>
							<Link
								href="/join"
								className="hover:text-[#FF9933] font-medium text-white">
								✅ Become a Member
							</Link>
						</li>
					</ul>
				</div>

				{/* Contact + Social */}
				<div>
					<h3 className="text-md font-semibold text-[#FF9933] mb-3">
						Contact Us
					</h3>
					<p className="text-sm text-gray-300 mb-4">
						Email: info@nava.org
						<br />
						Phone: +91-XXXXXXXXXX
					</p>
					<div className="flex space-x-4 text-xl">
						<a
							href="#"
							aria-label="Facebook"
							className="text-[#1877F2] hover:text-[#FF9933] transition-colors duration-300">
							<FaFacebookF />
						</a>
						<a
							href="#"
							aria-label="Twitter"
							className="text-[#1DA1F2] hover:text-[#FF9933] transition-colors duration-300">
							<FaTwitter />
						</a>
						<a
							href="#"
							aria-label="Instagram"
							className="text-[#E1306C] hover:text-[#FF9933] transition-colors duration-300">
							<FaInstagram />
						</a>
						<a
							href="#"
							aria-label="LinkedIn"
							className="text-[#0077B5] hover:text-[#FF9933] transition-colors duration-300">
							<FaLinkedin />
						</a>
					</div>
				</div>
			</div>

			{/* Bottom Bar */}
			<div className="border-t border-gray-700 py-4 text-center text-xs text-gray-400 w-full">
				&copy; {new Date().getFullYear()} NAVA GRAMEEN VIKAS NIRMAN SOCIETY. All
				rights reserved.
			</div>
		</footer>
	);
}
