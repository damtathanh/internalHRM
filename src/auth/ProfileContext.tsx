import { createContext, useContext, useEffect, useState, useRef, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { Profile, Role } from '../types';

interface ProfileContextType {
  profile: Profile | null;
  role: Role | null;
  profileLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

/**
 * Fetches user profile from Supabase profiles table.
 * Includes guards to prevent infinite recursion and repeated fetches.
 */
async function fetchProfile(userId: string): Promise<Profile | null> {
  try {
    console.log('[ProfileContext] fetchProfile start for userId:', userId);
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('[ProfileContext] fetchProfile error:', error.message);
      return null;
    }

    if (!data) {
      console.warn('[ProfileContext] fetchProfile: No profile found for userId:', userId);
      return null;
    }

    console.log('[ProfileContext] fetchProfile success');
    return data as Profile;
  } catch (err) {
    console.error('[ProfileContext] fetchProfile exception:', err instanceof Error ? err.message : 'Unknown error');
    return null;
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const { authUser, authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  
  // Guards to prevent repeated fetches
  const fetchingRef = useRef(false);
  const lastFetchedUserIdRef = useRef<string | null>(null);
  const mountedRef = useRef(true);

  /**
   * Fetches profile only if:
   * 1. Auth is ready (not loading)
   * 2. User exists
   * 3. Not already fetching
   * 4. User ID changed (new user logged in)
   */
  const loadProfile = useCallback(async () => {
    // Guard: Wait for auth to be ready
    if (authLoading) {
      console.log('[ProfileContext] Skipping profile fetch - auth still loading');
      return;
    }

    // Guard: No user = no profile
    if (!authUser) {
      console.log('[ProfileContext] No auth user - clearing profile');
      setProfile(null);
      setRole(null);
      setProfileLoading(false);
      lastFetchedUserIdRef.current = null;
      return;
    }

    // Guard: Prevent repeated fetches for the same user
    if (fetchingRef.current) {
      console.log('[ProfileContext] Already fetching profile - skipping');
      return;
    }

    // Guard: Skip if we already fetched for this user
    if (lastFetchedUserIdRef.current === authUser.id) {
      console.log('[ProfileContext] Profile already fetched for this user - skipping');
      setProfileLoading(false);
      return;
    }

    // Set fetching flag to prevent concurrent requests
    fetchingRef.current = true;
    setProfileLoading(true);

    try {
      const userProfile = await fetchProfile(authUser.id);

      if (!mountedRef.current) {
        return;
      }

      if (userProfile) {
        setProfile(userProfile);
        setRole(userProfile.role);
        lastFetchedUserIdRef.current = authUser.id;
      } else {
        // Profile not found - clear state
        console.warn('[ProfileContext] Profile not found for user:', authUser.id);
        setProfile(null);
        setRole(null);
        lastFetchedUserIdRef.current = null;
      }
    } catch (error) {
      console.error('[ProfileContext] Error loading profile:', error);
      if (mountedRef.current) {
        setProfile(null);
        setRole(null);
        lastFetchedUserIdRef.current = null;
      }
    } finally {
      if (mountedRef.current) {
        fetchingRef.current = false;
        setProfileLoading(false);
      }
    }
  }, [authUser, authLoading]);

  // Load profile when auth user changes (but only after auth is ready)
  useEffect(() => {
    mountedRef.current = true;
    
    // Only fetch profile after auth is fully initialized
    if (!authLoading) {
      loadProfile();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [authLoading, loadProfile]); // loadProfile is memoized with useCallback

  // Manual refresh function
  const refreshProfile = async () => {
    if (!authUser) {
      console.warn('[ProfileContext] Cannot refresh profile - no auth user');
      return;
    }

    // Reset guard to allow re-fetch
    lastFetchedUserIdRef.current = null;
    fetchingRef.current = false;
    
    await loadProfile();
  };

  return (
    <ProfileContext.Provider value={{ profile, role, profileLoading, refreshProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
