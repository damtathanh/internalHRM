import { ReactNode } from 'react';
import { useProfile } from './ProfileContext';
import type { Role } from '../types';

interface RoleGuardProps {
  allow: Role[];
  children: ReactNode;
}

/**
 * RoleGuard component - currently allows all roles to access all content
 * Structure is maintained for future role-based access control implementation
 * 
 * @param allow - Array of roles that should have access (currently not enforced)
 * @param children - Content to render (always rendered)
 */
export function RoleGuard({ allow, children }: RoleGuardProps) {
  // Role is read from ProfileContext for future use
  const { role } = useProfile();

  // Currently, all roles have access to all content
  // No UI blocking is enforced at this time
  return <>{children}</>;
}
