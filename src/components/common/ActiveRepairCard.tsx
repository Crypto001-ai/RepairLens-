import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  Play,
  X,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { Button } from './Button';
import { ActiveRepairSession } from '../../types';
import { useAuth } from '../../hooks/useAuth';

interface ActiveRepairCardProps {
  session: ActiveRepairSession;
  onContinue: () => void;
  onDismiss: () => void;
  onCancelSession: () => Promise<void>;
}

export const ActiveRepairCard: React.FC<ActiveRepairCardProps> = ({
  session,
  onContinue,
  onDismiss,
  onCancelSession,
}) => {
  const { profile, user } = useAuth();
  const [showCancelModal, setShowCancelModal] = useState<boolean>(false);
  const [isCancelling, setIsCancelling] = useState<boolean>(false);

  const displayName =
    profile?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Member';

  const applianceName = session.diagnosis?.appliance || 'Appliance';
  const likelyFault = session.diagnosis?.likelyFault || 'Diagnosed Issue';
  const totalSteps = session.diagnosis?.steps?.length || 5;
  const completedCount = session.completedSteps?.length || 0;
  const remainingSteps = Math.max(0, totalSteps - completedCount);
  const progressPercent =
    session.progressPercentage ?? Math.round((completedCount / totalSteps) * 100);

  // Estimate remaining time
  const totalEstMinutes = session.diagnosis?.estimatedTimeMinutes || 25;
  const remainingMinutes =
    totalSteps > 0
      ? Math.round(totalEstMinutes * (remainingSteps / totalSteps))
      : 10;
  const estRemainingTime = session.estimatedRemainingTime || `~${remainingMinutes || 10} mins remaining`;

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    try {
      await onCancelSession();
    } catch (err) {
      console.error('Error cancelling session:', err);
    } finally {
      setIsCancelling(false);
      setShowCancelModal(false);
    }
  };

  // Format last activity string
  const lastActiveText = (() => {
    const rawTime = session.lastActivity || session.updatedAt || session.createdAt;
    if (!rawTime) return 'Last active recently';
    const diffMs = Date.now() - new Date(rawTime).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Last active just now';
    if (diffMins < 60) return `Last active ${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `Last active ${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `Last active ${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  })();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -16, scale: 0.98 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full overflow-hidden rounded-3xl bg-[#1A2035]/90 backdrop-blur-xl border border-[rgba(99,102,241,0.3)] shadow-[0_12px_40px_rgba(0,0,0,0.4)] p-6 md:p-7 text-[#F9FAFB]"
      >
        {/* Subtle Ambient Glow Effect */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#6366F1]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#10B981]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10B981]"></span>
            </span>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-bold uppercase tracking-wider">
              <Play className="w-3 h-3 fill-[#10B981]" />
              <span>Active Repair Session</span>
            </div>
          </div>

          {/* Dismiss (X) Button */}
          <button
            onClick={onDismiss}
            title="Dismiss card (will show again on return)"
            className="p-2 rounded-xl bg-[#111827]/60 text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#111827] border border-[rgba(255,255,255,0.08)] transition-all cursor-pointer group"
          >
            <X className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Welcome Back & Appliance Info */}
        <div className="space-y-1.5 mb-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[#6366F1] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>👋 Welcome back, {displayName}</span>
            </p>
            <span className="text-[11px] font-mono text-[#9CA3AF] bg-[#111827] px-2.5 py-1 rounded-lg border border-[rgba(99,102,241,0.15)]">
              {lastActiveText}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#F9FAFB] tracking-tight">
            {applianceName} <span className="text-[#9CA3AF] font-normal">• {likelyFault}</span>
          </h2>
          <p className="text-xs text-[#9CA3AF]">Continue where you left off.</p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5 p-3.5 rounded-2xl bg-[#111827]/70 border border-[rgba(99,102,241,0.15)] text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">Progress</span>
            <div className="font-extrabold text-[#F9FAFB] font-mono text-sm flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
              {completedCount} of {totalSteps} steps ({progressPercent}%)
            </div>
          </div>

          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">Remaining</span>
            <div className="font-extrabold text-[#F9FAFB] font-mono text-sm">
              {remainingSteps} {remainingSteps === 1 ? 'step' : 'steps'} left
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 space-y-0.5">
            <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider">Est. Time</span>
            <div className="font-extrabold text-[#F9FAFB] font-mono text-sm flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-[#6366F1]" />
              {estRemainingTime}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-6">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-[#9CA3AF]">Repair Progress</span>
            <span className="text-[#10B981] font-bold">{progressPercent}% Complete</span>
          </div>
          <div className="w-full bg-[#111827] rounded-full h-2.5 overflow-hidden border border-[rgba(99,102,241,0.2)]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-gradient-to-r from-[#10B981] via-[#0EA5E9] to-[#6366F1] h-full rounded-full shadow-[0_0_12px_#10b981]"
            />
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            onClick={() => setShowCancelModal(true)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer text-center"
          >
            Cancel Session
          </button>

          <Button
            onClick={onContinue}
            variant="primary"
            size="md"
            className="w-full sm:w-auto font-extrabold px-6 py-2.5 shadow-lg shadow-indigo-900/40 flex items-center justify-center gap-2"
          >
            <Wrench className="w-4 h-4" />
            <span>Continue Repair</span>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Cancel Session Confirmation Dialog */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md rounded-3xl bg-[#1A2035] border border-rose-500/30 p-6 sm:p-7 shadow-2xl space-y-5 text-[#F9FAFB]"
            >
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-[#F9FAFB]">
                    Cancel Repair Session?
                  </h3>
                  <p className="text-xs text-rose-300 font-medium">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Your repair progress will be lost. You can always start a new diagnosis later.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={isCancelling}
                  className="px-4 py-2.5 rounded-xl bg-[#111827] text-xs font-bold text-[#F9FAFB] hover:bg-[#20293a] border border-[rgba(255,255,255,0.1)] transition-all cursor-pointer"
                >
                  Keep Repair
                </button>

                <button
                  onClick={handleConfirmCancel}
                  disabled={isCancelling}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-950/50 transition-all cursor-pointer flex items-center gap-2"
                >
                  {isCancelling ? 'Cancelling...' : 'Yes, Cancel Session'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
