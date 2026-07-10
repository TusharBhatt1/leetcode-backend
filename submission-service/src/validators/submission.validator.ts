import { z } from "zod";
import {
	SubmissionLanguage,
	SubmissionStatus,
} from "@/models/submission.model";
import mongoose from "mongoose";

export const createSubmissionSchema = z.object({
	problemId: z.string().min(1, "Problem ID is required"),

	code: z.string().min(1, "Code is required"),

	language: z.enum(SubmissionLanguage, {
		error: () => ({ message: "Invalid language" }),
	}),
});

export const updateSubmissionStatusBodySchema = z.object({
	status: z.enum(SubmissionStatus, {
		error: () => ({ message: "Invalid submission status" }),
	}),
});
export const updateSubmissionStatusParamSchema = z.object({
	id: z.string().refine((id) => mongoose.Types.ObjectId.isValid(id), {
		message: "Invalid MongoDB ObjectId",
	}),
});

export const getSubmissionByIdSchema = updateSubmissionStatusParamSchema;
export const addResultParamSchema = updateSubmissionStatusParamSchema;

export const findSubmissionByIdSchema = z.object({
	id: z.string().min(1, "Submission ID is required"),
});

export const findSubmissionsByProblemIdSchema = z.object({
	problemId: z.string().min(1, "Problem ID is required"),
});

const submissionResultItemSchema = z.object({
	input: z.string(),
	expected: z.unknown().optional(),
	actual: z.unknown().optional(),
	passed: z.boolean(),
	error: z
		.object({
			name: z.string(),
			message: z.string(),
		})
		.optional(),
});

export const submissionResultSchema = z.object({
	success: z.boolean(),
	results: z.array(submissionResultItemSchema),
	error: z
		.object({
			name: z.string(),
			message: z.string(),
		})
		.optional(),
});

export const addResultBodySchema = z.object({
	status: z.enum(SubmissionStatus),
	result: submissionResultSchema,
});

// export type CreateSubmissionDto = z.infer<typeof createSubmissionSchema>;
// export type UpdateSubmissionStatusDto = z.infer<
// 	typeof updateSubmissionStatusSchema
// >;
