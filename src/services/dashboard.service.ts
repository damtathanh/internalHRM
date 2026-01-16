import { DashboardStat, RecentRequest, UpcomingEvent } from '../types';
import { Users, FileText, DollarSign, TrendingUp } from 'lucide-react';

// Mock data - will be replaced with actual Supabase queries
const mockStats: DashboardStat[] = [
  {
    title: "Total Employees",
    value: "1,247",
    change: "+12%",
    icon: Users,
    color: "text-blue-600"
  },
  {
    title: "Active Requests",
    value: "23",
    change: "-8%",
    icon: FileText,
    color: "text-orange-600"
  },
  {
    title: "Monthly Payroll",
    value: "SAR 2.4M",
    change: "+5%",
    icon: DollarSign,
    color: "text-green-600"
  },
  {
    title: "Training Hours",
    value: "4,820",
    change: "+18%",
    icon: TrendingUp,
    color: "text-purple-600"
  }
];

const mockRecentRequests: RecentRequest[] = [
  { id: 1, type: "Leave Request", employee: "Ahmed Al-Rashid", status: "pending", date: "2024-01-15" },
  { id: 2, type: "Loan Request", employee: "Sarah Johnson", status: "approved", date: "2024-01-14" },
  { id: 3, type: "Training Enrollment", employee: "Mohammed Hassan", status: "pending", date: "2024-01-14" },
  { id: 4, type: "Performance Review", employee: "Linda Smith", status: "completed", date: "2024-01-13" },
  { id: 5, type: "Promotion Request", employee: "Omar Abdullah", status: "pending", date: "2024-01-12" }
];

const mockUpcomingEvents: UpcomingEvent[] = [
  { id: 1, title: "Team Building Workshop", date: "2024-01-20", type: "training" },
  { id: 2, title: "Performance Review - Marketing", date: "2024-01-22", type: "review" },
  { id: 3, title: "New Employee Orientation", date: "2024-01-25", type: "onboarding" },
  { id: 4, title: "Leadership Development Program", date: "2024-01-28", type: "training" }
];

export const dashboardService = {
  async getStats(): Promise<DashboardStat[]> {
    // TODO: Replace with actual calculations from Supabase
    // This should aggregate data from employees, requests, payroll, etc.
    return mockStats;
  },

  async getRecentRequests(limit: number = 5): Promise<RecentRequest[]> {
    // TODO: Replace with actual Supabase query
    // Should combine leave requests, loan requests, etc.
    return mockRecentRequests.slice(0, limit);
  },

  async getUpcomingEvents(limit: number = 10): Promise<UpcomingEvent[]> {
    // TODO: Replace with actual Supabase query
    // Should get events from training, reviews, onboarding, etc.
    return mockUpcomingEvents.slice(0, limit);
  },
};
