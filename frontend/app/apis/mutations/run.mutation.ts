import { apiClient } from '@/app/lib/axios';
import { RunCodeRequest, RunCodeResponse } from '@/app/types/api';

export async function runCode(payload: RunCodeRequest): Promise<RunCodeResponse> {
  const { data } = await apiClient.post<RunCodeResponse>('/submission/run', payload);
  return data;
}