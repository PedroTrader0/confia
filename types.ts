export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Customer {
  id: string;
  name: string;
  cpf_cnpj: string;
  phone: string;
  email: string;
  notes: string;
  user_id?: string;
}

export interface Supplier {
  id: string;
  name: string;
  cnpj: string;
  phone: string;
  email: string;
  product_service: string;
  user_id?: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  category: string;
  description: string;
  user_id?: string;
}

export interface DashboardStats {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  netProfit: number;
}
