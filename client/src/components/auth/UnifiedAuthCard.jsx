import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  Edit2,
  CheckCircle2,
  KeyRound,
  ShieldCheck,
  RotateCw
} from 'lucide-react';
import { useToast } from '../ui/Toast';
import { useAuth } from '../../context/AuthContext';
import { GoogleSignInButton } from './GoogleSignInButton';
import { apiRequest } from '../../utils/api';

export const UnifiedAuthCard = ({ initialEmail = '', defaultMode = null }) => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { login, signup, setSession } = useAuth();

  // Step state: 'email' | 'login' | 'signup' | 'forgot' | 'verify_otp' | 'reset_new_password'
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState(initialEmail);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [userNameGreeting, setUserNameGreeting] = useState('');

  // OTP Verification state
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const otpInputRefs = useRef([]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // New Password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', percent: 0 };
    if (password.length < 6) return { label: 'Weak', color: 'bg-rose-500 text-rose-600', percent: 33 };
    if (password.length < 10) return { label: 'Good', color: 'bg-amber-500 text-amber-600', percent: 66 };
    return { label: 'Strong', color: 'bg-emerald-500 text-emerald-600', percent: 100 };
  };

  const strength = getPasswordStrength();

  // Validate Email
  const validateEmail = (val) => {
    if (!val || !val.trim()) return 'Email address is required';
    if (!/\S+@\S+\.\S+/.test(val)) return 'Please enter a valid email address';
    return null;
  };

  // Step 1: Check Email
  const handleCheckEmail = async (e) => {
    e?.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setErrors({ email: emailErr });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const res = await apiRequest('/auth/check-email', {
        method: 'POST',
        body: JSON.stringify({ email: email.toLowerCase().trim() }),
      });

      if (res.exists) {
        // User already has an account -> Move to Login password prompt
        setUserNameGreeting(res.name || '');
        setStep('login');
      } else {
        // New user -> Move to Signup setup prompt
        setStep('signup');
      }
    } catch (err) {
      console.warn('Check-email warning, defaulting to login prompt:', err.message);
      setStep('login');
    } finally {
      setLoading(false);
    }
  };

  // Step 2A: Handle Login (Existing User)
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      setErrors({ password: 'Password is required' });
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const authenticatedUser = await login(email.toLowerCase().trim(), password, rememberMe);
      addToast({
        title: 'Welcome back!',
        message: `Signed in successfully as ${authenticatedUser?.name || 'User'}.`,
        type: 'success',
      });
      navigate('/app/dashboard');
    } catch (err) {
      const msg = err.message || 'Invalid email or password. Please try again.';
      setErrors({ form: msg });
      addToast({
        title: 'Sign In Failed',
        message: msg,
        type: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 2B: Handle Signup (New User)
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!agreeTerms) errs.agreeTerms = 'Please agree to terms to create account';

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const authenticatedUser = await signup(name.trim(), email.toLowerCase().trim(), password);
      addToast({
        title: 'Account Created!',
        message: `Welcome to AfterBuy, ${name.trim()}! Your dashboard is ready.`,
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

  const handleResetToEmail = () => {
    setStep('email');
    setPassword('');
    setConfirmPassword('');
    setOtp(['', '', '', '', '', '']);
    setErrors({});
  };

  // 60-second OTP resend countdown effect
  useEffect(() => {
    let interval;
    if (step === 'verify_otp' && resendTimer > 0) {
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
  }, [step, resendTimer]);

  // Step 3: Request 6-Digit OTP via Email
  const handleForgotPasswordRequest = async (e) => {
    e?.preventDefault();
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
        setOtp(['', '', '', '', '', '']);
        setResendTimer(60);
        setCanResend(false);
        addToast({
          title: 'Verification Code Sent!',
          message: `A 6-digit security code was sent to ${email}.`,
          type: 'success',
        });
        setStep('verify_otp');
        // Auto focus first OTP digit input
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

  // OTP Input handlers (auto-focus next, backspace support, clipboard paste)
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (errors.otp) setErrors((prev) => ({ ...prev, otp: null }));

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when 6th digit entered
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

  // Execute OTP Verification with backend
  const executeVerifyOtp = async (codeToVerify) => {
    const code = codeToVerify || otp.join('');
    if (code.length < 6) {
      setErrors({ otp: 'Please enter all 6 digits of the code' });
      return;
    }

    setErrors({});
    setLoading(true);

    try {
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
        setStep('reset_new_password');
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

  // Step 5: Save New Password using OTP
  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters long' });
      return;
    }
    if (confirmNewPassword && newPassword !== confirmNewPassword) {
      setErrors({ confirmNewPassword: 'Passwords do not match' });
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
          password: newPassword,
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

  // Dynamic header text based on context
  const getHeaderTitle = () => {
    if (step === 'email') {
      if (defaultMode === 'signup') return 'Create your account';
      if (defaultMode === 'login') return 'Welcome to AfterBuy';
      return 'Welcome to AfterBuy';
    }
    if (step === 'login') {
      return `Welcome back${userNameGreeting ? `, ${userNameGreeting.split(' ')[0]}` : ''}!`;
    }
    if (step === 'signup') {
      return 'Complete your account';
    }
    if (step === 'forgot') {
      return 'Reset your password';
    }
    if (step === 'verify_otp') {
      return 'Enter verification code';
    }
    if (step === 'reset_new_password') {
      return 'Create new password';
    }
    return 'Welcome to AfterBuy';
  };

  const getHeaderSubtitle = () => {
    if (step === 'email') {
      return 'Enter your email to sign in or get started';
    }
    if (step === 'login') {
      return 'Enter your password to access your dashboard';
    }
    if (step === 'signup') {
      return 'Set up your name and password to start tracking';
    }
    if (step === 'forgot') {
      return 'Enter your email to receive a 6-digit security code';
    }
    if (step === 'verify_otp') {
      return `We've sent a 6-digit code to ${email}`;
    }
    if (step === 'reset_new_password') {
      return 'Choose a strong password to secure your account';
    }
    return '';
  };

  return (
    <div className="bg-white dark:bg-[#141820] rounded-2xl border border-slate-200/80 dark:border-[#242A36] shadow-xl shadow-slate-200/50 dark:shadow-black/60 p-7 sm:p-9 transition-all duration-200">
      
      {/* Brand Icon Header */}
      <div className="flex flex-col items-center text-center mb-7">
        <div className="w-12 h-12 mb-4 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-4 ring-blue-50 dark:ring-blue-950/40">
          <span className="font-extrabold text-base tracking-wider">AB</span>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] tracking-tight">
          {getHeaderTitle()}
        </h1>

        <p className="text-sm text-slate-500 dark:text-[#A9B0BC] mt-1.5 max-w-xs mx-auto">
          {getHeaderSubtitle()}
        </p>
      </div>

      {/* Verified Email Banner with "Change" Option (Shown on Step 2A and 2B) */}
      {step !== 'email' && step !== 'forgot' && step !== 'verify_otp' && step !== 'reset_new_password' && (
        <div className="mb-5 p-3 rounded-xl bg-slate-50 dark:bg-[#1A1F2B] border border-slate-200/80 dark:border-[#2A3140] flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <Mail className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] text-slate-400 dark:text-[#747C89] font-medium uppercase tracking-wider">
                {step === 'login' ? 'Existing Account' : 'New Account'}
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] truncate">
                {email}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetToEmail}
            className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 hover:underline px-2 py-1 rounded-md transition-colors cursor-pointer shrink-0"
          >
            <Edit2 className="w-3 h-3" />
            <span>Change</span>
          </button>
        </div>
      )}

      {/* Form Error Callout */}
      {errors.form && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
          <span>{errors.form}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STEP 1: EMAIL ENTRY */}
      {/* ========================================================================= */}
      {step === 'email' && (
        <form onSubmit={handleCheckEmail} className="space-y-4">
          <div>
            <label htmlFor="unified-email" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="unified-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                placeholder="name@example.com"
                required
                autoFocus
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#11141A] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#151921] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
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
            className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Checking...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          {/* Elegant Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-slate-200/80 dark:border-[#242A36]" />
            <span className="bg-white dark:bg-[#141820] px-3 text-xs text-slate-400 dark:text-[#747C89] font-medium select-none">
              or continue with
            </span>
          </div>

          {/* Google Sign-In at Bottom */}
          <GoogleSignInButton label="Continue with Google" />

          {/* Micro Footer Notice */}
          <p className="pt-2 text-center text-[11px] text-slate-400 dark:text-[#747C89] leading-relaxed">
            By continuing, you agree to AfterBuy's{' '}
            <Link to="/terms" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2">Terms</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 underline underline-offset-2">Privacy Policy</Link>.
          </p>
        </form>
      )}

      {/* ========================================================================= */}
      {/* STEP 2A: EXISTING USER LOGIN */}
      {/* ========================================================================= */}
      {step === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0]">
                Password
              </label>
              <button
                type="button"
                onClick={() => {
                  setStep('forgot');
                  setErrors({});
                }}
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
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
                autoFocus
                className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#11141A] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#151921] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
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

          <div className="flex items-center">
            <input
              id="unified-remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="unified-remember" className="ml-2 text-xs text-slate-600 dark:text-[#A9B0BC] cursor-pointer select-none">
              Remember me for 30 days
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Sign In to Dashboard
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          {/* Elegant Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-slate-200/80 dark:border-[#242A36]" />
            <span className="bg-white dark:bg-[#141820] px-3 text-xs text-slate-400 dark:text-[#747C89] font-medium select-none">
              or continue with
            </span>
          </div>

          {/* Google Sign-In at Bottom */}
          <GoogleSignInButton label="Continue with Google" />
        </form>
      )}

      {/* ========================================================================= */}
      {/* STEP 2B: NEW USER SIGNUP */}
      {/* ========================================================================= */}
      {step === 'signup' && (
        <form onSubmit={handleSignupSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label htmlFor="signup-name" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              Full Name
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
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#11141A] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#151921] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.name}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="signup-password" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              Create Password
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
                placeholder="At least 6 characters"
                required
                className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#11141A] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#151921] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
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

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2.5 space-y-1">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-[#1F242E] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strength.color.split(' ')[0]} transition-all duration-300`}
                    style={{ width: `${strength.percent}%` }}
                  />
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400 dark:text-[#747C89]">Password strength</span>
                  <span className={`font-semibold ${strength.color.split(' ')[1]}`}>
                    {strength.label}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start pt-1">
            <input
              id="unified-terms"
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
            <label htmlFor="unified-terms" className="ml-2 text-xs text-slate-600 dark:text-[#A9B0BC] select-none leading-relaxed">
              I agree to the{' '}
              <Link to="/terms" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Terms of Service
              </Link>{' '}
              and acknowledge the{' '}
              <Link to="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                Privacy Policy
              </Link>.
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-xs text-rose-600 dark:text-rose-400 font-medium">
              {errors.agreeTerms}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating your account...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>

          {/* Elegant Divider */}
          <div className="relative flex items-center justify-center my-6">
            <div className="w-full border-t border-slate-200/80 dark:border-[#242A36]" />
            <span className="bg-white dark:bg-[#141820] px-3 text-xs text-slate-400 dark:text-[#747C89] font-medium select-none">
              or continue with
            </span>
          </div>

          {/* Google Sign-In at Bottom */}
          <GoogleSignInButton label="Continue with Google" />
        </form>
      )}

      {/* ========================================================================= */}
      {/* STEP 3: FORGOT PASSWORD REQUEST (Enter email to receive OTP) */}
      {/* ========================================================================= */}
      {step === 'forgot' && (
        <form onSubmit={handleForgotPasswordRequest} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              Account Email Address
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
                placeholder="name@example.com"
                required
                autoFocus
                className="w-full h-11 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#11141A] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#151921] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
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
            className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
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
              onClick={() => {
                setStep('login');
                setErrors({});
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to Sign In
            </button>
          </div>
        </form>
      )}

      {/* ========================================================================= */}
      {/* STEP 4: ENTER 6-DIGIT OTP VERIFICATION CODE */}
      {/* ========================================================================= */}
      {step === 'verify_otp' && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            executeVerifyOtp();
          }}
          className="space-y-5"
        >
          {/* Target Email Indicator */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#1A1F2B] border border-slate-200/80 dark:border-[#2A3140] flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span className="text-xs font-semibold text-slate-900 dark:text-[#F5F7FA] truncate">
                {email}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setStep('forgot')}
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
                  onKeyDown={(e) => handleOtpKeyDown(idx, e.target)}
                  className="w-11 h-12 sm:w-12 sm:h-13 text-center text-lg sm:text-xl font-bold rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#11141A] text-slate-900 dark:text-[#F5F7FA] focus:bg-white dark:focus:bg-[#151921] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-150 select-all"
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
            className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-50"
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
              onClick={() => {
                setStep('login');
                setErrors({});
              }}
              className="inline-flex items-center gap-1 font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Cancel
            </button>

            {canResend ? (
              <button
                type="button"
                onClick={handleForgotPasswordRequest}
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
      {/* STEP 5: CREATE NEW PASSWORD (After OTP verified) */}
      {/* ========================================================================= */}
      {step === 'reset_new_password' && (
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
            <label htmlFor="new-password-otp" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="new-password-otp"
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: null }));
                }}
                placeholder="At least 6 characters"
                required
                autoFocus
                className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#11141A] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#151921] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.newPassword}
              </p>
            )}

            {/* Strength Bar */}
            {newPassword && (
              <div className="mt-2.5 space-y-1">
                <div className="h-1.5 w-full bg-slate-100 dark:bg-[#1F242E] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${newPassword.length < 6 ? 'bg-rose-500 w-1/3' : newPassword.length < 10 ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-full'} transition-all duration-300`}
                  />
                </div>
                <div className="flex justify-between text-[10px]">
                  <span className="text-slate-400 dark:text-[#747C89]">Strength</span>
                  <span className={`font-semibold ${newPassword.length < 6 ? 'text-rose-600' : newPassword.length < 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {newPassword.length < 6 ? 'Weak' : newPassword.length < 10 ? 'Good' : 'Strong'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirm-new-password-otp" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
              Confirm New Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="confirm-new-password-otp"
                type={showConfirmNewPassword ? 'text' : 'password'}
                value={confirmNewPassword}
                onChange={(e) => {
                  setConfirmNewPassword(e.target.value);
                  if (errors.confirmNewPassword) setErrors((prev) => ({ ...prev, confirmNewPassword: null }));
                }}
                placeholder="Re-type your new password"
                required
                className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#11141A] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#151921] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] cursor-pointer"
              >
                {showConfirmNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.confirmNewPassword && (
              <p className="mt-1.5 text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.confirmNewPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99] disabled:opacity-60"
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
              onClick={() => {
                setStep('login');
                setErrors({});
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Cancel and Back to Sign In
            </button>
          </div>
        </form>
      )}

    </div>
  );
};
