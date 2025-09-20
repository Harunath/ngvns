import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const bodyText = await req.text(); // raw string: "status=CHARGED&...&order_id=VRKP..."
		const params = new URLSearchParams(bodyText); // parse form body
		const orderId = params.get("order_id"); // ✅ here’s your order_id

		if (!orderId) {
			return NextResponse.redirect(
				new URL(
					"https://www.vrkisanparivaar.com/join/payment/error?reason=missing-order",
					req.url
				),
				303
			);
		}

		// 🔑 Force GET here (303), do NOT use the default 307
		return NextResponse.redirect(
			new URL(
				`https://www.vrkisanparivaar.com/join/payment/catch/${orderId}`,
				req.url
			),
			303
		);
	} catch (err) {
		console.error("Return URL error:", err);
		return NextResponse.redirect(
			new URL(
				"https://www.vrkisanparivaar.com/join/payment/error?reason=server",
				req.url
			),
			303
		);
	}
}
