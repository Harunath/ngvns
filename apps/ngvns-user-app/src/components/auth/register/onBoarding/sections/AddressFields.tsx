"use client";

import React, { useEffect } from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import TextInput from "../fields/TextInput";
import SelectInput from "../fields/SelectInput";
import type { OnboardingFormData } from "../../../../../lib/validators/onboarding";

export default function AddressFields({
	register,
	errors,
}: {
	register: UseFormRegister<OnboardingFormData>;
	errors: FieldErrors<OnboardingFormData>;
}) {
	const [states, setStates] = React.useState<
		Array<{ id: string; name: string }>
	>([]);
	useEffect(() => {
		const result = async () => {
			const res = await fetch("/api/states");
			const data = await res.json();
			console.log("States data:", data);
			setStates(data);
		};
		result();
	}, []);
	return (
		<div className="md:col-span-2 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div className="md:col-span-2">
				<TextInput
					label="Address Line 1 *"
					error={errors.address?.addressLine1}
					{...register("address.addressLine1")}
				/>
			</div>
			<div className="md:col-span-2">
				<TextInput
					label="Address Line 2 (optional)"
					error={errors.address?.addressLine2 as any}
					{...register("address.addressLine2")}
				/>
			</div>

			<SelectInput
				label="State *"
				error={errors.address?.stateId}
				{...register("address.stateId")}>
				<option value="">Select State</option>
				{/* map states from API/store later */}
				{states.map((state) => (
					<option key={state.id} value={state.id}>
						{state.name}
					</option>
				))}
			</SelectInput>

			<TextInput
				inputMode="numeric"
				label="Pincode *"
				error={errors.address?.pincode}
				{...register("address.pincode")}
			/>
		</div>
	);
}
