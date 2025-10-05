import { supabase } from '../lib/supabase';

export interface VerificationResponse {
  success: boolean;
  delivered?: boolean;
  devCode?: string;
  error?: string;
}

export interface VerifyCodeResponse {
  success: boolean;
  reason?: string;
  error?: string;
}

/**
 * Send verification email to user
 */
export const sendVerificationEmail = async (
  email: string, 
  userId: string
): Promise<VerificationResponse> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration. Please check your .env file.');
      return { success: false, error: 'Configuration error' };
    }
    
    const response = await fetch(`${supabaseUrl}/functions/v1/send-verification-email`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, userId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Send verification email failed:', response.status, errorText);
      return { success: false, error: `HTTP ${response.status}` };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Send verification email error:', error);
    return { success: false, error: 'Network error' };
  }
};

/**
 * Verify email code
 */
export const verifyEmailCode = async (
  userId: string, 
  code: string
): Promise<VerifyCodeResponse> => {
  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration. Please check your .env file.');
      return { success: false, error: 'Configuration error' };
    }
    
    const response = await fetch(`${supabaseUrl}/functions/v1/verify-email-code`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, code }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Verify email code failed:', response.status, errorText);
      return { success: false, error: `HTTP ${response.status}` };
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Verify email code error:', error);
    return { success: false, error: 'Network error' };
  }
};

/**
 * Check if user's email is verified in Supabase
 */
export const checkEmailVerificationStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error || !user) {
      console.error('Could not get user:', error);
      return false;
    }
    
    return user.user_metadata?.email_verified === true || user.email_confirmed_at !== null;
  } catch (error) {
    console.error('Check verification status error:', error);
    return false;
  }
};