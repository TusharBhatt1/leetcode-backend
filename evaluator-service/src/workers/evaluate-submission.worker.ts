import { Worker } from "bullmq";
import { logger } from "@/config/logger.config";
import { createNewRedisConnection } from "@/config/redis.config";
import { updateSubmissionResult } from "@/apis/updateSubmissionResult.api";
import { initializeContainerAndExecuteCode } from "./utils/executeCode";

async function setupEvaluationWorker() {
	const worker = new Worker(
		"submission",
		async (job) => {
			logger.info(`Proccessing Submission job ${job.id}`);
			const { id: submissionId, problem, code, language } = job.data;

			const result = await initializeContainerAndExecuteCode({ problem, code });
			await updateSubmissionResult(result, submissionId);
		},

		{
			//@ts-ignore
			connection: createNewRedisConnection(),
		},
	);

	worker.on("ready", () => logger.info("Evaluation Worker is ready"));
}

async function startEvaluationWorkers() {
	await setupEvaluationWorker();
}

export { startEvaluationWorkers };
