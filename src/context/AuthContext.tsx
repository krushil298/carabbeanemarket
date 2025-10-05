import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { sendVerificationEmail as sendVerificationEmailUtil, verifyEmailCode as verifyEmailCodeUtil } from '../utils/emailVerification';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  sendVerificationEmail: (email: string, userId: string) => Promise<boolean>;
  verifyEmailCode: (userId: string, code: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<boolean>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = mapSupabaseUserToUser(session.user);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user = mapSupabaseUserToUser(session.user);
          setCurrentUser(user);
          setIsAuthenticated(true);
        } else {
          setCurrentUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const mapSupabaseUserToUser = (supabaseUser: any): User => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || '',
      profilePicture: supabaseUser.user_metadata?.profilePicture || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
      bio: supabaseUser.user_metadata?.bio || '',
      location: supabaseUser.user_metadata?.location || '',
      phone: supabaseUser.user_metadata?.phone || '',
      joinedDate: new Date(supabaseUser.created_at),
      emailVerified: !!supabaseUser.email_confirmed_at || supabaseUser.user_metadata?.email_verified === true,
      phoneVerified: supabaseUser.user_metadata?.phone_verified === true,
      islandVerified: supabaseUser.user_metadata?.island_verified === true,
    };
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!supabase) {
      console.error('Supabase not configured');
      return false;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });

      if (error) {
        console.error('Login error:', error.message);
        return false;
      }

      if (data.user) {
        const user = mapSupabaseUserToUser(data.user);
        setCurrentUser(user);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    if (!supabase) {
      console.error('Supabase not configured');
      return false;
    }

    try {
      const { email, password, username, location, phone, bio, profilePicture } = userData;
      
      if (!email || !password) {
        console.error('Email and password are required');
        return false;
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0],
            location: location || '',
            phone: phone || '',
            bio: bio || '',
            profilePicture: profilePicture || 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face',
            email_verified: false,
            phone_verified: false,
            island_verified: false,
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        return false;
      }

      if (data.user) {
        const user = mapSupabaseUserToUser(data.user);
        setCurrentUser(user);
        setIsAuthenticated(true);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const sendVerificationEmail = async (email: string, userId: string): Promise<boolean> => {
    if (!supabase) {
      console.error('Supabase not configured');
      return false;
    }
    
    const result = await sendVerificationEmailUtil(email, userId);
    return result.success;
  };

  const verifyEmailCode = async (userId: string, code: string): Promise<boolean> => {
    if (!supabase) {
      console.error('Supabase not configured');
      return false;
    }
    
    try {
      const result = await verifyEmailCodeUtil(userId, code);
      if (result.success && currentUser && currentUser.id === userId) {
        const updatedUser = { ...currentUser, emailVerified: true };
        setCurrentUser(updatedUser);
      }
      return result.success;
    } catch (error) {
      console.error('Verify email error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    if (!supabase) {
      setCurrentUser(null);
      setIsAuthenticated(false);
      return;
    }

    try {
      await supabase.auth.signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateProfile = async (userData: Partial<User>): Promise<boolean> => {
    if (!supabase || !currentUser) {
      return false;
    }

    try {
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...userData,
          username: userData.username || currentUser.username,
          location: userData.location || currentUser.location,
          phone: userData.phone || currentUser.phone,
          bio: userData.bio || currentUser.bio,
          profilePicture: userData.profilePicture || currentUser.profilePicture,
        }
      });

      if (error) {
        console.error('Update profile error:', error.message);
        return false;
      }

      if (data.user) {
        const updatedUser = mapSupabaseUserToUser(data.user);
        setCurrentUser(updatedUser);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      login,
      signup,
      sendVerificationEmail,
      verifyEmailCode,
      logout,
      updateProfile,
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};