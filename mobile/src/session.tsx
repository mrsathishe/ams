import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { api, login as loginApi } from "./api";
import type { Apartment, User } from "./types";

const TOKEN_KEY = "kootukudil_access_token";
const APARTMENT_KEY = "kootukudil_active_apartment";

interface SessionValue {
  user: User | null;
  token: string;
  apartments: Apartment[];
  activeApartmentId: string;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: Parameters<typeof api.register>[0]) => Promise<User>;
  refresh: () => Promise<User | null>;
  selectApartment: (apartmentId: string) => Promise<void>;
  logout: () => Promise<void>;
}

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState("");
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [activeApartmentId, setActiveApartmentId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadAccount = async (accessToken: string) => {
    const [profile, apartmentList] = await Promise.all([
      api.currentUser(accessToken),
      api.apartments(accessToken),
    ]);
    setUser(profile);
    setApartments(apartmentList);
    const savedApartment = await SecureStore.getItemAsync(APARTMENT_KEY);
    const nextApartment = apartmentList.some(
      (item) => item.id === savedApartment,
    )
      ? savedApartment || ""
      : apartmentList[0]?.id || "";
    setActiveApartmentId(nextApartment);
    if (nextApartment)
      await SecureStore.setItemAsync(APARTMENT_KEY, nextApartment);
    else await SecureStore.deleteItemAsync(APARTMENT_KEY);
    return profile;
  };

  useEffect(() => {
    let active = true;
    const restore = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        if (storedToken) {
          await loadAccount(storedToken);
          if (active) setToken(storedToken);
        }
      } catch {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
        await SecureStore.deleteItemAsync(APARTMENT_KEY);
        if (active) {
          setUser(null);
          setApartments([]);
          setActiveApartmentId("");
        }
      } finally {
        if (active) setIsLoading(false);
      }
    };
    void restore();
    return () => {
      active = false;
    };
  }, []);

  const refresh = async () => {
    if (!token) return null;
    return loadAccount(token);
  };

  const login = async (email: string, password: string) => {
    const accessToken = await loginApi(email, password);
    await SecureStore.setItemAsync(TOKEN_KEY, accessToken);
    setToken(accessToken);
    return loadAccount(accessToken);
  };

  const register = async (data: Parameters<typeof api.register>[0]) => {
    await api.register(data);
    return login(data.email, data.password);
  };

  const selectApartment = async (apartmentId: string) => {
    if (!apartments.some((apartment) => apartment.id === apartmentId)) return;
    setActiveApartmentId(apartmentId);
    await SecureStore.setItemAsync(APARTMENT_KEY, apartmentId);
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    await SecureStore.deleteItemAsync(APARTMENT_KEY);
    setToken("");
    setUser(null);
    setApartments([]);
    setActiveApartmentId("");
  };

  return (
    <SessionContext.Provider
      value={{
        user,
        token,
        apartments,
        activeApartmentId,
        isLoading,
        login,
        register,
        refresh,
        selectApartment,
        logout,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const session = useContext(SessionContext);
  if (!session)
    throw new Error("useSession must be used inside SessionProvider");
  return session;
}
