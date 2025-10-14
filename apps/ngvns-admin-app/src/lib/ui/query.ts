export function buildQS(params: Record<string, unknown>) {
	const sp = new URLSearchParams();
	Object.entries(params).forEach(([k, v]) => {
		if (v === undefined || v === null || v === "") return;
		sp.set(k, String(v));
	});
	const s = sp.toString();
	return s ? `?${s}` : "";
}
