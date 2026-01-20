import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  authUser: User | null;
  session: Session | null;
  authLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const isInitializedRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    console.log('[AuthContext] Initializing auth state');
    
    // Initialize auth state immediately using getSession()
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!mountedRef.current) return;

        if (error) {
          console.error('[AuthContext] getSession() error:', error);
          setAuthUser(null);
          setSession(null);
          setAuthLoading(false);
          isInitializedRef.current = true;
          return;
        }

        // Set user and session immediately
        if (session?.user) {
          setAuthUser(session.user);
          setSession(session);
        } else {
          setAuthUser(null);
          setSession(null);
        }
      } catch (error) {
        console.error('[AuthContext] Error in initializeAuth:', error);
        if (mountedRef.current) {
          setAuthUser(null);
          setSession(null);
        }
      } finally {
        if (mountedRef.current) {
          console.log('[AuthContext] Auth initialization complete');
          setAuthLoading(false);
          isInitializedRef.current = true;
        }
      }
    };

    // Call getSession() immediately on mount
    initializeAuth();

    // Listen for future auth changes (sign in/out)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      // Only process auth state changes after initial bootstrap
      if (!mountedRef.current || !isInitializedRef.current) {
        return;
      }

      console.log('[AuthContext] Auth state changed:', _event);
      
      if (session?.user) {
        setAuthUser(session.user);
        setSession(session);
      } else {
        setAuthUser(null);
        setSession(null);
      }
    });

    return () => {
      mountedRef.current = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      // State will be cleared by onAuthStateChange listener
    } catch (error) {
      console.error('[AuthContext] Error in signOut:', error);
      // Force clear state on error
      setAuthUser(null);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ authUser, session, authLoading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
