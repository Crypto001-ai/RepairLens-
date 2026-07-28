import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';
import { useActiveRepairSession } from '../../hooks/useActiveRepairSession';
import { Button } from '../../components/common/Button';
import { DiagnosticModal } from '../../components/diagnosis/DiagnosticModal';
import { ActiveRepairCard } from '../../components/common/ActiveRepairCard';
import { MyRepairsSection } from './MyRepairsSection';
import { RepairNotebookModal } from '../../components/notebook/RepairNotebookModal';
import { 
  Wrench, 
  DollarSign, 
  Wallet, 
  CheckCircle, 
  Sparkles, 
  Play, 
  Plus, 
  Clock, 
  ShieldAlert, 
  Cpu, 
  ChevronRight, 
  Camera, 
  ArrowRight,
  Sparkle,
  Award,
  Zap,
  Layers,
  HelpCircle,
  Upload,
  Edit3
} from 'lucide-react';
import { RepairItem, ActiveRepairSession } from '../../types';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get('view') || 'home';

  const [diagModalOpen, setDiagModalOpen] = useState(false);
  const [diagInputTab, setDiagInputTab] = useState<'photo' | 'upload' | 'text'>('photo');
  const [sessionToResume, setSessionToResume] = useState<ActiveRepairSession | null>(null);

  // Notebook Modal State
  const [notebookModalOpen, setNotebookModalOpen] = useState(false);
  const [selectedNotebookItem, setSelectedNotebookItem] = useState<RepairItem | ActiveRepairSession | null>(null);

  const {
    activeSession,
    loading: sessionLoading,
    isDismissed,
    dismissSession,
    cancelSession,
  } = useActiveRepairSession();

  // Real Repair Items stored in state (persisted in localStorage)
  const [repairs, setRepairs] = useState<RepairItem[]>(() => {
    try {
      const saved = localStorage.getItem('repairlens_user_repairs');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved repairs', e);
    }
    return []; // Default empty state for new users
  });

  // Persist repair changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('repairlens_user_repairs', JSON.stringify(repairs));
    } catch (e) {
      console.error('Failed to save repairs', e);
    }
  }, [repairs]);

  // Calculated Real User Metrics
  const completedRepairs = repairs.filter((r) => r.status === 'completed');
  const totalSavedDollars = completedRepairs.reduce((acc, r) => acc + (r.estimatedSavingsDollars || 0), 0);
  const totalSavedNaira = completedRepairs.reduce((acc, r) => acc + (r.estimatedSavingsNaira || (r.estimatedSavingsDollars * 1150) || 0), 0);
  const totalTechFeesAvoidedNaira = completedRepairs.reduce((acc, r) => acc + (r.techFeeAvoidedNaira || r.estimatedSavingsNaira || (r.estimatedSavingsDollars * 1300) || 0), 0);

  // Handle addition of a completed repair from DiagnosticModal
  const handleCompleteRepair = (newRepair: RepairItem) => {
    setRepairs((prev) => [newRepair, ...prev]);
  };

  const handleUpdateRepairStatus = (id: string, newStatus: 'in_progress' | 'completed' | 'archived') => {
    setRepairs((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r))
    );
  };

  const handleDeleteRepair = (id: string) => {
    setRepairs((prev) => prev.filter((r) => r.id !== id));
  };

  const handleOpenNotebook = (item: RepairItem | ActiveRepairSession) => {
    setSelectedNotebookItem(item);
    setNotebookModalOpen(true);
  };

  const handleContinueSession = (item: ActiveRepairSession | RepairItem) => {
    if ('repairSessionId' in item) {
      setSessionToResume(item as ActiveRepairSession);
    } else {
      setSessionToResume(null);
    }
    setDiagModalOpen(true);
  };

  const onboardingSteps = [
    {
      step: '01',
      title: 'Capture or Upload',
      description: 'Take a photo of your appliance model badge or error code with your phone camera.',
      icon: <Camera className="w-5 h-5 text-indigo-600" />,
      badge: 'Vision AI',
    },
    {
      step: '02',
      title: 'Gemma AI Diagnoses',
      description: 'Our engine identifies part defects, error codes, and required safety warnings.',
      icon: <Cpu className="w-5 h-5 text-purple-600" />,
      badge: '96% Accuracy',
    },
    {
      step: '03',
      title: 'Follow DIY Guide',
      description: 'Follow step-by-step safety instructions with exact tools needed before you start.',
      icon: <Wrench className="w-5 h-5 text-amber-600" />,
      badge: 'Safety First',
    },
    {
      step: '04',
      title: 'Celebrate & Save',
      description: 'Complete the fix, earn your DIY Hero badge, and save $200+ on pro service calls.',
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      badge: 'Direct Savings',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F9FAFB] pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* WELCOME BANNER CARD */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#6366F1] to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-indigo-950/40">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/15 backdrop-blur-xs text-white text-xs font-semibold border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                <span>AI Diagnostic Studio Ready</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Welcome, {profile?.displayName || user?.email?.split('@')[0] || 'Member'}!
              </h1>
              <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed font-normal">
                Diagnose household appliances safely using vision AI and step-by-step guidance.
              </p>
            </div>

            <div className="shrink-0">
              <Button 
                onClick={() => {
                  setSessionToResume(null);
                  setDiagModalOpen(true);
                }}
                size="lg" 
                className="bg-white text-indigo-900 hover:bg-slate-100 font-extrabold px-6 py-3.5 shadow-md w-full md:w-auto border-0 active:scale-[0.98]"
              >
                <Plus className="w-5 h-5 mr-1.5 text-indigo-600" /> Start Diagnosis
              </Button>
            </div>
          </div>

          {/* Background Ambient Mesh */}
          <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* DIAGNOSE VIEW CARDS (SHOW WHEN USER SELECTS DIAGNOSE NAV LINK OR BTN) */}
        {activeView === 'diagnose' && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-[rgba(99,102,241,0.25)] bg-[#1A2035] p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#6366F1]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-1.5 text-center max-w-xl mx-auto relative z-10">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 text-xs font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#10B981]" /> Multimodal AI Diagnostic Engine
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">Select Diagnosis Method</h2>
              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed">
                Select how you would like Gemma AI to inspect your household appliance fault.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative z-10">
              {/* Option 1: 📸 Take Photo */}
              <motion.button
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setDiagInputTab('photo');
                  setSessionToResume(null);
                  setDiagModalOpen(true);
                }}
                className="p-6 rounded-2xl bg-[#111827] border border-[rgba(99,102,241,0.2)] hover:border-[#10B981] transition-all text-left space-y-4 group cursor-pointer shadow-lg"
              >
                <div className="p-3.5 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] w-fit group-hover:scale-110 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#F9FAFB] group-hover:text-[#10B981] transition-colors">📸 Take Photo</h3>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Use live device camera to capture appliance model badge or error code.
                  </p>
                </div>
                <div className="text-xs font-extrabold text-[#10B981] flex items-center gap-1.5 pt-2">
                  <span>Start Live Camera</span> <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.button>

              {/* Option 2: 🖼 Upload Existing Photo */}
              <motion.button
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setDiagInputTab('upload');
                  setSessionToResume(null);
                  setDiagModalOpen(true);
                }}
                className="p-6 rounded-2xl bg-[#111827] border border-[rgba(99,102,241,0.2)] hover:border-[#6366F1] transition-all text-left space-y-4 group cursor-pointer shadow-lg"
              >
                <div className="p-3.5 rounded-xl bg-[#6366F1]/15 border border-[#6366F1]/30 text-[#6366F1] w-fit group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#F9FAFB] group-hover:text-[#6366F1] transition-colors">🖼 Upload Existing Photo</h3>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Select existing appliance photos or model label screenshots from gallery.
                  </p>
                </div>
                <div className="text-xs font-extrabold text-[#6366F1] flex items-center gap-1.5 pt-2">
                  <span>Upload Gallery Image</span> <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.button>

              {/* Option 3: ✍ Describe the Fault */}
              <motion.button
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setDiagInputTab('text');
                  setSessionToResume(null);
                  setDiagModalOpen(true);
                }}
                className="p-6 rounded-2xl bg-[#111827] border border-[rgba(99,102,241,0.2)] hover:border-amber-400 transition-all text-left space-y-4 group cursor-pointer shadow-lg"
              >
                <div className="p-3.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 w-fit group-hover:scale-110 transition-transform">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-extrabold text-[#F9FAFB] group-hover:text-amber-400 transition-colors">✍ Describe the Fault</h3>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed">
                    Type symptoms, error code text, noise descriptions, or model names.
                  </p>
                </div>
                <div className="text-xs font-extrabold text-amber-400 flex items-center gap-1.5 pt-2">
                  <span>Describe Fault Text</span> <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ACTIVE REPAIR FLOATING CARD FROM FIRESTORE PERSISTENCE */}
        <AnimatePresence>
          {activeSession && !isDismissed && (
            <ActiveRepairCard
              session={activeSession}
              onContinue={() => {
                setSessionToResume(activeSession);
                setDiagModalOpen(true);
              }}
              onDismiss={dismissSession}
              onCancelSession={cancelSession}
            />
          )}
        </AnimatePresence>

        {/* METRICS CARDS GRID (PART 1: REAL DATA) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          
          {/* Card 1: Money Saved */}
          <div className="p-6 rounded-3xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] shadow-xs flex items-center justify-between hover:border-[rgba(99,102,241,0.3)] transition-colors">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Money Saved</span>
              <div className="text-xl sm:text-2xl font-extrabold text-[#F9FAFB] font-mono">
                ₦{(totalSavedNaira ?? 0).toLocaleString()} <span className="text-xs text-[#9CA3AF]">(${totalSavedDollars || 0})</span>
              </div>
              <p className="text-[11px] text-[#10B981] font-medium">
                {completedRepairs.length > 0 ? 'Verified DIY savings' : 'Complete 1st repair to earn'}
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: Technician Fees Avoided */}
          <div className="p-6 rounded-3xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] shadow-xs flex items-center justify-between hover:border-[rgba(99,102,241,0.3)] transition-colors">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">TECHNICIAN FEES AVOIDED</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] font-mono">
                ₦{(totalTechFeesAvoidedNaira ?? 0).toLocaleString()}
              </div>
              <p className="text-[11px] text-teal-400 font-medium">
                Money kept in your pocket
              </p>
            </div>
            <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Repairs Completed */}
          <div className="p-6 rounded-3xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] shadow-xs flex items-center justify-between sm:col-span-2 lg:col-span-1 hover:border-[rgba(99,102,241,0.3)] transition-colors">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Repairs Completed</span>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] font-mono">
                {completedRepairs.length}
              </div>
              <p className="text-[11px] text-[#6366F1] font-medium">100% Safety verified steps</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/20 text-[#6366F1]">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>

        </div>

        {/* MY REPAIRS SECTION */}
        <MyRepairsSection
          repairs={repairs}
          activeSession={activeSession}
          onContinueSession={handleContinueSession}
          onOpenNotebook={handleOpenNotebook}
          onUpdateRepairStatus={handleUpdateRepairStatus}
          onDeleteRepair={handleDeleteRepair}
          onCancelActiveSession={cancelSession}
          onStartDiagnosis={() => {
            setSessionToResume(null);
            setDiagModalOpen(true);
          }}
        />

        {/* ONBOARDING WALKTHROUGH CARDS (SHOW WHEN USER HAS NO REPAIRS YET) */}
        {repairs.length === 0 && !activeSession && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[#F9FAFB]">How RepairLens AI Works</h3>
                <p className="text-xs text-[#9CA3AF]">Your guided path from broken appliance to successful DIY repair</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {onboardingSteps.map((card) => (
                <motion.div
                  key={card.step}
                  whileHover={{ y: -4 }}
                  className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-[#6B7280]/40 font-mono">{card.step}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#111827] border border-[rgba(99,102,241,0.2)] text-[#F9FAFB] text-[10px] font-bold">
                      {card.badge}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.15)] w-fit">
                    {card.icon}
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-[#F9FAFB]">{card.title}</h4>
                    <p className="text-[11px] text-[#9CA3AF] leading-relaxed">{card.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* SAFETY ADVISORY NOTICE */}
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-300">
          <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed font-medium">
            <strong className="text-amber-200">Safety Reminder:</strong> Always disconnect the main electrical supply or unplug the appliance before opening any cabinet panels or testing components.
          </p>
        </div>

      </div>

      {/* DIAGNOSTIC MODAL */}
      <DiagnosticModal 
        isOpen={diagModalOpen} 
        onClose={() => {
          setDiagModalOpen(false);
          setSessionToResume(null);
        }}
        initialInputTab={diagInputTab}
        onCompleteRepair={handleCompleteRepair}
        activeSessionToResume={sessionToResume}
      />

      {/* REPAIR NOTEBOOK MODAL */}
      <RepairNotebookModal
        isOpen={notebookModalOpen}
        onClose={() => {
          setNotebookModalOpen(false);
          setSelectedNotebookItem(null);
        }}
        repairItem={selectedNotebookItem && 'id' in selectedNotebookItem ? (selectedNotebookItem as RepairItem) : null}
        activeSession={selectedNotebookItem && 'repairSessionId' in selectedNotebookItem ? (selectedNotebookItem as ActiveRepairSession) : null}
        onRestoreToActive={(id) => handleUpdateRepairStatus(id, 'in_progress')}
      />

    </div>
  );
};
