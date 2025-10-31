// lib/responses.ts
import { NextResponse } from "next/server";

export function ok(data: any, init: number = 200) {
	return NextResponse.json({ ok: true, ...data }, { status: init });
}
export function bad(message: string, status = 400, extra?: any) {
	console.log("Bad response:", message, extra);
	return NextResponse.json({ ok: false, message, ...extra }, { status });
}
