import { apiClient } from '@/app/lib/axios';
import { GetProblemsResponse, GetProblemResponse } from '@/app/types/api';
import { Problem } from '@/app/types/domain';

export interface GetProblemsParams {
  search: string;
  cursor?: string;
  direction: 'next' | 'prev';
}

export async function getProblems({
  search,
  cursor,
  direction,
}: GetProblemsParams) {
  const response = await apiClient.get<GetProblemsResponse>('/problem', {
    params: {
      search,
      cursor,
      direction,
    },
  });

  return {
    problems: response.data.data.data,
    pageInfo: response.data.data.pageInfo,
  };
}

export async function getProblem(id: string): Promise<Problem> {
  const response = await apiClient.get<GetProblemResponse>(`/problem/${id}`);
  return response.data.data;
}