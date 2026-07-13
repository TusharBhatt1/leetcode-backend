// apis/mutations/run.ts

import { apiClient } from "@/app/lib/axios";

export interface RunCodeRequest {
  problemId: string;
  language: string;
  code: string;
}

export interface RunCodeResponse {
  success: boolean;
  data: {
    runId: string;
  };
}

export async function runCode(payload: RunCodeRequest) {
  const { data } = await apiClient.post<RunCodeResponse>(
    "/submission/run",
    payload
  );

  return data;
}