import { IProblem, ProblemModel } from "../models/problem.model";

export interface IProblemRepository {
	createProblem(problem: Partial<IProblem>): Promise<IProblem>;
	getProblemById(id: string): Promise<IProblem | null>;
	getAllProblems(): Promise<{ problems: IProblem[]; total: number }>;
	updateProblem(id: string, problem: IProblem): Promise<IProblem | null>;
	deleteProblem(id: string): Promise<boolean>;
	findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<IProblem[]>;
	searchProblems(query: string): Promise<IProblem[]>;
}

export class ProblemRepository implements IProblemRepository {
	async createProblem(problem: Partial<IProblem>): Promise<IProblem> {
		return await ProblemModel.create(problem);
	}

	async getProblemById(id: string): Promise<IProblem | null> {
		return await ProblemModel.findById(id);
	}

	async getAllProblems(): Promise<{ problems: IProblem[]; total: number }> {
		const problems = await ProblemModel.find().sort({ createdAt: -1 });

		return { problems, total: problems.length };
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
