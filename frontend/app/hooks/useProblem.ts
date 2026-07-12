import { useQuery } from "@tanstack/react-query";
import { getProblem } from "../apis/queries/problem";

export function useProblem(id: string) {
  return useQuery({
    queryKey: ["problem", id],
    queryFn: () => getProblem(id),
    enabled: !!id,
  });
}