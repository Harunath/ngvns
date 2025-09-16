"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
	paymentId: string;
	intervalMs?: number; // polling interval (default: 5s)
	maxAttempts?: number; // max attempts (default: 12 ~1 min)
};

type PaymentStatus = "INITIATED" | "PENDING" | "SUCCESS" | "FAILED" | string;

export default function PaymentStatusPoller({
	paymentId,
	intervalMs = 5000,
	maxAttempts = 12,
}: Props) {
	const [status, setStatus] = useState<PaymentStatus>("INITIATED");
	const [error, setError] = useState<string | null>(null);

	const attemptsRef = useRef(0);
	const intervalRef = useRef<NodeJS.Timeout | null>(null);
	const isMounted = useRef(true);

	useEffect(() => {
		isMounted.current = true;

		const pollPaymentStatus = async () => {
			try {
				const res = await fetch(
					`/api/payments/hdfc/status-check?paymentId=${paymentId}`
				);
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Unexpected response");

				if (!isMounted.current) return;
				setStatus(data.status);

				// stop polling if status is final
				if (["SUCCESS", "FAILED"].includes(data.status)) {
					stopPolling();
				}
			} catch (err: any) {
				console.error("Payment poll error:", err.message);

				if (!isMounted.current) return;

				// soft-fail: show error but keep trying unless maxAttempts exceeded
				setError(`Retrying… (${err.message})`);
			}
		};

		const stopPolling = () => {
			if (intervalRef.current) clearInterval(intervalRef.current);
			intervalRef.current = null;
		};

		// run once immediately
		pollPaymentStatus();

		// schedule polling
		intervalRef.current = setInterval(() => {
			attemptsRef.current++;
			if (attemptsRef.current > maxAttempts) {
				stopPolling();
				if (isMounted.current) {
					setError("Polling timed out. Please refresh the page.");
				}
				return;
			}
			pollPaymentStatus();
		}, intervalMs);

		// cleanup
		return () => {
			isMounted.current = false;
			stopPolling();
		};
	}, [paymentId, intervalMs, maxAttempts]);

	// UI
	return (
		<div className="absolute inset-0 p-6 border rounded shadow bg-white">
			<h2 className="font-bold text-lg mb-2">Payment Status</h2>

			{error && <p className="text-red-600 mb-2">{error}</p>}

			<p className="mt-2 text-gray-700 flex items-center gap-2">
				{status === "INITIATED" && <>⏳ Waiting for payment confirmation…</>}
				{status === "PENDING" && <>🔄 Payment is processing…</>}
				{status === "SUCCESS" && <>✅ Payment successful!</>}
				{status === "FAILED" && <>❌ Payment failed.</>}
				{!["INITIATED", "PENDING", "SUCCESS", "FAILED"].includes(status) &&
					`ℹ️ Status: ${status}`}
			</p>
		</div>
	);
}
