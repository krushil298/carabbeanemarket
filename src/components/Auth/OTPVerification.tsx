import React, { useState, useEffect, useRef } from 'react';
import { Mail, RefreshCw } from 'lucide-react';

interface OTPVerificationProps {
  email: string;
  onVerify: (code: string) => Promise<{ success: boolean; error?: string }>;
  onResend: () => Promise<{ success: boolean; error?: string }>;
  title?: string;
  description?: string;
  devCode?: string;
}

const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  onVerify,
  onResend,
  title = 'Verify Your Email',
  description = 'Enter the 6-digit code we sent to your email',
  devCode
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newCode.every(digit => digit !== '')) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];

    pastedData.split('').forEach((digit, index) => {
      if (index < 6) {
        newCode[index] = digit;
      }
    });

    setCode(newCode);

    if (pastedData.length === 6) {
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    } else if (pastedData.length > 0) {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleVerify = async (verificationCode: string) => {
    setLoading(true);
    setError('');

    try {
      const result = await onVerify(verificationCode);

      if (!result.success) {
        setError(result.error || 'Invalid verification code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setLoading(true);
    setError('');

    try {
      const result = await onResend();

      if (result.success) {
        setResendCooldown(60);
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(result.error || 'Failed to resend code. Please try again.');
      }
    } catch (err) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sm:p-8 max-w-md w-full mx-auto transition-colors">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
          {email}
        </p>
      </div>

      {devCode && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <p className="text-xs text-yellow-800 dark:text-yellow-200 text-center">
            <strong>Dev Mode:</strong> Your code is <strong className="text-lg">{devCode}</strong>
          </p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4 text-sm text-center">
          {error}
        </div>
      )}

      <div className="flex justify-center gap-2 mb-6">
        {code.map((digit, index) => (
          <input
            key={index}
            ref={el => inputRefs.current[index] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={e => handleChange(index, e.target.value)}
            onKeyDown={e => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={loading}
            className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-lg
              ${digit ? 'border-cyan-500 dark:border-cyan-400' : 'border-gray-300 dark:border-gray-600'}
              ${loading ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : 'bg-white dark:bg-gray-700'}
              focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 dark:focus:ring-cyan-800
              text-gray-900 dark:text-white transition-all outline-none`}
          />
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleResend}
          disabled={resendCooldown > 0 || loading}
          className={`inline-flex items-center gap-2 text-sm font-medium transition-colors
            ${resendCooldown > 0 || loading
              ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300'
            }`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : 'Resend code'
          }
        </button>
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-4">
        Didn't receive the code? Check your spam folder or request a new one.
      </p>
    </div>
  );
};

export default OTPVerification;