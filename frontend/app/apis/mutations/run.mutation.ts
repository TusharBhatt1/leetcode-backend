// apis/mutations/run.ts

import { api } from "@/app/lib/axios";

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
  const { data } = await api.post<RunCodeResponse>(
    "/submission/run",
    payload,{
        baseURL:"http://localhost:3001/api/v1"
    }
  );

  return data;
}