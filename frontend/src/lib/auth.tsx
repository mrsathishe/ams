import {
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { authAPI } from "../lib/api";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      getCurrentUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const getCurrentUser = async () => {
    try {
      const userData = await authAPI.getCurrentUser();
      setUser(userData);
    } catch {
      localStorage.removeItem("token");
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    const { access_token } = await authAPI.login({ username, password });
    localStorage.setItem("token", access_token);
    await getCurrentUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
