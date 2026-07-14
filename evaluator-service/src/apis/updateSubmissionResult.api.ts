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

export async function updateSubmissionResult(
	result: {
		success: boolean;
		error?: {
			name: string;
			message: string;
		};
		results: {
			input: string;
			expected: any;
			actual: any;
			passed: boolean;
			error?: {
				name: string;
				message: string;
			};
		}[];
	},
	submissionId: string,
) {
	const allPassed = result.results.every((r) => r.passed);
	const error = !!result?.error || result.results.some((r) => r.error);

	try {
		const status = error
			? SubmissionStatus.ERROR
			: allPassed
				? SubmissionStatus.ACCEPTED
				: SubmissionStatus.WRONG_ANSWER;

		await axios.post(
			`${crossServiceConfig.SUBMISSION_SERVICE}/api/v1/submission/add-result/${submissionId}`,
			{
				status,
				result,
			},
			{
				headers: {
					"service_token": process.env.INTER_SERVICE_TOKEN,
				},
			},
		);

		logger.info(`Submission status updated to ${status}`);
	} catch (e) {
		logger.error("Submission status updation failed.");
	}
}
