"use client";
import React, { useEffect } from "react";
import { useOnboardingStore } from "../../../lib/store/useOnboardingStore";
import { useRouter } from "next/navigation";

const PaymentButton = () => {
	const { data } = useOnboardingStore();
	const router = useRouter();
	useEffect(() => {
		if (!data?.phone) {
			router.push("/register/resume");
		}
	}, [data]);
	const handlePayment = async () => {
		// try {
		// 	const res = await fetch("/api/payments/hdfc/session", {
		// 		method: "POST",
		// 		body: JSON.stringify({
		// 			phone: data?.phone,
		// 		}),
		// 	});
		// 	if (!res.ok) {
		// 		console.error("Failed to create payment session");
		// 		return;
		// 	}
		// 	const paymentData = await res.json();
		// 	console.log("Payment session created:", paymentData);
		// 	const { url } = paymentData;
		// 	if (url) {
		// 		window.location.href = url; // Redirect to payment gateway
		// 	} else {
		// 		console.error("Payment URL not found in response");
		// 	}
		// } catch (e) {
		// 	console.error("Error initiating payment:", e);
		// }
		router.push("/join/payment/in-progress");
	};
	return (
		<button
			onClick={handlePayment}
			className="block w-full rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 px-5 py-3 text-center text-sm font-semibold tracking-wide text-white transition hover:opacity-95 active:opacity-90"
			aria-disabled="true"
			// onClick={(e) => e.preventDefault()}
			title="Wire this to your gateway route when ready">
			Proceed to Payment
		</button>
	);
};

export default PaymentButton;
