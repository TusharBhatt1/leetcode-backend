import { Request, Response } from "express";
import { SubmissionRepository } from "@/repositories/submission.repository";
import { SubmissionService } from "@/services/submission.service";
import { ISubmissionResult, SubmissionStatus } from "@/models/submission.model";
import { parsePagination } from "@/utils/pagination/parsePagination.utils";
import { IJwtUser } from "@/middlewares/jwt.middleware";

const submissionRepository = new SubmissionRepository();
const submissionService = new SubmissionService(submissionRepository);

export const SubmissionController = {
	async createSubmission(req: Request, res: Response): Promise<void> {
		try {
			//@ts-ignore
			const { id } = req.user as IJwtUser;
			const payload = {
				...req.body,
				userId: id,
			};
			const submission = await submissionService.createSubmission(payload);
			res.status(201).json({
				message: "Submission created successfully",
				data: submission,
				success: true,
			});
		} catch (error) {
			res.status(400).json({
				message:
					error instanceof Error ? error.message : "Something went wrong!",
				success: false,
			});
		}
	},

	async getSubmissionById(req: Request, res: Response): Promise<void> {
		const submission = await submissionService.findSubmissionById(
			req.params.id as string,
		);

		if (!submission) {
			res.status(404).json({
				message: `Submission with ID: ${req.params.id} not found`,
				data: null,
				success: false,
			});
			return;
		}

		res.status(200).json({
			data: submission,
			success: true,
		});
	},

	async getSubmissionsByProblemId(req: Request, res: Response): Promise<void> {
		const pagination = parsePagination(req.query);
		const search: string = req.query.search ? String(req.query.search) : "";

		const submissions = await submissionService.findSubmissionsByProblemId(
			req.params.problemId as string,
			pagination,
			search,
		);

		res.status(200).json({
			data: submissions,
			success: true,
		});
	},

	async getSubmissionsByUserId(req: Request, res: Response): Promise<void> {
		const pagination = parsePagination(req.query);
		//@ts-ignore
		const { id } = req.user as IJwtUser;

		const submissions = await submissionService.findSubmissionsByUserId(
			//@ts-ignore
			id,
			pagination,
		);

		res.status(200).json({
			data: submissions,
			success: true,
		});
	},
	async updateSubmissionStatus(req: Request, res: Response): Promise<void> {
		const submission = await submissionService.updateSubmissionStatus(
			req.params.id as string,
			req.body.status as SubmissionStatus,
		);

		res.status(200).json({
			message: "Submission status updated successfully",
			data: submission,
			success: true,
		});
	},

	async addResult(req: Request, res: Response): Promise<void> {
		const updated = await submissionService.addResult(
			req.params.id as string,
			req.body.status as SubmissionStatus,
			req.body.result as ISubmissionResult,
		);

		if (!updated) {
			res.status(400).json({
				message: "Submission not found or result already exists",
				success: false,
			});
			return;
		}

		res.status(200).json({
			message: "Submission result added successfully",
			data: updated,
			success: true,
		});
	},

	async deleteSubmission(req: Request, res: Response): Promise<void> {
		await submissionService.deleteSubmissionById(req.params.id as string);

		res.status(200).json({
			message: "Submission deleted successfully",
			success: true,
		});
	},
};
