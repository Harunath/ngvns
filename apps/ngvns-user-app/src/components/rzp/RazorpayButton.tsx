"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "../../lib/store/useOnboardingStore";
// import { makeGatewayOrderId } from "../../utils/gatewayOrderId";

function loadScript(src: string) {
	return new Promise<boolean>((resolve) => {
		const s = document.createElement("script");
		s.src = src;
		s.onload = () => resolve(true);
		s.onerror = () => resolve(false);
		document.body.appendChild(s);
	});
}

export default function RazorpayButton() {
	const [loading, setLoading] = useState(false);
	const { data } = useOnboardingStore();
	const [customer, setCusomer] = useState({
		name: data?.fullname || "",
		email: data?.email || "",
		phone: data?.phone || "",
	});
	const router = useRouter();
	useEffect(() => {
		if (!data?.phone || !data?.email || !data?.fullname) {
			router.push("/register/resume");
			return;
		}
		setCusomer({
			name: data.fullname!,
			email: data.email!,
			phone: data.phone!,
		});
	}, [data]);
	const pay = async () => {
		setLoading(true);
		try {
			// 1) Get/Create Razorpay Order from server
			const r = await fetch("/api/payments/rzp/order", {
				method: "POST",
				body: JSON.stringify({ phone: customer.phone }),
			});
			const data = await r.json();
			console.log("Razorpay order", { r, data });
			if (!r.ok) throw new Error(data?.error || "Failed to create order");

			// 2) Load Checkout
			const ok = await loadScript(
				"https://checkout.razorpay.com/v1/checkout.js"
			);
			if (!ok) throw new Error("Razorpay SDK failed to load");
			console.log(data);
			const options: any = {
				key:
					process.env.NEXT_PUBLIC_GATEWAY_MODE == "LIVE"
						? process.env.NEXT_PUBLIC_RZP_LIVE_KEY_ID
						: process.env.NEXT_PUBLIC_RZP_TEST_KEY_ID,
				amount: data.amount,
				currency: data.currency,
				name: "VR Kisan Parivaar",
				description: "Membership Payment",
				order_id: data.rzOrderId,
				prefill: {
					name: customer.name,
					email: customer.email,
					contact: customer.phone,
				},
				notes: { orderId: data.rzOrderId }, // your business order id
				theme: { color: "#0ea5e9" },
				handler: async function (resp: {
					razorpay_payment_id: string;
					razorpay_order_id: string;
					razorpay_signature: string;
				}) {
					console.log("Razorpay payment completed", resp);
					router.push(
						`/join/payment/catch/${data.rzOrderId}/${resp.razorpay_payment_id}`
					);
					// const vr = await fetch("/api/payments/rzp/status", {
					// 	method: "POST",
					// 	headers: { "Content-Type": "application/json" },
					// 	body: JSON.stringify({ orderId: data.order_id, ...resp }),
					// });
					// const vjson = await vr.json();
					// if (vr.ok && vjson.ok) {
					// 	router.push(`/join/payment/catch/${data.order_id}`);
					// 	// window.location.href = `/payment/catch/${data.order_id}`; // your success page/poller
					// } else {
					// 	alert("Payment verification failed");
					// }
				},
				modal: { ondismiss: () => setLoading(false) },
			};

			const rz = new (window as any).Razorpay(options);
			rz.on("payment.failed", (response: any) => {
				console.error("Razorpay failed", response?.error);
				setLoading(false);
			});
			rz.open();
		} catch (e) {
			console.error(e);
			setLoading(false);
			alert((e as Error).message);
		}
	};

	return (
		// <button
		// 	onClick={pay}
		// 	disabled={loading}
		// 	className="px-4 py-2 rounded-md bg-black text-white hover:opacity-90 disabled:opacity-50">
		// 	{loading ? "Processing..." : "Pay with Razorpay"}
		// </button>
		<button
			onClick={pay}
			disabled={loading}
			className="block w-full rounded-xl bg-gradient-to-r from-emerald-500 to-blue-600 px-5 py-3 text-center text-sm font-semibold tracking-wide text-white transition hover:opacity-95 active:opacity-90"
			aria-disabled="true">
			{loading ? "Processing..." : "Proceed to Payment"}
		</button>
	);
}
