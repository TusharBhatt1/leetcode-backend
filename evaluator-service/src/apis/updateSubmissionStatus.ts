import { crossServiceConfig } from "@/config";
import { logger } from "@/config/logger.config";
import axios from "axios";

export enum SubmissionStatus {
	PENDING = "pending", // Job is queued
	RUNNING = "running", // Code is currently executing
	ACCEPTED = "accepted", // Passed all test cases
	WRONG_ANSWER = "wrong_answer", // Failed one or more test cases
	ERROR = "error", // Compilation or runtime/system error
}

export async function updateSubmissionStatus(
	allPassed: boolean,
	error: boolean,
	submissionId: string,
) {
	try {
		const status = error
			? SubmissionStatus.ERROR
			: allPassed
				? SubmissionStatus.ACCEPTED
				: SubmissionStatus.WRONG_ANSWER;

		await axios.post(
			`${crossServiceConfig.SUBMISSION_SERVICE}/api/v1/submission/update-status/${submissionId}`,
			{
				status,
			},
		);

		logger.info(`Submission status updated to ${status}`);
	} catch (e) {
		logger.error("Submission status updation failed.", e);
	}
}
