import React, { useState } from 'react';
import { resetPassword } from '../../firebase/auth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Mail, CheckCircle, X, AlertCircle } from 'lucide-react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultEmail?: string;
}

export const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose, defaultEmail = '' }) => {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      console.error('Password reset failed:', err);
      setError(err.message || 'Failed to send reset email. Please check the address.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0F1E]/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] p-6 shadow-2xl space-y-4">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#9CA3AF] hover:text-[#F9FAFB] p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#111827] text-[#F9FAFB] border border-[rgba(99,102,241,0.2)]">
            <Mail className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#F9FAFB]">Reset Password</h3>
            <p className="text-xs text-[#9CA3AF]">We'll send you a password reset link.</p>
          </div>
        </div>

        {success ? (
          <div className="py-4 text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-[#10B981] mx-auto" />
            <p className="text-xs font-semibold text-[#F9FAFB]">
              Reset email sent to <span className="font-mono text-[#10B981]">{email}</span>.
            </p>
            <p className="text-xs text-[#9CA3AF]">Please check your inbox or spam folder.</p>
            <Button variant="outline" className="w-full mt-2" onClick={onClose}>
              Done
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4" />}
              required
            />

            <div className="flex gap-2 pt-2">
              <Button type="button" variant="ghost" className="w-1/2" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="w-1/2" isLoading={loading}>
                Send Link
              </Button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
