import { AttendanceRecord, LeaveRequest } from '../types';
import { supabase } from '../lib/supabase';

// Mock data - will be replaced with actual Supabase queries
const mockAttendanceRecords: AttendanceRecord[] = [];
const mockLeaveRequests: LeaveRequest[] = [
  { id: 1, employeeId: "EMP001", employeeName: "Ahmed Al-Rashid", type: "Annual Leave", startDate: "2024-02-15", endDate: "2024-02-19", days: 5, status: "approved", reason: "Family vacation" },
  { id: 2, employeeId: "EMP002", employeeName: "Sarah Johnson", type: "Sick Leave", startDate: "2024-01-10", endDate: "2024-01-12", days: 3, status: "approved", reason: "Medical treatment" },
  { id: 3, employeeId: "EMP003", employeeName: "Mohammed Hassan", type: "Personal Leave", startDate: "2024-02-28", endDate: "2024-02-28", days: 1, status: "pending", reason: "Personal matters" },
];

export const attendanceService = {
  // Attendance Record operations
  async getAttendanceRecords(filters?: { employeeId?: string; startDate?: string; endDate?: string }): Promise<AttendanceRecord[]> {
    // TODO: Replace with actual Supabase query
    // const query = supabase.from('attendance_records').select('*');
    // if (filters?.employeeId) query.eq('employee_id', filters.employeeId);
    // if (filters?.startDate) query.gte('date', filters.startDate);
    // if (filters?.endDate) query.lte('date', filters.endDate);
    // const { data, error } = await query;
    // if (error) throw error;
    // return data;
    return mockAttendanceRecords;
  },

  async getAttendanceRecordById(id: number): Promise<AttendanceRecord | null> {
    const records = await this.getAttendanceRecords();
    return records.find(r => r.id === id) || null;
  },

  async createAttendanceRecord(record: Omit<AttendanceRecord, 'id'>): Promise<AttendanceRecord> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async updateAttendanceRecord(id: number, record: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  // Leave Request operations
  async getLeaveRequests(filters?: { employeeId?: string; status?: string }): Promise<LeaveRequest[]> {
    // TODO: Replace with actual Supabase query
    return mockLeaveRequests;
  },

  async getLeaveRequestById(id: number): Promise<LeaveRequest | null> {
    const requests = await this.getLeaveRequests();
    return requests.find(r => r.id === id) || null;
  },

  async createLeaveRequest(request: Omit<LeaveRequest, 'id' | 'employeeName'>): Promise<LeaveRequest> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async updateLeaveRequest(id: number, request: Partial<LeaveRequest>): Promise<LeaveRequest> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  async approveLeaveRequest(id: number): Promise<LeaveRequest> {
    return this.updateLeaveRequest(id, { status: 'approved' });
  },

  async rejectLeaveRequest(id: number): Promise<LeaveRequest> {
    return this.updateLeaveRequest(id, { status: 'rejected' });
  },
};
