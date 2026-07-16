import { apiClient } from '@/app/lib/axios';
import { SubmitSolutionRequest, SubmitSolutionResponse } from '@/app/types/api';

export async function submitSolution(payload: SubmitSolutionRequest): Promise<SubmitSolutionResponse> {
  const { data } = await apiClient.post<SubmitSolutionResponse>('/submission/submit', payload);
  return data;
}