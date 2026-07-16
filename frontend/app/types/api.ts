/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Problem, Submission, RunResult, ProgrammingLanguage } from "./domain";

export interface ApiResponse<T> {
	success: boolean;
	data: T;
	message?: string;
}

export interface PaginatedData<T> {
	data: T[];
	pageInfo: PageInfo;
}

export interface PageInfo {
	hasPrevPage: boolean;
	hasNextPage: boolean;
	prevCursor?: string;
	nextCursor?: string;
}

export interface GetProblemsResponse extends ApiResponse<
	PaginatedData<Problem>
> {}

export interface GetProblemResponse extends ApiResponse<Problem> {}

export interface SubmitSolutionRequest {
	problemId: string;
	language: ProgrammingLanguage;
	code: string;
}

export interface SubmitSolutionResponse {
	data: {
		id: string;
		status: string;
	};
}

export interface GetSubmissionResponse extends ApiResponse<Submission> {}

export interface RunCodeRequest {
	problemId: string;
	language: ProgrammingLanguage;
	code: string;
}

export interface RunCodeResponse {
	data: {
		runId: string;
	};
}

export interface GetRunResultResponse extends RunResult {}

export interface LoginRequest {
	email: string;
	password: string;
	role?: "candidate" | "problem_setter";
}

export interface LoginResponse {
	token: string;
	user: { id: string; email: string; name: string };
}

export interface SignupRequest {
	email: string;
	password: string;
	name?: string;
	role?: "candidate" | "problem_setter" | "admin";
}

export interface SignupResponse {
	user: { id: string; email: string };
}
