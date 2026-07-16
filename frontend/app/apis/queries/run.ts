import { apiClient } from '@/app/lib/axios';
import { GetRunResultResponse } from '@/app/types/api';
import { RunResult } from '@/app/types/domain';

export async function getRunResult(runId: string): Promise<RunResult> {
  const { data } = await apiClient.get<GetRunResultResponse>(`/submission/run/${runId}`);
  return data
}
