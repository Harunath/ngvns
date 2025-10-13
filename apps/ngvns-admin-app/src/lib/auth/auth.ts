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
				const admin = await prisma.admin.findFirst({
					where: { phone: credentials.phone },
					select: {
						id: true,
						email: true,
						password: true,
						fullname: true,
						phone: true,
						role: true,
					},
				});

				if (admin) {
					// Verify password
					const isValidPassword = await bcrypt.compare(
						credentials.password,
						admin.password
					);
					if (!isValidPassword) {
						throw new Error("Invalid password");
					}
					const log = await prisma.adminAuditLog.create({
						data: {
							actorId: admin.id,
							action: "login",
							targetType: "admin",
							targetId: admin.id,
							metadata: {
								name: admin.fullname,
								role: admin.role,
								timestamp: new Date(),
							},
						},
					});
					return {
						id: admin.id,
						email: admin.email,
						phone: admin.phone, // Ensure phone is always a string
						fullname: admin.fullname,
						role: admin.role,
					};
				}
				return null;
			},
		}),
	],
	callbacks: {
		async signIn({ user }) {
			// Check if user already exists in the database
			const vr_user = await prisma.admin.findUnique({
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
				const admin = await prisma.admin.findFirst({
					where: { phone: user.phone },
					select: {
						id: true,
						email: true,
						fullname: true,
						phone: true,
						role: true,
					},
				});
				if (admin) {
					token.id = admin.id;
					token.email = admin.email;
					token.fullname = admin.fullname;
					token.phone = admin.phone;
					token.role = admin.role;
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
