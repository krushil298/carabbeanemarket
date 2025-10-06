import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../types';
import { Profile } from '../types/database';
import { generateOTP, verifyOTP, OTPType } from '../services/otpService';
import { createProfile, getProfile, updateProfile as updateProfileService } from '../services/profileService';

interface AuthContextType {
  currentUser: User | null;
  profile: Profile | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithOTP: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  signup: (userData: Partial<User> & { password: string }) => Promise<{ success: boolean; userId?: string; error?: string }>;
  sendOTP: (email: string, type: OTPType) => Promise<{ success: boolean; error?: string; devCode?: string }>;
  verifyOTPCode: (email: string, code: string, type: OTPType) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<Profile>) => Promise<boolean>;
  resetPassword: (email: string, newPassword: string, code: string) => Promise<{ success: boolean; error?: string }>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const user = mapSupabaseUserToUser(session.user);
        setCurrentUser(user);
        setIsAuthenticated(true);

        const { data: profileData } = await getProfile(session.user.id);
        if (profileData) {
          setProfile(profileData);
        }
      }
      setLoading(false);
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const user = mapSupabaseUserToUser(session.user);
          setCurrentUser(user);
          setIsAuthenticated(true);

          const { data: profileData } = await getProfile(session.user.id);
          if (profileData) {
            setProfile(profileData);
          }
        } else {
          setCurrentUser(null);
          setProfile(null);
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

  const signup = async (userData: Partial<User> & { password: string }): Promise<{ success: boolean; userId?: string; error?: string }> => {
    try {
      const { email, password, username, location, phone, bio, profilePicture } = userData;

      if (!email || !password) {
        return { success: false, error: 'Email and password are required' };
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined,
          data: {
            full_name: username || email.split('@')[0],
          }
        }
      });

      if (error) {
        console.error('Signup error:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        const profileData: Partial<Profile> = {
          id: data.user.id,
          email: email,
          full_name: username || email.split('@')[0],
          phone: phone || null,
          country: location || null,
          parish: null,
          bio: bio || null,
          avatar_url: profilePicture || null,
        };

        const { error: profileError } = await createProfile(profileData);
        if (profileError) {
          console.error('Profile creation error:', profileError);
        }

        return { success: true, userId: data.user.id };
      }

      return { success: false, error: 'Signup failed' };
    } catch (error) {
      console.error('Signup error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const loginWithOTP = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const verifyResult = await verifyOTP(email, code, 'login');

      if (!verifyResult.success) {
        return { success: false, error: verifyResult.message || 'Invalid OTP code' };
      }

      const { data: users } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (!users || users.length === 0) {
        return { success: false, error: 'User not found' };
      }

      return { success: true };
    } catch (error) {
      console.error('OTP login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const sendOTP = async (email: string, type: OTPType): Promise<{ success: boolean; error?: string; devCode?: string }> => {
    try {
      const result = await generateOTP(email, type);

      if (!result.success) {
        return { success: false, error: result.error };
      }

      return {
        success: true,
        devCode: result.devCode
      };
    } catch (error) {
      console.error('Send OTP error:', error);
      return { success: false, error: 'Failed to send OTP' };
    }
  };

  const verifyOTPCode = async (email: string, code: string, type: OTPType): Promise<{ success: boolean; error?: string }> => {
    try {
      const result = await verifyOTP(email, code, type);

      if (!result.success) {
        return { success: false, error: result.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { success: false, error: 'Verification failed' };
    }
  };

  const resetPassword = async (email: string, newPassword: string, code: string): Promise<{ success: boolean; error?: string }> => {
    if (!supabase) {
      return { success: false, error: 'Supabase not configured' };
    }

    try {
      const verifyResult = await verifyOTP(email, code, 'reset');

      if (!verifyResult.success) {
        return { success: false, error: verifyResult.message || 'Invalid OTP code' };
      }

      const { data: users } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .limit(1);

      if (!users || users.length === 0) {
        return { success: false, error: 'User not found' };
      }

      const { error } = await supabase.auth.admin.updateUserById(
        users[0].id,
        { password: newPassword }
      );

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Password reset failed' };
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

  const updateUserProfile = async (userData: Partial<Profile>): Promise<boolean> => {
    if (!supabase || !currentUser) {
      return false;
    }

    try {
      const { data, error } = await updateProfileService(currentUser.id, userData);

      if (error) {
        console.error('Update profile error:', error);
        return false;
      }

      if (data) {
        setProfile(data);

        const updatedUser = {
          ...currentUser,
          username: data.full_name || currentUser.username,
          location: data.country || currentUser.location,
          phone: data.phone || currentUser.phone,
          bio: data.bio || currentUser.bio,
          profilePicture: data.avatar_url || currentUser.profilePicture,
        };
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
      profile,
      login,
      loginWithOTP,
      signup,
      sendOTP,
      verifyOTPCode,
      logout,
      updateUserProfile,
      resetPassword,
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