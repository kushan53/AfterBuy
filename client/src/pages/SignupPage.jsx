import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Lock,
  Mail,
  User,
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

export const SignupPage = () => {
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { signup } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
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

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Full name is required';
    }
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
    if (!confirmPassword) {
      errs.confirmPassword = 'Confirm password is required';
    } else if (password !== confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }
    if (!agreeTerms) {
      errs.agreeTerms = 'Please agree to terms to create account';
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
      const authenticatedUser = await signup(name, email, password);
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
            <span className="text-slate-500 dark:text-[#A9B0BC] hidden sm:inline">Already have an account?</span>
            <Link to="/login">
              <Button variant="outline" size="small">
                Sign in
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
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-800/50 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Free Personal SaaS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA]">
              Create your account
            </h1>
            <p className="text-xs text-slate-500 dark:text-[#A9B0BC] max-w-xs mx-auto">
              Never miss a return deadline, warranty claim, or stuck refund again.
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
              {/* Name */}
              <Input
                label="Full Name"
                type="text"
                icon={User}
                placeholder="e.g. John Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
                }}
                error={errors.name}
                required
              />

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
                <label className="text-xs font-medium text-slate-700 select-none">
                  Create Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    icon={Lock}
                    placeholder="At least 6 characters"
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

                {/* Password Strength Indicator */}
                {password && (
                  <div className="space-y-1 pt-1">
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${strength.color.split(' ')[0]}`}
                        style={{ width: `${strength.percent}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-semibold ${strength.color.split(' ')[1]}`}>
                      Password strength: {strength.label}
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-700 select-none">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    icon={Lock}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
                    }}
                    error={errors.confirmPassword}
                    className="pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => {
                      setAgreeTerms(e.target.checked);
                      if (errors.agreeTerms) setErrors((prev) => ({ ...prev, agreeTerms: null }));
                    }}
                    className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer mt-0.5"
                  />
                  <span className="text-[11px] text-slate-600 leading-normal">
                    I agree to the{' '}
                    <Link to="/terms" target="_blank" className="text-blue-600 font-semibold hover:underline">
                      Terms of Service
                    </Link>{' '}
                    and acknowledge the{' '}
                    <Link to="/privacy" target="_blank" className="text-blue-600 font-semibold hover:underline">
                      Consumer Privacy Policy
                    </Link>.
                  </span>
                </label>
                {errors.agreeTerms && (
                  <span className="text-[11px] text-rose-500 font-medium block mt-1">
                    {errors.agreeTerms}
                  </span>
                )}
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
                {loading ? 'Creating Account...' : 'Get Started Free'}
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

            {/* Google Sign Up */}
            <GoogleSignInButton label="Sign up with Google" />

            <div className="pt-4 text-center border-t border-slate-100 dark:border-[#242A36] mt-5">
              <p className="text-xs text-slate-500 dark:text-[#A9B0BC]">
                Already registered?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>

          {/* Guarantee / Security Note */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Independent personal SaaS • No bank account link required</span>
          </div>
        </div>
      </main>

      {/* Standardized 1-Line Footer */}
      <PublicFooter />
    </div>
  );
};
