import { LoanRequest, Dependent } from '../types';
import { supabase } from '../lib/supabase';

// Mock data - will be replaced with actual Supabase queries
const mockLoanRequests: LoanRequest[] = [
  { id: 1, type: "Personal Loan", amount: "SAR 50,000", purpose: "Home renovation", requestDate: "2024-01-15", status: "approved", installments: 24 },
  { id: 2, type: "Emergency Loan", amount: "SAR 10,000", purpose: "Medical emergency", requestDate: "2024-01-20", status: "pending", installments: 12 },
  { id: 3, type: "Salary Advance", amount: "SAR 5,000", purpose: "Urgent expenses", requestDate: "2024-01-25", status: "approved", installments: 6 },
];

const mockDependents: Dependent[] = [
  { id: 1, name: "Fatima Abdullah", relationship: "Spouse", birthDate: "1990-05-15", insurance: true, idNumber: "1234567890" },
  { id: 2, name: "Omar Abdullah", relationship: "Son", birthDate: "2015-08-20", insurance: true, idNumber: "9876543210" },
  { id: 3, name: "Aisha Abdullah", relationship: "Daughter", birthDate: "2018-03-10", insurance: true, idNumber: "5555555555" },
];

export const loanService = {
  // Loan Request operations
  async getLoanRequests(employeeId?: string): Promise<LoanRequest[]> {
    // TODO: Replace with actual Supabase query
    // if (employeeId) {
    //   const { data, error } = await supabase
    //     .from('loan_requests')
    //     .select('*')
    //     .eq('employee_id', employeeId)
    //     .order('requestDate', { ascending: false });
    //   if (error) throw error;
    //   return data;
    // }
    return mockLoanRequests;
  },

  async getLoanRequestById(id: number): Promise<LoanRequest | null> {
    const requests = await this.getLoanRequests();
    return requests.find(r => r.id === id) || null;
  },

  async createLoanRequest(request: Omit<LoanRequest, 'id'>): Promise<LoanRequest> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async updateLoanRequest(id: number, request: Partial<LoanRequest>): Promise<LoanRequest> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  async approveLoanRequest(id: number): Promise<LoanRequest> {
    return this.updateLoanRequest(id, { status: 'approved' });
  },

  async rejectLoanRequest(id: number): Promise<LoanRequest> {
    return this.updateLoanRequest(id, { status: 'rejected' });
  },

  // Dependent operations
  async getDependents(employeeId?: string): Promise<Dependent[]> {
    // TODO: Replace with actual Supabase query
    return mockDependents;
  },

  async getDependentById(id: number): Promise<Dependent | null> {
    const dependents = await this.getDependents();
    return dependents.find(d => d.id === id) || null;
  },

  async createDependent(dependent: Omit<Dependent, 'id'>): Promise<Dependent> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async updateDependent(id: number, dependent: Partial<Dependent>): Promise<Dependent> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  async deleteDependent(id: number): Promise<void> {
    // TODO: Replace with actual Supabase delete
    throw new Error('Not implemented');
  },
};
