import { logger } from "@/config/logger.config";
import { createNewRedisConnection } from "@/config/redis.config";
import { Queue } from "bullmq";

export const runQueue = new Queue("run", {
	//@ts-ignore
	connection: createNewRedisConnection(),
	defaultJobOptions: {
        attempts:3,
		backoff: {
			type: "exponential",
			delay: 2000,
		},
	},
});


runQueue.on("error", (error) => {
	logger.error(`Submission queue errored: ${error}`);
});

runQueue.on("waiting", (job) => {
	logger.info(`Submission job waiting: ${job}`);
});