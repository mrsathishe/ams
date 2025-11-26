export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
  is_active: boolean;
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
  password: string;
  role?: string;
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
