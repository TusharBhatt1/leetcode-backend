import { useMutation } from '@tanstack/react-query';
import { signup } from '../apis/mutations/signup';
import { SignupRequest } from '@/app/types/api';

export const useSignup = () => {
  return useMutation({
    mutationFn: (data: SignupRequest) => signup(data),
  });
};
