import { Request, Response } from "express";
import { ProblemService } from "../services/problem.service";
import { ProblemRepository } from "../repository/problem.repository";

const problemRepository = new ProblemRepository();

const problemService = new ProblemService(problemRepository);

export const ProblemController = {
	async createProblem(req: Request, res: Response): Promise<void> {
		const problem = await problemService.createProblem(req.body);

		res.status(201).json({
			message: "Problem created successfully",
			data: problem,
			success: true,
		});
	},

	async getProblemById(req: Request, res: Response): Promise<void> {
		const problem = await problemService.getProblemById(
			req.params.id as string,
		);
		if (problem) {
			res.status(200).json({
				data: problem,
				success: true,
			});
			return;
		}
		res.status(404).json({
			data: null,
			message: `Problem with ID:${req.params.id} not found`,
			success: true,
		});
	},

	async getAllProblems(req: Request, res: Response): Promise<void> {
		const result = await problemService.getAllProblems();

		res.status(200).json({
			data: result,
			success: true,
		});
	},

	async updateProblem(req: Request, res: Response): Promise<void> {
		const problem = await problemService.updateProblem(
			req.params.id as string,
			req.body,
		);

		res.status(200).json({
			message: "Problem updated successfully",
			data: problem,
			success: true,
		});
	},

	async deleteProblem(req: Request, res: Response): Promise<void> {
		await problemService.deleteProblem(req.params.id as string);

		res.status(200).json({
			message: "Problem deleted successfully",
			success: true,
		});
	},

	async findByDifficulty(req: Request, res: Response): Promise<void> {
		const problems = await problemService.findByDifficulty(
			req.params.difficulty as "easy" | "medium" | "hard",
		);

		res.status(200).json({
			data: problems,
			success: true,
		});
	},

	async searchProblems(req: Request, res: Response): Promise<void> {
		const problems = await problemService.searchProblems(req.query.q as string);

		res.status(200).json({
			data: problems,
			success: true,
		});
	},
};
