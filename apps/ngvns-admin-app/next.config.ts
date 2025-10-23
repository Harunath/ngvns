import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	/* config options here */
	images: {
		formats: ["image/avif", "image/webp"],
		remotePatterns: [
			{
				protocol: "https",
				hostname: "res.cloudinary.com",
			},
			{
				protocol: "https",
				hostname: "static.vecteezy.com",
			},
			{
				protocol: "https",
				hostname: "pub-98a0b13dd37c4b7b84e18b52d9c03d5e.r2.dev",
			},
		],
	},
};

export default nextConfig;
