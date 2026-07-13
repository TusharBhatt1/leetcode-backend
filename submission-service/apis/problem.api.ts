import axios, { AxiosResponse } from "axios";
import { logger } from "../src/config/logger.config";
import { crossServiceConfig } from "../src/config";

export interface ITestCase {
	input: string;
	output: string;
}
export interface IProblem {
	title: string;
	description: string;
	difficulty: "easy" | "medium" | "hard";
	testCases: ITestCase[];
	functionName: string;
	editorial?: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IProblemResponse {
	data: IProblem;
	message: string;
	success: boolean;
}

export async function getProblemById(
	problemId: string,
): Promise<IProblem | null> {
	try {
		const response: AxiosResponse<IProblemResponse> = await axios.get(
			`${crossServiceConfig.PROBLEM_SERVICE}/api/v1/problem/${problemId}`,
		);
		if (response.data.data) {
			return response.data.data;
		}

		throw new Error("Problem not found");
	} catch (error) {
		logger.error("Fetching problem by ID failed", problemId);
		return null;
	}
}
