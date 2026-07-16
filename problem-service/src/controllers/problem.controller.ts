import { Request, Response } from "express";
import { ProblemService } from "../services/problem.service";
import { ProblemRepository } from "../repository/problem.repository";
import { redisClient } from "@/config/redis.config";
import { parseCursorData } from "@/utils/pagination/parseCursorData";
import { IJwtUser } from "@/middlewares/jwt.middleware";

const problemRepository = new ProblemRepository();

const problemService = new ProblemService(problemRepository);

export const ProblemController = {
	async createProblem(req: Request, res: Response): Promise<void> {
		try {
			//@ts-ignore
			const { id } = req.user as IJwtUser;
			const payload = {
				...req.body,
				userId: id,
			};
			
			const problem = await problemService.createProblem(payload);

			res.status(201).json({
				message: "Problem created successfully",
				data: problem,
				success: true,
			});
		} catch (error) {
			res.status(409).json({
				message:
					error instanceof Error
						? error.message
						: "Problem creation failed",
				data: null,
				success: false,
			});
		}
	},

	async getProblemById(req: Request, res: Response): Promise<void> {
		const problemId = req.params.id;
		const problemKey = `problem-${problemId}`;
		const cachedProblem = await redisClient.get(problemKey);

		if (cachedProblem) {
			res.status(200).json({
				data: JSON.parse(cachedProblem),
				success: true,
				message: "From redis cache",
			});
			return;
		}

		const problem = await problemService.getProblemById(problemId as string);
		if (problem) {
			await redisClient.set(problemKey, JSON.stringify(problem), "EX", 300);
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
		const { cursor, direction, search } = parseCursorData(req.query);

		const result = await problemService.getAllProblems({
			cursor,
			direction,
			search,
		});

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
