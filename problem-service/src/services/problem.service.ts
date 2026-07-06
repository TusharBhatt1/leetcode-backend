import { CreateProblemDTO } from "../dtos/problem.dto";
import { IProblem } from "../models/problem.model";
import { IProblemRepository } from "../repository/problem.repository";
import { getSanitizedMarkDown } from "../utils/helpers";

export interface IProblemService {
	createProblem(problem: CreateProblemDTO): Promise<IProblem>;
	getProblemById(id: string): Promise<IProblem | null>;
	getAllProblems(): Promise<{ problems: IProblem[]; total: number }>;
	updateProblem(id: string, problem: IProblem): Promise<IProblem | null>;
	deleteProblem(id: string): Promise<boolean>;
	findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<IProblem[]>;
	searchProblems(query: string): Promise<IProblem[]>;
}

export class ProblemService implements IProblemService {
	private problemRepository: IProblemRepository;

	constructor(problemRepository: IProblemRepository) {
		this.problemRepository = problemRepository;
	}

	async createProblem(problem: CreateProblemDTO): Promise<IProblem> {
		const { description, editorial } = problem;

		const sanitizedDescription = await getSanitizedMarkDown(description);

		const sanitizedEditorial = editorial
			? await getSanitizedMarkDown(editorial)
			: undefined;

		return await this.problemRepository.createProblem({
			...problem,
			description: sanitizedDescription,
			...(editorial && { editorial: sanitizedEditorial }),
		});
	}
	async getProblemById(id: string): Promise<IProblem | null> {
		const p = await this.problemRepository.getProblemById(id);
		if (!p) {
			throw new Error("Problem not found");
		}

		return p;
	}

	async getAllProblems(): Promise<{ problems: IProblem[]; total: number }> {
		return await this.problemRepository.getAllProblems();
	}

	async updateProblem(id: string, problem: IProblem): Promise<IProblem | null> {
		const p = await this.problemRepository.getProblemById(id);

		if (!p) {
			throw new Error("Problem not found");
		}

		const { description, editorial } = problem;

		let sanitizedDescription;
		let sanitizedEditorial;

		if (description) {
			sanitizedDescription = await getSanitizedMarkDown(description);
		}

		if (editorial) {
			sanitizedEditorial = await getSanitizedMarkDown(editorial);
		}

		return await this.problemRepository.updateProblem(id, {
			...problem,
			...(description && { description: sanitizedDescription }),
			...(editorial && { editorial: sanitizedEditorial }),
		});
	}

	async deleteProblem(id: string): Promise<boolean> {
		return this.problemRepository.deleteProblem(id);
	}

	async findByDifficulty(
		difficulty: "easy" | "medium" | "hard",
	): Promise<IProblem[]> {
		return this.problemRepository.findByDifficulty(difficulty);
	}
	async searchProblems(query: string): Promise<IProblem[]> {
		return this.problemRepository.searchProblems(query);
	}
}
