import { useQuery } from "@tanstack/react-query";
import { getProblems } from "../apis/queries/problem";

interface UseProblemsProps {
  search: string;
  cursor?: string;
  direction: "next" | "prev";
}

export function useProblems({
  search,
  cursor,
  direction,
}: UseProblemsProps) {
  return useQuery({
    queryKey: ["problems", search, cursor, direction],
    queryFn: () =>
      getProblems({
        search,
        cursor,
        direction,
      }),
  });
}