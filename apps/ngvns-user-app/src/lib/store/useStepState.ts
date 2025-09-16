// stores/useStepState.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export const steps = ["form", "phone", "email", "tandc"] as const;
export type Step = (typeof steps)[number];

export const stepLabels: Record<Step, string> = {
	form: "Your Details",
	phone: "Verify Phone",
	email: "Verify Email",
	tandc: "Terms & Conditions",
};

export type StepState = {
	step: Step;
	setStep: (step: Step) => void;
	next: () => void;
	prev: () => void;
	reset: () => void;
};

// flip to false if you don't want localStorage persistence
const PERSIST = false;

const factory = (set: any, get: any): StepState => ({
	step: steps[0],
	setStep: (step) => set({ step }),
	next: () => {
		const i = steps.indexOf(get().step);
		set({ step: steps[Math.min(i + 1, steps.length - 1)] });
	},
	prev: () => {
		const i = steps.indexOf(get().step);
		set({ step: steps[Math.max(i - 1, 0)] });
	},
	reset: () => set({ step: steps[0] }),
});

export const useStepState = PERSIST
	? create<StepState>()(
			persist(factory, {
				name: "onboarding:step",
				storage: createJSONStorage(() => localStorage),
			})
		)
	: create<StepState>()(factory);
