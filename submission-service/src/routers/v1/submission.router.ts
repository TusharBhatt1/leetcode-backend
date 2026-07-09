import express from "express";
import {
	validateRequestBody,
	validateRequestParams,
} from "@/middlewares/submission.middleware";
import {
	createSubmissionSchema,
	getSubmissionByIdSchema,
	updateSubmissionStatusBodySchema,
	updateSubmissionStatusParamSchema,
} from "@/validators/submission.validator";
import { SubmissionController } from "@/controllers/submission.controller";

export const submissionRouter = express.Router();

submissionRouter.post(
	"/submit",
	validateRequestBody(createSubmissionSchema),
	SubmissionController.createSubmission,
);
submissionRouter.post(
	"/update-status/:id",
	validateRequestBody(updateSubmissionStatusBodySchema),
	validateRequestParams(updateSubmissionStatusParamSchema),
	SubmissionController.updateSubmissionStatus,
);
submissionRouter.get(
	"/:id",
	validateRequestParams(getSubmissionByIdSchema),
	SubmissionController.getSubmissionById,
);
