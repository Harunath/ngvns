import Image from "next/image";

export const metadata = {
	title: "Women Empowerment | VR KISAN PARIVAAR",
	description:
		"Empowering rural women through SHGs, microfinance, leadership training, and enterprise development for sustainable community growth.",
};

export default function Page() {
	return (
		<section className="min-h-screen bg-white text-slate-800 py-16 px-6 md:px-16">
			<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
				<div>
					<h1 className="text-4xl font-bold text-pink-700 mb-6">
						Women Empowerment
					</h1>
					<p className="text-lg mb-4">
						Putting women at the center of rural progress through inclusive
						programs that strengthen confidence, self-reliance, and leadership.
					</p>
					<ul className="list-disc list-inside space-y-2 text-base">
						<li>SHG (Self-Help Group) formation and training</li>
						<li>Microfinance access and enterprise support</li>
						<li>Literacy, leadership, and skill development programs</li>
					</ul>
					<p className="mt-4 text-base text-slate-700">
						Empowered women uplift families, improve education for children, and
						contribute significantly to their local economies. Our goal is to
						enable every woman to become a changemaker within her community.
					</p>
				</div>

				<div className="w-full">
					<Image
						src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1751479105/International-Women_s-Day-22_ji0lt7.jpg"
						alt="Women Empowerment"
						width={800}
						height={450}
						className="rounded-xl shadow-lg object-cover w-full h-auto"
					/>
				</div>
			</div>
		</section>
	);
}
