import { useMutation } from "@tanstack/react-query";
import { login, LoginPayload } from "../apis/queries/login";

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginPayload) => login(data),
  });
};