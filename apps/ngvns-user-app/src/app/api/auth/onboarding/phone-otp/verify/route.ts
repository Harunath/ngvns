// import prisma, { GenderType, RelationType } from "@ngvns2025/db/client";
import prisma from "@ngvns2025/db/client";
import { NextRequest, NextResponse } from "next/server";
// import { z } from "zod";

// const onboardingUserSchema = z.object({
// 	fullname: z.string().min(1, "Full name is required"),
// 	relationType: z.string(), // ideally use z.nativeEnum(RelationType) if it's an enum
// 	relationName: z.enum(["So", "Do", "Wo"]),
// 	dob: z.coerce.date(),
// 	address: z.any(), // or use z.object(...) if you know the shape
// 	phone: z.string().min(10).max(15), // adjust validation as per format
// 	email: z.email(),
// 	aadhaar: z.string().length(12, "Aadhaar must be 12 digits"),
// 	gender: z.enum(["Male", "Female", "Others"]),
// 	userPhoto: z.string(),

// 	nominieeName: z.string(),
// 	nominieeDob: z.coerce.date(),
// 	relationship: z.string(),

// 	referralId: z.string(),

// 	phoneVerified: z.boolean().default(false),
// 	emailVerified: z.boolean().default(false),
// });

// const onboardingSchema = z.object({
// 	user: onboardingUserSchema,
// 	code: z.string().length(6, "OTP must be at least 4 digits"),
// });

// export async function POST(req: NextRequest) {
// 	try {
// 		const body = await req.json();

// 		const parsed = onboardingSchema.safeParse(body);
// 		if (!parsed.success) {
// 			return NextResponse.json(
// 				{
// 					success: false,
// 					message: "Invalid input",
// 					errors: parsed.error.issues,
// 				},
// 				{ status: 400 }
// 			);
// 		}

// 		const { user, code } = parsed.data;

// 		const phoneOtp = await prisma.phoneVerificationCode.findUnique({
// 			where: { phone: user.phone },
// 		});

// 		if (!phoneOtp || !phoneOtp.expiresAt) {
// 			return NextResponse.json(
// 				{
// 					success: false,
// 					message: "OTP not found or expired.",
// 				},
// 				{ status: 400 }
// 			);
// 		}

// 		if (new Date() > phoneOtp.expiresAt) {
// 			return NextResponse.json(
// 				{
// 					success: false,
// 					message: "OTP has expired.",
// 				},
// 				{ status: 400 }
// 			);
// 		}

// 		if (code !== phoneOtp.code) {
// 			return NextResponse.json(
// 				{
// 					success: false,
// 					message: "Invalid OTP code.",
// 				},
// 				{ status: 400 }
// 			);
// 		}

// 		const onboardingUser = await prisma.onboarding.create({
// 			data: {
// 				...user,
// 				relationType: user.relationType as RelationType,
// 				gender: user.gender as GenderType,
// 				phoneVerified: true,
// 				aadhaarVerified: false, // or set to true if appropriate
// 			},
// 		});

// 		return NextResponse.json({
// 			success: true,
// 			message: "Onboarding user is registered",
// 		});
// 	} catch (error) {
// 		console.error("Verifying Phone error:", error);

// 		return NextResponse.json(
// 			{
// 				success: false,
// 				message: "Something went wrong. Please try again later.",
// 			},
// 			{ status: 500 }
// 		);
// 	}
// }

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { phone } = body;
		const user = await prisma.onboarding.findUnique({ where: { phone } });

		return NextResponse.json({
			success: true,
			message: "Onboarding user is registered :" + user?.fullname,
		});
	} catch (error) {
		console.error("Verifying Phone error:", error);

		return NextResponse.json(
			{
				success: false,
				message: "Something went wrong. Please try again later.",
			},
			{ status: 500 }
		);
	}
}
