import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  RotateCw,
  CheckCircle2,
  UserX,
  User,
  Search,
  AlertCircle
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { apiRequest } from '../../utils/api';

/**
 * UnifiedAuthCard
 * 
 * Modern production-grade SaaS unified authentication card for AfterBuy.
 * - Login & Signup feel like two states of ONE polished experience.
 * - Identical card width (400-440px), structure, typography, input & button heights.
 * - Instagram-like intelligent feedback when email doesn't exist (no generic "invalid credentials").
 * - Clean "Forgot email or need help finding account?" recovery workflow.
 * - Proper "Forgot password?" placement below password field with Remember Me.
 */
export const UnifiedAuthCard = ({ defaultMode = 'login', initialEmail = '' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  const { login, signup, setSession, sendLoginOtp, loginWithOtp } = useAuth();

  // Active state: 'login' | 'signup' | 'forgot' | 'verify_otp' | 'reset_password' | 'find_account'
  const [mode, setMode] = useState(defaultMode || 'login');

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Unregistered email detection (Instagram-like supportive feedback)
  const [unregisteredEmail, setUnregisteredEmail] = useState(null);

  // Account discovery / forgot email state
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState(null);
  const [lookupError, setLookupError] = useState(null);

  // OTP Verification state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [otpMode, setOtpMode] = useState('reset'); // 'reset' | 'login'

  // Loading & error states
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Sync mode with route if user navigates via browser back/forward buttons
  useEffect(() => {
    if (
      location.pathname === '/signup' &&
      mode !== 'signup' &&
      mode !== 'forgot' &&
      mode !== 'verify_otp' &&
      mode !== 'reset_password' &&
      mode !== 'find_account'
    ) {
      setMode('signup');
      setErrors({});
      setUnregisteredEmail(null);
    } else if (
      location.pathname === '/login' &&
      mode !== 'login' &&
      mode !== 'forgot' &&
      mode !== 'verify_otp' &&
      mode !== 'reset_password' &&
      mode !== 'find_account'
    ) {
      setMode('login');
      setErrors({});
      setUnregisteredEmail(null);
    }
  }, [location.pathname]);

  // Handle switching between states seamlessly
  const switchMode = (newMode) => {
    setMode(newMode);
    setErrors({});
    setUnregisteredEmail(null);
    if (newMode === 'login') {
      navigate('/login', { replace: true });
    } else if (newMode === 'signup') {
      navigate('/signup', { replace: true });
    }
  };

  // 60-second OTP resend countdown
  useEffect(() => {
    let interval;
    if (mode === 'verify_otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, resendTimer]);

  // Validation helpers
  const validateEmail = (val) => {
    if (!val || !val.trim()) return 'Email address is required';
    if (!/\S+@\S+\.\S+/.test(val)) return 'Please enter a valid email address';
    return null;
  };

  // ---------------------------------------------------------------------------
  // 1. HANDLE LOGIN SUBMISSION
  // ---------------------------------------------------------------------------
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    const errs = {};
    if (emailErr) errs.email = emailErr;
    if (!password) errs.password = 'Password is required';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setUnregisteredEmail(null);
    setLoading(true);

    try {
      const user = await login(email.toLowerCase().trim(), password, rememberMe);
      addToast({
        title: 'Welcome back!',
        message: `Signed in successfully as ${user?.name || 'User'}.`,
        type: 'success',
      });
      navigate('/app/dashboard');
    } catch (err) {
      const msg = err.message || '';
      const isNotFound =
        err.status === 404 ||
        err.data?.code === 'USER_NOT_FOUND' ||
        msg.toLowerCase().includes('no account') ||
        msg.toLowerCase().includes('user not found');

      const isWrongPass =
        err.data?.code === 'INCORRECT_PASSWORD' ||
        msg.toLowerCase().includes('incorrect password');

      if (isNotFound) {
        // Instagram-style unique resolution: email has no registered account
        setUnregisteredEmail(email.toLowerCase().trim());
        setErrors({});
      } else if (isWrongPass) {
        setErrors({ password: 'Incorrect password. Please try again or reset it.' });
      } else {
        setErrors({ form: msg || 'Invalid email or password. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 2. HANDLE SIGNUP SUBMISSION
  // ---------------------------------------------------------------------------
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!name || !name.trim()) errs.name = 'Full name is required';
    const emailErr = validateEmail(email);
    if (emailErr) errs.email = emailErr;
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';

    if (!confirmPassword) errs.confirmPassword = 'Confirm password is required';
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const user = await signup(name.trim(), email.toLowerCase().trim(), password);
      addToast({
        title: 'Account Created!',
        message: `Welcome to AfterBuy, ${user?.name || 'User'}!`,
        type: 'success',
      });
      navigate('/app/dashboard');
    } catch (err) {
      const msg = err.message || 'Failed to create account. Please try again.';
      setErrors({ form: msg });
      addToast({
        title: 'Registration Failed',
        message: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 3. HANDLE FORGOT PASSWORD REQUEST (Sends 6-digit OTP)
  // ---------------------------------------------------------------------------
  const handleForgotPasswordRequest = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setErrors({ email: emailErr });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      if (res.success) {
        setOtpMode('reset');
        setOtp(['', '', '', '', '', '']);
        setResendTimer(60);
        setCanResend(false);
        addToast({
          title: 'Verification Code Sent!',
          message: `A 6-digit security code was sent to ${email}.`,
          type: 'success',
        });
        setMode('verify_otp');
        setTimeout(() => {
          otpInputRefs.current[0]?.focus();
        }, 150);
      }
    } catch (err) {
      const msg = err.message || 'No account found with this email address.';
      setErrors({ form: msg });
      addToast({
        title: 'Request Failed',
        message: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 4. HANDLE ACCOUNT DISCOVERY (Forgot Email lookup by phone/name)
  // ---------------------------------------------------------------------------
  const handleFindAccount = async (e) => {
    e.preventDefault();
    if (!lookupQuery.trim()) {
      setLookupError('Please enter a phone number or name');
      return;
    }

    setLookupError(null);
    setLookupLoading(true);

    try {
      const res = await apiRequest('/auth/find-account', {
        method: 'POST',
        body: JSON.stringify({ query: lookupQuery.trim() }),
      });

      if (res.found) {
        setLookupResult(res);
      }
    } catch (err) {
      setLookupError(err.message || 'No account found matching this information.');
    } finally {
      setLookupLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 5. OTP INPUT HANDLERS & VERIFICATION
  // ---------------------------------------------------------------------------
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (errors.otp) setErrors((prev) => ({ ...prev, otp: null }));

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    const fullCode = newOtp.join('');
    if (fullCode.length === 6) {
      executeVerifyOtp(fullCode);
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (/^\d{6}$/.test(pasted)) {
      const digits = pasted.split('');
      setOtp(digits);
      digits.forEach((d, i) => {
        if (otpInputRefs.current[i]) otpInputRefs.current[i].value = d;
      });
      otpInputRefs.current[5]?.focus();
      executeVerifyOtp(pasted);
    }
  };

  const executeVerifyOtp = async (codeToVerify) => {
    const code = codeToVerify || otp.join('');
    if (code.length < 6) {
      setErrors({ otp: 'Please enter all 6 digits of the code' });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      if (otpMode === 'login') {
        const user = await loginWithOtp(email, code);
        addToast({
          title: 'Signed In Successfully!',
          message: `Welcome back, ${user?.name || 'User'}!`,
          type: 'success',
        });
        navigate('/app/dashboard');
      } else {
        const res = await apiRequest('/auth/verify-reset-otp', {
          method: 'POST',
          body: JSON.stringify({
            email: email.toLowerCase().trim(),
            otp: code,
          }),
        });

        if (res.success) {
          addToast({
            title: 'Code Verified!',
            message: 'Code confirmed. Please set your new password.',
            type: 'success',
          });
          setPassword('');
          setConfirmPassword('');
          setMode('reset_password');
        }
      }
    } catch (err) {
      const msg = err.message || 'Incorrect or expired verification code. Please try again.';
      setErrors({ otp: msg });
      addToast({
        title: 'Verification Failed',
        message: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    setErrors({});
    setLoading(true);

    try {
      if (otpMode === 'login') {
        await sendLoginOtp(email.toLowerCase().trim());
      } else {
        await apiRequest('/auth/forgot-password', {
          method: 'POST',
          body: JSON.stringify({ email: email.toLowerCase().trim() }),
        });
      }

      setResendTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      addToast({
        title: 'New Code Sent',
        message: `A fresh 6-digit code has been delivered to ${email}.`,
        type: 'info',
      });
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (err) {
      addToast({
        title: 'Resend Failed',
        message: err.message || 'Could not resend code. Please try again.',
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // 6. HANDLE RESET NEW PASSWORD SUBMISSION
  // ---------------------------------------------------------------------------
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setErrors({ password: 'Password must be at least 6 characters long' });
      return;
    }
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await apiRequest('/auth/reset-password-otp', {
        method: 'POST',
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          otp: otp.join(''),
          password,
        }),
      });

      if (res.success) {
        if (res.token && res.user) {
          setSession(res.token, res.user);
        }
        addToast({
          title: 'Password Updated!',
          message: 'Your password has been changed. Welcome back to AfterBuy!',
          type: 'success',
        });
        navigate('/app/dashboard');
      }
    } catch (err) {
      const msg = err.message || 'Failed to update password. Please try again.';
      setErrors({ form: msg });
      addToast({
        title: 'Update Failed',
        message: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // HEADINGS & SUBTITLES
  // ---------------------------------------------------------------------------
  const getHeaderInfo = () => {
    if (mode === 'signup') {
      return {
        title: 'Create your account',
        subtitle: 'Start managing your purchases, returns and warranties',
      };
    }
    if (mode === 'forgot') {
      return {
        title: 'Reset your password',
        subtitle: 'Enter your email to receive a 6-digit security code',
      };
    }
    if (mode === 'find_account') {
      return {
        title: 'Find your account',
        subtitle: 'Search by your full name or phone number to find your registered email',
      };
    }
    if (mode === 'verify_otp') {
      return {
        title: 'Enter verification code',
        subtitle: `We've sent a 6-digit code to ${email}`,
      };
    }
    if (mode === 'reset_password') {
      return {
        title: 'Create new password',
        subtitle: 'Choose a strong password to secure your account',
      };
    }
    // Default: 'login'
    return {
      title: 'Welcome back',
      subtitle: 'Sign in to your AfterBuy account',
    };
  };

  const { title, subtitle } = getHeaderInfo();

  return (
    <div className="w-full bg-white dark:bg-[#121620] rounded-2xl border border-slate-200/80 dark:border-[#222734] shadow-sm dark:shadow-none p-6 sm:p-9 transition-all duration-200">
      
      {/* AB Logo & Header */}
      <div className="flex flex-col items-center text-center mb-6 sm:mb-7">
        <div className="w-12 h-12 mb-3.5 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 ring-4 ring-blue-50 dark:ring-blue-950/40">
          <span className="font-extrabold text-base tracking-wider">AB</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] tracking-tight">
          {title}
        </h1>

        <p className="text-sm text-slate-500 dark:text-[#A9B0BC] mt-1.5 max-w-xs mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Form Error Callout Banner */}
      {errors.form && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. LOGIN STATE                                                            */}
      {/* ========================================================================= */}
      {mode === 'login' && (
        <div className="space-y-4">
          
          {/* Instagram-Style User Not Found Feedback Banner */}
          {unregisteredEmail && (
            <div className="p-4 rounded-xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/70 transition-all duration-200">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/70 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                  <UserX className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    No account found for this email
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                    There is no AfterBuy account registered with <strong className="text-slate-900 dark:text-white">{unregisteredEmail}</strong>.
                  </p>

                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail(unregisteredEmail);
                        setUnregisteredEmail(null);
                        switchMode('signup');
                      }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <span>Create account with this email</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMode('find_account');
                        setUnregisteredEmail(null);
                      }}
                      className="px-2 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      Forgot your email?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                    if (unregisteredEmail) setUnregisteredEmail(null);
                  }}
                  placeholder="Enter your email"
                  required
                  autoFocus
                  className={`w-full h-12 pl-10 pr-4 rounded-xl border ${
                    errors.email || unregisteredEmail ? 'border-rose-300 dark:border-rose-700' : 'border-slate-200 dark:border-[#2D333F]'
                  } bg-slate-50/60 dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#141822] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password - Clean label without top clutter */}
            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                  }}
                  placeholder="Enter your password"
                  required
                  className={`w-full h-12 pl-10 pr-11 rounded-xl border ${
                    errors.password ? 'border-rose-300 dark:border-rose-700' : 'border-slate-200 dark:border-[#2D333F]'
                  } bg-slate-50/60 dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#141822] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {errors.password}
                </p>
              )}
            </div>

            {/* Clean Actions Row BELOW Password: Remember Me on left, Forgot Password on right */}
            <div className="flex items-center justify-between pt-0.5 text-xs">
              <label htmlFor="login-remember" className="flex items-center gap-2 text-slate-600 dark:text-[#A9B0BC] cursor-pointer select-none">
                <input
                  id="login-remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setErrors({});
                  setUnregisteredEmail(null);
                }}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            {/* Primary Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>

            {/* Subtle Centered Divider */}
            <div className="flex items-center my-5">
              <div className="flex-1 border-t border-slate-200/80 dark:border-[#242A36]" />
              <span className="px-3 text-xs text-slate-400 dark:text-[#747C89] font-medium select-none">
                OR
              </span>
              <div className="flex-1 border-t border-slate-200/80 dark:border-[#242A36]" />
            </div>

            {/* Google Sign-In */}
            <GoogleSignInButton label="Continue with Google" />

            {/* Seamless State Switcher */}
            <div className="pt-2 text-center text-xs text-slate-500 dark:text-[#A9B0BC]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => switchMode('signup')}
                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </div>

            {/* Extra Assistance: Forgot Email / Find Account (Instagram-like feature) */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setMode('find_account');
                  setErrors({});
                  setUnregisteredEmail(null);
                }}
                className="text-xs text-slate-400 dark:text-[#747C89] hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
              >
                Forgot email address or need help logging in?
              </button>
            </div>

            {/* Small Legal Text */}
            <p className="pt-1 text-center text-[11px] text-slate-400 dark:text-[#747C89] leading-relaxed">
              By continuing, you agree to AfterBuy's{' '}
              <Link to="/terms" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 transition-colors">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 transition-colors">
                Privacy Policy
              </Link>.
            </p>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. SIGNUP STATE                                                           */}
      {/* ========================================================================= */}
      {mode === 'signup' && (
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              Full name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                id="signup-name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                placeholder="e.g. John Doe"
                required
                autoFocus
                className={`w-full h-12 pl-10 pr-4 rounded-xl border ${
                  errors.name ? 'border-rose-300 dark:border-rose-700' : 'border-slate-200 dark:border-[#2D333F]'
                } bg-slate-50/60 dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#141822] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200`}
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <label htmlFor="signup-email" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              Email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                placeholder="Enter your email"
                required
                className={`w-full h-12 pl-10 pr-4 rounded-xl border ${
                  errors.email ? 'border-rose-300 dark:border-rose-700' : 'border-slate-200 dark:border-[#2D333F]'
                } bg-slate-50/60 dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#141822] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                placeholder="Create a password"
                required
                className={`w-full h-12 pl-10 pr-11 rounded-xl border ${
                  errors.password ? 'border-rose-300 dark:border-rose-700' : 'border-slate-200 dark:border-[#2D333F]'
                } bg-slate-50/60 dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#141822] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="signup-confirm-password" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              Confirm password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="signup-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }}
                placeholder="Confirm your password"
                required
                className={`w-full h-12 pl-10 pr-11 rounded-xl border ${
                  errors.confirmPassword ? 'border-rose-300 dark:border-rose-700' : 'border-slate-200 dark:border-[#2D333F]'
                } bg-slate-50/60 dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#141822] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Primary Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Create account
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          {/* Subtle Centered Divider */}
          <div className="flex items-center my-5">
            <div className="flex-1 border-t border-slate-200/80 dark:border-[#242A36]" />
            <span className="px-3 text-xs text-slate-400 dark:text-[#747C89] font-medium select-none">
              OR
            </span>
            <div className="flex-1 border-t border-slate-200/80 dark:border-[#242A36]" />
          </div>

          {/* Google Sign-In */}
          <GoogleSignInButton label="Continue with Google" />

          {/* Seamless State Switcher */}
          <div className="pt-2 text-center text-xs text-slate-500 dark:text-[#A9B0BC]">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              Sign in
            </button>
          </div>

          {/* Small Legal Text */}
          <p className="pt-1 text-center text-[11px] text-slate-400 dark:text-[#747C89] leading-relaxed">
            By continuing, you agree to AfterBuy's{' '}
            <Link to="/terms" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 transition-colors">
              Terms of Service
            </Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2 transition-colors">
              Privacy Policy
            </Link>.
          </p>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 3. FORGOT PASSWORD REQUEST STATE                                          */}
      {/* ========================================================================= */}
      {mode === 'forgot' && (
        <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              Account email address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                placeholder="Enter your email"
                required
                autoFocus
                className={`w-full h-12 pl-10 pr-4 rounded-xl border ${
                  errors.email ? 'border-rose-300 dark:border-rose-700' : 'border-slate-200 dark:border-[#2D333F]'
                } bg-slate-50/60 dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#141822] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200`}
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.email}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending verification code...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Send 6-Digit Code
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 4. FIND ACCOUNT / FORGOT EMAIL STATE (Instagram-style recovery)           */}
      {/* ========================================================================= */}
      {mode === 'find_account' && (
        <div className="space-y-4">
          {!lookupResult ? (
            <form onSubmit={handleFindAccount} className="space-y-4">
              <div>
                <label htmlFor="lookup-query" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
                  Full name or phone number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    id="lookup-query"
                    type="text"
                    value={lookupQuery}
                    onChange={(e) => {
                      setLookupQuery(e.target.value);
                      if (lookupError) setLookupError(null);
                    }}
                    placeholder="e.g. John Doe or +91 9876543210"
                    required
                    autoFocus
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#141822] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200"
                  />
                </div>
                {lookupError && (
                  <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                    {lookupError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={lookupLoading}
                className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {lookupLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Searching...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Find My Account
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </button>

              {/* Helpful Tips Card */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#181D28] border border-slate-200/80 dark:border-[#242A36] text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
                <span className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-blue-500" />
                  Helpful Recovery Tip
                </span>
                <p className="text-[11px] text-slate-500 dark:text-[#949EB2] leading-relaxed">
                  Search by your full name that you entered during registration, or search your email inboxes (Gmail, Outlook) for emails from AfterBuy.
                </p>
              </div>

              {/* Subtle Centered Divider */}
              <div className="flex items-center my-4">
                <div className="flex-1 border-t border-slate-200/80 dark:border-[#242A36]" />
                <span className="px-3 text-xs text-slate-400 dark:text-[#747C89] font-medium select-none">
                  OR
                </span>
                <div className="flex-1 border-t border-slate-200/80 dark:border-[#242A36]" />
              </div>

              {/* Check with Google Button */}
              <GoogleSignInButton label="Check if you signed up with Google" />
            </form>
          ) : (
            /* Result View when Account is Found */
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/90 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-900/70">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  Account Found!
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                  {lookupResult.name}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  Registered Email: <strong className="text-slate-900 dark:text-white font-semibold">{lookupResult.maskedEmail}</strong>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEmail(lookupResult.email);
                  setLookupResult(null);
                  setLookupQuery('');
                  switchMode('login');
                }}
                className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                Sign in with this account
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    setLoading(true);
                    await sendLoginOtp(lookupResult.email);
                    setEmail(lookupResult.email);
                    setOtpMode('login');
                    setOtp(['', '', '', '', '', '']);
                    setResendTimer(60);
                    setCanResend(false);
                    setLookupResult(null);
                    setLookupQuery('');
                    setMode('verify_otp');
                    addToast({
                      title: 'Login Code Sent!',
                      message: `A 6-digit code was sent to ${lookupResult.maskedEmail}.`,
                      type: 'success',
                    });
                  } catch (err) {
                    addToast({
                      title: 'Failed to send code',
                      message: err.message || 'Could not send verification code.',
                      type: 'error',
                    });
                  } finally {
                    setLoading(false);
                  }
                }}
                className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-white dark:bg-[#151922] hover:bg-slate-50 dark:hover:bg-[#1C2230] text-slate-700 dark:text-[#E2E8F0] font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Send 6-Digit Login Code via Email
              </button>
            </div>
          )}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLookupResult(null);
                setLookupError(null);
                setLookupQuery('');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. VERIFY 6-DIGIT OTP CODE                                                */}
      {/* ========================================================================= */}
      {mode === 'verify_otp' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeVerifyOtp();
          }}
          className="space-y-5"
        >
          {/* Target Email Indicator */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#181D28] border border-slate-200/80 dark:border-[#262D3D] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA] truncate">
                {email}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setMode('forgot')}
              className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer shrink-0"
            >
              Edit
            </button>
          </div>

          {/* 6 Square OTP Inputs */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-2.5 text-center">
              Enter 6-digit security code
            </label>
            <div className="flex items-center justify-center gap-2 sm:gap-2.5" onPaste={handleOtpPaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => (otpInputRefs.current[idx] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg sm:text-xl font-bold rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] focus:bg-white dark:focus:bg-[#141822] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-150 select-all"
                />
              ))}
            </div>

            {errors.otp && (
              <p className="mt-2 text-center text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.otp}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length < 6}
            className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying code...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Verify Code
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          {/* Resend Code Timer */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="inline-flex items-center gap-1 font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </button>

            {canResend ? (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading}
                className="inline-flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                <RotateCw className="w-3 h-3" />
                Resend Code
              </button>
            ) : (
              <span className="text-slate-400 dark:text-[#747C89]">
                Resend code in <strong className="font-semibold text-slate-600 dark:text-slate-300">{resendTimer}s</strong>
              </span>
            )}
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* 6. CREATE NEW PASSWORD (After OTP verification)                           */}
      {/* ========================================================================= */}
      {mode === 'reset_password' && (
        <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-xs text-emerald-800 dark:text-emerald-300 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
            <div>
              <span className="font-semibold block">Code Verified Successfully</span>
              Now set a strong new password to protect your account.
            </div>
          </div>

          {/* New Password */}
          <div>
            <label htmlFor="new-password" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                }}
                placeholder="At least 6 characters"
                required
                autoFocus
                className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#141822] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-new-password" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirm-new-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                }}
                placeholder="Confirm your new password"
                required
                className="w-full h-12 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#0E1117] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#141822] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/15 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] cursor-pointer"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Updating password...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Save Password & Sign In
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </button>
          </div>
        </form>
      )}

    </div>
  );
};

export default UnifiedAuthCard;
