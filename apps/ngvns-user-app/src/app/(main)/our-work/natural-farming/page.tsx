import Image from "next/image";

export const metadata = {
	title: "Natural Farming – Nava Grameen",
	description: "Farming in harmony with the environment",
};

export default function NaturalFarmingPage() {
	return (
		<main className="min-h-screen bg-white text-gray-900 px-6 py-16">
			<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
				<div>
					<h1 className="text-4xl font-bold mb-4 text-black">
						Natural Farming
					</h1>
					<p className="text-lg mb-6">
						Farming in harmony with the environment. Our initiative promotes
						sustainable agriculture that nurtures the soil, protects
						biodiversity, and ensures healthier livelihoods.
					</p>

					<ul className="list-disc list-inside space-y-2 text-base text-gray-800">
						<li>
							<strong>Organic training programs:</strong> Educating farmers on
							natural cultivation techniques, without chemicals.
						</li>
						<li>
							<strong>Natural soil and pest management:</strong> Encouraging
							bio-fertilizers, compost, and herbal pest control.
						</li>
						<li>
							<strong>Seed preservation:</strong> Protecting indigenous seeds
							and promoting seed banks for future generations.
						</li>
					</ul>
				</div>

				<div className="w-full">
					<Image
						src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1752471456/4f4a1a9d7c51499e0f4d28ec5e128022_jjhwgw.jpg"
						alt="Natural Farming"
						width={700}
						height={500}
						className="rounded-xl shadow-lg"
					/>
				</div>
			</div>

			<section className="mt-16 text-center">
				<h2 className="text-2xl font-semibold mb-4 text-black">
					Building a Greener Future
				</h2>
				<p className="text-md max-w-3xl mx-auto">
					By empowering farmers to return to nature-friendly practices, we are
					restoring soil health, ensuring food security, and building
					self-reliant rural communities.
				</p>
			</section>
		</main>
	);
}
