import express from "express";
import {
	validateRequestBody,
	validateRequestParams,
} from "@/middlewares/submission.middleware";
import {
	addResultBodySchema,
	addResultParamSchema,
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
	validateRequestParams(updateSubmissionStatusParamSchema),
	validateRequestBody(updateSubmissionStatusBodySchema),
	SubmissionController.updateSubmissionStatus,
);

submissionRouter.get(
	"/me",
	SubmissionController.getSubmissionsByUserId,
);

submissionRouter.get(
	"/:id",
	validateRequestParams(getSubmissionByIdSchema),
	SubmissionController.getSubmissionById,
);

submissionRouter.post(
	"/add-result/:id",
	validateRequestParams(addResultParamSchema),
	validateRequestBody(addResultBodySchema),
	SubmissionController.addResult,
);
submissionRouter.get(
	"/problem/:problemId",
	SubmissionController.getSubmissionsByProblemId,
);
