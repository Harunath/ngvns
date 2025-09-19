import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const bodyText = await req.text(); // raw string: "status=CHARGED&...&order_id=VRKP..."
		const params = new URLSearchParams(bodyText); // parse form body
		const orderId = params.get("order_id"); // ✅ here’s your order_id

		if (!orderId) {
			return NextResponse.redirect(
				new URL("/payment/error?reason=missing-order", req.url)
			);
		}

		return NextResponse.redirect(
			new URL(`/join/payment/catch/${orderId}`, req.url)
		);
	} catch (err) {
		console.error("Return URL error:", err);
		return NextResponse.redirect(
			new URL("/payment/error?reason=server", req.url)
		);
	}
}
