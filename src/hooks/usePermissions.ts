import { useMemo } from 'react';
import { useProfile } from '../auth/ProfileContext';
import {
  canAccess,
  canPerformAction,
  getRolePermissions,
  isPermissionEnforcementEnabled,
  type Permission,
  type PermissionResource,
  type PermissionAction,
  type PermissionContext,
} from '../utils/permissions';

/**
 * usePermissions Hook
 * 
 * Provides permission checking utilities based on the current user's role.
 * Currently returns true for all permission checks (default allow all).
 * 
 * Usage:
 * ```tsx
 * const { canAccess, canPerformAction } = usePermissions();
 * 
 * // Check specific permission
 * if (canAccess({ resource: 'employee', action: 'create', scope: 'all' })) {
 *   // Show create button
 * }
 * 
 * // Check action on resource (convenience method)
 * if (canPerformAction('employee', 'delete')) {
 *   // Show delete button
 * }
 * ```
 */
export function usePermissions() {
  const { role } = useProfile();

  /**
   * Check if current user has access to a specific permission
   * 
   * @param permission - Permission to check
   * @param context - Optional context (resource owner, department, etc.)
   * @returns true if access is granted
   */
  const checkAccess = useMemo(() => {
    return (permission: Permission, context?: PermissionContext): boolean => {
      return canAccess(role, permission, context);
    };
  }, [role]);

  /**
   * Check if current user can perform an action on a resource
   * 
   * @param resource - Resource type
   * @param action - Action to perform
   * @param context - Optional context
   * @returns true if action is allowed
   */
  const checkAction = useMemo(() => {
    return (
      resource: PermissionResource,
      action: PermissionAction,
      context?: PermissionContext
    ): boolean => {
      return canPerformAction(role, resource, action, context);
    };
  }, [role]);

  /**
   * Get all permissions for the current user's role
   * Useful for debugging or displaying permission summary
   * 
   * @returns Array of all permissions
   */
  const permissions = useMemo(() => {
    return getRolePermissions(role);
  }, [role]);

  /**
   * Check if permission enforcement is enabled
   * 
   * @returns true if permission checks are actively enforced
   */
  const isEnforced = isPermissionEnforcementEnabled();

  return {
    /**
     * Check access to a specific permission
     * @alias checkAccess
     */
    canAccess: checkAccess,
    
    /**
     * Check if action can be performed on resource
     * @alias checkAction
     */
    canPerformAction: checkAction,
    
    /**
     * Get all permissions for current role
     */
    permissions,
    
    /**
     * Check if permission enforcement is active
     */
    isEnforced,
    
    /**
     * Current user's role
     */
    role,
  };
}

/**
 * Hook alias for convenience
 * Can be used as: const { canAccess } = usePermissions();
 */
export default usePermissions;