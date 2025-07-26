import apiClient from "../api-client";

export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  first_name: string;
  last_name: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<User> => {
    const response = await apiClient.post("/api/login/", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<User> => {
    const response = await apiClient.post("/api/register/", data);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/api/logout/");
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get("/api/user/");
    return response.data;
  },
};
