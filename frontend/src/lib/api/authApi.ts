import { LoginCredentials, RegisterData, User } from "@/types";
import api from "./apiConfig";

// Auth API
export const authAPI = {
  login: async (
    credentials: LoginCredentials,
  ): Promise<{ access_token: string; token_type: string }> => {
    const response = await api.post(
      "/token",
      { ...credentials },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  },

  register: async (data: RegisterData): Promise<User> => {
    const response = await api.post("/register", data);
    return response.data;
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await api.get("/users/me");
    return response.data;
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    const response = await api.post("/password-reset/request", { email });
    return response.data;
  },

  resetPassword: async (
    token: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    const response = await api.post("/password-reset/confirm", {
      token,
      new_password: newPassword,
    });
    return response.data;
  },

  changePassword: async (
    email: string,
    newPassword: string,
  ): Promise<{ message: string }> => {
    const response = await api.post("/change-password", {
      email,
      new_password: newPassword,
    });
    return response.data;
  },
};
