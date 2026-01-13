import { createClient } from '@supabase/supabase-js';
import { Customer, Supplier, Transaction } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// --- Mock Service for Demo Mode (when no credentials are provided) ---
// This ensures the app is reviewable and functional even without a real backend connection.

const STORAGE_KEYS = {
  CUSTOMERS: 'confia_customers',
  SUPPLIERS: 'confia_suppliers',
  TRANSACTIONS: 'confia_transactions',
};

const generateId = () => Math.random().toString(36).substr(2, 9);

export const mockService = {
  async getCustomers(): Promise<Customer[]> {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    return data ? JSON.parse(data) : [];
  },
  async createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
    const customers = await this.getCustomers();
    const newCustomer = { ...customer, id: generateId() };
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify([...customers, newCustomer]));
    return newCustomer;
  },
  async deleteCustomer(id: string): Promise<void> {
    const customers = await this.getCustomers();
    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers.filter(c => c.id !== id)));
  },

  async getSuppliers(): Promise<Supplier[]> {
    const data = localStorage.getItem(STORAGE_KEYS.SUPPLIERS);
    return data ? JSON.parse(data) : [];
  },
  async createSupplier(supplier: Omit<Supplier, 'id'>): Promise<Supplier> {
    const suppliers = await this.getSuppliers();
    const newSupplier = { ...supplier, id: generateId() };
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify([...suppliers, newSupplier]));
    return newSupplier;
  },
  async deleteSupplier(id: string): Promise<void> {
    const suppliers = await this.getSuppliers();
    localStorage.setItem(STORAGE_KEYS.SUPPLIERS, JSON.stringify(suppliers.filter(s => s.id !== id)));
  },

  async getTransactions(): Promise<Transaction[]> {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
  },
  async createTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const transactions = await this.getTransactions();
    const newTransaction = { ...transaction, id: generateId() };
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify([...transactions, newTransaction]));
    return newTransaction;
  },
  async deleteTransaction(id: string): Promise<void> {
    const transactions = await this.getTransactions();
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions.filter(t => t.id !== id)));
  }
};
