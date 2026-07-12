import { logger } from "@/config/logger.config";
import { SubmissionLanguage } from "@/models/submission.model";
import { submissionQueue } from "@/queues/submission.queue";
import { IProblem } from "apis/problem.api";

export interface ISubmissionJob {
	problem: IProblem;
	code: string;
	language: SubmissionLanguage;
	id: string;
}

export async function addSubmissionJob(
	submission: ISubmissionJob,
): Promise<string | null> {
	try {
		const job = await submissionQueue.add("evalute-submission", submission);
		logger.info(
			`Job added to submission queue, ID: ${job.id}`,
		);

		return job.id || null;
	} catch (error) {
		logger.error(`Adding job to submission queue failed: ${error}`);
		return null;
	}
}
