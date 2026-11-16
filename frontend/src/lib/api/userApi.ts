import { AxiosResponse } from "axios";
import { User } from "@/types";
import api from "./apiConfig";
// User API
export const userAPI = {
  // Get current user details
  getCurrentUser: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get("/users/me");
    return response.data;
  },
};
