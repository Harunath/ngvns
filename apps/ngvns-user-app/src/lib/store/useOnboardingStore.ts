// stores/useOnboardingStore.ts
import { create } from "zustand";
// import { persist } from "zustand/middleware";

type OnboardingData = {
	referralId: string;
	fullname: string;
	relationType: string;
	relationName: string;
	dob: string;
	address: string;
	phone: string;
	email: string;
	aadhaar: string;
	gender: string;
	userPhoto: string;
	nominieeName: string;
	nominieeDob: string;
	relationship: string;
};

type OnboardingStore = {
	data: OnboardingData | null;
	setData: (data: OnboardingData) => void;
	clearData: () => void;
};

export const useOnboardingStore = create<OnboardingStore>()(
	// persist(
	(set) => ({
		data: null,
		setData: (data) => set({ data }),
		clearData: () => set({ data: null }),
	})
	// {
	// 	name: "onboarding-data", // key in localStorage
	// }
	// )
);
