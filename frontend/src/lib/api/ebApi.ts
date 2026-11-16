import api from "./apiConfig";
import type { EBAccount, EBBill, EBPayment } from "@/types";

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
  ): Promise<EBBill> =>
    (await api.post(`/eb-accounts/${accountId}/bills`, data)).data,
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
  ): Promise<EBBill> => (await api.patch(`/eb-bills/${billId}`, data)).data,
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
  approve: async (requestId: string): Promise<{ status: string }> =>
    (await api.post(`/approvals/${requestId}/approve`)).data,
};
