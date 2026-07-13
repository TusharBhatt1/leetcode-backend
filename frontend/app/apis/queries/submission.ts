// apis/queries/submission.ts

import { apiClient } from "@/app/lib/axios";

export async function getSubmission(id: string) {
  const { data } = await apiClient.get(`/submission/${id}`);

  return data.data;
}