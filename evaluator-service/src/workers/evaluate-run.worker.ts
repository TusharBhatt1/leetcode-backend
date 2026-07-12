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

			const result = await initializeContainerAndExecuteCode({ problem, code });

			await redisClient.set(`run_${job.id}`, JSON.stringify(result), "EX", 300);
			logger.info(`run ${job.id} result added to Redis`);
		},
		{
			//@ts-ignore
			connection: createNewRedisConnection(),
		},
	);

	worker.on("ready", () => logger.info("Run worker is ready"));
}

async function startRunWorker() {
    await setupRunWorker()
} 

export {startRunWorker}