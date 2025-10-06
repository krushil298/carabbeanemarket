import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { User, Eye, EyeOff, MapPin, Phone as PhoneIcon } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import OTPVerification from '../components/Auth/OTPVerification';
import { useAuth } from '../context/AuthContext';
import { caribbeanLocations } from '../data/mockData';

type SignupStep = 'form' | 'otp-verify' | 'complete';

const SignupPage: React.FC = () => {
  const { signup, sendOTP, verifyOTPCode, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<SignupStep>('form');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    phone: '',
    location: '',
    bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!formData.email || !formData.password || !formData.location || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const signupResult = await signup(formData);

      if (!signupResult.success) {
        setError(signupResult.error || 'Failed to create account');
        setSubmitting(false);
        return;
      }

      const otpResult = await sendOTP(formData.email, 'signup');

      if (!otpResult.success) {
        setError(otpResult.error || 'Failed to send verification code');
        setSubmitting(false);
        return;
      }

      setDevCode(otpResult.devCode);
      setStep('otp-verify');
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Signup error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOTP = async (code: string) => {
    const result = await verifyOTPCode(formData.email, code, 'signup');

    if (result.success) {
      setStep('complete');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }

    return result;
  };

  const handleResendOTP = async () => {
    const result = await sendOTP(formData.email, 'signup');
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
              email={formData.email}
              onVerify={handleVerifyOTP}
              onResend={handleResendOTP}
              title="Verify Your Email"
              description="We sent a 6-digit code to your email"
              devCode={devCode}
            />
          </div>
        </div>
      </Layout>
    );
  }

  if (step === 'complete') {
    return (
      <Layout>
        <div className="py-12 sm:py-16">
          <div className="container mx-auto px-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 max-w-md w-full mx-auto text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Welcome to Caribbean eMarket!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your account has been successfully created and verified.
              </p>
              <div className="animate-pulse text-cyan-600 dark:text-cyan-400">
                Redirecting to homepage...
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
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 max-w-md w-full mx-auto transition-colors">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                Join Caribbean eMarket
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Create your account to start buying and selling
              </p>
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4" role="alert">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="Your full name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Phone Number *
                </label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    id="location"
                    name="location"
                    required
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  >
                    <option value="">Select your island/country</option>
                    {caribbeanLocations.map((location) => (
                      <option key={location} value={location}>
                        {location}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="Min. 6 characters"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Bio (Optional)
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-cyan-500 focus:border-cyan-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg ${
                  submitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {submitting ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
              <p>
                Already have an account?{' '}
                <a href="/login" className="text-cyan-600 hover:text-cyan-700 font-medium">
                  Sign in
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;