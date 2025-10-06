import Image from "next/image";

export const metadata = {
	title: "Agri-Waste Management | VR KISAN PARIVAAR",
	description:
		"Transforming agricultural waste into wealth through composting, biogas, and eco-friendly residue products in rural India.",
};

export default function Page() {
	return (
		<section className="min-h-screen bg-white text-slate-800 py-16 px-6 md:px-16">
			<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
				{/* Text Content */}
				<div>
					<h1 className="text-4xl font-bold text-black mb-6">
						Agri-Waste Management
					</h1>
					<p className="text-lg mb-4">
						Turning agricultural waste into wealth to promote eco-friendly
						farming and environmental sustainability.
					</p>
					<ul className="list-disc list-inside space-y-2 text-base">
						<li>Composting and organic manure preparation</li>
						<li>Biogas generation from crop residues</li>
						<li>Creating eco-friendly products from farm waste</li>
					</ul>
					<p className="mt-4 text-base text-slate-700">
						Our approach reduces pollution, improves soil health, and creates
						local green enterprises — enabling farmers to benefit both
						economically and ecologically.
					</p>
				</div>

				{/* Image */}
				<div className="w-full">
					<Image
						src="https://res.cloudinary.com/diaoy3wzi/image/upload/v1759741645/ChatGPT_Image_Oct_6_2025_02_32_28_PM_yazhtp.png"
						alt="Agri-Waste Management"
						width={800}
						height={450}
						className="rounded-xl shadow-lg object-cover w-full h-auto"
					/>
				</div>
			</div>
		</section>
	);
}
