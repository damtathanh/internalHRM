import type { Role } from '../types';

/**
 * Permission Resource Types
 * Defines what resources can be accessed
 */
export type PermissionResource = 
  | 'employee'
  | 'department'
  | 'payroll'
  | 'recruitment'
  | 'attendance'
  | 'leave'
  | 'loan'
  | 'performance'
  | 'training'
  | 'reports'
  | 'settings';

/**
 * Permission Actions
 * Defines what actions can be performed
 */
export type PermissionAction = 
  | 'read'
  | 'create'
  | 'update'
  | 'delete'
  | 'approve'
  | 'export';

/**
 * Permission Scope
 * Defines the scope of access
 */
export type PermissionScope = 
  | 'self'      // Only own data
  | 'team'      // Own + team members' data
  | 'all';      // All data in the system

/**
 * Permission Definition
 * Combines resource, action, and scope
 */
export interface Permission {
  resource: PermissionResource;
  action: PermissionAction;
  scope: PermissionScope;
}

/**
 * Permission Check Context
 * Additional context for permission checks (e.g., resource owner ID)
 */
export interface PermissionContext {
  resourceOwnerId?: string;  // ID of the resource owner (for self/team checks)
  departmentId?: string;     // Department ID (for team checks)
}

/**
 * Role Permission Configuration
 * Maps roles to their permission scopes per resource-action pair
 * 
 * CURRENT STATE: All roles have 'all' scope for all resources/actions
 * This means full access for everyone (default allow all)
 * 
 * FUTURE STATE (to enable later):
 * - admin/hr: 'all' scope for everything
 * - manager: 'team' scope (self + team members)
 * - employee: 'self' scope (only own data)
 */
const ROLE_PERMISSIONS: Record<Role, PermissionScope> = {
  admin: 'all',      // Full access to all resources
  hr: 'all',         // Full access to all resources
  manager: 'all',    // Currently: full access | Future: 'team' scope
  employee: 'all',   // Currently: full access | Future: 'self' scope
};

/**
 * Permission enforcement flag
 * 
 * CURRENT: false = permission checks disabled, all access allowed (default allow all)
 * FUTURE: true = permission checks enabled, role-based access enforced
 * 
 * To enable permission enforcement in the future:
 * 1. Set ENABLE_PERMISSION_CHECKS = true
 * 2. Update ROLE_PERMISSIONS mappings as needed (manager: 'team', employee: 'self')
 * 3. Implement self/team scope checking logic in canAccess()
 */
const ENABLE_PERMISSION_CHECKS = false;

/**
 * Check if a role has access to a specific permission
 * 
 * @param role - User's role
 * @param permission - Permission to check
 * @param context - Optional context (resource owner, department, etc.)
 * @returns true if access is granted, false otherwise
 * 
 * CURRENT BEHAVIOR: Always returns true (default allow all)
 * FUTURE BEHAVIOR: Checks role permissions based on scope
 */
export function canAccess(
  role: Role | null,
  permission: Permission,
  context?: PermissionContext
): boolean {
  // Default: allow all if no role
  if (!role) {
    return !ENABLE_PERMISSION_CHECKS;
  }

  // Currently: always allow (permission checks disabled)
  if (!ENABLE_PERMISSION_CHECKS) {
    return true;
  }

  // FUTURE: Permission check logic (will be enabled when ENABLE_PERMISSION_CHECKS = false)
  const roleScope = ROLE_PERMISSIONS[role];
  
  // Full access
  if (roleScope === 'all') {
    return true;
  }

  // Self scope: only own resources
  if (roleScope === 'self') {
    // Check if user is accessing their own resource
    // This would require userId from auth context
    // Example: return context?.resourceOwnerId === currentUserId;
    return false; // Placeholder - implement when enabling checks
  }

  // Team scope: own + team members
  if (roleScope === 'team') {
    // Check if resource belongs to user or their team
    // This would require userId, departmentId, managerId from auth context
    // Example: return context?.resourceOwnerId === currentUserId || 
    //          context?.departmentId === currentUserDepartmentId ||
    //          context?.resourceOwnerId in teamMemberIds;
    return false; // Placeholder - implement when enabling checks
  }

  return false;
}

/**
 * Check if a role can perform a specific action on a resource
 * Convenience wrapper around canAccess()
 * 
 * @param role - User's role
 * @param resource - Resource type
 * @param action - Action to perform
 * @param scope - Required scope (default: checks role's scope)
 * @param context - Optional context
 * @returns true if action is allowed
 */
export function canPerformAction(
  role: Role | null,
  resource: PermissionResource,
  action: PermissionAction,
  context?: PermissionContext
): boolean {
  // Get role's scope for this resource-action pair
  // Currently all roles have 'all' scope
  const roleScope = role ? ROLE_PERMISSIONS[role] : 'all';
  
  return canAccess(role, {
    resource,
    action,
    scope: roleScope,
  }, context);
}

/**
 * Get all permissions for a role
 * Useful for debugging or displaying permission summary
 * 
 * @param role - User's role
 * @returns Array of all permissions with their scopes
 */
export function getRolePermissions(role: Role | null): Permission[] {
  if (!role) {
    return [];
  }

  const scope = ROLE_PERMISSIONS[role];
  const resources: PermissionResource[] = [
    'employee',
    'department',
    'payroll',
    'recruitment',
    'attendance',
    'leave',
    'loan',
    'performance',
    'training',
    'reports',
    'settings',
  ];
  const actions: PermissionAction[] = [
    'read',
    'create',
    'update',
    'delete',
    'approve',
    'export',
  ];

  return resources.flatMap(resource =>
    actions.map(action => ({
      resource,
      action,
      scope,
    }))
  );
}

/**
 * Check if permission checks are currently enabled
 * 
 * @returns true if permission enforcement is active
 */
export function isPermissionEnforcementEnabled(): boolean {
  return ENABLE_PERMISSION_CHECKS;
}