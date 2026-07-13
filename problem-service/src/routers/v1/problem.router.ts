import { rbacMiddlewWare } from "@/middlewares/rbac.middleware";
import express from "express";
import { ProblemController } from "src/controllers/problem.controller";
import {
	validateRequestBody,
	validateRequestParams,
} from "src/middlewares/validateRequestbody.middleware.js";
import {
	createProblemDTOSchema,
	findByDifficultySchema,
	findByIdSchema,
	updatedProblemDTOSchema,
} from "src/validator/problem.validator.js";

export const problemRouter = express.Router();

problemRouter.post(
	"/create",
	rbacMiddlewWare,
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

problemRouter.get(
	"/:id",
	validateRequestParams(findByIdSchema),
	ProblemController.getProblemById,
);

problemRouter.patch(
	"/:id",
	validateRequestBody(updatedProblemDTOSchema),
	ProblemController.updateProblem,
);

problemRouter.delete("/:id", ProblemController.deleteProblem);
