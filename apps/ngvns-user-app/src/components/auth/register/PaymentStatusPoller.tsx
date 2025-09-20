"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "react-toastify";

type Props = {
	intervalMs?: number; // polling interval (default: 5s)
	maxAttempts?: number; // max attempts (default: 12 ~1 min)
};

type PaymentStatus = "INITIATED" | "PENDING" | "SUCCESS" | "FAILED" | string;

export default function PaymentStatusPoller({
	intervalMs = 5000,
	maxAttempts = 12,
}: Props) {
	const { order_id: paymentId } = useParams<{ order_id: string }>();

	if (!paymentId) {
		return null;
	}

	const [status, setStatus] = useState<PaymentStatus>("INITIATED");
	const [error, setError] = useState<string | null>(null);
	const [onBoardingId, setOnBoardingId] = useState<string | null>(null);

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
				if (data.response.customer_id)
					setOnBoardingId(data.response.customer_id);
				// stop polling if status is final
				if (data.status == "SUCCESS" || data.status == "FAILED") {
					stopPolling();
				}
			} catch (err) {
				if (err instanceof Error) {
					if (!isMounted.current) return;
					setError(err.message);
					// soft-fail: show error but keep trying unless maxAttempts exceeded
					setError(`Retrying… (${err.message})`);
				} else setError("An unknown error occurred");
				toast.error(`Payment status check failed`);
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
		<div className="absolute inset-0 z-50 flex flex-col items-center justify-center pt-24 p-6 border rounded shadow bg-white">
			{error ? (
				<PaymentError />
			) : (
				<>
					{status == "INITIATED" && (
						<p>please wait while we are verifying the payment. Thank you.</p>
					)}
					<h2 className="font-bold text-lg mb-2">Payment Status :</h2>
					<p className="mt-2 text-gray-700 flex items-center gap-2">
						{status === "INITIATED" && (
							<>⏳ Waiting for payment confirmation…</>
						)}
						{status === "PENDING" && <PaymentPending />}
						{status === "SUCCESS" && <PaymentCharged />}
						{status === "FAILED" && <PaymentFailed />}

						{!["INITIATED", "PENDING", "SUCCESS", "FAILED"].includes(status) &&
							`ℹ️ Status: ${status}`}
					</p>
				</>
			)}
		</div>
	);
}

// ✅ Payment Charged (Success)
export function PaymentCharged() {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4 }}
			className="flex flex-col items-center justify-center rounded-2xl border bg-green-50 p-8 shadow">
			<motion.div
				initial={{ pathLength: 0 }}
				animate={{ pathLength: 1 }}
				transition={{ duration: 0.6 }}>
				<motion.svg
					initial={{ scale: 0.8 }}
					animate={{ scale: 0.8 }}
					transition={{
						duration: 1,
						ease: "easeInOut",
						repeat: Infinity,
						repeatType: "reverse",
					}}
					className="h-16 w-16 text-green-600"
					viewBox="0 0 48 48"
					fill="none"
					stroke="currentColor"
					strokeWidth="3">
					<circle cx="24" cy="24" r="22" stroke="currentColor" />
					<motion.path
						d="M14 24l6 6 14-14"
						stroke="currentColor"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 1, ease: "easeInOut" }}
					/>
				</motion.svg>
			</motion.div>
			<h2 className="mt-4 text-xl font-semibold text-green-700">
				Payment Charged
			</h2>
			<p className="mt-1 text-sm text-gray-600">Your payment was successful.</p>
			<p className="mt-4 text-gray-700">
				Your payment was successful! You will receive a confirmation message
				shortly. <br />
				You can now proceed to{" "}
				<Link href="/login" className="text-blue-600 underline">
					login
				</Link>{" "}
				to your account.
				<br />
				You will receive a welcome message with further details. <br />
				Thank you for joining VR Kisan Parivaar!
			</p>
		</motion.div>
	);
}

// 🔄 Payment Pending
export function PaymentPending() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.3 }}
			className="flex flex-col items-center justify-center rounded-2xl border bg-yellow-50 p-8 shadow">
			<motion.div
				className="h-12 w-12 rounded-full border-4 border-yellow-300 border-t-yellow-600"
				animate={{ rotate: 360 }}
				transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
			/>
			<h2 className="mt-4 text-xl font-semibold text-yellow-700">
				Payment Pending
			</h2>
			<p className="mt-1 text-sm text-gray-600">
				We are processing your payment…
			</p>
		</motion.div>
	);
}

// ❌ Payment Failed
export function PaymentFailed() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="flex flex-col items-center justify-center rounded-2xl border bg-red-50 p-8 shadow">
			<motion.div
				animate={{ x: [0, -6, 6, -4, 4, 0] }}
				transition={{ duration: 0.6 }}>
				<motion.svg
					initial={{ scale: 0.8 }}
					animate={{ scale: 0.8 }}
					transition={{
						duration: 1,
						ease: "easeInOut",
						repeat: Infinity,
						repeatType: "reverse",
					}}
					className="h-16 w-16 text-red-600"
					viewBox="0 0 48 48"
					fill="none"
					stroke="currentColor"
					strokeWidth="3">
					<circle cx="24" cy="24" r="22" stroke="currentColor" />
					<motion.path
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 1, ease: "easeInOut" }}
						d="M17 17l14 14M31 17L17 31"
						strokeLinecap="round"
					/>
				</motion.svg>
			</motion.div>
			<h2 className="mt-4 text-xl font-semibold text-red-700">
				Payment Failed
			</h2>
			<p className="mt-1 text-sm text-gray-600">Something went wrong.</p>
		</motion.div>
	);
}

export function PaymentError() {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="flex flex-col items-center justify-center rounded-2xl border bg-red-50 p-8 shadow">
			<motion.div
				animate={{ x: [0, -6, 6, -4, 4, 0] }}
				transition={{ duration: 0.6 }}>
				<motion.svg
					initial={{ scale: 0.8 }}
					animate={{ scale: 0.8 }}
					transition={{
						duration: 1,
						ease: "easeInOut",
						repeat: Infinity,
						repeatType: "reverse",
					}}
					className="h-16 w-16 text-red-600"
					viewBox="0 0 48 48"
					fill="none"
					stroke="currentColor"
					strokeWidth="3">
					<circle cx="24" cy="24" r="22" stroke="currentColor" />
					<motion.path
						initial={{ pathLength: 0 }}
						animate={{ pathLength: 1 }}
						transition={{ duration: 1, ease: "easeInOut" }}
						d="M17 17l14 14M31 17L17 31"
						strokeLinecap="round"
					/>
				</motion.svg>
			</motion.div>
			<h2 className="mt-4 text-xl font-semibold text-red-700">
				Payment Status Not Updated
			</h2>
			<p className="mt-1 text-sm text-gray-600">
				Something went wrong. Please don not worry. If you have paid please
				check back later. If you did not pay, you can resume registration by
				clicking{" "}
				<Link href="/register/resume" className="text-blue-300 italic">
					resume
				</Link>
				.
			</p>
		</motion.div>
	);
}
