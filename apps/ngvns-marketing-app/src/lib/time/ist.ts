// lib/time/ist.ts
const IST_OFFSET_MIN = 5 * 60 + 30;

export function toIstDateParts(d: Date) {
	const ist = new Date(d.getTime() + IST_OFFSET_MIN * 60_000);
	return {
		y: ist.getUTCFullYear(),
		m: ist.getUTCMonth() + 1,
		d: ist.getUTCDate(),
	};
}

export function pad(n: number) {
	return n < 10 ? `0${n}` : `${n}`;
}

/** Returns YYYY-MM-DD for "today" in IST */
export function todayIstYmd() {
	const { y, m, d } = toIstDateParts(new Date());
	return `${y}-${pad(m)}-${pad(d)}`;
}

/** Add `days` to an IST calendar date (YYYY-MM-DD), returns YYYY-MM-DD in IST */
export function addDaysIstYmd(yyyy_mm_dd: string, days: number) {
	const [y, m, d] = yyyy_mm_dd.split("-").map(Number);
	if (!y || !m || !d) {
		throw new Error(`Invalid date string: ${yyyy_mm_dd}`);
	}
	const baseIstMidnightUtc = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
	// move to IST real midnight by subtracting offset, then add days, then back to Y-M-D in IST
	const target = new Date(baseIstMidnightUtc.getTime() + days * 86400_000);
	const {
		y: yy,
		m: mm,
		d: dd,
	} = toIstDateParts(
		new Date(target.getTime()) // still get IST calendar
	);
	return `${yy}-${pad(mm)}-${pad(dd)}`;
}

export function prettyIstRange(fromYmd: string, toYmd: string) {
	const fmt = (ymd: string) => {
		const [y, m, d] = ymd.split("-").map(Number);
		if (!y || !m || !d) {
			throw new Error(`Invalid date string: ${ymd}`);
		}
		const date = new Date(Date.UTC(y, m - 1, d, 0, 0, 0));
		return date.toLocaleDateString("en-IN", {
			year: "numeric",
			month: "short",
			day: "2-digit",
			timeZone: "Asia/Kolkata",
		});
	};
	return `${fmt(fromYmd)} 12:00 AM IST → ${fmt(toYmd)} 12:00 AM IST`;
}

/** Presets */
export function presetToday1Day() {
	const from = todayIstYmd();
	const to = addDaysIstYmd(from, 1);
	return { from, to };
}

export function presetLast7Days() {
	// last 7 FULL days: [today-7, today)
	const to = todayIstYmd();
	const from = addDaysIstYmd(to, -7);
	return { from, to };
}
