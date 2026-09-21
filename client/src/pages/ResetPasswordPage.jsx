import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, AlertTriangle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import { apiRequest } from '../utils/api';
import { PublicFooter } from '../components/layout/PublicFooter';

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const { addToast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Password strength calculation
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: '', percent: 0 };
    if (password.length < 6) return { label: 'Weak', color: 'bg-rose-500 text-rose-600', percent: 33 };
    if (password.length < 10) return { label: 'Good', color: 'bg-amber-500 text-amber-600', percent: 66 };
    return { label: 'Strong', color: 'bg-emerald-500 text-emerald-600', percent: 100 };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please retype carefully.');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
      });

      if (res.success) {
        setSuccess(true);
        if (res.token && res.user) {
          setSession(res.token, res.user);
        }
        addToast({
          title: 'Password Reset Complete',
          message: 'Your password has been updated. Welcome back to AfterBuy!',
          type: 'success',
        });
        setTimeout(() => {
          navigate('/app/dashboard');
        }, 1200);
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired reset link. Please request a new one.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/80 dark:bg-[#0B0E14] flex flex-col justify-between text-slate-900 dark:text-[#F5F7FA] relative overflow-hidden selection:bg-blue-100 selection:text-blue-700 transition-colors duration-200">
      {/* Ambient Lighting Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-80 bg-gradient-to-b from-blue-100/60 via-indigo-50/20 to-transparent dark:from-blue-900/15 dark:via-transparent pointer-events-none blur-3xl -z-10" />

      {/* Top Navbar */}
      <header className="w-full border-b border-slate-200/80 dark:border-[#1E2430] bg-white/80 dark:bg-[#0E121A]/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center tracking-wider shadow-sm">
              AB
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-[#F5F7FA] leading-tight">
                AFTERBUY
              </span>
              <span className="text-[10px] text-slate-400 dark:text-[#747C89] font-medium tracking-tight">
                Everything after you buy
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3 text-xs">
            <Link to="/login" className="text-slate-500 dark:text-[#A9B0BC] hover:text-slate-900 dark:hover:text-white font-medium transition-colors">
              ← Back to Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-[420px]">
          <div className="bg-white dark:bg-[#141820] rounded-2xl border border-slate-200/80 dark:border-[#242A36] shadow-xl shadow-slate-200/50 dark:shadow-black/60 p-7 sm:p-9 transition-all duration-200">
            
            {/* Brand Icon Header */}
            <div className="flex flex-col items-center text-center mb-7">
              <div className="w-12 h-12 mb-4 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 ring-4 ring-blue-50 dark:ring-blue-950/40">
                <span className="font-extrabold text-base tracking-wider">AB</span>
              </div>

              <h1 className="text-2xl font-bold text-slate-900 dark:text-[#F5F7FA] tracking-tight">
                {success ? 'Password Reset!' : 'Set new password'}
              </h1>

              <p className="text-sm text-slate-500 dark:text-[#A9B0BC] mt-1.5 max-w-xs mx-auto">
                {success
                  ? 'Your password has been changed. Redirecting to dashboard...'
                  : 'Enter a strong password to secure your account.'}
              </p>
            </div>

            {/* If no token was found in URL query */}
            {!token && !success && (
              <div className="text-center py-4 space-y-4">
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-800 dark:text-amber-200 leading-relaxed text-left flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <div>
                    <span className="font-semibold block mb-0.5">Missing Reset Token</span>
                    This password reset link appears incomplete or corrupted. Please request a new password reset link from the sign-in page.
                  </div>
                </div>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 w-full h-11 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Return to Sign In
                </Link>
              </div>
            )}

            {/* Success State */}
            {success && (
              <div className="text-center py-4 space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <p className="text-xs text-slate-500 dark:text-[#A9B0BC]">
                  Redirecting you straight into your post-purchase dashboard...
                </p>
              </div>
            )}

            {/* Password Reset Form */}
            {token && !success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <span>{error}</span>
                  </div>
                )}

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
                        if (error) setError(null);
                      }}
                      placeholder="At least 6 characters"
                      required
                      autoFocus
                      className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#11141A] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#151921] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Strength Bar */}
                  {password && (
                    <div className="mt-2.5 space-y-1">
                      <div className="h-1.5 w-full bg-slate-100 dark:bg-[#1F242E] rounded-full overflow-hidden">
                        <div
                          className={`h-full ${strength.color.split(' ')[0]} transition-all duration-300`}
                          style={{ width: `${strength.percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400 dark:text-[#747C89]">Strength</span>
                        <span className={`font-semibold ${strength.color.split(' ')[1]}`}>
                          {strength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirm-password" className="block text-xs font-semibold text-slate-700 dark:text-[#E2E8F0] mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      placeholder="Re-type your password"
                      required
                      className="w-full h-11 pl-10 pr-11 rounded-xl border border-slate-200 dark:border-[#2D333F] bg-slate-50/60 dark:bg-[#11141A] text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 text-sm focus:bg-white dark:focus:bg-[#151921] focus:outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-[#F5F7FA] cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
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
                      Update Password & Sign In
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  )}
                </button>

                <div className="pt-2 text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-[#A9B0BC] hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    Back to Sign In
                  </Link>
                </div>
              </form>
            )}

          </div>
        </div>
      </main>

      {/* Standardized 1-Line Footer */}
      <PublicFooter />
    </div>
  );
};

export default ResetPasswordPage;
