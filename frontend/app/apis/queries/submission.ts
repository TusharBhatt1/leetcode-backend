import { apiClient } from '@/app/lib/axios';
import { GetSubmissionResponse } from '@/app/types/api';
import { Submission } from '@/app/types/domain';

export async function getSubmission(id: string): Promise<Submission> {
  const { data } = await apiClient.get<GetSubmissionResponse>(`/submission/${id}`);
  return data.data;
}