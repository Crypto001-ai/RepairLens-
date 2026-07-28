import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Wrench,
  CheckCircle2,
  Archive,
  Play,
  RotateCcw,
  Trash2,
  Clock,
  FileText,
  Printer,
  Share2,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  DollarSign,
  Award,
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { RepairItem, ActiveRepairSession } from '../../types';
import { repairSessionService } from '../../services/repairSessionService';

interface MyRepairsSectionProps {
  repairs: RepairItem[];
  activeSession: ActiveRepairSession | null;
  onContinueSession: (session: ActiveRepairSession | RepairItem) => void;
  onOpenNotebook: (item: RepairItem | ActiveRepairSession) => void;
  onUpdateRepairStatus: (id: string, newStatus: 'in_progress' | 'completed' | 'archived') => void;
  onDeleteRepair: (id: string) => void;
  onCancelActiveSession: () => Promise<void>;
  onStartDiagnosis?: () => void;
}

const PremiumEmptyState: React.FC<{
  title: string;
  description: string;
  onStartDiagnosis?: () => void;
}> = ({ title, description, onStartDiagnosis }) => (
  <div className="p-8 sm:p-12 rounded-3xl bg-[#111827] border border-[rgba(99,102,241,0.2)] text-center space-y-6 relative overflow-hidden shadow-xl my-2">
    {/* Background Glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none" />

    {/* Illustration Composition */}
    <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#6366F1]/20 via-[#10B981]/20 to-amber-500/20 animate-pulse" />
      <div className="relative w-16 h-16 rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.3)] shadow-lg flex items-center justify-center text-[#6366F1]">
        <Wrench className="w-8 h-8 text-[#10B981]" />
      </div>
      <div className="absolute -top-1 -right-1 p-1.5 rounded-lg bg-[#6366F1] text-white shadow-md">
        <Sparkles className="w-4 h-4 text-amber-300" />
      </div>
    </div>

    {/* Text Info */}
    <div className="space-y-2 max-w-md mx-auto relative z-10">
      <h3 className="text-lg sm:text-xl font-extrabold text-[#F9FAFB] tracking-tight">{title}</h3>
      <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed font-normal">{description}</p>
    </div>

    {/* Action Button */}
    {onStartDiagnosis && (
      <div className="pt-2 relative z-10 flex justify-center">
        <Button
          onClick={onStartDiagnosis}
          variant="primary"
          size="lg"
          className="font-extrabold px-6 py-3.5 shadow-lg shadow-indigo-950/50 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Sparkles className="w-4.5 h-4.5 mr-2 text-amber-300" /> Start Your First Diagnosis
        </Button>
      </div>
    )}
  </div>
);

export const MyRepairsSection: React.FC<MyRepairsSectionProps> = ({
  repairs,
  activeSession,
  onContinueSession,
  onOpenNotebook,
  onUpdateRepairStatus,
  onDeleteRepair,
  onCancelActiveSession,
  onStartDiagnosis,
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'archived'>('active');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Group repairs by status
  const activeRepairs = repairs.filter((r) => r.status === 'in_progress' || r.status === 'diagnosed');
  const completedRepairs = repairs.filter((r) => r.status === 'completed');
  const archivedRepairs = repairs.filter((r) => r.status === 'archived');

  // Check if activeSession exists and isn't already duplicated in activeRepairs
  const hasFirestoreActive =
    activeSession &&
    activeSession.status === 'active' &&
    !activeRepairs.some((r) => r.id === activeSession.repairSessionId);

  // Time ago formatter
  const formatTimeAgo = (dateStr?: string) => {
    if (!dateStr) return 'Recently';
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  };

  // Check if session is inactive for >= 7 days
  const isInactiveSevenDays = (dateStr?: string) => {
    if (!dateStr) return false;
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const SEVEN_DAYS = 7 * 24 * 60 * 60 * 1000;
    return diffMs >= SEVEN_DAYS;
  };

  const handleShareText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="rounded-3xl border border-[rgba(99,102,241,0.2)] bg-[#1A2035] p-6 sm:p-7 shadow-xl space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[rgba(99,102,241,0.15)] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#6366F1]/20 text-[#6366F1]">
              <Wrench className="w-4 h-4" />
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#F9FAFB] tracking-tight">
              My Repairs
            </h2>
          </div>
          <p className="text-xs text-[#9CA3AF] mt-1">
            Manage your active DIY sessions, completed fixes, and historical notebooks
          </p>
        </div>

        {/* 3 Main Tabs: Active | Completed | Archived */}
        <div className="flex items-center gap-1.5 bg-[#111827] p-1.5 rounded-2xl text-xs font-bold border border-[rgba(99,102,241,0.2)]">
          
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'active'
                ? 'bg-[#10B981] text-white shadow-md'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse" />
            <span>Active ({activeRepairs.length + (hasFirestoreActive ? 1 : 0)})</span>
          </button>

          <button
            onClick={() => setActiveTab('completed')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#6366F1] text-white shadow-md'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed ({completedRepairs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('archived')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'archived'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>Archived ({archivedRepairs.length})</span>
          </button>

        </div>
      </div>

      {/* TAB CONTENT 1: ACTIVE REPAIRS */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {activeRepairs.length === 0 && !hasFirestoreActive ? (
            <PremiumEmptyState
              title="No Active Repairs Right Now"
              description="When you start a new appliance diagnosis, your active step-by-step repair session will appear here."
              onStartDiagnosis={onStartDiagnosis}
            />
          ) : (
            <div className="space-y-4">
              
              {/* Active Firestore Session if present */}
              {hasFirestoreActive && activeSession && (
                <div className="p-5 rounded-2xl border border-[#10B981]/40 bg-[#111827] shadow-lg space-y-4 relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#10B981]/20 text-[#10B981]">
                        <Play className="w-5 h-5 fill-[#10B981]" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-[#F9FAFB]">
                            {activeSession.diagnosis?.appliance || 'Appliance'}
                          </h3>
                          <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold uppercase">
                            Firestore Live Session
                          </span>
                        </div>
                        <p className="text-xs text-[#9CA3AF]">
                          Fault: {activeSession.diagnosis?.likelyFault || 'Diagnosed issue'} • Last active {formatTimeAgo(activeSession.lastActivity || activeSession.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => onContinueSession(activeSession)}
                        variant="primary"
                        size="sm"
                        className="font-extrabold flex items-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" /> Continue Repair
                      </Button>
                      <Button
                        onClick={() => {
                          if (activeSession.repairSessionId) {
                            repairSessionService.updateSession(activeSession.repairSessionId, { status: 'archived' });
                          }
                        }}
                        variant="outline"
                        size="sm"
                        className="text-amber-400 hover:text-amber-300"
                      >
                        Archive
                      </Button>
                      <Button
                        onClick={onCancelActiveSession}
                        variant="ghost"
                        size="sm"
                        className="text-rose-400 hover:text-rose-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  {/* 7-Day Inactivity Prompt if applicable */}
                  {isInactiveSevenDays(activeSession.updatedAt || activeSession.createdAt) && (
                    <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>This repair has been inactive for 7 days. Would you like to continue it or archive it?</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          onClick={() => onContinueSession(activeSession)}
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-[11px] py-1 px-3"
                        >
                          Continue Repair
                        </Button>
                        <Button
                          onClick={() => {
                            if (activeSession.repairSessionId) {
                              repairSessionService.updateSession(activeSession.repairSessionId, { status: 'archived' });
                            }
                          }}
                          size="sm"
                          variant="outline"
                          className="text-amber-300 border-amber-500/30 text-[11px] py-1 px-3"
                        >
                          Archive
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#9CA3AF]">Progress</span>
                      <span className="text-[#10B981] font-bold">{activeSession.progressPercentage || 0}% Complete</span>
                    </div>
                    <div className="w-full bg-[#1A2035] rounded-full h-2 overflow-hidden border border-[rgba(99,102,241,0.15)]">
                      <div
                        className="bg-[#10B981] h-full rounded-full transition-all duration-500"
                        style={{ width: `${activeSession.progressPercentage || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Local Active Repairs */}
              {activeRepairs.map((repair) => (
                <div
                  key={repair.id}
                  className="p-5 rounded-2xl border border-[rgba(99,102,241,0.2)] bg-[#111827] shadow-sm space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-[#6366F1]/20 text-[#6366F1]">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-[#F9FAFB]">{repair.title}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-[#6366F1]/20 text-[#6366F1] text-[10px] font-bold uppercase">
                            {repair.applianceName}
                          </span>
                        </div>
                        <p className="text-xs text-[#9CA3AF]">
                          Severity: {repair.severity} • Last active {formatTimeAgo(repair.updatedAt || repair.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => onContinueSession(repair)}
                        variant="primary"
                        size="sm"
                        className="font-extrabold flex items-center gap-1.5"
                      >
                        <Wrench className="w-3.5 h-3.5" /> Continue
                      </Button>

                      <Button
                        onClick={() => onUpdateRepairStatus(repair.id, 'archived')}
                        variant="outline"
                        size="sm"
                        className="text-amber-400 hover:text-amber-300"
                      >
                        Archive
                      </Button>

                      <Button
                        onClick={() => onDeleteRepair(repair.id)}
                        variant="ghost"
                        size="sm"
                        className="text-rose-400 hover:text-rose-300"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>

                  {/* 7-Day Inactivity Warning for local repair */}
                  {isInactiveSevenDays(repair.updatedAt || repair.createdAt) && (
                    <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>This repair has been inactive for 7 days. Would you like to continue it or archive it?</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          onClick={() => onContinueSession(repair)}
                          size="sm"
                          className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-[11px] py-1 px-3"
                        >
                          Continue Repair
                        </Button>
                        <Button
                          onClick={() => onUpdateRepairStatus(repair.id, 'archived')}
                          size="sm"
                          variant="outline"
                          className="text-amber-300 border-amber-500/30 text-[11px] py-1 px-3"
                        >
                          Archive
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#9CA3AF]">Progress</span>
                      <span className="text-[#6366F1] font-bold">{repair.progressPercent}% Complete</span>
                    </div>
                    <div className="w-full bg-[#1A2035] rounded-full h-2 overflow-hidden border border-[rgba(99,102,241,0.15)]">
                      <div
                        className="bg-[#6366F1] h-full rounded-full transition-all duration-500"
                        style={{ width: `${repair.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 2: COMPLETED REPAIRS */}
      {activeTab === 'completed' && (
        <div className="space-y-4">
          {completedRepairs.length === 0 ? (
            <PremiumEmptyState
              title="No Completed Repairs Yet"
              description="Complete your first DIY repair session to earn your DIY Hero badge and see saved reports here!"
              onStartDiagnosis={onStartDiagnosis}
            />
          ) : (
            <div className="space-y-3">
              {completedRepairs.map((repair) => {
                const savedNairaVal = repair.estimatedSavingsNaira ?? (repair.estimatedSavingsDollars ? repair.estimatedSavingsDollars * 1150 : 0);
                const techFeeVal = repair.techFeeAvoidedNaira ?? (repair.estimatedSavingsNaira ? repair.estimatedSavingsNaira : (repair.estimatedSavingsDollars ? repair.estimatedSavingsDollars * 1300 : 0));
                const shareText = `Fixed my ${repair.applianceName} (${repair.title}) with RepairLens AI! Saved $${repair.estimatedSavingsDollars || 0} (₦${savedNairaVal.toLocaleString()})!`;
                return (
                  <div
                    key={repair.id}
                    className="p-5 rounded-2xl border border-[#10B981]/30 bg-[#111827] shadow-sm space-y-4 hover:border-[#10B981]/50 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-3.5">
                        <div className="p-3 rounded-xl bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] shrink-0">
                          <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-extrabold text-[#F9FAFB]">{repair.title}</h3>
                            <span className="px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-extrabold uppercase">
                              Verified Fix
                            </span>
                          </div>
                          <p className="text-xs text-[#9CA3AF]">
                            {repair.applianceName} • Completed on {new Date(repair.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Saved Stats */}
                      <div className="flex items-center gap-4 text-xs">
                        <div>
                          <span className="block font-extrabold text-[#10B981] text-sm font-mono">
                            +${repair.estimatedSavingsDollars || 0} Saved
                          </span>
                          <span className="text-[10px] text-teal-400 font-mono">
                            ₦{techFeeVal.toLocaleString()} Tech Fee Avoided
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-[rgba(99,102,241,0.15)] text-xs">
                      <Button
                        onClick={() => onOpenNotebook(repair)}
                        variant="primary"
                        size="sm"
                        className="flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Summary
                      </Button>

                      <Button
                        onClick={() => onOpenNotebook(repair)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 text-[#F9FAFB]"
                      >
                        <Printer className="w-3.5 h-3.5 text-[#9CA3AF]" /> Download PDF Report
                      </Button>

                      <Button
                        onClick={() => handleShareText(repair.id, shareText)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5 text-[#6366F1]"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        {copiedId === repair.id ? 'Copied Share Link!' : 'Share Achievement'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 3: ARCHIVED REPAIRS */}
      {activeTab === 'archived' && (
        <div className="space-y-4">
          {archivedRepairs.length === 0 ? (
            <PremiumEmptyState
              title="No Archived Repairs"
              description="Archived sessions or old diagnostic plans will be listed here for reference."
              onStartDiagnosis={onStartDiagnosis}
            />
          ) : (
            <div className="space-y-3">
              {archivedRepairs.map((repair) => (
                <div
                  key={repair.id}
                  className="p-5 rounded-2xl border border-[rgba(255,255,255,0.1)] bg-[#111827] space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
                        <Archive className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-extrabold text-[#F9FAFB]">{repair.title}</h3>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold uppercase">
                            Archived
                          </span>
                        </div>
                        <p className="text-xs text-[#9CA3AF]">
                          {repair.applianceName} • Archived on {new Date(repair.updatedAt || repair.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() => onOpenNotebook(repair)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1.5"
                      >
                        <FileText className="w-3.5 h-3.5" /> View Notebook
                      </Button>

                      <Button
                        onClick={() => onUpdateRepairStatus(repair.id, 'in_progress')}
                        variant="primary"
                        size="sm"
                        className="bg-[#10B981] hover:bg-[#059669] flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Restore to Active
                      </Button>

                      <Button
                        onClick={() => onDeleteRepair(repair.id)}
                        variant="ghost"
                        size="sm"
                        className="text-rose-400 hover:text-rose-300"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
