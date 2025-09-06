import Image from "next/image";

export const metadata = {
	title: "Rural Employment | VR KISAN PARIVAAR",
	description:
		"Creating jobs and sustainable incomes through skill development, business support, and market linkages.",
};

export default function RuralEmploymentPage() {
	return (
		<section className="min-h-screen bg-white text-slate-800 py-16 px-6 md:px-16">
			<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
				<div>
					<h1 className="text-4xl font-bold text-black mb-6">
						Rural Employment
					</h1>
					<p className="text-lg mb-4">
						At VR KISAN PARIVAAR, we believe that strong villages are built on
						thriving local economies. Our Rural Employment initiatives aim to
						unlock the potential of rural communities by creating dignified,
						sustainable livelihood opportunities for all.
					</p>
					<ul className="list-disc list-inside space-y-2 text-base">
						<li>Skill training and digital literacy for youth and women</li>
						<li>Support for local small businesses and micro-enterprises</li>
						<li>Market linkage programs to connect products with buyers</li>
					</ul>
					<p className="text-base mt-4">
						By focusing on practical skills, entrepreneurship, and local market
						connections, we help villagers build incomes that stay within their
						communities. These programs not only generate jobs but also create a
						sense of pride, stability, and self-reliance in rural life.
					</p>
				</div>

				<div className="w-full">
					<Image
						src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1751478526/india-rural-economy-16-9_nriovz.jpg"
						alt="Rural Employment"
						width={800}
						height={450}
						className="rounded-xl shadow-lg object-cover w-full h-auto"
					/>
				</div>
			</div>
		</section>
	);
}
