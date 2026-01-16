import { HiringRequest, Application, Interview } from '../types';
import { supabase } from '../lib/supabase';

// Mock data - will be replaced with actual Supabase queries
const mockHiringRequests: HiringRequest[] = [
  { id: 1, position: "Senior Software Engineer", department: "Engineering", priority: "high", requestedBy: "Ahmed Al-Rashid", status: "approved", deadline: "2024-02-15" },
  { id: 2, position: "Marketing Specialist", department: "Marketing", priority: "medium", requestedBy: "Linda Smith", status: "pending", deadline: "2024-02-20" },
  { id: 3, position: "HR Coordinator", department: "Human Resources", priority: "low", requestedBy: "Sarah Johnson", status: "draft", deadline: "2024-03-01" },
  { id: 4, position: "Financial Analyst", department: "Finance", priority: "high", requestedBy: "Mohammed Hassan", status: "approved", deadline: "2024-02-10" },
];

const mockApplications: Application[] = [
  { id: 1, name: "Omar Abdullah", position: "Senior Software Engineer", email: "omar.abdullah@email.com", phone: "+966 50 123 4567", experience: "5 years", status: "interview_scheduled", rating: 4.5, appliedDate: "2024-01-10", avatar: "/api/placeholder/40/40" },
  { id: 2, name: "Fatima Al-Zahra", position: "Marketing Specialist", email: "fatima.zahra@email.com", phone: "+966 55 987 6543", experience: "3 years", status: "under_review", rating: 4.2, appliedDate: "2024-01-12", avatar: "/api/placeholder/40/40" },
  { id: 3, name: "John Mitchell", position: "Senior Software Engineer", email: "john.mitchell@email.com", phone: "+966 50 555 1234", experience: "7 years", status: "offer_extended", rating: 4.8, appliedDate: "2024-01-08", avatar: "/api/placeholder/40/40" },
  { id: 4, name: "Aisha Rahman", position: "HR Coordinator", email: "aisha.rahman@email.com", phone: "+966 54 333 7890", experience: "2 years", status: "rejected", rating: 3.5, appliedDate: "2024-01-14", avatar: "/api/placeholder/40/40" },
];

const mockInterviews: Interview[] = [
  { id: 1, candidate: "Omar Abdullah", position: "Senior Software Engineer", interviewer: "Ahmed Al-Rashid", date: "2024-01-22", time: "10:00 AM", type: "technical", status: "scheduled" },
  { id: 2, candidate: "Fatima Al-Zahra", position: "Marketing Specialist", interviewer: "Linda Smith", date: "2024-01-23", time: "2:00 PM", type: "behavioral", status: "scheduled" },
  { id: 3, candidate: "John Mitchell", position: "Senior Software Engineer", interviewer: "Sarah Johnson", date: "2024-01-20", time: "11:00 AM", type: "hr", status: "completed" },
  { id: 4, candidate: "Omar Abdullah", position: "Senior Software Engineer", interviewer: "Tech Team", date: "2024-01-24", time: "3:00 PM", type: "panel", status: "scheduled" },
];

export const recruitmentService = {
  // Hiring Request operations
  async getHiringRequests(): Promise<HiringRequest[]> {
    // TODO: Replace with actual Supabase query
    return mockHiringRequests;
  },

  async getHiringRequestById(id: number): Promise<HiringRequest | null> {
    const requests = await this.getHiringRequests();
    return requests.find(r => r.id === id) || null;
  },

  async createHiringRequest(request: Omit<HiringRequest, 'id'>): Promise<HiringRequest> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async updateHiringRequest(id: number, request: Partial<HiringRequest>): Promise<HiringRequest> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  async approveHiringRequest(id: number): Promise<HiringRequest> {
    return this.updateHiringRequest(id, { status: 'approved' });
  },

  // Application operations
  async getApplications(filters?: { position?: string; status?: string }): Promise<Application[]> {
    // TODO: Replace with actual Supabase query
    return mockApplications;
  },

  async getApplicationById(id: number): Promise<Application | null> {
    const applications = await this.getApplications();
    return applications.find(a => a.id === id) || null;
  },

  async createApplication(application: Omit<Application, 'id'>): Promise<Application> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async updateApplication(id: number, application: Partial<Application>): Promise<Application> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  // Interview operations
  async getInterviews(filters?: { candidate?: string; status?: string }): Promise<Interview[]> {
    // TODO: Replace with actual Supabase query
    return mockInterviews;
  },

  async getInterviewById(id: number): Promise<Interview | null> {
    const interviews = await this.getInterviews();
    return interviews.find(i => i.id === id) || null;
  },

  async createInterview(interview: Omit<Interview, 'id'>): Promise<Interview> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async updateInterview(id: number, interview: Partial<Interview>): Promise<Interview> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  async completeInterview(id: number): Promise<Interview> {
    return this.updateInterview(id, { status: 'completed' });
  },
};
