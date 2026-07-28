import React, { useState } from 'react';
import { UserCheck, Mail, Calendar, Sparkles, Clock, Copy, Check, Shield } from 'lucide-react';
import { useAuth } from '../../../hooks/useAuth';

interface AccountSectionProps {
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export const AccountSection: React.FC<AccountSectionProps> = ({ showToast }) => {
  const { user, profile } = useAuth();
  const [copiedUid, setCopiedUid] = useState(false);

  const uid = user?.uid || profile?.uid || 'usr_demo_33df3709_e4d5';
  const email = user?.email || profile?.email || 'user@example.com';
  const creationDate = profile?.createdAt
    ? new Date(profile.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'July 12, 2024';

  const lastLoginFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleCopyUid = () => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(true);
    showToast('User ID copied to clipboard!', 'success');
    setTimeout(() => setCopiedUid(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[#F9FAFB] flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-[#6366F1]" />
          Account & Plan Information
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Detailed overview of your registered credentials, current plan tier, and account metadata.
        </p>
      </div>

      {/* Main Account Details Card */}
      <div className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(99,102,241,0.15)] pb-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
              Account Profile
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold">
            VERIFIED MEMBER
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email */}
          <div className="p-3.5 rounded-xl border border-[rgba(99,102,241,0.1)] bg-[#111827] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#6366F1]" /> Registered Email
            </span>
            <div className="text-xs font-bold text-[#F9FAFB] font-mono break-all">{email}</div>
          </div>

          {/* Current Plan */}
          <div className="p-3.5 rounded-xl border border-[rgba(99,102,241,0.1)] bg-[#111827] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Current Plan
            </span>
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#F9FAFB]">
                DIY Hero Pro <span className="text-[10px] text-[#10B981] font-mono">(Community Free)</span>
              </span>
              <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
                UNLIMITED REPAIRS
              </span>
            </div>
          </div>

          {/* Account Creation Date */}
          <div className="p-3.5 rounded-xl border border-[rgba(99,102,241,0.1)] bg-[#111827] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Account Created
            </span>
            <div className="text-xs font-bold text-[#F9FAFB]">{creationDate}</div>
          </div>

          {/* Last Login */}
          <div className="p-3.5 rounded-xl border border-[rgba(99,102,241,0.1)] bg-[#111827] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-purple-400" /> Last Active Login
            </span>
            <div className="text-xs font-bold text-[#F9FAFB]">{lastLoginFormatted}</div>
          </div>
        </div>

        {/* User ID Section */}
        <div className="p-3.5 rounded-xl border border-[rgba(99,102,241,0.15)] bg-[#111827] flex items-center justify-between gap-3">
          <div className="space-y-0.5 overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
              Unique System User ID (UID)
            </span>
            <span className="text-xs font-mono text-[#F9FAFB] block truncate">{uid}</span>
          </div>

          <button
            type="button"
            onClick={handleCopyUid}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#6366F1]/20 border border-[#6366F1]/40 hover:bg-[#6366F1] text-white text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            {copiedUid ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedUid ? 'Copied' : 'Copy UID'}
          </button>
        </div>
      </div>
    </div>
  );
};
