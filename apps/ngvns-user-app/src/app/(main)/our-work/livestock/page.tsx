import Image from "next/image";

export const metadata = {
	title: "Livestock Management | VR KISAN PARIVAAR",
	description:
		"Supporting rural farmers with veterinary care, training, and better infrastructure for dairy, poultry, and goat rearing.",
};

export default function Page() {
	return (
		<section className="min-h-screen bg-white text-slate-800 py-16 px-6 md:px-16">
			<div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
				<div>
					<h1 className="text-4xl font-bold text-black mb-6">
						Livestock Management
					</h1>
					<p className="text-lg mb-4">
						Healthier livestock mean improved nutrition, higher income, and
						rural prosperity.
					</p>
					<ul className="list-disc list-inside space-y-2 text-base">
						<li>Access to veterinary services and animal health camps</li>
						<li>Fodder cultivation support and better shelter facilities</li>
						<li>Training in dairy farming, poultry, and goat care</li>
					</ul>
					<p className="mt-4 text-base text-slate-700">
						We work with farmers to improve animal productivity and livelihoods,
						while promoting sustainable and ethical livestock practices.
					</p>
				</div>

				<div className="w-full">
					<Image
						src="https://res.cloudinary.com/dgulr1hgd/image/upload/v1698410526/livestock-training-villagers_uspgdn.jpg"
						alt="Livestock Management"
						width={800}
						height={450}
						className="rounded-xl shadow-lg object-cover w-full h-auto"
					/>
				</div>
			</div>
		</section>
	);
}
