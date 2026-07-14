import apiClient from "@/app/lib/axios";


export interface LoginPayload {
  email: string;
  password: string;
  role: "admin" | "candidate" | "problem_setter";
}

export const login = async (data: LoginPayload) => {
  const response = await apiClient.post("/login", data);
  return response.data;
};