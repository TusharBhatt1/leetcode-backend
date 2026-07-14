import { redisClient } from "@/config/redis.config";
import { IJwtUser } from "@/middlewares/jwt.middleware";
import { addRunJob } from "@/producers/run.producer";
import { getProblemById } from "apis/problem.api";
import { Request, Response } from "express";

export const RunController = {
	async run(req: Request, res: Response) {
		// => get the problem
		//@ts-ignore
		const problem = await getProblemById(req.body.problemId, req.user.id);

		if (!problem) {
			throw new Error("Problem not found");
		}
		// => add run to bull queue
		const jobId = await addRunJob({
			code: req.body.code,
			language: req.body.language,
			problem,
		});

		const runId = `run_${jobId}`;
		await redisClient.set(runId, "PENDING");

		res.status(201).json({
			runId,
		});
	},
	async runResult(req: Request, res: Response) {
		const result = await redisClient.get(req.params.id as string);
		if (result === "PENDING") {
			return res.status(200).json({
				status: "PENDING",
				result: null,
			});
		}

		if (result === "FAILED") {
			return res.status(200).json({
				status: "FAILED",
				result: null,
			});
		}

		return res.status(200).json({
			status: "COMPLETED",
			result: JSON.parse(result!),
		});
	},
};
