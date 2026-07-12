import { api } from "@/app/lib/axios";
export type SubmissionLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp";

export interface SubmitSolutionRequest {
  problemId: string;
  language: SubmissionLanguage;
  code: string;
}

export interface SubmitSolutionResponse {
  success: boolean;
  data: {
    submissionId: string;
    status: string;
  };
}

export async function submitSolution(
  payload: SubmitSolutionRequest
): Promise<SubmitSolutionResponse> {
  const { data } = await api.post("/submit", payload,{
    baseURL:"http://localhost:3001/api/v1/submission"
  });

  return data;
}