import Link from "next/link";

export default function Hero() {
	return (
		<section className="min-h-screen w-screen bg-linear-to-b/hsl from-orange-400 from-30% via-white via-65% to-green-400 to-90% flex items-center justify-center px-4 py-8">
			<div className="max-w-screen-xl mx-auto flex flex-col items-center justify-center lg:pt-40 pt-[140px]">
				<h1
					className="text-3xl md:text-5xl text-center font-bold 
             bg-gradient-to-r from-orange-300 via-white to-green-500 
             bg-clip-text text-transparent 
             uppercase tracking-widest mb-3 
             drop-shadow-md saturate-200">
					NAVA GRAMEEN VIKAS NIRMAN SOCIETY
				</h1>

				<h4 className="text-xl md:text-3xl font-bold text-[#5a6169] leading-tight mb-6">
					Building Sustainable Futures for Rural India
				</h4>

				<p className="text-gray-800 text-md md:text-lg font-medium max-w-2xl mx-auto mb-10">
					Empowering villages through clean energy, sustainable farming,
					women-led initiatives, and rural employment. Together, we shape a
					self-reliant and green Bharat.
				</p>

				<div className="flex flex-col sm:flex-row gap-4">
					<Link href="/register">
						<button className=" cursor-pointer bg-orange-600 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow">
							Become a Member
						</button>
					</Link>
					<Link href="/our-work">
						<button className=" cursor-pointer bg-gray-100 hover:bg-gray-200 text-black px-6 py-3 rounded-full font-semibold transition-all duration-300 shadow">
							Explore Our Work
						</button>
					</Link>
				</div>
			</div>
		</section>
	);
}
