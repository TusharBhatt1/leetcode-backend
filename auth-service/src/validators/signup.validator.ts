import { z } from "zod";
import { UserRole } from "../models/user.model";

export const signUpUserSchema = z.object({
	name: z
		.string()
		.trim()
		.min(1, "Name is required")
		.max(100, "Name cannot exceed 100 characters"),

	email: z
		.string()
		.trim()
		.toLowerCase()
		.email("Please enter a valid email address"),

	password: z
		.string()
		.min(8, "Password must be at least 8 characters long")
		.regex(
			/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,}$/,
			"Password must contain uppercase, lowercase, number and special character",
		),

	role: z.enum(UserRole, {
		error: () => ({
			message: "Role must be one of: candidate, problem_setter or admin",
		}),
	}),
});

export const logInUserSchema = signUpUserSchema.omit({
	name: true,
});
