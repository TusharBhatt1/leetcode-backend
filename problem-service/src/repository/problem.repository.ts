import { ICursorData } from "@/utils/pagination/parseCursorData";
import { IProblem, ProblemModel } from "../models/problem.model";
import { BaseRepository, ICursorPaginatedResponse } from "./base.repository";

export interface IProblemRepository {
	createProblem(problem: Partial<IProblem>): Promise<IProblem>;
	getProblemById(id: string): Promise<IProblem | null>;
	getAllProblems(
		data: ICursorData,
	): Promise<ICursorPaginatedResponse<IProblem>>;
	updateProblem(id: string, problem: IProblem): Promise<IProblem | null>;
	deleteProblem(id: string): Promise<boolean>;
	findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<IProblem[]>;
	searchProblems(query: string): Promise<IProblem[]>;
}

export class ProblemRepository
	extends BaseRepository<IProblem>
	implements IProblemRepository
{
	constructor() {
		super(ProblemModel);
	}

	async createProblem(problem: Partial<IProblem>): Promise<IProblem> {
		return await ProblemModel.create(problem);
	}

	async getProblemById(id: string): Promise<IProblem | null> {
		return await ProblemModel.findById(id);
	}

	async getAllProblems(
		data: ICursorData,
	): Promise<ICursorPaginatedResponse<IProblem>> {
		const { cursor, direction, search } = data;

		const filter = {};

		if (search) {
			//@ts-ignore
			filter.title = {
				$regex: search,
				$options: "i",
			};
		}

		return this.cursorPaginate({
			cursor,
			direction,
			filter,
		});
	
	}
	async updateProblem(id: string, problem: IProblem): Promise<IProblem | null> {
		const updatedProblem = await ProblemModel.findByIdAndUpdate(id, problem, {
			new: true,
		}); // return the new document

		return updatedProblem;
	}
	async findByDifficulty(
		difficulty: "easy" | "medium" | "hard",
	): Promise<IProblem[]> {
		const problems = await ProblemModel.find({
			difficulty,
		}).sort({ createdAt: -1 });

		return problems;
	}

	async searchProblems(query: string): Promise<IProblem[]> {
		const regex = new RegExp(query, "i"); // Regex makes the query flexible, /sum/i
		const problems = await ProblemModel.find({
			$or: [{ title: regex }, { description: regex }],
		}).sort({ createdAt: -1 });
		return problems;
	}
	async deleteProblem(id: string): Promise<boolean> {
		const problem = await ProblemModel.findByIdAndDelete(id);
		return !!problem;
	}
}
