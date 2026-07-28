import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfileData } from '../../firebase/auth';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { User, Mail, ShieldCheck, Award, DollarSign, CheckCircle, Sparkles, Check } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [displayName, setDisplayName] = useState(profile?.displayName || user?.displayName || '');
  const [diyLevel, setDiyLevel] = useState<'beginner' | 'intermediate' | 'expert'>(profile?.diyLevel || 'intermediate');
  const [loading, setLoading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setSavedSuccess(false);

    try {
      await updateUserProfileData(user.uid, {
        displayName,
        diyLevel,
      });
      await refreshProfile();
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F9FAFB] pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-[#F9FAFB] tracking-tight">Your Profile</h1>
          <p className="text-xs text-[#9CA3AF]">Manage your DIY credentials and account identity</p>
        </div>

        {/* Profile Identity Card */}
        <div className="rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[rgba(99,102,241,0.15)] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#6366F1] text-white flex items-center justify-center font-bold text-2xl uppercase shadow-md shrink-0">
                {profile?.displayName ? profile.displayName[0] : user?.email ? user.email[0] : 'U'}
              </div>
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-[#F9FAFB]">
                  {profile?.displayName || user?.email?.split('@')[0]}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                  <Mail className="w-3.5 h-3.5" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-bold border border-[#10B981]/30">
              <Award className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="capitalize">{diyLevel} DIYer</span>
            </div>
          </div>

          {/* Impact Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.15)] space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Total Savings</span>
              <div className="text-xl font-extrabold text-[#10B981] font-mono">
                ${profile?.totalSavedDollars || 635}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.15)] space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Technician Fees Avoided</span>
              <div className="text-xl font-extrabold text-teal-400 font-mono">
                ₦{(profile?.totalTechFeesAvoidedNaira || (profile?.totalSavedNaira ? profile.totalSavedNaira : 0)).toLocaleString()}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.15)] space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#9CA3AF]">Fixed Appliances</span>
              <div className="text-xl font-extrabold text-[#6366F1] font-mono">
                {profile?.completedRepairsCount || 3} Units
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 border-t border-[rgba(99,102,241,0.15)]">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">Account Details</h3>

            <Input
              label="Display Name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              icon={<User className="w-4 h-4" />}
            />

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
                Self-Assessed DIY Repair Experience
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(['beginner', 'intermediate', 'expert'] as const).map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setDiyLevel(level)}
                    className={`py-2.5 px-3 rounded-xl border text-xs font-semibold capitalize transition-colors ${
                      diyLevel === level
                        ? 'bg-[#6366F1] text-white border-[#6366F1] shadow-2xs'
                        : 'bg-[#111827] text-[#9CA3AF] border-[rgba(99,102,241,0.2)] hover:bg-[#0A0F1E] hover:text-[#F9FAFB]'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-bold text-[#10B981] flex items-center gap-1">
                  <Check className="w-4 h-4" /> Profile updated successfully!
                </span>
              ) : (
                <span className="text-xs text-[#6B7280]">Changes sync instantly with your account.</span>
              )}

              <Button type="submit" variant="primary" isLoading={loading}>
                Save Changes
              </Button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
