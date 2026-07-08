import { logger } from "@/config/logger.config";
import { ISubmission, SubmissionStatus } from "@/models/submission.model";
import { addSubmissionJob } from "@/producers/submission.producer";
import { ISubmissionRepository } from "@/repositories/submission.repository";
import { getProblemById } from "apis/problem.api";
export interface ISubmissionService {
	createSubmission(submission: ISubmission): Promise<ISubmission>;

	findSubmissionById(id: string): Promise<ISubmission | null>;

	findSubmissionsByProblemId(problemId: string): Promise<ISubmission[]>;

	updateSubmissionStatus(
		id: string,
		status: SubmissionStatus,
	): Promise<ISubmission | null>;

	deleteSubmissionById(id: string): Promise<boolean>;
}

export class SubmissionService implements ISubmissionService {
	constructor(private readonly submissionRepository: ISubmissionRepository) {}

	async createSubmission(submissionData: ISubmission): Promise<ISubmission> {
		// => get the problem

		const problem = await getProblemById(submissionData.problemId);

		if (!problem) {
			throw new Error("Problem not found");
		}
		// => save the payload to DB
		const submission = await this.submissionRepository.create(submissionData);
		// => add submission to bull queue

		const jobId = await addSubmissionJob({
			id: submission.id!,
			code: submission.code,
			language: submission.language,
			problem,
		});

		logger.info(`Submission job added with jobID: ${jobId}`);

		return submission;
	}

	async findSubmissionById(id: string): Promise<ISubmission | null> {
		return this.submissionRepository.findById(id);
	}

	async findSubmissionsByProblemId(problemId: string): Promise<ISubmission[]> {
		return this.submissionRepository.findByProblemId(problemId);
	}

	async updateSubmissionStatus(
		id: string,
		status: SubmissionStatus,
	): Promise<ISubmission | null> {
		return this.submissionRepository.updateStatus(id, status);
	}

	async deleteSubmissionById(id: string): Promise<boolean> {
		const deleted = await this.submissionRepository.deleteById(id);

		if (!deleted) {
			throw new Error("Submission not found");
		}

		return deleted;
	}
}
