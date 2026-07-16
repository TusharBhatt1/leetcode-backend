import { useQuery } from "@tanstack/react-query";
import { getSubmissions } from "../apis/queries/submissions";

export function useSubmissions() {
  return useQuery({
    queryKey: ["submissions"],
    queryFn: () => getSubmissions(),
  });
}
