import prisma from "@ngvns2025/db/client";
import { randomUUID } from "crypto";

const BASE_SEND_URL = "https://smslogin.co/v3/api.php";
const BASE_REPORT_URL = "https://smslogin.co/v3/report.php";

const USERNAME = process.env.SMS_USERNAME!;
const APIKEY = process.env.SMS_API_KEY!;
const SENDERID = process.env.SMS_SENDER_ID!;
const TEMPLATE_ID = process.env.SMS_WELCOME_TEMPLATE_ID!;

// --- Types ---
type DeliveryState = "Delivery" | "Submitted" | "Failed";
type EnsureOptions = {
	mobile: string; // e.g., "91XXXXXXXXXX"
	memberIdPassword: string; // fills {#var#}
	idempotencyKey?: string; // e.g., onboardingId
	maxSendRetries?: number; // default 3
	pollIntervalMs?: number; // default 5000
	maxPollSeconds?: number; // default 180 (3 min per attempt)
	leaseSeconds?: number; // default 300
};

function log(
	ctx: Record<string, any>,
	msg: string,
	level: "info" | "warn" | "error" = "info"
) {
	const safe = { ...ctx };
	if (safe.APIKEY) safe.APIKEY = "[REDACTED]";
	if (safe.message && String(safe.message).length > 200)
		safe.message = String(safe.message).slice(0, 200) + "…";
	const base = { ts: new Date().toISOString(), level, ...safe, msg };
	console.log(JSON.stringify(base));
}

function requiredEnv(ctx: any) {
	if (!USERNAME || !APIKEY || !SENDERID || !TEMPLATE_ID) {
		log(ctx, "Missing SMS env(s).", "error");
		throw new Error(
			"Missing SMS env(s). Please set SMS_USERNAME, SMS_APIKEY, SMS_SENDER_ID, SMS_WELCOME_TEMPLATE_ID"
		);
	}
}

function composeMessage(memberIdPassword: string) {
	return [
		"Welcome to VR KISAN PARIVAAR.",
		`Your Member ID & Password is ${memberIdPassword} .`,
		"Please login and reset your password and activate health care services.",
		"Thank you.",
	].join("\n");
}

async function providerSend(
	ctx: any,
	{ mobile, message }: { mobile: string; message: string }
): Promise<string> {
	const url = new URL(BASE_SEND_URL);
	url.searchParams.set("username", USERNAME);
	url.searchParams.set("apikey", APIKEY);
	url.searchParams.set("senderid", SENDERID);
	url.searchParams.set("mobile", mobile);
	url.searchParams.set("message", message);
	url.searchParams.set("templateid", TEMPLATE_ID);

	log(ctx, "SEND request → provider", "info");

	const res = await fetch(url.toString(), {
		method: "GET",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
	});

	const text = await res.text();
	log(
		{ ...ctx, httpStatus: res.status, providerBody: text },
		"SEND response ← provider",
		res.ok ? "info" : "warn"
	);

	// Try to extract campid robustly
	let campId = "";
	try {
		const maybeJson = JSON.parse(text);
		campId = maybeJson?.campid || maybeJson?.campId || "";
	} catch {
		const m =
			text.match(/[a-f0-9]{16,36}/i) ||
			text.match(/campid[=: ]+([a-z0-9\-]{8,})/i) ||
			text.match(/([a-z0-9]{8,})/i);
		if (m) campId = (m[1] || m[0]).trim();
	}

	if (!res.ok || !campId) {
		throw new Error(`SMS send failed: HTTP ${res.status}. Body: ${text}`);
	}

	log({ ...ctx, campId }, "SEND parsed campId", "info");
	return campId;
}

async function providerCheck(ctx: any, campId: string): Promise<DeliveryState> {
	const url = new URL(BASE_REPORT_URL);
	url.searchParams.set("username", USERNAME);
	url.searchParams.set("apikey", APIKEY);
	url.searchParams.set("campid", campId);

	log({ ...ctx, campId }, "REPORT request → provider", "info");

	const res = await fetch(url.toString(), { method: "GET" });
	const body = await res.text();
	log(
		{ ...ctx, campId, httpStatus: res.status, providerBody: body },
		"REPORT response ← provider",
		res.ok ? "info" : "warn"
	);

	let reports = body;
	try {
		const json = JSON.parse(body);
		reports = String(json.Reports ?? body);
	} catch {}

	if (/Delivery/i.test(reports)) return "Delivery";
	if (/Submitted/i.test(reports)) return "Submitted";
	if (/Failed/i.test(reports)) return "Failed";
	return "Submitted";
}

async function pollUntilFinal(
	ctx: any,
	campId: string,
	{
		pollIntervalMs = 5000,
		maxPollSeconds = 180,
		onHeartbeat,
	}: {
		pollIntervalMs?: number;
		maxPollSeconds?: number;
		onHeartbeat?: () => Promise<void>; // lease renew callback
	}
): Promise<DeliveryState> {
	log({ ...ctx, campId, pollIntervalMs, maxPollSeconds }, "POLL start", "info");

	const deadline = Date.now() + maxPollSeconds * 1000;
	let ticks = 0;

	while (Date.now() < deadline) {
		const state = await providerCheck(ctx, campId);
		log({ ...ctx, campId, state, tick: ticks }, "POLL state", "info");

		if (state === "Delivery") return "Delivery";
		if (state === "Failed") return "Failed";

		// Heartbeat (renew lease) every tick
		if (onHeartbeat) await onHeartbeat();

		ticks++;
		await new Promise((r) => setTimeout(r, pollIntervalMs));
	}

	log({ ...ctx, campId }, "POLL timeout → treat as Submitted", "warn");
	return "Submitted";
}

function backoffMs(attempt: number, base = 2000, cap = 30000) {
	const exp = Math.min(cap, base * Math.pow(2, attempt));
	const jitter = Math.floor(Math.random() * 1000);
	return exp + jitter;
}

// --- Lease helpers ---
function ownerWhere(id: string, token: string) {
	return { id, processingToken: token };
}

async function claimOrBail(
	ctx: any,
	id: string,
	token: string,
	leaseSeconds: number
) {
	// Only succeed if not owned or lease expired
	const res = await prisma.$executeRawUnsafe(
		`
    UPDATE "SmsMessage"
       SET "processingToken" = $1,
           "processingExpiresAt" = now() + ($2 || ' seconds')::interval
     WHERE id = $3
       AND ( "processingToken" IS NULL OR "processingExpiresAt" < now() )
    `,
		token,
		String(leaseSeconds),
		id
	);
	if (res === 1) {
		log({ ...ctx }, "CLAIM success", "info");
		return true;
	}
	log({ ...ctx }, "CLAIM lost (already processing elsewhere)", "warn");
	return false;
}

async function renewLease(
	ctx: any,
	id: string,
	token: string,
	leaseSeconds: number
) {
	const res = await prisma.smsMessage.updateMany({
		where: ownerWhere(id, token),
		data: { processingExpiresAt: new Date(Date.now() + leaseSeconds * 1000) },
	});
	if (res.count === 1) log({ ...ctx }, "LEASE renewed", "info");
	else log({ ...ctx }, "LEASE renewal failed (lost ownership)", "warn");
	return res.count === 1;
}

async function releaseLease(ctx: any, id: string, token: string) {
	const res = await prisma.smsMessage.updateMany({
		where: ownerWhere(id, token),
		data: { processingToken: null, processingExpiresAt: null },
	});
	if (res.count === 1) log({ ...ctx }, "LEASE released", "info");
	else log({ ...ctx }, "LEASE release noop (not owner)", "warn");
}

// --- Public API ---
export async function ensureWelcomeSms(options: EnsureOptions) {
	const runId = randomUUID(); // correlation id
	const ctxBase = { runId, op: "ensureWelcomeSms" };

	requiredEnv(ctxBase);

	const {
		mobile,
		memberIdPassword,
		idempotencyKey,
		maxSendRetries = 3,
		pollIntervalMs = 5000,
		maxPollSeconds = 180,
		leaseSeconds = 300,
	} = options;

	const text = composeMessage(memberIdPassword);
	const ctx = { ...ctxBase, mobile, templateId: TEMPLATE_ID };

	log(
		{ ...ctx, maxSendRetries, pollIntervalMs, maxPollSeconds, leaseSeconds },
		"BEGIN ensureWelcomeSms",
		"info"
	);

	// Fast-path: already delivered
	const existingDelivered = await prisma.smsMessage.findFirst({
		where: {
			mobile,
			text,
			...(idempotencyKey ? { idempotencyKey } : {}),
			status: "DELIVERED",
		},
		select: { id: true, campId: true },
	});
	if (existingDelivered) {
		log(
			{ ...ctx, smsId: existingDelivered.id, campId: existingDelivered.campId },
			"ALREADY_DELIVERED, exit",
			"info"
		);
		return {
			ok: true,
			status: "DELIVERED",
			campId: existingDelivered.campId,
			alreadyDelivered: true,
		};
	}

	// Find or create the row we’ll work on
	let record = await prisma.smsMessage.findFirst({
		where: {
			mobile,
			text,
			...(idempotencyKey ? { idempotencyKey } : {}),
			status: { in: ["QUEUED", "SUBMITTED", "FAILED"] },
		},
	});

	if (!record) {
		record = await prisma.smsMessage.create({
			data: {
				mobile,
				templateId: TEMPLATE_ID,
				text,
				status: "QUEUED",
				idempotencyKey,
			},
		});
		log({ ...ctx, smsId: record.id }, "ROW created → QUEUED", "info");
	} else {
		log(
			{
				...ctx,
				smsId: record.id,
				status: record.status,
				campId: record.campId,
			},
			"ROW loaded",
			"info"
		);
	}

	const token = randomUUID();
	const smsId = record.id;
	const claimOk = await claimOrBail(
		{ ...ctx, smsId, token },
		smsId,
		token,
		leaseSeconds
	);
	if (!claimOk) {
		return { ok: false, reason: "already_processing" as const };
	}

	let attempt = record.attempts ?? 0;
	let lastError = "";
	try {
		// Ensure ownership before each attempt
		const stillOwner = await renewLease(
			{ ...ctx, smsId, token },
			smsId,
			token,
			leaseSeconds
		);
		if (!stillOwner) {
			log({ ...ctx, smsId, token }, "Lost lease before attempt; abort", "warn");
			return { ok: false, reason: "lost_lease" as const };
		}

		let campId: string = record.campId || "";
		try {
			// SEND (only if no campId)
			if (!campId) {
				log({ ...ctx, smsId, attempt }, "SEND start", "info");

				campId = await providerSend(
					{ ...ctx, smsId, attempt },
					{ mobile, message: text }
				);

				const updated = await prisma.smsMessage.updateMany({
					where: ownerWhere(smsId, token),
					data: {
						campId,
						status: "SUBMITTED",
						attempts: { increment: 1 },
						lastError: null,
					},
				});
				if (updated.count === 0) {
					log({ ...ctx, smsId }, "SEND update lost ownership", "warn");
					return { ok: false, reason: "lost_lease" as const };
				}

				// refresh local record
				record = {
					...record,
					campId,
					status: "SUBMITTED",
					attempts: (record.attempts ?? 0) + 1,
				};
				attempt = record.attempts;
				log(
					{ ...ctx, smsId, campId, attempt },
					"SEND done → SUBMITTED",
					"info"
				);
			} else {
				log(
					{ ...ctx, smsId, campId, attempt },
					"REUSE existing campId → POLL",
					"info"
				);
			}

			// POLL
			const state = await pollUntilFinal(
				{ ...ctx, smsId, campId, attempt },
				campId,
				{
					pollIntervalMs,
					maxPollSeconds,
					onHeartbeat: async () => {
						await renewLease(
							{ ...ctx, smsId, token },
							smsId,
							token,
							leaseSeconds
						);
					},
				}
			);

			if (state === "Delivery") {
				const res = await prisma.smsMessage.updateMany({
					where: ownerWhere(smsId, token),
					data: {
						status: "DELIVERED",
						updatedAt: new Date(),
						lastError: null,
					},
				});
				if (res.count === 0) {
					log({ ...ctx, smsId }, "DELIVERED write lost ownership", "warn");
					return { ok: false, reason: "lost_lease" as const };
				}
				log({ ...ctx, smsId, campId }, "DONE DELIVERED", "info");
				return { ok: true, status: "DELIVERED" as const, campId };
			}

			// Failed or timeout → mark and retry (with fresh campId)
			const errMsg =
				state === "Failed"
					? "Delivery report: Failed"
					: "Delivery report: Submitted timeout";
			lastError = errMsg;

			const res = await prisma.smsMessage.updateMany({
				where: ownerWhere(smsId, token),
				data: {
					status: state === "Failed" ? "FAILED" : "SUBMITTED",
					updatedAt: new Date(),
					lastError: errMsg,
				},
			});
			if (res.count === 0) {
				log({ ...ctx, smsId }, "POLL write lost ownership", "warn");
				return { ok: false, reason: "lost_lease" as const };
			}

			// Decide retry
			attempt++;
			if (attempt > maxSendRetries) {
				log(
					{ ...ctx, smsId, attempt, lastError },
					"Max retries reached",
					"warn"
				);
			}

			// Clear campId for a fresh SEND next loop
			const cleared = await prisma.smsMessage.updateMany({
				where: ownerWhere(smsId, token),
				data: { campId: null, status: "QUEUED" },
			});
			if (cleared.count === 0) {
				log({ ...ctx, smsId }, "Could not clear campId (lost lease)", "warn");
				return { ok: false, reason: "lost_lease" as const };
			}
			record = { ...record, campId: null as any, status: "QUEUED" };

			const sleep = backoffMs(attempt);
			log(
				{ ...ctx, smsId, attempt, sleepMs: sleep, reason: errMsg },
				"RETRY backoff",
				"info"
			);
			await new Promise((r) => setTimeout(r, sleep));
		} catch (e: any) {
			lastError = String(e?.message || e);
			log(
				{ ...ctx, smsId, attempt, error: lastError },
				"ATTEMPT error",
				"error"
			);

			const res = await prisma.smsMessage.updateMany({
				where: ownerWhere(smsId, token),
				data: { status: "FAILED", lastError },
			});
			if (res.count === 0) {
				log({ ...ctx, smsId }, "FAILED write lost ownership", "warn");
				return { ok: false, reason: "lost_lease" as const };
			}

			attempt++;
			if (attempt > maxSendRetries) {
				log(
					{ ...ctx, smsId, attempt, lastError },
					"Max retries after exception",
					"warn"
				);
			}

			const cleared = await prisma.smsMessage.updateMany({
				where: ownerWhere(smsId, token),
				data: { campId: null, status: "QUEUED" },
			});
			if (cleared.count === 0) {
				log(
					{ ...ctx, smsId },
					"Could not clear campId post-exception (lost lease)",
					"warn"
				);
				return { ok: false, reason: "lost_lease" as const };
			}
			record = { ...record, campId: null as any, status: "QUEUED" };

			const sleep = backoffMs(attempt);
			log(
				{ ...ctx, smsId, attempt, sleepMs: sleep },
				"RETRY backoff after exception",
				"info"
			);
			await new Promise((r) => setTimeout(r, sleep));
		}

		log({ ...ctx, smsId, lastError }, "END FAILED", "error");
		return {
			ok: false,
			status: "FAILED" as const,
			error: lastError || "Max retries reached",
		};
	} finally {
		await releaseLease({ ...ctx, smsId, token }, smsId, token);
		log({ ...ctx, smsId }, "END ensureWelcomeSms", "info");
	}
}
