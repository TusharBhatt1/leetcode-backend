import { useMutation } from '@tanstack/react-query';
import { login } from '../apis/queries/login';
import { LoginRequest } from '@/app/types/api';

export const useLogin = () => {
  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
  });
};