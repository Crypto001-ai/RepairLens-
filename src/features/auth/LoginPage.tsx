import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail, loginWithGoogle } from '../../firebase/auth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { Mail, Lock, AlertCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { RepairLensLogo } from '../../components/common/RepairLensLogo';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgotModalOpen, setForgotModalOpen] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password. Please try again or sign up.');
      } else {
        setError(err.message || 'Login failed. Please check your credentials.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError(err.message || 'Google sign-in was cancelled or failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[#0A0F1E] flex flex-col items-center justify-center p-4 relative">
      <Link
        to="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-1.5 text-xs text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Home</span>
      </Link>

      <div className="w-full max-w-md bg-[#1A2035] border border-[rgba(99,102,241,0.15)] rounded-2xl p-6 sm:p-8 shadow-xl space-y-6 my-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto flex justify-center">
            <RepairLensLogo className="w-11 h-11" />
          </div>
          <h1 className="text-xl font-extrabold text-[#F9FAFB] tracking-tight">Welcome Back</h1>
          <p className="text-xs text-[#9CA3AF]">Sign in to manage your household appliance diagnostics</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] hover:bg-[#0A0F1E] text-[#F9FAFB] font-semibold text-xs transition-colors shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#6366F1]"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[rgba(99,102,241,0.15)]" />
          <span className="absolute bg-[#1A2035] px-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
            or email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <div className="space-y-1">
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock className="w-4 h-4" />}
              required
            />
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#6366F1] focus:ring-[#6366F1] border-[rgba(99,102,241,0.3)] bg-[#111827] w-3.5 h-3.5"
                />
                <span className="text-xs text-[#9CA3AF] font-medium">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => setForgotModalOpen(true)}
                className="text-xs font-semibold text-[#10B981] hover:underline"
              >
                Forgot password?
              </button>
            </div>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Sign In <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Footer Toggle */}
        <div className="pt-2 text-center text-xs text-[#9CA3AF]">
          Don't have an account?{' '}
          <Link to="/register" className="font-bold text-[#F9FAFB] hover:underline">
            Create Free Account
          </Link>
        </div>

      </div>

      <ForgotPasswordModal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        defaultEmail={email}
      />
    </div>
  );
};
