// Common types
export type Status = 'pending' | 'approved' | 'rejected' | 'completed' | 'draft' | 'processing' | 'active' | 'inactive' | 'scheduled' | 'under_review' | 'offer_extended' | 'interview_scheduled';
export type Priority = 'high' | 'medium' | 'low';

// Employee types
export interface Employee {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department: string;
  position: string;
  manager?: string;
  hireDate: string;
  status: Status;
  avatar?: string;
}

// Department types
export interface Department {
  id: number;
  name: string;
  manager: string;
  employees: number;
  budget: string;
  status: Status;
  description?: string;
}

// Position types
export interface Position {
  id: number;
  title: string;
  department: string;
  level: string;
  openings: number;
  status: Status;
}

// Salary Grade types
export interface SalaryGrade {
  id: number;
  grade: string;
  minSalary: string;
  maxSalary: string;
  level: string;
}

// Payroll types
export interface PayrollRun {
  id: number;
  period: string;
  status: Status;
  employees: number;
  totalAmount: string;
  runDate: string;
  approvedBy: string;
}

export interface PayrollComponent {
  name: string;
  amount: string;
  percentage: number;
  employees: number;
}

export interface Payslip {
  id: number;
  employee: string;
  empId: string;
  department: string;
  grossPay: string;
  netPay: string;
  status: Status;
}

export interface BankTransfer {
  id: number;
  bank: string;
  employees: number;
  amount: string;
  status: Status;
  date: string;
}

// Attendance types
export interface AttendanceRecord {
  id: number;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  hours: number;
  status: 'present' | 'absent' | 'late' | 'half-day';
}

export interface LeaveRequest {
  id: number;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: Status;
  reason: string;
}

// Recruitment types
export interface HiringRequest {
  id: number;
  position: string;
  department: string;
  priority: Priority;
  requestedBy: string;
  status: Status;
  deadline: string;
}

export interface Application {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  experience: string;
  status: string;
  rating: number;
  appliedDate: string;
  avatar?: string;
}

export interface Interview {
  id: number;
  candidate: string;
  position: string;
  interviewer: string;
  date: string;
  time: string;
  type: string;
  status: Status;
}

// Dashboard types
export interface DashboardStat {
  title: string;
  value: string;
  change: string;
  icon: any;
  color: string;
}

export interface RecentRequest {
  id: number;
  type: string;
  employee: string;
  status: Status;
  date: string;
}

export interface UpcomingEvent {
  id: number;
  title: string;
  date: string;
  type: string;
}

// Loan types
export interface LoanRequest {
  id: number;
  type: string;
  amount: string;
  purpose: string;
  requestDate: string;
  status: Status;
  installments: number;
}

// Dependent types
export interface Dependent {
  id: number;
  name: string;
  relationship: string;
  birthDate: string;
  insurance: boolean;
  idNumber: string;
}
