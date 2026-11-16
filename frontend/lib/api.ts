import axios, { AxiosResponse } from "axios";
import {
  User,
  Apartment,
  ApartmentMember,
  EBAccount,
  EBBill,
  EBPayment,
  LoginCredentials,
  RegisterData,
  ApartmentRegistrationOption,
  Flat,
  PendingApproval,
} from "../types";
const API_BASE_URL = "http://localhost:8001";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const apartmentId =
    typeof window !== "undefined"
      ? localStorage.getItem("active_apartment_id")
      : null;
  if (apartmentId) config.headers["X-Apartment-ID"] = apartmentId;
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (window.location.pathname !== "/") window.location.assign("/");
    }
    return Promise.reject(error);
  },
);

// User API
export const userAPI = {
  // Get current user details
  getCurrentUser: async (): Promise<User> => {
    const response: AxiosResponse<User> = await api.get("/users/me");
    return response.data;
  },
};

// Auth API
export const authAPI = {
  login: async (
    credentials: LoginCredentials,
  ): Promise<{ access_token: string; token_type: string }> => {
    const formData = new FormData();
    formData.append("username", credentials.username);
    formData.append("password", credentials.password);

    const response = await api.post("/token", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
};

export const apartmentsAPI = {
  getRegistrationOptions: async (): Promise<ApartmentRegistrationOption[]> => {
    const response = await api.get("/apartments/registration-options");
    return response.data;
  },
  getUserApartments: async (): Promise<Apartment[]> => {
    const response = await api.get("/apartments");
    return response.data;
  },
  getFlats: async (apartmentId: string): Promise<Flat[]> =>
    (await api.get(`/apartments/${apartmentId}/flats`)).data,
  getMemberships: async (apartmentId: string): Promise<ApartmentMember[]> =>
    (await api.get(`/apartments/${apartmentId}/memberships`)).data,
  updatePermissions: async (
    membershipId: string,
    permissions: Partial<ApartmentMember["permissions"]>,
  ) =>
    (await api.patch(`/memberships/${membershipId}/permissions`, permissions))
      .data,
  updateFlatPolicy: async (
    flatId: string,
    policy: Flat["tenant_membership_approval"],
  ) =>
    (
      await api.patch(
        `/apartments/flats/${flatId}/membership-approval-policy`,
        { tenant_membership_approval: policy },
      )
    ).data,
  setIndividualEB: async (flatId: string, enabled: boolean) =>
    (await api.patch(`/flats/${flatId}/individual-eb`, { enabled })).data,
  requestChange: async (
    apartmentId: string,
    changes: { name?: string; total_flat_count?: number },
  ) =>
    (await api.post(`/apartments/${apartmentId}/change-requests`, changes))
      .data,
  getChanges: async (apartmentId: string) =>
    (await api.get(`/apartments/${apartmentId}/change-requests`)).data,
};

export const ebAPI = {
  getAccounts: async (): Promise<EBAccount[]> =>
    (await api.get("/eb-accounts")).data,
  createAccount: async (data: {
    account_type: "common" | "individual";
    flat_id?: string;
    name?: string;
  }): Promise<EBAccount> => (await api.post("/eb-accounts", data)).data,
  getBills: async (accountId: string): Promise<EBBill[]> =>
    (await api.get(`/eb-accounts/${accountId}/bills`)).data,
  createBill: async (
    accountId: string,
    data: {
      period_start: string;
      period_end: string;
      opening_balance: number;
      bill_amount: number;
      description?: string;
    },
  ) => (await api.post(`/eb-accounts/${accountId}/bills`, data)).data,
  updateBill: async (
    billId: string,
    data: Partial<
      Pick<
        EBBill,
        | "period_start"
        | "period_end"
        | "opening_balance"
        | "bill_amount"
        | "description"
      >
    >,
  ) => (await api.patch(`/eb-bills/${billId}`, data)).data,
  addPayment: async (
    billId: string,
    data: { amount: number; payment_date: string; payment_method?: string },
  ): Promise<EBPayment> =>
    (await api.post(`/eb-bills/${billId}/payments`, data)).data,
  updatePayment: async (
    paymentId: string,
    data: { amount?: number; payment_date?: string; payment_method?: string },
  ): Promise<EBPayment> =>
    (await api.patch(`/eb-payments/${paymentId}`, data)).data,
  approve: async (requestId: string) =>
    (await api.post(`/approvals/${requestId}/approve`)).data,
};

export const approvalsAPI = {
  getPending: async (): Promise<PendingApproval[]> =>
    (await api.get("/approvals/pending")).data,
  approve: async (requestId: string): Promise<{ status: string }> =>
    (await api.post(`/approvals/${requestId}/approve`)).data,
};

export default api;
