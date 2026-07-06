import express from "express";
import { ProblemController } from "src/controllers/problem.controller"
import {
	validateRequestBody,
	validateRequestParams,
} from "src/middlewares/validateRequestbody.middleware.js";
import {
	createProblemDTOSchema,
	findByDifficultySchema,
	updatedProblemDTOSchema,
} from "src/validator/problem.validator.js";

export const problemRouter = express.Router();

problemRouter.post(
	"/create",
	validateRequestBody(createProblemDTOSchema),
	ProblemController.createProblem,
);

problemRouter.get("/", ProblemController.getAllProblems);

problemRouter.get("/search", ProblemController.searchProblems);

problemRouter.get(
	"/difficulty/:difficulty",
	validateRequestParams(findByDifficultySchema),
	ProblemController.findByDifficulty,
);

problemRouter.get("/:id", ProblemController.getProblemById);

problemRouter.patch(
	"/:id",
	validateRequestBody(updatedProblemDTOSchema),
	ProblemController.updateProblem,
);

problemRouter.delete("/:id", ProblemController.deleteProblem);
