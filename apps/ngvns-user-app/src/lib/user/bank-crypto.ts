// lib/crypto.ts (server)
import crypto from "crypto";

const KEY = process.env.FIELD_ENCRYPTION_KEY;
if (!KEY)
	throw new Error("Missing FIELD_ENCRYPTION_KEY env var (32 bytes base64)");

const KEY_BUF = Buffer.from(KEY, "base64"); // set env as base64(32 bytes)

export function encrypt(text: string) {
	const iv = crypto.randomBytes(12); // 96-bit recommended for GCM
	const cipher = crypto.createCipheriv("aes-256-gcm", KEY_BUF, iv);
	const encrypted = Buffer.concat([
		cipher.update(text, "utf8"),
		cipher.final(),
	]);
	const tag = cipher.getAuthTag();
	// store iv + tag + ciphertext base64
	return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

export function decrypt(payload: string) {
	const [ivB64, tagB64, dataB64] = payload.split(":");
	if (!ivB64 || !tagB64 || !dataB64)
		throw new Error("Invalid encrypted payload");
	const iv = Buffer.from(ivB64, "base64");
	const tag = Buffer.from(tagB64, "base64");
	const data = Buffer.from(dataB64, "base64");
	const decipher = crypto.createDecipheriv("aes-256-gcm", KEY_BUF, iv);
	decipher.setAuthTag(tag);
	const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
	return decrypted.toString("utf8");
}
