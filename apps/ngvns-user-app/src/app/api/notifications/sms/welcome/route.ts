import { NextRequest, NextResponse } from "next/server";
import { ensureWelcomeSms } from "../../../../../utils/welcomeMsgPhone";

export async function POST(req: NextRequest) {
	try {
		console.log("inside welcome sms route");
		const { mobile, memberIdPassword, idempotencyKey } = await req.json();

		if (!mobile || !memberIdPassword || !idempotencyKey) {
			console.error("Missing required fields");
			return NextResponse.json(
				{ ok: false, error: "mobile & memberIdPassword required" },
				{ status: 400 }
			);
		}

		const result = await ensureWelcomeSms({
			mobile: String(mobile),
			memberIdPassword: String(memberIdPassword),
			idempotencyKey: idempotencyKey,
			// optional overrides:
			maxSendRetries: 3,
			pollIntervalMs: 5000,
			// maxPollSeconds: 180,
		});

		return NextResponse.json(result, { status: result.ok ? 200 : 500 });
	} catch (err: any) {
		return NextResponse.json(
			{ ok: false, error: String(err?.message || err) },
			{ status: 500 }
		);
	}
}
