// hooks/useRunCode.ts

import { useMutation } from "@tanstack/react-query";
import { runCode } from "../apis/mutations/run.mutation";

export function useRunCode() {
  return useMutation({
    mutationFn: runCode,
  });
}