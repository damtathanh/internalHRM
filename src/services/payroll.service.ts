import { PayrollRun, PayrollComponent, Payslip, BankTransfer } from '../types';
import { supabase } from '../lib/supabase';

// Mock data - will be replaced with actual Supabase queries
const mockPayrollRuns: PayrollRun[] = [
  { id: 1, period: "January 2024", status: "completed", employees: 1247, totalAmount: "SAR 3,245,678", runDate: "2024-01-31", approvedBy: "Sarah Johnson" },
  { id: 2, period: "February 2024", status: "processing", employees: 1251, totalAmount: "SAR 3,287,432", runDate: "2024-02-28", approvedBy: "Pending" },
  { id: 3, period: "March 2024", status: "draft", employees: 1255, totalAmount: "SAR 3,312,890", runDate: "2024-03-31", approvedBy: "Pending" },
];

const mockPayrollComponents: PayrollComponent[] = [
  { name: "Basic Salary", amount: "SAR 2,156,789", percentage: 66.4, employees: 1247 },
  { name: "Housing Allowance", amount: "SAR 647,037", percentage: 19.9, employees: 1247 },
  { name: "Transportation", amount: "SAR 249,360", percentage: 7.7, employees: 1247 },
  { name: "Medical Allowance", amount: "SAR 124,680", percentage: 3.8, employees: 847 },
  { name: "Performance Bonus", amount: "SAR 67,812", percentage: 2.1, employees: 234 },
];

const mockPayslips: Payslip[] = [
  { id: 1, employee: "Ahmed Al-Rashid", empId: "EMP001", department: "Engineering", grossPay: "SAR 12,500", netPay: "SAR 10,875", status: "approved" },
  { id: 2, employee: "Sarah Johnson", empId: "EMP002", department: "HR", grossPay: "SAR 15,000", netPay: "SAR 13,125", status: "approved" },
  { id: 3, employee: "Mohammed Hassan", empId: "EMP003", department: "Finance", grossPay: "SAR 11,800", netPay: "SAR 10,290", status: "pending" },
  { id: 4, employee: "Linda Smith", empId: "EMP004", department: "Marketing", grossPay: "SAR 13,200", netPay: "SAR 11,520", status: "approved" },
];

const mockBankTransfers: BankTransfer[] = [
  { id: 1, bank: "Saudi National Bank", employees: 456, amount: "SAR 1,234,567", status: "completed", date: "2024-01-31" },
  { id: 2, bank: "Al Rajhi Bank", employees: 342, amount: "SAR 987,654", status: "completed", date: "2024-01-31" },
  { id: 3, bank: "Riyadh Bank", employees: 289, amount: "SAR 765,432", status: "pending", date: "2024-02-01" },
  { id: 4, bank: "SABB", employees: 160, amount: "SAR 258,025", status: "pending", date: "2024-02-01" },
];

export const payrollService = {
  // Payroll Run operations
  async getPayrollRuns(): Promise<PayrollRun[]> {
    // TODO: Replace with actual Supabase query
    // const { data, error } = await supabase.from('payroll_runs').select('*').order('runDate', { ascending: false });
    // if (error) throw error;
    // return data;
    return mockPayrollRuns;
  },

  async getPayrollRunById(id: number): Promise<PayrollRun | null> {
    const runs = await this.getPayrollRuns();
    return runs.find(r => r.id === id) || null;
  },

  async createPayrollRun(run: Omit<PayrollRun, 'id'>): Promise<PayrollRun> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async processPayrollRun(id: number): Promise<PayrollRun> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  // Payroll Component operations
  async getPayrollComponents(period?: string): Promise<PayrollComponent[]> {
    // TODO: Replace with actual Supabase query
    return mockPayrollComponents;
  },

  // Payslip operations
  async getPayslips(filters?: { employeeId?: string; period?: string }): Promise<Payslip[]> {
    // TODO: Replace with actual Supabase query
    return mockPayslips;
  },

  async getPayslipById(id: number): Promise<Payslip | null> {
    const payslips = await this.getPayslips();
    return payslips.find(p => p.id === id) || null;
  },

  async generatePayslip(employeeId: string, period: string): Promise<Payslip> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  // Bank Transfer operations
  async getBankTransfers(): Promise<BankTransfer[]> {
    // TODO: Replace with actual Supabase query
    return mockBankTransfers;
  },

  async processBankTransfer(id: number): Promise<BankTransfer> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },
};
