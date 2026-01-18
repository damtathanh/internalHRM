// Common types
export type Status = 'pending' | 'approved' | 'rejected' | 'completed' | 'draft' | 'processing' | 'active' | 'inactive' | 'scheduled' | 'under_review' | 'offer_extended' | 'interview_scheduled';
export type Priority = 'high' | 'medium' | 'low';

// Auth & Profile types
export type Role = 'admin' | 'hr' | 'manager' | 'employee';

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  role: Role;
  department_id: string | null;
  manager_id: string | null;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// WORKFORCE MANAGEMENT TYPES
// ============================================================================

// Employee types
export type EmployeeStatus = 'active' | 'on_leave' | 'resigned';

export interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position_id: string | null;
  department_id: string | null;
  manager_id: string | null;
  job_grade_id: string | null;
  status: EmployeeStatus;
  system_role: Role; // Internal only - NOT displayed in UI
  user_id: string | null;
  created_at: string;
  updated_at: string;
}

// Employee list item with joined data for display
export interface EmployeeListItem {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  position: string | null;
  department: string | null;
  manager: string | null;
  status: EmployeeStatus;
  // NOTE: system_role is NOT included here - it's internal only
}

// Department types
export type DepartmentStatus = 'active' | 'inactive';

export interface Department {
  id: string;
  name: string;
  manager_id: string | null;
  description: string | null;
  status: DepartmentStatus;
  created_at: string;
  updated_at: string;
}

// Department list item with joined data for display
export interface DepartmentListItem {
  id: string;
  name: string;
  manager_id: string | null;
  manager_name: string | null;
  employee_count: number;
  budget: number; // Calculated - sum of employee salaries
  status: DepartmentStatus;
  description: string | null;
}

// Position types
export type PositionStatus = 'active' | 'inactive';

export interface Position {
  id: string;
  title: string;
  department_id: string | null;
  description: string | null;
  status: PositionStatus;
  created_at: string;
  updated_at: string;
}

// Position list item with joined data
export interface PositionListItem {
  id: string;
  title: string;
  department_id: string | null;
  department_name: string | null;
  status: PositionStatus;
  description: string | null;
}

// Job Grade types
// Job Grades are defined per Position
// Each grade has multiple salary levels (some may be nullable)
export interface JobGrade {
  id: string;
  position_id: string;
  intern_salary: number | null;
  junior_salary: number | null;
  middle_salary: number | null;
  senior_salary: number | null;
  lead_salary: number | null;
  manager_salary: number | null; // Also used for Head level
  created_at: string;
  updated_at: string;
}

// Job Grade list item with joined data for display
export interface JobGradeListItem {
  id: string;
  position_id: string;
  position_title: string;
  intern_salary: number | null;
  junior_salary: number | null;
  middle_salary: number | null;
  senior_salary: number | null;
  lead_salary: number | null;
  manager_salary: number | null;
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
  level?: string;
  openings?: number;
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
