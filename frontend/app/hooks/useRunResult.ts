// hooks/useRunResult.ts

import { useQuery } from "@tanstack/react-query";
import { getRunResult } from "@/app/apis/queries/run";

export function useRunResult(runId?: string) {
  return useQuery({
    queryKey: ["run-result", runId],
    queryFn: () => getRunResult(runId!),
    enabled: !!runId,

    refetchInterval: (query) => {
      const status = query.state.data?.status;

      if (status === "PENDING") {
        return 1000;
      }

      return false;
    },
  });
}