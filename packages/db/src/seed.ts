import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
	await prisma.tnCVersion.create({
		data: {
			version: "1.0",
			content: `
# Terms & Conditions

Welcome to our service. By using it you agree to the following:

1. You will not misuse the platform.
2. We may update these terms at any time.
3. Continued use indicates acceptance of updates.
`,
			active: true,
		},
	});
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => prisma.$disconnect());
