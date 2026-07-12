import { useMutation } from "@tanstack/react-query";
import { submitSolution } from "../apis/queries/mutations/submission";

export function useSubmitSolution() {
  return useMutation({
    mutationFn: submitSolution,
  });
}