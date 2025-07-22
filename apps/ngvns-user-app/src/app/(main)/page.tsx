import Image from "next/image";
import Link from "next/link";

export default function Home() {
	return (
		<main className="min-h-screen">
			<h1 className=" text-9xl">NGVNS User app</h1>
			<Link href="/register">Register</Link>
		</main>
	);
}
