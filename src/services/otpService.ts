import { supabase } from '../lib/supabase';

export type OTPType = 'signup' | 'login' | 'reset';

export interface GenerateOTPResponse {
  success: boolean;
  emailSent: boolean;
  devCode?: string;
  expiresAt?: string;
  error?: string;
  code?: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  reason?: string;
  message?: string;
  email?: string;
  error?: string;
}

export async function generateOTP(email: string, type: OTPType): Promise<GenerateOTPResponse> {
  if (!supabase) {
    return { success: false, emailSent: false, error: 'Supabase not initialized' };
  }

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/functions/v1/generate-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email, type }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        emailSent: false,
        error: data.error || 'Failed to generate OTP',
        code: data.code
      };
    }

    return data;
  } catch (error) {
    console.error('Generate OTP error:', error);
    return {
      success: false,
      emailSent: false,
      error: 'Network error. Please try again.'
    };
  }
}

export async function verifyOTP(
  email: string,
  code: string,
  type: OTPType
): Promise<VerifyOTPResponse> {
  if (!supabase) {
    return { success: false, error: 'Supabase not initialized' };
  }

  try {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const response = await fetch(`${supabaseUrl}/functions/v1/verify-otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ email, code, type }),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        reason: data.reason,
        message: data.message || data.error || 'Verification failed'
      };
    }

    return data;
  } catch (error) {
    console.error('Verify OTP error:', error);
    return {
      success: false,
      error: 'Network error. Please try again.'
    };
  }
}

export async function resendOTP(email: string, type: OTPType): Promise<GenerateOTPResponse> {
  return generateOTP(email, type);
}

export function formatOTPCode(code: string): string {
  return code.replace(/(\d{3})(\d{3})/, '$1 $2');
}

export function validateOTPCode(code: string): boolean {
  const cleanCode = code.replace(/\s/g, '');
  return /^\d{6}$/.test(cleanCode);
}