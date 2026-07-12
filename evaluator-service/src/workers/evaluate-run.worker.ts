import { logger } from "@/config/logger.config";
import { Job, Worker } from "bullmq";
import { initializeContainerAndExecuteCode } from "./utils/executeCode";
import { createNewRedisConnection, redisClient } from "@/config/redis.config";

async function setupRunWorker() {
	const worker = new Worker(
		"run",
		async (job) => {
			logger.info(`Proccessing Run job ${job.id}`);
			const { problem, code, language } = job.data;
			try {
				const result = await initializeContainerAndExecuteCode({
					problem,
					code,
				});

				await redisClient.set(
					`run_${job.id}`,
					JSON.stringify(result),
					"EX",
					120,
				);
				logger.info(`run ${job.id} result added to Redis`);
			} catch (error) {
				await redisClient.set(
					`run_${job.id}`,
					"FAILED",
					"EX",
					120,
				);
			}
		},
		{
			//@ts-ignore
			connection: createNewRedisConnection(),
		},
	);

	worker.on("ready", () => logger.info("Run worker is ready"));
}

async function startRunWorker() {
	await setupRunWorker();
}

export { startRunWorker };
