export interface User {
  id: string;
  email: string;
  name: string;
  phone_number?: string | null;
  is_active: boolean;
  is_super_admin: boolean;
  approval_status: "pending" | "approved";
  memberships: MembershipSummary[];
  created_at: string;
}

export interface MembershipSummary {
  id: string;
  apartment_id: string;
  apartment_name: string;
  flat_id: string;
  flat_name: string;
  relationship: "Owner" | "Tenant" | "Rental";
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

export interface ApartmentMember {
  id: string;
  user_id: string;
  name: string;
  email: string;
  apartment_id: string;
  flat_id: string;
  flat_name: string;
  relationship: "Owner" | "Tenant" | "Rental";
  status: "pending" | "approved" | "rejected";
  permissions: {
    can_view_common_eb: boolean;
    can_view_individual_eb: boolean;
    can_add_eb: boolean;
    can_manage_apartment: boolean;
  };
}

export interface ApartmentRegistrationOption {
  id: string;
  name: string;
  total_flat_count: number;
  flats: { id: string; name: string }[];
}

export interface Community {
  id: string;
  name: string;
  status: "pending" | "active" | "suspended";
  total_building_count: number;
  total_flat_count: number;
  created_at: string;
}

export interface Building {
  id: string;
  community_id: string;
  name: string;
  total_flat_count: number;
  flat_count: number;
  created_at: string;
}

export interface Expense {
  id: string;
  amount: number;
  month: number;
  year: number;
  expense_type: string;
  description?: string;
  created_at: string;
  created_by: string;
}

export interface Payment {
  id: string;
  user_id: string;
  expense_id: string;
  amount: number;
  payment_date: string;
  payment_method?: string;
  created_at: string;
}

export interface Document {
  id: string;
  title: string;
  filename: string;
  file_path: string;
  file_type: string;
  expense_id?: string;
  month?: number;
  year?: number;
  uploaded_at: string;
  uploaded_by: string;
}

export interface ExpenseWithPayments extends Expense {
  payments: Payment[];
  total_paid: number;
  remaining_amount: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  email: string;
  name: string;
  phone_number: string;
  password: string;
  relationship: "Owner" | "Rental";
  community_id: string;
  building_id: string;
  flat_number: string;
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

export interface PendingApproval {
  id: string;
  type: "membership" | "apartment_change" | "eb_bill_create" | "eb_bill_update";
  apartment_id: string;
  name: string;
  relationship: "Owner" | "Tenant" | "Rental";
  flat_name: string;
  apartment_name: string;
  changes?: Record<string, unknown>;
  approved_count?: number;
  required_approvals?: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}
