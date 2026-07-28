import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerWithEmail, loginWithGoogle } from '../../firebase/auth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Mail, Lock, User, AlertCircle, ArrowRight, CheckCircle2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { RepairLensLogo } from '../../components/common/RepairLensLogo';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  // Password rules
  const passwordRules = [
    { id: 'len', label: 'At least 8 characters', met: password.length >= 8 },
    { id: 'upper', label: 'At least one uppercase letter (A-Z)', met: /[A-Z]/.test(password) },
    { id: 'lower', label: 'At least one lowercase letter (a-z)', met: /[a-z]/.test(password) },
    { id: 'num', label: 'At least one number (0-9)', met: /[0-9]/.test(password) },
    { id: 'special', label: 'At least one special character (!@#$%^&*)', met: /[!@#$%^&*]/.test(password) },
  ];

  const metCount = passwordRules.filter((r) => r.met).length;
  const allRulesMet = metCount === passwordRules.length;

  // Rules visibility: shown when password field is focused or when password typed and rules not yet met
  const showRules = isPasswordFocused || (password.length > 0 && !allRulesMet);

  // Strength meter calculations
  let strengthLabel = '';
  let strengthLabelColor = 'text-[#6B7280]';
  let strengthBarColor = 'bg-slate-700';

  if (metCount > 0) {
    if (metCount <= 2) {
      strengthLabel = 'Weak';
      strengthLabelColor = 'text-rose-400';
      strengthBarColor = 'bg-rose-500';
    } else if (metCount <= 4) {
      strengthLabel = 'Medium';
      strengthLabelColor = 'text-amber-400';
      strengthBarColor = 'bg-amber-500';
    } else {
      strengthLabel = 'Strong';
      strengthLabelColor = 'text-emerald-400';
      strengthBarColor = 'bg-emerald-500';
    }
  }

  // Confirm password validation
  const hasConfirmInput = confirmPasswordTouched || confirmPassword.length > 0;
  const passwordsMatch = hasConfirmInput && confirmPassword.length > 0 && confirmPassword === password;
  const passwordsMismatch = hasConfirmInput && confirmPassword.length > 0 && confirmPassword !== password;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!displayName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }

    if (!allRulesMet) {
      setError('Password does not meet all strength requirements.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setError('You must accept the terms of service to create an account.');
      return;
    }

    setLoading(true);
    try {
      await registerWithEmail(email, password, displayName);
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already registered. Try signing in instead.');
      } else {
        setError(err.message || 'Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Google register error:', err);
      setError(err.message || 'Google sign-up failed.');
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
          <h1 className="text-xl font-extrabold text-[#F9FAFB] tracking-tight">Create Free Account</h1>
          <p className="text-xs text-[#9CA3AF]">Diagnose household appliances with AI safety guidance</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Google Sign-Up Button */}
        <button
          type="button"
          onClick={handleGoogleRegister}
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
          {googleLoading ? 'Connecting to Google...' : 'Sign Up with Google'}
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center">
          <div className="w-full border-t border-[rgba(99,102,241,0.15)]" />
          <span className="absolute bg-[#1A2035] px-3 text-[10px] font-semibold uppercase tracking-wider text-[#6B7280]">
            or email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <Input
            label="Full Name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Alex Johnson"
            icon={<User className="w-4 h-4" />}
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="alexjohnson@gmail.com"
            icon={<Mail className="w-4 h-4" />}
            required
          />

          {/* Password Input */}
          <div className="space-y-2">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
              placeholder="Create a strong password"
              icon={<Lock className="w-4 h-4" />}
              required
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#6B7280] hover:text-[#F9FAFB] transition-colors focus:outline-none p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />

            {/* Password Rules */}
            {showRules && (
              <div className="p-3 rounded-xl bg-[#111827]/80 border border-[rgba(99,102,241,0.15)] space-y-1.5 transition-all duration-200">
                <p className="text-[11px] font-semibold text-[#9CA3AF] mb-1">Password must contain:</p>
                {passwordRules.map((rule) => (
                  <div
                    key={rule.id}
                    className={`flex items-center gap-2 text-xs transition-colors duration-200 ${
                      rule.met ? 'text-emerald-400 font-medium' : 'text-[#6B7280]'
                    }`}
                  >
                    <span className="font-bold text-xs">{rule.met ? '✓' : '✗'}</span>
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Strength Meter */}
            {password.length > 0 && (
              <div className="space-y-1 pt-1">
                <div className="flex items-center justify-between text-[11px] font-semibold">
                  <span className="text-[#9CA3AF]">Password Strength:</span>
                  <span className={strengthLabelColor}>{strengthLabel}</span>
                </div>
                <div className="w-full h-1.5 bg-[#111827] rounded-full overflow-hidden border border-[rgba(99,102,241,0.15)]">
                  <div
                    className={`h-full transition-all duration-300 ease-out rounded-full ${strengthBarColor}`}
                    style={{ width: `${(metCount / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (!confirmPasswordTouched) setConfirmPasswordTouched(true);
            }}
            placeholder="Re-enter your password"
            icon={<Lock className="w-4 h-4" />}
            required
            error={passwordsMismatch ? 'Passwords do not match' : undefined}
            success={passwordsMatch}
            rightElement={
              <div className="flex items-center gap-1.5">
                {passwordsMatch && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#6B7280] hover:text-[#F9FAFB] transition-colors focus:outline-none p-1"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            }
          />

          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 rounded text-[#6366F1] focus:ring-[#6366F1] border-[rgba(99,102,241,0.3)] bg-[#111827] w-3.5 h-3.5"
              />
              <span className="text-xs text-[#9CA3AF] leading-tight">
                I agree to RepairLens AI's Terms of Service and Safety Disclaimer.
              </span>
            </label>
          </div>

          <Button type="submit" variant="primary" className="w-full" isLoading={loading}>
            Create Account <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* Footer Toggle */}
        <div className="pt-2 text-center text-xs text-[#9CA3AF]">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#F9FAFB] hover:underline">
            Sign In
          </Link>
        </div>

      </div>
    </div>
  );
};

