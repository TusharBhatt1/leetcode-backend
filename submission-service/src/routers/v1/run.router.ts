import { RunController } from "@/controllers/run.controller";
import {
	validateRequestBody,
	validateRequestParams,
} from "@/middlewares/submission.middleware";
import {
	createRunSchema,
	getRunResultSchema,
} from "@/validators/run.validator";

import express from "express";
export const runRouter = express.Router();

runRouter.post("/", validateRequestBody(createRunSchema), RunController.run);
runRouter.get(
	"/:id",
	validateRequestParams(getRunResultSchema),
	RunController.runResult,
);
