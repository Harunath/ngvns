import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Green Energy | VR KISAN PARIVAAR",
	description: "Clean, renewable power for a cleaner village life.",
};

export default function GreenEnergyPage() {
	return (
		<section className="min-h-screen px-6 py-16 bg-white text-slate-800">
			<h1 className="text-4xl font-bold text-black mb-6 text-center">
				Green Energy
			</h1>

			<p className="text-lg max-w-3xl mx-auto mb-8 text-center">
				Clean, renewable power for a cleaner village life. Our green energy
				initiatives empower rural communities with sustainable solutions that
				reduce carbon footprints and improve daily living.
			</p>

			<div className="grid gap-8 max-w-5xl mx-auto md:grid-cols-2">
				<div className="bg-slate-100 p-6 rounded-md shadow">
					<h3 className="text-xl font-semibold mb-2">🌞 Solar Solutions</h3>
					<p>
						Installation of solar lights, water pumps, and microgrids to power
						homes, farms, and schools.
					</p>
				</div>

				<div className="bg-slate-100 p-6 rounded-md shadow">
					<h3 className="text-xl font-semibold mb-2">♻️ Biogas Units</h3>
					<p>
						Eco-friendly energy generated from organic waste to power kitchens
						and small industries.
					</p>
				</div>

				<div className="bg-slate-100 p-6 rounded-md shadow">
					<h3 className="text-xl font-semibold mb-2">⚙️ Farm Tools</h3>
					<p>
						Providing farmers with energy-efficient agricultural tools to
						improve productivity and reduce emissions.
					</p>
				</div>

				<div className="bg-slate-100 p-6 rounded-md shadow">
					<h3 className="text-xl font-semibold mb-2">🌱 Community Education</h3>
					<p>
						Training locals to maintain and benefit from green energy systems
						sustainably.
					</p>
				</div>
			</div>
		</section>
	);
}
