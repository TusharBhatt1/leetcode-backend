import { apiClient } from '@/app/lib/axios';
import { GetSubmissionsResponse } from '@/app/types/api';
import { Submission } from '@/app/types/domain';

export async function getSubmissions(): Promise<Submission[]> {
  const { data } = await apiClient.get<GetSubmissionsResponse>('/submission/me');
  return data.data;
}
