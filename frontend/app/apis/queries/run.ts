// apis/queries/run.ts

import { apiClient } from "@/app/lib/axios";

export async function getRunResult(runId: string) {
	const { data } = await apiClient.get(`/submission/run/${runId}`);

	return data;
}
