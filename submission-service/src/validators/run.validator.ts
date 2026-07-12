import z from "zod";
import { createSubmissionSchema } from "./submission.validator";

export const createRunSchema = createSubmissionSchema;

export const getRunResultSchema = z.object({
	id: z.string().min(1).startsWith("run_"),
});
