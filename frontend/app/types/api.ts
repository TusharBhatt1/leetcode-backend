import { Problem, Submission, RunResult, ProgrammingLanguage } from './domain';

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

export interface GetProblemsResponse extends ApiResponse<PaginatedData<Problem>> {}

export interface GetProblemResponse extends ApiResponse<Problem> {}

export interface SubmitSolutionRequest {
  problemId: string;
  language: ProgrammingLanguage;
  code: string;
}

export interface SubmitSolutionResponse extends ApiResponse<{ id: string; status: string }> {}

export interface GetSubmissionResponse extends ApiResponse<Submission> {}

export interface RunCodeRequest {
  problemId: string;
  language: ProgrammingLanguage;
  code: string;
}

export interface RunCodeResponse extends ApiResponse<{ runId: string }> {}

export interface GetRunResultResponse extends ApiResponse<RunResult> {}

export interface LoginRequest {
  email: string;
  password: string;
  role?: 'candidate' | 'problem_setter';
}

export interface LoginResponse extends ApiResponse<{ token: string; user: { id: string; email: string } }> {}

export interface SignupRequest {
  email: string;
  password: string;
  name?: string;
  role?: 'candidate' | 'problem_setter';
}

export interface SignupResponse extends ApiResponse<{ token: string; user: { id: string; email: string } }> {}
