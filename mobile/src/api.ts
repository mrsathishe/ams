import {
  Apartment,
  ApprovalItem,
  EBAccount,
  EBBill,
  EBPayment,
  Flat,
  RegistrationOption,
  User,
} from "./types";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:8001";

type RequestOptions = {
  token?: string;
  apartmentId?: string | null;
  method?: "GET" | "POST" | "PATCH";
  body?: unknown;
};

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers: Record<string, string> = { Accept: "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;
  if (options.apartmentId) headers["X-Apartment-ID"] = options.apartmentId;
  if (options.body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });

  if (!response.ok) {
    let detail = "The request could not be completed.";
    try {
      const payload = await response.json();
      if (typeof payload.detail === "string") detail = payload.detail;
    } catch {
      detail = response.statusText || detail;
    }
    throw new Error(detail);
  }

  return response.json() as Promise<T>;
}

export async function login(email: string, password: string): Promise<string> {
  const form = `username=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`;
  const response = await fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  if (!response.ok) throw new Error("Email or password is incorrect.");
  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export const api = {
  register: (data: {
    email: string;
    name: string;
    password: string;
    relationship: "Owner" | "Tenant";
    apartment_id?: string;
    apartment_name?: string;
    total_flat_count?: number;
    flat_id?: string;
    flat_name?: string;
  }) => request<User>("/register", { method: "POST", body: data }),
  currentUser: (token: string) => request<User>("/users/me", { token }),
  apartments: (token: string) => request<Apartment[]>("/apartments", { token }),
  registrationOptions: () =>
    request<RegistrationOption[]>("/apartments/registration-options"),
  flats: (token: string, apartmentId: string) =>
    request<Flat[]>(`/apartments/${apartmentId}/flats`, { token, apartmentId }),
  accounts: (token: string, apartmentId: string) =>
    request<EBAccount[]>("/eb-accounts", { token, apartmentId }),
  bills: (token: string, apartmentId: string, accountId: string) =>
    request<EBBill[]>(`/eb-accounts/${accountId}/bills`, {
      token,
      apartmentId,
    }),
  addAccount: (
    token: string,
    apartmentId: string,
    data: { account_type: "common" | "individual"; flat_id?: string },
  ) =>
    request<EBAccount>("/eb-accounts", {
      token,
      apartmentId,
      method: "POST",
      body: data,
    }),
  addBill: (
    token: string,
    apartmentId: string,
    accountId: string,
    data: {
      period_start: string;
      period_end: string;
      opening_balance: number;
      bill_amount: number;
      description?: string;
    },
  ) =>
    request<{ status: string }>(`/eb-accounts/${accountId}/bills`, {
      token,
      apartmentId,
      method: "POST",
      body: data,
    }),
  addPayment: (
    token: string,
    apartmentId: string,
    billId: string,
    data: { amount: number; payment_date: string; payment_method?: string },
  ) =>
    request<EBPayment>(`/eb-bills/${billId}/payments`, {
      token,
      apartmentId,
      method: "POST",
      body: data,
    }),
  updatePayment: (
    token: string,
    apartmentId: string,
    paymentId: string,
    data: { amount?: number; payment_date?: string; payment_method?: string },
  ) =>
    request<EBPayment>(`/eb-payments/${paymentId}`, {
      token,
      apartmentId,
      method: "PATCH",
      body: data,
    }),
  pendingApprovals: (token: string, apartmentId?: string | null) =>
    request<ApprovalItem[]>("/approvals/pending", { token, apartmentId }),
  approve: (token: string, requestId: string, apartmentId?: string | null) =>
    request<{ status: string }>(`/approvals/${requestId}/approve`, {
      token,
      apartmentId,
      method: "POST",
    }),
};
