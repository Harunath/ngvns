// app/api/payments/hdfc/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function verify(body: string, receivedSig: string) {
	const hmac = crypto.createHmac("sha256", process.env.HDFC_SG_WEBHOOK_SECRET!);
	hmac.update(body, "utf8");
	const expected = hmac.digest("hex");
	return crypto.timingSafeEqual(
		Buffer.from(expected),
		Buffer.from(receivedSig)
	);
}

export async function POST(req: NextRequest) {
	const raw = await req.text(); // IMPORTANT: read raw body for signature
	const sig = req.headers.get("x-webhook-signature") || ""; // header name per dashboard/docs
	if (!verify(raw, sig))
		return NextResponse.json({ ok: false }, { status: 400 });

	const evt = JSON.parse(raw);
	// evt.order_id, evt.status, evt.txn_id, amount, etc. (fields per docs)

	// (Optional but recommended) fetch Order Status again to reconcile:
	// const r = await fetch(`${process.env.HDFC_SG_BASE_URL}/.../order-status-api`, ...)

	// Idempotent upsert in your DB by order_id
	// await prisma.payment.upsert({ ... });

	return NextResponse.json({ ok: true }, { status: 200 });
}
