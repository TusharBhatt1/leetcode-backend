import apiClient from '@/app/lib/axios';
import { SignupRequest, SignupResponse } from '@/app/types/api';

export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>('/signup', data);
  return response.data;
}
