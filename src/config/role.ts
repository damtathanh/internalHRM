import type { Role } from '../types';

// Role module mappings - kept for future authorization logic
// Currently not used to restrict UI access
export const ROLE_MODULES: Record<Role, string[]> = {
  admin: ['*'],
  hr: ['workforce', 'recruitment', 'payroll', 'reports'],
  manager: ['dashboard', 'team', 'approvals'],
  employee: ['self-service'],
};

// Module access check - kept for future authorization logic
// Currently always returns true (no UI restrictions)
export function hasModuleAccess(role: Role | null, module: string): boolean {
  // All roles have access to all modules for now
  // This function is kept for future authorization implementation
  return true;
}

// Default route - always returns 'dashboard' regardless of role
// Kept for future customization
export function getDefaultRoute(role: Role | null): string {
  // All users start at dashboard
  return 'dashboard';
}
