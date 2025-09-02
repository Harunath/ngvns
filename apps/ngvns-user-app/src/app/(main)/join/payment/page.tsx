import React from "react";
import { FaCreditCard } from "react-icons/fa";

function PaymentsPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-6">
			<div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-lg">
				<div className="flex justify-center mb-4">
					<FaCreditCard className="text-green-600 text-5xl" />
				</div>
				<h1 className="text-2xl font-bold text-gray-800 mb-2">
					Payments Page Under Development
				</h1>
				<p className="text-gray-600 mb-6">
					We are currently in the process of integrating a secure payment
					gateway.
				</p>
				<p className="text-gray-500 text-sm">
					This page is a placeholder until payment gateway approval is
					completed.
				</p>
				<div className="mt-6">
					<button
						disabled
						className="bg-green-600 text-white px-6 py-3 rounded-xl opacity-60 cursor-not-allowed">
						Pay ₹4999
					</button>
				</div>
			</div>
		</div>
	);
}

export default PaymentsPage;
