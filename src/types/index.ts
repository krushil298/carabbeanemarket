import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Upload, Eye, EyeOff, Shield, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { caribbeanLocations } from '../../data/mockData';

interface AuthFormProps {
  type: 'login' | 'signup';
  onSubmit: (data: any) => Promise<boolean>;
}

const AuthForm: React.FC<AuthFormProps> = ({ type, onSubmit }) => {
  const navigate = useNavigate();
  const { sendVerificationEmail, verifyEmailCode } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    profilePicture: '',
    location: '',
    bio: '',
    phone: '',
    userId: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'form' | 'email' | 'phone' | 'complete'>('form');
  const [verificationCodes, setVerificationCodes] = useState({
    email: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPreviewImage(result);
      setFormData(prev => ({ ...prev, profilePicture: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (type === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      
      if (!formData.email || !formData.password || !formData.location || !formData.phone) {
        setError('Please fill in all required fields');
        return;
      }
      
      setLoading(true);
      try {
        const success = await onSubmit(formData);
        
        if (success) {
          navigate('/');
        } else {
          setError('Failed to create account');
        }
      } catch (err) {
        setError('An error occurred during signup');
        console.error(err);
      } finally {
        setLoading(false);
      }
      return;
    } else {
      if (!formData.email || !formData.password) {
        setError('Please fill in all required fields');
        return;
      }
      
      setLoading(true);
      
      try {
        const success = await onSubmit(formData);
        
        if (success) {
          navigate('/');
        } else {
          setError('Invalid credentials');
        }
      } catch (err) {
        setError('An error occurred during login');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleVerifyEmail = () => {
    // Verify the email code
    if (!verificationCodes.email.trim()) {
      setError('Please enter the verification code');
      return;
    }
    
    setLoading(true);
    verifyEmailCode(formData.userId || '', verificationCodes.email)
      .then((success) => {
        if (success) {
          setVerificationStep('phone');
        } else {
          setError('Invalid verification code. Please try again.');
        }
      })
      .catch(() => {
        setError('Failed to verify code. Please try again.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleVerifyPhone = () => {
    // Skip phone verification for demo - complete signup
    setVerificationStep('complete');
    // Complete signup
    setTimeout(() => {
      handleSubmit(new Event('submit') as any);
    }, 1000);
  };

  const defaultProfilePic = 'https://images.pexels.com/photos/771742/pexels-photo-771742.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face';

  if (type === 'signup' && verificationStep !== 'form') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 max-w-md w-full mx-auto transition-colors caribbean-pattern">
        <div className="text-center">
          {verificationStep === 'email' && (
            <>
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Verify Your Email
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent a verification code to {formData.email}
              </p>
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCodes.email}
                onChange={(e) => setVerificationCodes(prev => ({ ...prev, email: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
              />
              <p className="text-sm text-gray-500 mb-4">
                Please check your email (including spam folder) and enter the 6-digit verification code.
              </p>
              <button
                onClick={handleVerifyEmail}
                disabled={loading}
                className={`w-full btn-tropical text-white py-3 rounded-lg font-semibold transition-all ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </>
          )}

          {verificationStep === 'phone' && (
            <>
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Verify Your Phone
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent a verification code to {formData.phone}
              </p>
              <input
                type="text"
                placeholder="Enter verification code"
                value={verificationCodes.phone}
                onChange={(e) => setVerificationCodes(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
              />
              <p className="text-sm text-gray-500 mb-4">
                Demo mode: Click "Verify Phone" to continue (no actual code needed)
              </p>
              <button
                onClick={handleVerifyPhone}
                className="w-full btn-tropical text-white py-3 rounded-lg font-semibold transition-all"
              >
                Verify Phone
              </button>
            </>
          )}

          {verificationStep === 'complete' && (
            <>
              <div className="w-16 h-16 bg-teal-100 dark:bg-teal-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-teal-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Account Created!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your account has been successfully created and verified.
              </p>
              <div className="animate-pulse text-teal-600">
                Redirecting to your profile...
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 max-w-md w-full mx-auto transition-colors caribbean-pattern">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
          {type === 'login' ? 'Welcome Back' : 'Join Caribbean eMarket'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {type === 'login' 
            ? 'Sign in to your account' 
            : 'Create your account to start buying and selling'}
        </p>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4" role="alert">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'signup' && (
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username*
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              placeholder="Choose a username"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email Address*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
            placeholder="you@example.com"
          />
        </div>

        {type === 'signup' && (
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number*
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              placeholder="+1 (555) 123-4567"
            />
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Password*
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              placeholder="••••••••"
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

        {type === 'signup' && (
          <>
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password*
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full p-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                  placeholder="••••••••"
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
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Location*
              </label>
              <select
                id="location"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
              >
                <option value="">Select your island/country</option>
                {caribbeanLocations.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                value={formData.bio}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all"
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Profile Picture
              </label>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden flex items-center justify-center">
                  {previewImage ? (
                    <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <label className="cursor-pointer bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg transition-colors flex items-center">
                  <Upload className="w-4 h-4 mr-2" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Optional - A default profile picture will be used if none is selected
              </p>
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`w-full btn-tropical text-white py-3 rounded-lg font-semibold transition-all ${
            loading ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {loading 
            ? 'Processing...' 
            : type === 'login' 
              ? 'Sign In' 
              : 'Create Account'}
        </button>
      </form>

      <div className="mt-6 text-center text-gray-600 dark:text-gray-400">
        {type === 'login' ? (
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
              Sign up
            </a>
          </p>
        ) : (
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-teal-600 hover:text-teal-700 font-medium">
              Sign in
            </a>
          </p>
        )}
        
        {type === 'login' && (
          <p className="mt-2">
            <a href="/forgot-password" className="text-teal-600 hover:text-teal-700 font-medium text-sm">
              Forgot your password?
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthForm;