// apis/queries/run.ts

import { api } from "@/app/lib/axios";

export async function getRunResult(runId: string) {
  const { data } = await api.get(`/submission/run/${runId}`,{
    baseURL:"http://localhost:3001/api/v1"
  });

  return data;
}