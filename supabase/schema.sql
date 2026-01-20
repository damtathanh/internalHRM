-- Workforce Management Schema
-- This schema defines the structure for Employees, Departments, Positions, and Job Grades

-- ============================================================================
-- DEPARTMENTS TABLE
-- ============================================================================
-- Stores organizational departments
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- POSITIONS TABLE
-- ============================================================================
-- Stores job positions (e.g., Software Engineer, HR Manager, Sales Executive)
CREATE TABLE IF NOT EXISTS positions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL UNIQUE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- JOB GRADES TABLE
-- ============================================================================
-- Stores salary grades defined per position
-- Each grade can have multiple salary levels (Intern, Junior, Middle, Senior, Lead, Manager/Head)
-- Salary values are manually input by HR and can be nullable
CREATE TABLE IF NOT EXISTS job_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  position_id UUID REFERENCES positions(id) ON DELETE CASCADE NOT NULL,
  -- Salary levels (nullable - HR manually inputs values)
  intern_salary DECIMAL(12, 2),
  junior_salary DECIMAL(12, 2),
  middle_salary DECIMAL(12, 2),
  senior_salary DECIMAL(12, 2),
  lead_salary DECIMAL(12, 2),
  manager_salary DECIMAL(12, 2), -- Also used for Head level
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(position_id)
);

-- ============================================================================
-- EMPLOYEES TABLE
-- ============================================================================
-- Stores real HR employees (separate from system users/profiles)
-- System role (admin/hr/manager/employee) is stored but NOT displayed in UI
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Basic Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(50),
  
  -- Work Information
  position_id UUID REFERENCES positions(id) ON DELETE SET NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  manager_id UUID REFERENCES employees(id) ON DELETE SET NULL,
  job_grade_id UUID REFERENCES job_grades(id) ON DELETE SET NULL,
  
  -- Status
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'resigned')),
  
  -- System Role (internal only - NOT displayed in Employees table UI)
  system_role VARCHAR(50) DEFAULT 'employee' CHECK (system_role IN ('admin', 'hr', 'manager', 'employee')),
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Optional: Link to auth user if employee has system access
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_manager ON employees(manager_id);
CREATE INDEX IF NOT EXISTS idx_employees_position ON employees(position_id);
CREATE INDEX IF NOT EXISTS idx_employees_status ON employees(status);
CREATE INDEX IF NOT EXISTS idx_positions_department ON positions(department_id);
CREATE INDEX IF NOT EXISTS idx_job_grades_position ON job_grades(position_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_departments_updated_at
  BEFORE UPDATE ON departments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_positions_updated_at
  BEFORE UPDATE ON positions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_grades_updated_at
  BEFORE UPDATE ON job_grades
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON employees
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEW: DEPARTMENT BUDGET CALCULATION
-- ============================================================================
-- Budget is calculated as the sum of salaries of all active employees in the department
-- Salary is retrieved from job_grades based on employee's job_grade_id
CREATE OR REPLACE VIEW department_budgets AS
SELECT 
  d.id AS department_id,
  d.name AS department_name,
  d.manager_id,
  COUNT(DISTINCT e.id) AS employee_count,
  COALESCE(SUM(
    COALESCE(jg.intern_salary, 0) + 
    COALESCE(jg.junior_salary, 0) + 
    COALESCE(jg.middle_salary, 0) + 
    COALESCE(jg.senior_salary, 0) + 
    COALESCE(jg.lead_salary, 0) + 
    COALESCE(jg.manager_salary, 0)
  ) / NULLIF(COUNT(DISTINCT 
    CASE WHEN jg.intern_salary IS NOT NULL THEN 1 END +
    CASE WHEN jg.junior_salary IS NOT NULL THEN 1 END +
    CASE WHEN jg.middle_salary IS NOT NULL THEN 1 END +
    CASE WHEN jg.senior_salary IS NOT NULL THEN 1 END +
    CASE WHEN jg.lead_salary IS NOT NULL THEN 1 END +
    CASE WHEN jg.manager_salary IS NOT NULL THEN 1 END
  ), 0), 0), 0) AS estimated_annual_budget
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id AND e.status = 'active'
LEFT JOIN job_grades jg ON e.job_grade_id = jg.id
GROUP BY d.id, d.name, d.manager_id;

-- Alternative simpler approach: Sum the maximum salary per employee from their job grade
CREATE OR REPLACE VIEW department_budgets_simple AS
SELECT 
  d.id AS department_id,
  d.name AS department_name,
  d.manager_id,
  COUNT(DISTINCT e.id) AS employee_count,
  COALESCE(SUM(GREATEST(
    COALESCE(jg.intern_salary, 0),
    COALESCE(jg.junior_salary, 0),
    COALESCE(jg.middle_salary, 0),
    COALESCE(jg.senior_salary, 0),
    COALESCE(jg.lead_salary, 0),
    COALESCE(jg.manager_salary, 0)
  )), 0) * 12 AS estimated_annual_budget -- Monthly to annual
FROM departments d
LEFT JOIN employees e ON e.department_id = d.id AND e.status = 'active'
LEFT JOIN job_grades jg ON e.job_grade_id = jg.id
GROUP BY d.id, d.name, d.manager_id;
