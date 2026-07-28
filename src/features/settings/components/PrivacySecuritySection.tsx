import React, { useState } from 'react';
import { ShieldCheck, Lock, Key, Smartphone, LogOut, Trash2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';
import { resetPassword } from '../../../firebase/auth';
import { UserSessionInfo } from '../types';

interface PrivacySecuritySectionProps {
  showToast: (text: string, type?: 'success' | 'error') => void;
  onRequestDeleteAccount: () => void;
}

const MOCK_ACTIVE_SESSIONS: UserSessionInfo[] = [
  {
    id: 's-1',
    device: 'Linux Workstation',
    browser: 'Chrome 126.0 (Desktop)',
    location: 'Lagos, Nigeria 🇳🇬',
    ipAddress: '102.89.23.11',
    lastActive: 'Active Now (Current Session)',
    isCurrent: true,
  },
  {
    id: 's-2',
    device: 'iPhone 15 Pro',
    browser: 'Safari Mobile 17.4',
    location: 'Lagos, Nigeria 🇳🇬',
    ipAddress: '102.89.44.89',
    lastActive: '2 hours ago',
    isCurrent: false,
  },
  {
    id: 's-3',
    device: 'MacBook Air M2',
    browser: 'Chrome 125.0',
    location: 'Abuja, Nigeria 🇳🇬',
    ipAddress: '197.210.12.50',
    lastActive: '3 days ago',
    isCurrent: false,
  },
];

export const PrivacySecuritySection: React.FC<PrivacySecuritySectionProps> = ({
  showToast,
  onRequestDeleteAccount,
}) => {
  const { user, logout } = useAuth();
  const [resetSent, setResetSent] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [sessions, setSessions] = useState<UserSessionInfo[]>(MOCK_ACTIVE_SESSIONS);
  const [signingOutSessions, setSigningOutSessions] = useState(false);

  const handlePasswordReset = async () => {
    if (!user?.email) {
      showToast('No user email associated with this account.', 'error');
      return;
    }
    setResetLoading(true);
    try {
      await resetPassword(user.email);
      setResetSent(true);
      showToast(`Password reset link sent to ${user.email}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to send password reset email.', 'error');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSignOutAllDevices = async () => {
    setSigningOutSessions(true);
    setTimeout(async () => {
      setSessions((prev) => prev.filter((s) => s.isCurrent));
      setSigningOutSessions(false);
      showToast('Successfully signed out of all other remote sessions!', 'success');
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[#F9FAFB] flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#6366F1]" />
          Privacy & Security
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Manage login credentials, connected OAuth providers, active browser sessions, and account data deletion.
        </p>
      </div>

      {/* Change Password Card */}
      <div className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[rgba(99,102,241,0.15)] pb-3">
          <Lock className="w-4 h-4 text-[#6366F1]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
            Password & Authentication
          </h3>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#F9FAFB] block">Password Reset Link</span>
            <span className="text-[11px] text-[#9CA3AF] block mt-0.5">
              Send an instant secure password reset email to <span className="text-[#F9FAFB] font-mono">{user?.email || 'your registered email'}</span>
            </span>
          </div>

          {resetSent ? (
            <span className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#10B981]/15 text-[#10B981] text-xs font-bold border border-[#10B981]/30">
              <CheckCircle2 className="w-4 h-4" /> Reset Email Sent!
            </span>
          ) : (
            <button
              type="button"
              onClick={handlePasswordReset}
              disabled={resetLoading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.3)] hover:bg-[#6366F1] hover:border-[#6366F1] text-white text-xs font-bold transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {resetLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Key className="w-3.5 h-3.5" />
              )}
              Send Password Reset
            </button>
          )}
        </div>
      </div>

      {/* Connected Providers */}
      <div className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[rgba(99,102,241,0.15)] pb-3">
          <Key className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
            Connected Identity Providers
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl border border-[rgba(99,102,241,0.15)] bg-[#111827] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-xs text-white">
                G
              </div>
              <div>
                <span className="text-xs font-bold text-[#F9FAFB] block">Google Account</span>
                <span className="text-[10px] text-[#9CA3AF]">Google OAuth Provider</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#10B981] font-bold">
              CONNECTED
            </span>
          </div>

          <div className="p-3.5 rounded-xl border border-[rgba(99,102,241,0.15)] bg-[#111827] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#6366F1]/20 flex items-center justify-center font-bold text-xs text-[#6366F1]">
                ✉️
              </div>
              <div>
                <span className="text-xs font-bold text-[#F9FAFB] block">Email & Password</span>
                <span className="text-[10px] text-[#9CA3AF]">Firebase Auth</span>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#10B981] font-bold">
              ACTIVE
            </span>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(99,102,241,0.15)] pb-3">
          <div className="flex items-center gap-2.5">
            <Smartphone className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
              Active Browser Sessions ({sessions.length})
            </h3>
          </div>

          {sessions.length > 1 && (
            <button
              type="button"
              onClick={handleSignOutAllDevices}
              disabled={signingOutSessions}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out All Devices
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {sessions.map((s) => (
            <div
              key={s.id}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                s.isCurrent
                  ? 'border-[#6366F1]/40 bg-[#111827]'
                  : 'border-[rgba(99,102,241,0.1)] bg-[#111827]/50'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F9FAFB]">{s.device}</span>
                  {s.isCurrent && (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded-md bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30">
                      CURRENT DEVICE
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#9CA3AF]">
                  {s.browser} • {s.location} ({s.ipAddress})
                </p>
              </div>

              <span className="text-[11px] font-mono text-[#9CA3AF]">{s.lastActive}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Danger Zone: Delete Account */}
      <div className="p-5 rounded-2xl border border-red-500/30 bg-red-950/20 space-y-4">
        <div className="flex items-center gap-2.5 border-b border-red-500/20 pb-3">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400">
              Danger Zone
            </h3>
            <p className="text-[11px] text-[#9CA3AF]">Irreversible account actions</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#F9FAFB] block">Delete Account & Saved Repairs</span>
            <span className="text-[11px] text-[#9CA3AF] block mt-0.5">
              Permanently erase your RepairLens profile, active diagnostic sessions, and savings history.
            </span>
          </div>

          <button
            type="button"
            onClick={onRequestDeleteAccount}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md hover:shadow-red-500/25 transition-all cursor-pointer whitespace-nowrap"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};
