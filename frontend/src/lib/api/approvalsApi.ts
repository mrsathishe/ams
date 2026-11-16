import api from "./apiConfig";
import type { PendingApproval } from "@/types";

export const approvalsAPI = {
  getPending: async (): Promise<PendingApproval[]> =>
    (await api.get("/approvals/pending")).data,
  approve: async (requestId: string): Promise<{ status: string }> =>
    (await api.post(`/approvals/${requestId}/approve`)).data,
};
