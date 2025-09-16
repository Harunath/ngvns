import AuthNavbar from "../../components/common/AuthNavbar";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen w-screen">
			<AuthNavbar />
			{children}
		</div>
	);
}
