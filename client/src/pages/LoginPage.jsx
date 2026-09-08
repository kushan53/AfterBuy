import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  RotateCcw,
  BadgePercent,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useToast } from '../components/ui/Toast';
import { useAuth } from '../context/AuthContext';
import { GoogleSignInButton } from '../components/auth/GoogleSignInButton';
import { PublicFooter } from '../components/layout/PublicFooter';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errs.email = 'Please enter a valid email address';
    }
    if (!password) {
      errs.password = 'Password is required';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      const authenticatedUser = await login(email, password, rememberMe);
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

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F1115] flex flex-col justify-between text-slate-900 dark:text-[#F5F7FA] selection:bg-blue-100 selection:text-blue-700 transition-colors duration-200">
      {/* Top Navbar */}
      <header className="w-full border-b border-slate-200/80 dark:border-[#22262F] bg-white/90 dark:bg-[#11141A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600 text-white font-bold text-sm flex items-center justify-center tracking-wider shadow-xs">
              AB
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
                AFTERBUY
              </span>
              <span className="text-[10px] text-slate-400 dark:text-[#747C89] font-medium tracking-tight">
                Everything after you buy
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-slate-500 dark:text-[#A9B0BC] hidden sm:inline">New to AfterBuy?</span>
            <Link to="/signup">
              <Button variant="outline" size="small">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header text */}
          <div className="text-center space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-800/50 text-blue-700 dark:text-blue-300 text-[11px] font-semibold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Post-Purchase Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
              Welcome back
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] max-w-xs mx-auto">
              Sign in to manage your return deadlines, pending refunds, and active warranties.
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-[#171A21] p-4 sm:p-8 rounded-2xl border border-slate-200/90 dark:border-[#292E38] shadow-xl shadow-slate-900/5 dark:shadow-black/60">
            {errors.form && (
              <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-medium">
                {errors.form}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="name@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
                }}
                error={errors.email}
                required
              />

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 dark:text-slate-300 select-none">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    icon={Lock}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
                    }}
                    error={errors.password}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Symmetrical Action Row: Remember Me (Left) & Forgot Password (Right) */}
              <div className="flex items-center justify-between pt-0.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <span className="text-slate-600 dark:text-slate-400 text-xs">Remember me</span>
                </label>

                <a
                  href="#forgot"
                  onClick={(e) => {
                    e.preventDefault();
                    addToast({
                      title: 'Password Reset',
                      message: 'A password recovery link has been sent to your registered email.',
                      type: 'info',
                    });
                  }}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="large"
                className="w-full mt-2 font-semibold shadow-xs"
                disabled={loading}
                icon={ArrowRight}
                iconPosition="right"
              >
                {loading ? 'Signing in...' : 'Sign in to Dashboard'}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center my-4">
              <div className="border-t border-slate-200 dark:border-[#242A36] w-full" />
              <span className="bg-white dark:bg-[#171A21] px-3 text-[11px] font-semibold text-slate-400 dark:text-[#747C89] uppercase tracking-wider shrink-0">
                Or
              </span>
              <div className="border-t border-slate-200 dark:border-[#242A36] w-full" />
            </div>

            {/* Google Sign In */}
            <GoogleSignInButton label="Sign in with Google" />

            {/* Sign up prompt */}
            <div className="pt-4 text-center border-t border-slate-100 dark:border-[#242A36] mt-5">
              <p className="text-xs text-slate-500 dark:text-[#A9B0BC]">
                Don't have an account?{' '}
                <Link to="/signup" className="font-semibold text-blue-600 hover:text-blue-700">
                  Sign up free
                </Link>
              </p>
            </div>
          </div>

          {/* Guarantee / Security Note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>End-to-end encrypted • Zero commercial data sharing</span>
          </div>
        </div>
      </main>

      {/* Standardized 1-Line Footer */}
      <PublicFooter />
    </div>
  );
};
