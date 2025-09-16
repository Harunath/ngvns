// packages/db/src/index.ts
import { PrismaClient } from "@prisma/client"; // point to generated client

const prismaClientSingleton = () => {
	return new PrismaClient();
};

declare global {
	// allow global var to persist Prisma instance across hot reloads in dev
	var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma: ReturnType<typeof prismaClientSingleton> =
	globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// prevent creating multiple instances in dev
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;

// Re-export all generated Prisma exports
export * from "@prisma/client";
export type { PrismaClient } from "@prisma/client";
