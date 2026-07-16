import apiClient from '@/app/lib/axios';
import { LoginRequest, LoginResponse } from '@/app/types/api';

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/login', data);
  return response.data;
};