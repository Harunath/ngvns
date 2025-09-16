// lib/gatewayOrderId.ts
import crypto from "crypto";

// Uppercase base36 without symbols, non-sequential (ts + random)
export function makeGatewayOrderId(prefix = "VRKP") {
	const ts = Date.now().toString(36).toUpperCase(); // time component
	const rnd = BigInt("0x" + crypto.randomBytes(6).toString("hex")) // 48 bits
		.toString(36)
		.toUpperCase()
		.padStart(10, "0");
	let id = (prefix.replace(/[^A-Z0-9]/gi, "") + ts + rnd).toUpperCase();
	// HDFC/Juspay: < 21 chars, alphanumeric; trim to 20 to be safe across docs
	id = id.slice(0, 20);
	// Guard: must be [A-Z0-9]+ and length >= 8 (your policy)
	if (!/^[A-Z0-9]{8,20}$/.test(id)) return makeGatewayOrderId(prefix); // regenerate edge-cases
	return id;
}

console.log(makeGatewayOrderId());
