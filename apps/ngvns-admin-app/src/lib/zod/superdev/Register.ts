import { z } from "zod";
// mirror your enum values
const AdminRoleEnum = z.enum([
	"ROOT",
	"SUPER",
	"COMMAND",
	"FINANCE",
	"DATA_ENTRY",
]);

export const RegisterSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8, "Password must be at least 8 characters"),
	fullname: z.string().min(2),
	phone: z.string().min(8).max(15),
	role: AdminRoleEnum,
	inviteCode: z.string().optional(), // optional
});
