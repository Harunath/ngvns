"use client";

export default function StepHeader({
	step,
	title,
	chip,
}: {
	step: number;
	title: string;
	chip?: React.ReactNode;
}) {
	return (
		<div className="mb-4 flex items-center justify-between">
			<div className="flex items-center gap-3">
				<span className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-emerald-500 text-sm font-semibold">
					{step}
				</span>
				<h3 className="text-lg font-semibold">{title}</h3>
			</div>
			{chip}
		</div>
	);
}
