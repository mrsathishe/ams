import axios, { AxiosResponse } from "axios";
import {
  User,
  Expense,
  Payment,
  Document,
  ExpenseWithPayments,
  LoginCredentials,
  RegisterData,
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
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (
    credentials: LoginCredentials
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

// Expenses API
export const expensesAPI = {
  getExpenses: async (
    month?: number,
    year?: number
  ): Promise<ExpenseWithPayments[]> => {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());

    const response = await api.get(`/expenses?${params.toString()}`);
    return response.data;
  },

  getExpense: async (id: string): Promise<ExpenseWithPayments> => {
    const response = await api.get(`/expenses/${id}`);
    return response.data;
  },

  createExpense: async (
    expense: Omit<Expense, "id" | "created_at" | "created_by">
  ): Promise<Expense> => {
    const response = await api.post("/expenses", expense);
    return response.data;
  },
};

// Payments API
export const paymentsAPI = {
  createPayment: async (
    payment: Omit<Payment, "id" | "created_at">
  ): Promise<Payment> => {
    const response = await api.post("/payments", payment);
    return response.data;
  },

  getUserPayments: async (userId: string): Promise<Payment[]> => {
    const response = await api.get(`/payments/user/${userId}`);
    return response.data;
  },
};

// Documents API
export const documentsAPI = {
  getDocuments: async (month?: number, year?: number): Promise<Document[]> => {
    const params = new URLSearchParams();
    if (month) params.append("month", month.toString());
    if (year) params.append("year", year.toString());

    const response = await api.get(`/documents?${params.toString()}`);
    return response.data;
  },

  uploadDocument: async (
    file: File,
    title: string,
    expenseId?: string,
    month?: number,
    year?: number
  ): Promise<Document> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    if (expenseId) formData.append("expense_id", expenseId);
    if (month) formData.append("month", month.toString());
    if (year) formData.append("year", year.toString());

    const response = await api.post("/documents/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  downloadDocument: async (id: string): Promise<Blob> => {
    const response = await api.get(`/documents/${id}/download`, {
      responseType: "blob",
    });
    return response.data;
  },
};

// Analytics API
export const analyticsAPI = {
  getExpenseAnalytics: async (year?: number): Promise<any> => {
    const params = new URLSearchParams();
    if (year) params.append("year", year.toString());

    const response = await api.get(`/analytics/expenses?${params.toString()}`);
    return response.data;
  },
};

export default api;
