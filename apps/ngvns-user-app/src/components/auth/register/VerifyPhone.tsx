"use client";
// components/VerifyPhone.tsx
import React, { useState } from "react";
import { useOnboardingStore } from "../../../lib/store/useOnboardingStore";
import toast from "react-hot-toast";

function VerifyPhone() {
	const { data } = useOnboardingStore();
	const phone = data?.phone || "";

	const [otpSent, setOtpSent] = useState(false);
	const [otp, setOtp] = useState("");
	const [loading, setLoading] = useState(false);

	const sendOtp = async () => {
		if (!phone) {
			toast.error("Phone number is missing in onboarding data");
			return;
		}

		try {
			setLoading(true);
			// Dummy API call simulation
			await new Promise((res) => setTimeout(res, 1000));
			setOtpSent(true);
			toast.success("OTP sent to your phone");
		} catch (err) {
			toast.error("Failed to send OTP");
		} finally {
			setLoading(false);
		}
	};

	const verifyOtp = async () => {
		if (!otp) {
			toast.error("Please enter the OTP");
			return;
		}

		try {
			setLoading(true);
			// Dummy verification simulation
			await new Promise((res) => setTimeout(res, 1000));
			toast.success("Phone verified successfully!");
		} catch (err) {
			toast.error("Invalid OTP or verification failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto p-4 border rounded-lg shadow-md">
			<h2 className="text-lg font-semibold mb-4">Phone Verification</h2>

			<div className="mb-4">
				<label className="block text-sm font-medium text-gray-700 mb-1">
					Phone Number
				</label>
				<input
					type="text"
					value={phone}
					readOnly
					className="w-full border px-3 py-2 rounded-md bg-gray-100 cursor-not-allowed"
				/>
			</div>

			{!otpSent && (
				<button
					onClick={sendOtp}
					disabled={loading}
					className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50">
					{loading ? "Sending OTP..." : "Send OTP"}
				</button>
			)}

			{otpSent && (
				<>
					<div className="mt-4">
						<label className="block text-sm font-medium text-gray-700 mb-1">
							Enter OTP
						</label>
						<input
							type="text"
							value={otp}
							onChange={(e) => setOtp(e.target.value)}
							className="w-full border px-3 py-2 rounded-md"
							maxLength={6}
						/>
					</div>

					<button
						onClick={verifyOtp}
						disabled={loading}
						className="w-full mt-4 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 disabled:opacity-50">
						{loading ? "Verifying..." : "Submit OTP"}
					</button>
				</>
			)}
		</div>
	);
}

export default VerifyPhone;
