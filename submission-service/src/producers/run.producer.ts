import { logger } from "@/config/logger.config";
import { runQueue } from "@/queues/run.queue";
import { ISubmissionJob } from "./submission.producer";

export interface IRunJob extends Omit<ISubmissionJob, "id"> {}

export async function addRunJob(input: IRunJob) {
	try {
		const job = await runQueue.add("evalute-run", input);
		logger.info(`Job added to run queue, ID: ${job.id}`);

		return job.id || null;
	} catch (error) {
		logger.error(`Adding job to run queue failed: ${error}`);
		return null;
	}
}
