"use client";

export default function StayConnected() {
	return (
		<section className="bg-green-700 text-white py-20 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 2xl:px-48 text-center">
			<h2 className="text-3xl md:text-4xl font-bold mb-4 text-[#FF9933]">
				Stay Connected
			</h2>

			<p className="text-base md:text-lg mb-10 text-gray-200 max-w-3xl mx-auto">
				Be part of our mission to build sustainable futures. Get updates on new
				initiatives, inspiring success stories, and rural innovations.
			</p>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					alert("Thank you for subscribing!");
				}}
				className="max-w-2xl mx-auto w-full flex flex-col sm:flex-row items-center gap-4">
				<input
					type="email"
					placeholder="Enter your email address"
					required
					className="w-full px-5 py-3 rounded-full bg-white text-black placeholder-gray-500 shadow-md focus:outline-none focus:ring-2 focus:ring-[#138808] transition duration-300"
				/>
				<button
					type="submit"
					className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-full shadow-md transition duration-300 whitespace-nowrap">
					Subscribe
				</button>
			</form>

			<p className="text-sm mt-6 text-gray-300 max-w-xl mx-auto">
				We respect your privacy. No spam – unsubscribe anytime.
			</p>
		</section>
	);
}
