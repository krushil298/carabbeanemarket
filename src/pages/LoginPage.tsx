import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import OTPVerification from '../components/Auth/OTPVerification';
import { useAuth } from '../context/AuthContext';

type LoginMethod = 'password' | 'otp';
type LoginStep = 'method-select' | 'password-form' | 'otp-request' | 'otp-verify';

const LoginPage: React.FC = () => {
  const { login, loginWithOTP, sendOTP, verifyOTPCode, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<LoginStep>('method-select');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [devCode, setDevCode] = useState<string>();

  if (loading) {
    return (
      <Layout>
        <div className="py-12 sm:py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </Layout>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleMethodSelect = (method: LoginMethod) => {
    setLoginMethod(method);
    if (method === 'password') {
      setStep('password-form');
    } else {
      setStep('otp-request');
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setSubmitting(true);

    try {
      const success = await login(email, password);

      if (success) {
        navigate('/');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOTPRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setSubmitting(true);

    try {
      const result = await sendOTP(email, 'login');

      if (!result.success) {
        setError(result.error || 'Failed to send OTP code');
        setSubmitting(false);
        return;
      }

      setDevCode(result.devCode);
      setStep('otp-verify');
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('OTP request error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (code: string) => {
    const verifyResult = await verifyOTPCode(email, code, 'login');

    if (!verifyResult.success) {
      return { success: false, error: verifyResult.error };
    }

    const loginResult = await loginWithOTP(email, code);

    if (loginResult.success) {
      navigate('/');
    }

    return loginResult;
  };

  const handleResendOTP = async () => {
    const result = await sendOTP(email, 'login');
    if (result.success && result.devCode) {
      setDevCode(result.devCode);
    }
    return result;
  };

  if (step === 'otp-verify') {
    return (
      <Layout>
        <div className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <OTPVerification
              email={email}
              onVerify={handleVerifyOTP}
              onResend={handleResendOTP}
              title="Enter Login Code"
              description="We sent a 6-digit code to your email"
              devCode={devCode}
            />
            <div className="text-center mt-4">
              <button
                onClick={() => setStep('otp-request')}
                className="text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
              >
                ← Back to email entry
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (step === 'method-select') {
    return (
      <Layout>
        <div className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 max-w-md w-full mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Welcome Back
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose how you'd like to sign in
                </p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => handleMethodSelect('password')}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/50 transition-colors">
                      <Lock className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 dark:text-white">Sign in with Password</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Use your email and password</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <button
                  onClick={() => handleMethodSelect('otp')}
                  className="w-full flex items-center justify-between p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center group-hover:bg-cyan-200 dark:group-hover:bg-cyan-800/50 transition-colors">
                      <Mail className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 dark:text-white">Sign in with Email Code</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Get a one-time code via email</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <div className="mt-8 text-center text-gray-600 dark:text-gray-400">
                <p>
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 font-medium">
                    Sign up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (step === 'otp-request') {
    return (
      <Layout>
        <div className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 max-w-md w-full mx-auto">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Sign in with Email Code
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  Enter your email to receive a login code
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4" role="alert">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleOTPRequest} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="you@example.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className={`w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
                    submitting ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {submitting ? 'Sending Code...' : 'Send Login Code'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setStep('method-select')}
                  className="text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
                >
                  ← Back to login options
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 max-w-md w-full mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Welcome Back
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Sign in to your account
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4" role="alert">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="Your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <Link to="/forgot-password" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 font-medium">
                    Forgot password?
                  </Link>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setStep('method-select')}
                className="text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400"
              >
                ← Back to login options
              </button>
            </div>

            <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
              <p>
                Don't have an account?{' '}
                <Link to="/signup" className="text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;