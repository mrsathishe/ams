export interface Membership {
  id: string;
  apartment_id: string;
  apartment_name: string;
  flat_id: string;
  flat_name: string;
  relationship: "Owner" | "Tenant";
  status: "pending" | "approved" | "rejected";
  approval_required_by: string;
  eligible_approver_names: string[];
  permissions: {
    can_view_common_eb: boolean;
    can_view_individual_eb: boolean;
    can_add_eb: boolean;
    can_manage_apartment: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  is_active: boolean;
  is_super_admin: boolean;
  approval_status: "pending" | "approved";
  memberships: Membership[];
  created_at: string;
}

export interface Apartment {
  id: string;
  name?: string;
  total_flat_count: number;
  status: "pending" | "active" | "suspended";
  created_by: string;
  created_at: string;
}

export interface Flat {
  id: string;
  apartment_id: string;
  name: string;
  individual_eb_enabled: boolean;
  tenant_membership_approval: "owner" | "tenant" | "owner_or_tenant";
}

export interface RegistrationOption {
  id: string;
  name: string;
  total_flat_count: number;
  flats: Pick<Flat, "id" | "name">[];
}

export interface EBAccount {
  id: string;
  apartment_id: string;
  account_type: "common" | "individual";
  flat_id?: string;
  name: string;
  created_by: string;
  created_at: string;
}

export interface EBPayment {
  id: string;
  bill_id: string;
  paid_by: string;
  payer_name: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  created_at: string;
}

export interface EBBill {
  id: string;
  account_id: string;
  apartment_id: string;
  flat_id?: string;
  period_start: string;
  period_end: string;
  opening_balance: number;
  previous_balance: number;
  bill_amount: number;
  total_payable: number;
  total_paid: number;
  closing_balance: number;
  payment_status: "Pending" | "Partially Paid" | "Paid";
  description?: string;
  created_by: string;
  payments: EBPayment[];
}

export interface ApprovalItem {
  id: string;
  type: "membership" | "apartment_change" | "eb_bill_create" | "eb_bill_update";
  apartment_id: string;
  apartment_name: string;
  flat_name: string;
  relationship: "Owner" | "Tenant";
  name: string;
  approved_count?: number;
  required_approvals?: number;
}
