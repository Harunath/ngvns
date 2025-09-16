// lib/otp.ts
import crypto from "crypto";

export function generateOtp(len = 6) {
	const code = Array.from({ length: len }, () =>
		Math.floor(Math.random() * 10)
	).join("");
	return code;
}

export function hashOtp(code: string) {
	return crypto.createHash("sha256").update(code).digest("hex");
}

export function isExpired(expiresAt?: Date | null) {
	if (!expiresAt) return true;
	return new Date() > new Date(expiresAt);
}

export function expiryFromNow(minutes = 10) {
	const d = new Date();
	d.setMinutes(d.getMinutes() + minutes);
	return d;
}
