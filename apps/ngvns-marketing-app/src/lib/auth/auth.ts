import NextAuth, { NextAuthOptions } from "next-auth";
import { Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";
import prisma from "@ngvns2025/db/client";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				phone: { label: "Phone", type: "number" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.phone || !credentials?.password) {
					throw new Error("Invalid email or password");
				}

				// Find user in database
				const user = await prisma.user.findFirst({
					where: { phone: credentials.phone },
					select: {
						id: true,
						vrKpId: true,
						email: true,
						password: true,
						fullname: true,
						phone: true,
						marketingMember: {
							select: {
								id: true,
								teamId: true,
								role: true,
							},
						},
					},
				});

				if (user) {
					// Verify password
					const isValidPassword = await bcrypt.compare(
						credentials.password,
						user.password
					);
					if (!isValidPassword) {
						throw new Error("Invalid password");
					}
					if (
						!user.marketingMember ||
						!user.marketingMember.id ||
						!user.marketingMember.role ||
						!user.marketingMember.teamId
					) {
						throw new Error("Unauthorized");
					}
					return {
						id: user.id,
						email: user.email,
						phone: user.phone, // Ensure phone is always a string
						fullname: user.fullname,
						vrKpId: user.vrKpId,
						role: user.marketingMember?.role,
						teamId: user.marketingMember?.teamId,
						marketingMemberId: user.marketingMember?.id,
					};
				}
				return null;
			},
		}),
	],
	callbacks: {
		async signIn({ user }) {
			// Check if user already exists in the database
			const vr_user = await prisma.user.findUnique({
				where: {
					phone: user.phone!,
				},
			});

			if (vr_user) {
				return true;
			}
			return "/unauthorized";
		},
		async redirect({ baseUrl }) {
			console.log("Redirecting to baseUrl:", baseUrl);
			return baseUrl + "/login";
		},
		async jwt({ token, user }) {
			if (user && user.phone) {
				const vr_user = await prisma.user.findFirst({
					where: { phone: user.phone },
					select: {
						id: true,
						email: true,
						password: true,
						fullname: true,
						phone: true,
						vrKpId: true,
						marketingMember: {
							select: {
								id: true,
								teamId: true,
								role: true,
							},
						},
					},
				});
				if (vr_user) {
					token.id = vr_user.id;
					token.email = vr_user.email;
					token.fullname = vr_user.fullname;
					token.phone = vr_user.phone;
					token.role = vr_user.marketingMember?.role;
					token.teamId = vr_user.marketingMember?.teamId;
					token.marketingMemberId = vr_user.marketingMember?.id;
					token.vrKpId = vr_user.vrKpId;
				}
			}
			return token;
		},

		async session({ session, token }: { session: Session; token: JWT }) {
			if (session.user && token) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
				session.user.fullname = token.fullname as string;
				session.user.phone = token.phone as string;
				session.user.role = token.role as any;
				session.user.teamId = token.teamId as string;
				session.user.marketingMemberId = token.marketingMemberId as string;
				session.user.vrKpId = token.vrKpId as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
	},
	secret: process.env.NEXTAUTH_SECRET!,
};

export default NextAuth(authOptions);
