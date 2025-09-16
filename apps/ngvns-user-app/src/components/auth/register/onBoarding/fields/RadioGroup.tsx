"use client";

import React from "react";

type Option = { label: string; value: string };

export default function RadioGroup({
	name,
	options,
	register,
}: {
	name: string;
	options: Option[];
	register: any;
}) {
	return (
		<div className="flex gap-4">
			{options.map((opt) => (
				<label key={opt.value} className="flex items-center gap-2">
					<input
						type="radio"
						value={opt.value}
						{...register(name)}
						className="h-4 w-4"
					/>
					<span>{opt.label}</span>
				</label>
			))}
		</div>
	);
}
