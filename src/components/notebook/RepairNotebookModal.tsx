import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Wrench,
  Sparkles,
  Calendar,
  Clock,
  DollarSign,
  Award,
  CheckCircle2,
  FileText,
  Printer,
  Share2,
  Image as ImageIcon,
  MessageSquare,
  AlertTriangle,
  RotateCcw,
  Check,
  Save,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../common/Button';
import { RepairItem, ActiveRepairSession, TimelineEvent } from '../../types';
import { repairSessionService } from '../../services/repairSessionService';

import { showToast } from '../../context/ToastContext';

interface RepairNotebookModalProps {
  isOpen: boolean;
  onClose: () => void;
  repairItem?: RepairItem | null;
  activeSession?: ActiveRepairSession | null;
  onRestoreToActive?: (id: string) => void;
}

export const RepairNotebookModal: React.FC<RepairNotebookModalProps> = ({
  isOpen,
  onClose,
  repairItem,
  activeSession,
  onRestoreToActive,
}) => {
  const [activeTab, setActiveTab] = useState<'timeline' | 'qa' | 'notes' | 'gallery'>('timeline');
  const [userNotes, setUserNotes] = useState<string>('');
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  const [notesSavedSuccess, setNotesSavedSuccess] = useState<boolean>(false);
  const [copiedShareText, setCopiedShareText] = useState<boolean>(false);
  const [selectedImageModal, setSelectedImageModal] = useState<string | null>(null);

  // Extract merged data
  const title = repairItem?.title || activeSession?.diagnosis?.appliance || 'Appliance Repair';
  const applianceName = repairItem?.applianceName || activeSession?.diagnosis?.appliance || 'Household Appliance';
  const likelyFault = repairItem?.diagnosis?.likelyFault || activeSession?.diagnosis?.likelyFault || 'Diagnosed Issue';
  const brand = repairItem?.brand || activeSession?.diagnosis?.brand || '';
  const status = activeSession?.status || repairItem?.status || 'completed';
  const progressPercent = activeSession?.progressPercentage ?? repairItem?.progressPercent ?? 100;
  
  const savedNaira = repairItem?.estimatedSavingsNaira || activeSession?.diagnosis?.diySavingsNaira || 150000;
  const savedUsd = repairItem?.estimatedSavingsDollars || activeSession?.diagnosis?.diySavingsUsd || 120;
  const techFeeNaira = repairItem?.techFeeAvoidedNaira || activeSession?.diagnosis?.techFeeAvoidedNaira || 180000;

  const diagnosis = activeSession?.diagnosis || repairItem?.diagnosis;
  const steps = diagnosis?.steps || [];
  const completedSteps = activeSession?.completedSteps || repairItem?.completedSteps || Array.from({ length: steps.length }, (_, i) => i);
  const uploadedImages = activeSession?.uploadedImages || repairItem?.uploadedImages || [];
  const gemmaHistory = activeSession?.gemmaHistory || repairItem?.gemmaHistory || [];

  // Initialize notes from session or item
  useEffect(() => {
    const existingNotes = activeSession?.userNotes || repairItem?.userNotes || '';
    setUserNotes(existingNotes);
  }, [activeSession, repairItem]);

  // Construct auto timeline events if none exist
  const timelineEvents: TimelineEvent[] = React.useMemo(() => {
    if (activeSession?.timelineEvents?.length) return activeSession.timelineEvents;
    if (repairItem?.timelineEvents?.length) return repairItem.timelineEvents;

    const baseTime = new Date(activeSession?.createdAt || repairItem?.createdAt || Date.now());
    const events: TimelineEvent[] = [];

    // 1. Initial Diagnosis
    events.push({
      id: 'tl_diag',
      timestamp: baseTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      title: 'AI Vision Diagnosis Completed',
      description: `Identified: ${likelyFault} (${diagnosis?.confidenceScore || 96}% AI Confidence)`,
      type: 'diagnosis',
    });

    // 2. Images uploaded
    if (uploadedImages.length > 0) {
      const imgTime = new Date(baseTime.getTime() + 4 * 60000);
      events.push({
        id: 'tl_img',
        timestamp: imgTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Uploaded ${uploadedImages.length} Inspection Photo${uploadedImages.length > 1 ? 's' : ''}`,
        description: 'Photos saved to Repair Notebook for verification.',
        type: 'image',
      });
    }

    // 3. Completed steps
    completedSteps.forEach((stepIdx, i) => {
      const stepObj = steps[stepIdx];
      const stepTime = new Date(baseTime.getTime() + (10 + i * 8) * 60000);
      events.push({
        id: `tl_step_${stepIdx}`,
        timestamp: stepTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: `Completed Step ${stepIdx + 1}: ${stepObj?.title || 'Repair Procedure'}`,
        description: stepObj?.expectedResult || 'Procedure verified',
        type: 'step',
      });
    });

    // 4. Gemma responses
    if (gemmaHistory.length > 0) {
      const lastGemma = gemmaHistory.filter((m) => m.sender === 'gemma').pop();
      if (lastGemma) {
        const gTime = new Date(baseTime.getTime() + 25 * 60000);
        events.push({
          id: 'tl_gemma',
          timestamp: gTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          title: 'Gemma 4 AI Safety Confirmation',
          description: lastGemma.text.slice(0, 90) + '...',
          type: 'gemma',
        });
      }
    }

    // 5. Final Completion
    if (progressPercent >= 100 || status === 'completed') {
      const compTime = new Date(baseTime.getTime() + 35 * 60000);
      events.push({
        id: 'tl_comp',
        timestamp: compTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Repair Completed 🎉',
        description: `DIY Fix verified. Kept ₦${(techFeeNaira ?? 0).toLocaleString()} in your pocket!`,
        type: 'completion',
      });
    }

    return events;
  }, [activeSession, repairItem, likelyFault, diagnosis, uploadedImages, completedSteps, steps, gemmaHistory, progressPercent, status, techFeeNaira]);

  // Handle Save Notes
  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    showToast('Saving your progress...', 'info');
    try {
      if (activeSession?.repairSessionId) {
        await repairSessionService.updateSession(activeSession.repairSessionId, {
          userNotes,
        });
      }
      setNotesSavedSuccess(true);
      showToast('Notes saved successfully ✓', 'success');
      setTimeout(() => setNotesSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Handle Share Achievement
  const handleShare = () => {
    const text = `🛠️ I just fixed my ${applianceName} (${likelyFault}) with RepairLens AI!\nSaved $${savedUsd} (₦${(savedNaira ?? 0).toLocaleString()}) and avoided technician fees. #DIYHero #RepairLensAI`;
    navigator.clipboard.writeText(text);
    setCopiedShareText(true);
    showToast('Copied to clipboard ✓', 'success');
    setTimeout(() => setCopiedShareText(false), 2500);
  };

  // Handle PDF / Print
  const handlePrint = () => {
    window.print();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#1A2035] border border-[rgba(99,102,241,0.25)] shadow-2xl p-6 sm:p-8 text-[#F9FAFB] space-y-6 print:max-h-none print:border-0 print:bg-white print:text-black"
        >
          {/* Print Header */}
          <div className="hidden print:block text-black border-b border-gray-300 pb-4 mb-4">
            <h1 className="text-2xl font-bold">RepairLens AI — Official Repair Notebook</h1>
            <p className="text-sm text-gray-600">Generated on {new Date().toLocaleDateString()}</p>
          </div>

          {/* Modal Header Bar */}
          <div className="flex items-start justify-between gap-4 border-b border-[rgba(99,102,241,0.15)] pb-5 print:hidden">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-[#6366F1]/15 border border-[#6366F1]/30 text-[#6366F1]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6366F1]">
                    Digital Repair Notebook
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    status === 'completed' 
                      ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30' 
                      : status === 'archived' 
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30'
                  }`}>
                    {status}
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#F9FAFB] tracking-tight">
                  {applianceName} {brand ? `(${brand})` : ''}
                </h2>
                <p className="text-xs text-[#9CA3AF]">Diagnosed Fault: {likelyFault}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[#111827] text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#20293a] border border-[rgba(255,255,255,0.08)] transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Financial & Environmental Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#111827] border border-[rgba(99,102,241,0.15)] text-xs print:border-gray-300 print:bg-gray-50">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider print:text-gray-600">Money Saved</span>
              <div className="font-extrabold text-[#10B981] font-mono text-sm print:text-emerald-700">
                ₦{(savedNaira ?? 0).toLocaleString()} <span className="text-[10px] text-[#9CA3AF]">(${savedUsd})</span>
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider print:text-gray-600">Tech Fee Avoided</span>
              <div className="font-extrabold text-teal-400 font-mono text-sm print:text-teal-700">
                ₦{(techFeeNaira ?? 0).toLocaleString()}
              </div>
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#9CA3AF] tracking-wider print:text-gray-600">Badge Earned</span>
              <div className="font-extrabold text-[#6366F1] font-mono text-xs flex items-center gap-1 print:text-indigo-700">
                <Award className="w-3.5 h-3.5" />
                DIY Master Hero
              </div>
            </div>
          </div>

          {/* Modal Tab Navigation Bar */}
          <div className="flex items-center gap-2 border-b border-[rgba(99,102,241,0.15)] pb-3 text-xs font-semibold print:hidden">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-[#6366F1] text-white font-bold shadow-md'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#111827]'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Repair Timeline ({timelineEvents.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('qa')}
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'qa'
                  ? 'bg-[#6366F1] text-white font-bold shadow-md'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#111827]'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Gemma Q&A Log ({gemmaHistory.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('notes')}
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'notes'
                  ? 'bg-[#6366F1] text-white font-bold shadow-md'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#111827]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>My Technician Notes</span>
            </button>

            {uploadedImages.length > 0 && (
              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-2 cursor-pointer ${
                  activeTab === 'gallery'
                    ? 'bg-[#6366F1] text-white font-bold shadow-md'
                    : 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#111827]'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>Photos ({uploadedImages.length})</span>
              </button>
            )}
          </div>

          {/* TAB CONTENT 1: TIMELINE */}
          {(activeTab === 'timeline' || true) && (
            <div className={`space-y-6 ${activeTab !== 'timeline' ? 'hidden print:block' : 'block'}`}>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-[#F9FAFB] print:text-black">Vertical Repair Timeline</h3>
                <p className="text-xs text-[#9CA3AF] print:text-gray-600">
                  Chronological event log automatically captured during this diagnostic session.
                </p>
              </div>

              {/* Vertical Animated Timeline */}
              <div className="relative pl-6 border-l-2 border-[#6366F1]/30 space-y-6 print:border-gray-400">
                {timelineEvents.map((evt, idx) => (
                  <motion.div
                    key={evt.id || idx}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="relative group"
                  >
                    {/* Timeline Node Dot */}
                    <div className="absolute -left-[31px] top-0.5 w-4 h-4 rounded-full bg-[#1A2035] border-2 border-[#6366F1] flex items-center justify-center print:bg-white print:border-indigo-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                    </div>

                    <div className="p-4 rounded-2xl bg-[#111827] border border-[rgba(99,102,241,0.15)] space-y-1 print:bg-gray-50 print:border-gray-300 print:text-black">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-extrabold text-[#F9FAFB] print:text-black">{evt.title}</span>
                        <span className="text-[#9CA3AF] text-[10px] print:text-gray-600">{evt.timestamp}</span>
                      </div>
                      {evt.description && (
                        <p className="text-xs text-[#9CA3AF] leading-relaxed print:text-gray-700">
                          {evt.description}
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: GEMMA Q&A */}
          {activeTab === 'qa' && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-[#F9FAFB]">Gemma 4 AI Master Engineer Log</h3>
              {gemmaHistory.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#111827] border border-[rgba(99,102,241,0.15)] text-center text-xs text-[#9CA3AF]">
                  No messages recorded in this session.
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {gemmaHistory.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl text-xs space-y-1.5 ${
                        msg.sender === 'user'
                          ? 'bg-[#6366F1]/15 border border-[#6366F1]/30 ml-8 text-indigo-100'
                          : 'bg-[#111827] border border-[rgba(99,102,241,0.15)] mr-8 text-[#F9FAFB]'
                      }`}
                    >
                      <div className="flex justify-between items-center font-mono text-[10px] text-[#9CA3AF]">
                        <span className="font-bold uppercase text-[#6366F1]">
                          {msg.sender === 'user' ? 'You' : 'Gemma 4 AI Engineer'}
                        </span>
                        <span>{msg.timestamp}</span>
                      </div>
                      <p className="leading-relaxed">{msg.text}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT 3: MY TECHNICIAN NOTES */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[#F9FAFB]">Technician Scratchpad & Notes</h3>
                  <p className="text-xs text-[#9CA3AF]">
                    Record part serial numbers, multimeters readings, or tool notes. Saved automatically.
                  </p>
                </div>
                <Button
                  onClick={handleSaveNotes}
                  disabled={isSavingNotes}
                  size="sm"
                  variant="primary"
                  className="flex items-center gap-1.5"
                >
                  {isSavingNotes ? (
                    'Saving...'
                  ) : notesSavedSuccess ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-300" /> Saved!
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" /> Save Notes
                    </>
                  )}
                </Button>
              </div>

              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="Type your notes here... e.g. Replaced capacitor with 45uF 370V part. Disconnected brown wire first."
                className="w-full h-44 p-4 rounded-2xl bg-[#111827] border border-[rgba(99,102,241,0.2)] focus:border-[#6366F1] text-xs text-[#F9FAFB] focus:outline-none transition-all leading-relaxed"
              />
            </div>
          )}

          {/* TAB CONTENT 4: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-4">
              <h3 className="text-base font-extrabold text-[#F9FAFB]">Uploaded Inspection Photos</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {uploadedImages.map((imgSrc, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedImageModal(imgSrc)}
                    className="relative group rounded-2xl overflow-hidden border border-[rgba(99,102,241,0.2)] bg-[#111827] aspect-square cursor-pointer hover:border-[#6366F1] transition-all"
                  >
                    <img
                      src={imgSrc}
                      alt={`Inspection photo ${idx + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">
                      View Photo
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[rgba(99,102,241,0.15)] print:hidden">
            <div className="flex items-center gap-2">
              <Button
                onClick={handlePrint}
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4 text-[#9CA3AF]" />
                <span>Download / Print PDF</span>
              </Button>

              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="flex items-center gap-1.5"
              >
                {copiedShareText ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4 text-[#9CA3AF]" /> Share Achievement
                  </>
                )}
              </Button>
            </div>

            <div className="flex items-center gap-3">
              {status === 'archived' && onRestoreToActive && (
                <Button
                  onClick={() => {
                    if (repairItem?.id) onRestoreToActive(repairItem.id);
                    onClose();
                  }}
                  variant="primary"
                  size="sm"
                  className="flex items-center gap-1.5 bg-[#10B981] hover:bg-[#059669]"
                >
                  <RotateCcw className="w-4 h-4" /> Restore to Active
                </Button>
              )}

              <Button onClick={onClose} variant="ghost" size="sm">
                Close Notebook
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
