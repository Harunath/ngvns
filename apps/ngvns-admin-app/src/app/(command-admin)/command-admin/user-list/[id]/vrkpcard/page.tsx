import prisma from "@ngvns2025/db/client";
import React from "react";
import Image from "next/image";
import GenerateVrkpCard from "../../../../../../components/common/admins/user/GenerateVrkpCard";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = await params;
	if (!id) {
		return <>Something went wrong.</>;
	}
	const card = await prisma.vRKP_Card.findUnique({
		where: {
			userId: id,
		},
	});
	if (!card) {
		return (
			<>
				No VRKP Card found for this user.
				<GenerateVrkpCard userId={id} role="super-admin" />
			</>
		);
	}
	return (
		<div>
			<h1 className="text-2xl font-bold mb-4">VRKP Card already exists</h1>
			<p>
				<strong>Card Number:</strong> {card.cardNumber}
			</p>
			{card.cardUrl ? (
				<Image
					src={card.cardUrl!}
					alt="VRKP Card QR Code"
					width={400}
					height={200}
					className=" h-48 w-96"
				/>
			) : (
				<p className=" text-red-400 ">Card url is not available.</p>
			)}
		</div>
	);
};

export default page;
