/**
 * Workforce Management Service
 * Handles all database operations for Employees, Departments, Positions, and Job Grades
 */

import { supabase } from '../lib/supabase';
import type {
  Employee,
  EmployeeListItem,
  Department,
  DepartmentListItem,
  Position,
  PositionListItem,
  JobGrade,
  JobGradeListItem,
  Role,
  EmployeeStatus,
  DepartmentStatus,
  PositionStatus,
} from '../types';

// ============================================================================
// EMPLOYEE OPERATIONS
// ============================================================================

export async function getEmployees(): Promise<EmployeeListItem[]> {
  try {
    const { data, error } = await supabase
      .from('employee_list_view')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Error fetching employees:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return [];
    }

    if (!data || !Array.isArray(data)) {
      console.warn('No employee data returned or data is not an array');
      return [];
    }

    // Safely map data with null checks
    return data.map((emp: any) => ({
      id: emp?.id || '',
      full_name: emp?.full_name || '',
      email: emp?.email || '',
      phone: emp?.phone || null,
      position: emp?.position || null,
      department: emp?.department || null,
      manager: emp?.manager || null,
      status: (emp?.status || 'active') as EmployeeStatus,
    }));
  } catch (err) {
    console.error('Exception in getEmployees:', err);
    return [];
  }
}

export async function getEmployeeById(id: string): Promise<Employee | null> {
  const { data, error } = await supabase
    .from('employees')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching employee:', error);
    return null;
  }

  return data as Employee;
}

export async function createEmployee(employee: {
  full_name: string;
  email: string;
  phone?: string;
  position_id?: string;
  department_id?: string;
  manager_id?: string;
  job_grade_id?: string;
  status?: EmployeeStatus;
  system_role?: Role;
}): Promise<{ data: Employee | null; error: any }> {
  // Ensure system_role is always sent (never undefined)
  const systemRole = employee.system_role || 'employee';
  
  // Convert empty strings to null for all optional ID fields
  const positionId = employee.position_id && employee.position_id.trim() !== '' ? employee.position_id : null;
  const departmentId = employee.department_id && employee.department_id.trim() !== '' ? employee.department_id : null;
  const managerId = employee.manager_id && employee.manager_id.trim() !== '' ? employee.manager_id : null;
  const jobGradeId = employee.job_grade_id && employee.job_grade_id.trim() !== '' ? employee.job_grade_id : null;
  const phone = employee.phone && employee.phone.trim() !== '' ? employee.phone : null;

  const { data, error } = await supabase
    .from('employees')
    .insert({
      full_name: employee.full_name,
      email: employee.email,
      phone: phone,
      position_id: positionId,
      department_id: departmentId,
      manager_id: managerId,
      job_grade_id: jobGradeId, // Explicitly null, not undefined or empty string
      status: employee.status || 'active',
      system_role: systemRole, // Always sent, never undefined
    })
    .select()
    .single();

  // Log Supabase error to console for debugging
  if (error) {
    console.error('Error creating employee:', error);
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    console.error('Payload sent:', {
      full_name: employee.full_name,
      email: employee.email,
      phone: phone,
      position_id: positionId,
      department_id: departmentId,
      manager_id: managerId,
      job_grade_id: jobGradeId,
      status: employee.status || 'active',
      system_role: systemRole,
    });
  }

  return { data: data as Employee | null, error };
}

export async function updateEmployee(
  id: string,
  updates: {
    full_name?: string;
    email?: string;
    phone?: string;
    position_id?: string;
    department_id?: string;
    manager_id?: string;
    job_grade_id?: string;
    status?: EmployeeStatus;
    system_role?: Role;
  }
): Promise<{ data: Employee | null; error: any }> {
  // Convert empty strings to null for all optional ID fields
  const cleanUpdates: any = { ...updates };
  
  if (cleanUpdates.position_id !== undefined) {
    cleanUpdates.position_id = cleanUpdates.position_id && cleanUpdates.position_id.trim() !== '' ? cleanUpdates.position_id : null;
  }
  if (cleanUpdates.department_id !== undefined) {
    cleanUpdates.department_id = cleanUpdates.department_id && cleanUpdates.department_id.trim() !== '' ? cleanUpdates.department_id : null;
  }
  if (cleanUpdates.manager_id !== undefined) {
    cleanUpdates.manager_id = cleanUpdates.manager_id && cleanUpdates.manager_id.trim() !== '' ? cleanUpdates.manager_id : null;
  }
  if (cleanUpdates.job_grade_id !== undefined) {
    cleanUpdates.job_grade_id = cleanUpdates.job_grade_id && cleanUpdates.job_grade_id.trim() !== '' ? cleanUpdates.job_grade_id : null;
  }
  if (cleanUpdates.phone !== undefined) {
    cleanUpdates.phone = cleanUpdates.phone && cleanUpdates.phone.trim() !== '' ? cleanUpdates.phone : null;
  }

  const { data, error } = await supabase
    .from('employees')
    .update(cleanUpdates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating employee:', error);
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  return { data: data as Employee | null, error };
}

export async function deleteEmployee(id: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('employees')
    .delete()
    .eq('id', id);

  return { error };
}

// ============================================================================
// DEPARTMENT OPERATIONS
// ============================================================================

export async function getDepartments(): Promise<DepartmentListItem[]> {
  try {
    const { data, error } = await supabase
      .from('department_budgets')
      .select('*')
      .order('department_name', { ascending: true });

    if (error) {
      console.error('Error fetching departments:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return [];
    }

    if (!data || !Array.isArray(data)) {
      console.warn('No department data returned or data is not an array');
      return [];
    }

    return data.map((dept: any) => ({
      id: dept?.department_id || dept?.id || '',
      name: dept?.department_name || dept?.name || '',
      manager_id: dept?.manager_id || null,
      manager_name: dept?.manager_name || null,
      employee_count: dept?.employee_count || 0,
      budget: dept?.estimated_annual_budget || dept?.budget || 0,
      status: (dept?.status || 'active') as DepartmentStatus,
      description: dept?.description || null,
    }));
  } catch (err) {
    console.error('Exception in getDepartments:', err);
    return [];
  }
}

export async function createDepartment(department: {
  name: string;
  manager_id?: string;
  description?: string;
  status?: DepartmentStatus;
}): Promise<{ data: Department | null; error: any }> {
  const { data, error } = await supabase
    .from('departments')
    .insert({
      name: department.name,
      manager_id: department.manager_id || null,
      description: department.description || null,
      status: department.status || 'active',
    })
    .select()
    .single();

  return { data: data as Department | null, error };
}

export async function updateDepartment(
  id: string,
  updates: {
    name?: string;
    manager_id?: string;
    description?: string;
    status?: DepartmentStatus;
  }
): Promise<{ data: Department | null; error: any }> {
  const { data, error } = await supabase
    .from('departments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data: data as Department | null, error };
}

export async function deleteDepartment(id: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('departments')
    .delete()
    .eq('id', id);

  return { error };
}

// ============================================================================
// POSITION OPERATIONS
// ============================================================================

export async function getPositions(): Promise<PositionListItem[]> {
  try {
    const { data, error } = await supabase
      .from('positions')
      .select('id, title, description, status')
      .order('title', { ascending: true });

    if (error) {
      console.error('Error fetching positions:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return [];
    }

    if (!data || !Array.isArray(data)) {
      console.warn('No position data returned or data is not an array');
      return [];
    }

    return data.map((pos: any) => ({
      id: pos?.id || '',
      title: pos?.title || '',
      department_id: null, // Not available from positions table alone
      department_name: null, // Not available from positions table alone
      status: (pos?.status || 'active') as PositionStatus,
      description: pos?.description || null,
    }));
  } catch (err) {
    console.error('Exception in getPositions:', err);
    return [];
  }
}

export async function createPosition(position: {
  title: string;
  department_id?: string;
  description?: string;
  status?: PositionStatus;
}): Promise<{ data: Position | null; error: any }> {
  const { data, error } = await supabase
    .from('positions')
    .insert({
      title: position.title,
      department_id: position.department_id || null,
      description: position.description || null,
      status: position.status || 'active',
    })
    .select()
    .single();

  return { data: data as Position | null, error };
}

// ============================================================================
// JOB GRADE OPERATIONS
// ============================================================================

export async function getJobGrades(): Promise<JobGradeListItem[]> {
  const { data, error } = await supabase
    .from('job_grades')
    .select(`
      id,
      position_id,
      intern_salary,
      junior_salary,
      middle_salary,
      senior_salary,
      lead_salary,
      manager_salary,
      positions:position_id (id, title)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching job grades:', error);
    return [];
  }

  if (!data) return [];

  return data.map((jg: any) => ({
    id: jg.id,
    position_id: jg.position_id,
    position_title: jg.positions?.title || null,
    intern_salary: jg.intern_salary,
    junior_salary: jg.junior_salary,
    middle_salary: jg.middle_salary,
    senior_salary: jg.senior_salary,
    lead_salary: jg.lead_salary,
    manager_salary: jg.manager_salary,
  }));
}

export async function getJobGradesByPosition(positionId: string): Promise<JobGradeListItem[]> {
  if (!positionId || positionId.trim() === '') {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('job_grades')
      .select(`
        id,
        position_id,
        intern_salary,
        junior_salary,
        middle_salary,
        senior_salary,
        lead_salary,
        manager_salary,
        positions:position_id (id, title)
      `)
      .eq('position_id', positionId)
      .single();

    if (error) {
      // If no job grade found for position, that's OK - just return empty array
      if (error.code === 'PGRST116') {
        console.log(`No job grade found for position ${positionId}`);
        return [];
      }
      console.error('Error fetching job grade by position:', error);
      return [];
    }

    if (!data) return [];

    return [{
      id: data?.id || '',
      position_id: data?.position_id || positionId,
      position_title: data?.positions?.title || null,
      intern_salary: data?.intern_salary || null,
      junior_salary: data?.junior_salary || null,
      middle_salary: data?.middle_salary || null,
      senior_salary: data?.senior_salary || null,
      lead_salary: data?.lead_salary || null,
      manager_salary: data?.manager_salary || null,
    }];
  } catch (err) {
    console.error('Exception in getJobGradesByPosition:', err);
    return [];
  }
}

export async function createJobGrade(jobGrade: {
  position_id: string;
  intern_salary?: number | null;
  junior_salary?: number | null;
  middle_salary?: number | null;
  senior_salary?: number | null;
  lead_salary?: number | null;
  manager_salary?: number | null;
}): Promise<{ data: JobGrade | null; error: any }> {
  const { data, error } = await supabase
    .from('job_grades')
    .insert({
      position_id: jobGrade.position_id,
      intern_salary: jobGrade.intern_salary || null,
      junior_salary: jobGrade.junior_salary || null,
      middle_salary: jobGrade.middle_salary || null,
      senior_salary: jobGrade.senior_salary || null,
      lead_salary: jobGrade.lead_salary || null,
      manager_salary: jobGrade.manager_salary || null,
    })
    .select()
    .single();

  return { data: data as JobGrade | null, error };
}

export async function updateJobGrade(
  id: string,
  updates: {
    position_id?: string;
    intern_salary?: number | null;
    junior_salary?: number | null;
    middle_salary?: number | null;
    senior_salary?: number | null;
    lead_salary?: number | null;
    manager_salary?: number | null;
  }
): Promise<{ data: JobGrade | null; error: any }> {
  const { data, error } = await supabase
    .from('job_grades')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data: data as JobGrade | null, error };
}

export async function deleteJobGrade(id: string): Promise<{ error: any }> {
  const { error } = await supabase
    .from('job_grades')
    .delete()
    .eq('id', id);

  return { error };
}
