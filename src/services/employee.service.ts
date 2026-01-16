import { Employee, Department, Position, SalaryGrade } from '../types';
import { supabase } from '../lib/supabase';

// Mock data - will be replaced with actual Supabase queries
const mockEmployees: Employee[] = [];
const mockDepartments: Department[] = [
  { id: 1, name: "Human Resources", manager: "Sarah Johnson", employees: 12, budget: "SAR 2.4M", status: "active" },
  { id: 2, name: "Engineering", manager: "Ahmed Al-Rashid", employees: 45, budget: "SAR 8.2M", status: "active" },
  { id: 3, name: "Marketing", manager: "Linda Smith", employees: 18, budget: "SAR 3.1M", status: "active" },
  { id: 4, name: "Finance", manager: "Mohammed Hassan", employees: 15, budget: "SAR 2.8M", status: "active" },
  { id: 5, name: "Operations", manager: "Emily Chen", employees: 32, budget: "SAR 4.5M", status: "active" }
];

const mockPositions: Position[] = [
  { id: 1, title: "Software Engineer", department: "Engineering", level: "Mid-Level", openings: 3, status: "active" },
  { id: 2, title: "HR Specialist", department: "Human Resources", level: "Junior", openings: 1, status: "active" },
  { id: 3, title: "Marketing Manager", department: "Marketing", level: "Senior", openings: 2, status: "active" },
  { id: 4, title: "Financial Analyst", department: "Finance", level: "Mid-Level", openings: 1, status: "draft" },
  { id: 5, title: "Operations Coordinator", department: "Operations", level: "Junior", openings: 2, status: "active" }
];

const mockSalaryGrades: SalaryGrade[] = [
  { id: 1, grade: "G1", minSalary: "SAR 4,000", maxSalary: "SAR 6,000", level: "Entry Level" },
  { id: 2, grade: "G2", minSalary: "SAR 6,000", maxSalary: "SAR 9,000", level: "Junior" },
  { id: 3, grade: "G3", minSalary: "SAR 9,000", maxSalary: "SAR 15,000", level: "Mid-Level" },
  { id: 4, grade: "G4", minSalary: "SAR 15,000", maxSalary: "SAR 25,000", level: "Senior" },
  { id: 5, grade: "G5", minSalary: "SAR 25,000", maxSalary: "SAR 40,000", level: "Executive" }
];

export const employeeService = {
  // Employee operations
  async getEmployees(): Promise<Employee[]> {
    // TODO: Replace with actual Supabase query
    // const { data, error } = await supabase.from('employees').select('*');
    // if (error) throw error;
    // return data;
    return mockEmployees;
  },

  async getEmployeeById(id: string): Promise<Employee | null> {
    // TODO: Replace with actual Supabase query
    return null;
  },

  async createEmployee(employee: Omit<Employee, 'id'>): Promise<Employee> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async updateEmployee(id: string, employee: Partial<Employee>): Promise<Employee> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  async deleteEmployee(id: string): Promise<void> {
    // TODO: Replace with actual Supabase delete
    throw new Error('Not implemented');
  },

  // Department operations
  async getDepartments(): Promise<Department[]> {
    // TODO: Replace with actual Supabase query
    // const { data, error } = await supabase.from('departments').select('*');
    // if (error) throw error;
    // return data;
    return mockDepartments;
  },

  async getDepartmentById(id: number): Promise<Department | null> {
    const departments = await this.getDepartments();
    return departments.find(d => d.id === id) || null;
  },

  async createDepartment(department: Omit<Department, 'id'>): Promise<Department> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async updateDepartment(id: number, department: Partial<Department>): Promise<Department> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  async deleteDepartment(id: number): Promise<void> {
    // TODO: Replace with actual Supabase delete
    throw new Error('Not implemented');
  },

  // Position operations
  async getPositions(): Promise<Position[]> {
    // TODO: Replace with actual Supabase query
    return mockPositions;
  },

  async getPositionById(id: number): Promise<Position | null> {
    const positions = await this.getPositions();
    return positions.find(p => p.id === id) || null;
  },

  async createPosition(position: Omit<Position, 'id'>): Promise<Position> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async updatePosition(id: number, position: Partial<Position>): Promise<Position> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  async deletePosition(id: number): Promise<void> {
    // TODO: Replace with actual Supabase delete
    throw new Error('Not implemented');
  },

  // Salary Grade operations
  async getSalaryGrades(): Promise<SalaryGrade[]> {
    // TODO: Replace with actual Supabase query
    return mockSalaryGrades;
  },

  async getSalaryGradeById(id: number): Promise<SalaryGrade | null> {
    const grades = await this.getSalaryGrades();
    return grades.find(g => g.id === id) || null;
  },

  async createSalaryGrade(grade: Omit<SalaryGrade, 'id'>): Promise<SalaryGrade> {
    // TODO: Replace with actual Supabase insert
    throw new Error('Not implemented');
  },

  async updateSalaryGrade(id: number, grade: Partial<SalaryGrade>): Promise<SalaryGrade> {
    // TODO: Replace with actual Supabase update
    throw new Error('Not implemented');
  },

  async deleteSalaryGrade(id: number): Promise<void> {
    // TODO: Replace with actual Supabase delete
    throw new Error('Not implemented');
  },
};
