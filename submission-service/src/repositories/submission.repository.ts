import {
	ISubmission,
	ISubmissionResult,
	SubmissionModel,
	SubmissionStatus,
} from "@/models/submission.model";
import { IPaginationOptions } from "@/utils/pagination/parsePagination.utils";
import { BaseRepository } from "./base.repository";
import { IPaginatedResponse } from "@/utils/pagination/createPaginatedData";

export interface ISubmissionRepository {
	create(submission: ISubmission): Promise<ISubmission>;
	findById(id: string): Promise<ISubmission | null>;
	deleteById(id: string): Promise<boolean | null>;
	updateStatus(
		id: string,
		status: SubmissionStatus,
	): Promise<ISubmission | null>;
	addResult(
		id: string,
		status: SubmissionStatus,
		result: ISubmissionResult,
	): Promise<ISubmission | null>;
	findByProblemId(
		problemId: string,
		pagination: IPaginationOptions,
		search: string,
	): Promise<IPaginatedResponse<ISubmission>>;
	findByUserId(
		userId: string,
		pagination: IPaginationOptions,
	): Promise<IPaginatedResponse<ISubmission>>;
}

export class SubmissionRepository
	extends BaseRepository<ISubmission>
	implements ISubmissionRepository
{
	constructor() {
		super(SubmissionModel);
	}

	async create(submission: ISubmission): Promise<ISubmission> {
		return await SubmissionModel.create(submission);
	}
	async findById(id: string): Promise<ISubmission | null> {
		return await SubmissionModel.findById(id);
	}

	async findByUserId(
		userId: string,
		pagination: IPaginationOptions,
	): Promise<IPaginatedResponse<ISubmission>> {
		const filter = {
			userId,
		};

		return this.paginate({
			filter,
			pagination,
		});
	}
	async findByProblemId(
		problemId: string,
		pagination: IPaginationOptions,
		search: string,
	): Promise<IPaginatedResponse<ISubmission>> {
		const filter = {
			problemId,
			...(search && {
				language: {
					$regex: search,
					$options: "i",
				},
			}),
		};
		return this.paginate({
			filter,
			pagination,
		});
	}
	async updateStatus(
		id: string,
		status: SubmissionStatus,
	): Promise<ISubmission | null> {
		return await SubmissionModel.findByIdAndUpdate(id, {
			status,
		});
	}
	async addResult(
		id: string,
		status: SubmissionStatus,
		result: ISubmissionResult,
	): Promise<ISubmission | null> {
		return await SubmissionModel.findOneAndUpdate(
			{
				_id: id,
				result: { $exists: false },
			},
			{
				$set: { result, status },
			},
			{
				new: true,
			},
		);
	}
	async deleteById(id: string): Promise<boolean | null> {
		return await SubmissionModel.findByIdAndDelete(id);
	}
}
