import { redirect } from "next/navigation";

export default function Home() {
	redirect("/login");
	return (
		<main>
			<h1>Admin app</h1>
		</main>
	);
}
