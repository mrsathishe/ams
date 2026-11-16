"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Apartment, LoginCredentials, RegisterData, User } from "../types";
import { apartmentsAPI } from "./api/apartmentsApi";
import { authAPI } from "./api/authApi";

interface AuthContextType {
  user: User | null;
  apartments: Apartment[];
  activeApartmentId: string | null;
  selectApartment: (apartmentId: string) => void;
  login: (username: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  refreshUser: () => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [activeApartmentId, setActiveApartmentId] = useState<string | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    const loadAccount = async () => {
      try {
        const [userData, apartmentData] = await Promise.all([
          authAPI.getCurrentUser(),
          apartmentsAPI.getUserApartments(),
        ]);
        if (!active) return;
        setUser(userData);
        setApartments(apartmentData);
        const savedApartmentId = localStorage.getItem("active_apartment_id");
        const selectedApartment = apartmentData.some(
          (item) => item.id === savedApartmentId,
        )
          ? savedApartmentId
          : apartmentData[0]?.id || null;
        if (selectedApartment)
          localStorage.setItem("active_apartment_id", selectedApartment);
        else localStorage.removeItem("active_apartment_id");
        setActiveApartmentId(selectedApartment);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("active_apartment_id");
        if (active) {
          setUser(null);
          setApartments([]);
          setActiveApartmentId(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void loadAccount();

    return () => {
      active = false;
    };
  }, []);

  const refreshUser = async () => {
    if (!localStorage.getItem("token")) {
      setUser(null);
      return null;
    }
    try {
      const [userData, apartmentData] = await Promise.all([
        authAPI.getCurrentUser(),
        apartmentsAPI.getUserApartments(),
      ]);
      setUser(userData);
      setApartments(apartmentData);
      const savedApartmentId = localStorage.getItem("active_apartment_id");
      const selectedApartment = apartmentData.some(
        (item) => item.id === savedApartmentId,
      )
        ? savedApartmentId
        : apartmentData[0]?.id || null;
      if (selectedApartment)
        localStorage.setItem("active_apartment_id", selectedApartment);
      else localStorage.removeItem("active_apartment_id");
      setActiveApartmentId(selectedApartment);
      return userData;
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("active_apartment_id");
      setUser(null);
      setApartments([]);
      setActiveApartmentId(null);
      return null;
    }
  };

  const login = async (username: string, password: string): Promise<User> => {
    const credentials: LoginCredentials = { username, password };
    const { access_token } = await authAPI.login(credentials);
    localStorage.setItem("token", access_token);
    const userData = await refreshUser();
    if (!userData) throw new Error("Unable to load account");
    return userData;
  };

  const register = async (data: RegisterData): Promise<User> => {
    await authAPI.register(data);
    return login(data.email, data.password);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("active_apartment_id");
    setUser(null);
    setApartments([]);
    setActiveApartmentId(null);
  };

  const selectApartment = (apartmentId: string) => {
    if (!apartments.some((apartment) => apartment.id === apartmentId)) return;
    localStorage.setItem("active_apartment_id", apartmentId);
    setActiveApartmentId(apartmentId);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        apartments,
        activeApartmentId,
        selectApartment,
        login,
        register,
        refreshUser,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
