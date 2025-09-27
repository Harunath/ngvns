import Footer from "../../components/common/Footer";
import Navbar from "../../components/common/Navbar";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen w-screen">
			<Navbar />
			<div className="min-h-[80vh]">{children}</div>
			<Footer />
		</div>
	);
}
