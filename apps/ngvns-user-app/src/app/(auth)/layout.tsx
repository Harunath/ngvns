import { getServerSession } from "next-auth";
import AuthNavbar from "../../components/common/AuthNavbar";
import { authOptions } from "../../lib/auth/auth";
import { redirect } from "next/navigation";

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await getServerSession(authOptions);
	if (session?.user?.id) {
		redirect("/dashboard");
	}
	return (
		<div className="min-h-screen w-screen">
			<AuthNavbar />
			{children}
		</div>
	);
}
