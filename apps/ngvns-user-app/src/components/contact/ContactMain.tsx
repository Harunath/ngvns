"use client";
import React from "react";
import {
	FaMapMarkerAlt,
	FaPhoneAlt,
	FaEnvelope,
	FaGlobe,
	FaPaperPlane,
} from "react-icons/fa";

const ContactMain = () => {
	return (
		<section className="bg-white text-black py-16 px-4 md:px-12">
			<div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12">
				{/* Left - Contact Info */}
				<div className="border border-orange-500 p-8 rounded-lg shadow-lg">
					<h4 className="text-sm text-orange-500 font-semibold uppercase mb-2">
						Contact Us
					</h4>
					<h2 className="text-3xl md:text-4xl font-bold mb-4 text-black">
						Let’s Start a Conversation
					</h2>
					<p className="text-slate-600 mb-6 leading-relaxed">
						Have questions or inquiries? We're here to help. Reach out to us
						anytime and we'll respond promptly.
					</p>

					<hr className="border-t border-orange-500 mb-6" />

					{/* Address */}
					<div className="flex items-start gap-4 mb-6">
						<FaMapMarkerAlt className="text-orange-500 text-xl min-w-[24px]" />
						<div>
							<h4 className="font-bold text-black">Address</h4>
							<p className="text-slate-700 leading-relaxed">
								#101, Dwarakapuri Colony, <br />
								Hyderabad, Telangana – 500082
							</p>
						</div>
					</div>

					{/* Phone */}
					{/* <div className="flex items-center gap-4 mb-4">
						<FaPhoneAlt className="text-orange-500 text-xl min-w-[24px]" />
						<div>
							<h4 className="font-bold text-black">Phone</h4>
							<p className="text-slate-700">+91 9515934289</p>
						</div>
					</div> */}

					{/* Email */}
					<div className="flex items-center gap-4 mb-4">
						<FaEnvelope className="text-orange-500 text-xl min-w-[24px]" />
						<div>
							<h4 className="font-bold text-black">Email</h4>
							<p className="text-slate-700">support@vrkisanparivaar.com</p>
						</div>
					</div>

					{/* Website */}
					<div className="flex items-center gap-4">
						<FaGlobe className="text-orange-500 text-xl min-w-[24px]" />
						<div>
							<h4 className="font-bold text-black">Website</h4>
							<p className="text-blue-700 hover:underline">
								<a
									href="https://www.vrkisanparivaar.com/"
									target="_blank"
									rel="noreferrer">
									www.vrkisanparivaar.com
								</a>
							</p>
						</div>
					</div>
				</div>

				{/* Right - Form */}
				<div className="bg-slate-100 shadow-2xl p-8 rounded-lg">
					<form className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block font-semibold mb-1 text-black">
									Name <span className="text-orange-500">*</span>
								</label>
								<input
									type="text"
									placeholder="Your Name"
									className="w-full px-4 py-2 rounded border border-slate-300 bg-white text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
								/>
							</div>
							<div>
								<label className="block font-semibold mb-1 text-black">
									Email <span className="text-orange-500">*</span>
								</label>
								<input
									type="email"
									placeholder="Your Email"
									className="w-full px-4 py-2 rounded border border-slate-300 bg-white text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
								/>
							</div>
							<div>
								<label className="block font-semibold mb-1 text-black">
									Mobile Number <span className="text-orange-500">*</span>
								</label>
								<input
									type="tel"
									placeholder="Your Mobile Number"
									className="w-full px-4 py-2 rounded border border-slate-300 bg-white text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
									pattern="[0-9]{10}"
									maxLength={10}
									required
								/>
							</div>
						</div>
						<div>
							<label className="block font-semibold mb-1 text-black">
								Message
							</label>
							<textarea
								rows={6}
								placeholder="Your Message"
								className="w-full px-4 py-2 rounded border border-slate-300 bg-white text-black placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"></textarea>
						</div>
						<button
							type="submit"
							className="flex items-center gap-2 bg-orange-500 text-white px-6 py-3 rounded hover:bg-orange-600 transition-all">
							<FaPaperPlane />
							Send Message
						</button>
					</form>
				</div>
			</div>
		</section>
	);
};

export default ContactMain;
