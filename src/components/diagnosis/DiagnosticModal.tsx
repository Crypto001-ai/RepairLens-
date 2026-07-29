import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { 
  X, 
  Cpu, 
  Sparkles, 
  ShieldAlert, 
  ShieldCheck, 
  Wrench, 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Camera, 
  Upload, 
  Edit3, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  Info, 
  Clock, 
  Zap, 
  Eye, 
  Search, 
  Check, 
  Flame, 
  Wind, 
  Droplets, 
  Send, 
  Image as ImageIcon, 
  Printer, 
  Share2, 
  ChevronRight, 
  ChevronDown,
  Maximize2, 
  Minimize2,
  RefreshCw,
  Trash2,
  AlertCircle,
  TrendingUp,
  FileText
} from 'lucide-react';
import { 
  ApplianceCategory, 
  GemmaDiagnosticResult, 
  GemmaStepInstruction,
  RepairItem, 
  CompanionMessage, 
  RepairSummaryResult,
  ActiveRepairSession
} from '../../types';
import { gemmaService } from '../../services/gemma';
import { RepairLensLogo } from '../common/RepairLensLogo';
import { auth } from '../../firebase/config';
import { repairSessionService } from '../../services/repairSessionService';
import { showToast } from '../../context/ToastContext';

interface DiagnosticModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCompleteRepair?: (item: RepairItem) => void;
  initialAppliance?: ApplianceCategory;
  initialInputTab?: 'photo' | 'upload' | 'text';
  activeSessionToResume?: ActiveRepairSession | null;
}

export const DiagnosticModal: React.FC<DiagnosticModalProps> = ({
  isOpen,
  onClose,
  onCompleteRepair,
  initialAppliance = 'washer',
  initialInputTab = 'photo',
  activeSessionToResume = null,
}) => {
  // Modal Mode: 'input' -> 'investigating' -> 'result' -> 'guide' -> 'summary'
  const [modalMode, setModalMode] = useState<'input' | 'investigating' | 'result' | 'guide' | 'summary'>('input');
  
  // Input Method Options: 'photo' | 'upload' | 'text'
  const [activeInputTab, setActiveInputTab] = useState<'photo' | 'upload' | 'text'>(initialInputTab);

  // Sync initial input tab on open
  useEffect(() => {
    if (isOpen && !activeSessionToResume) {
      setActiveInputTab(initialInputTab);
      setModalMode('input');
    }
  }, [isOpen, initialInputTab, activeSessionToResume]);

  // Input States
  const [selectedAppliance, setSelectedAppliance] = useState<string>(initialAppliance);
  const [brand, setBrand] = useState<string>('');
  const [symptomText, setSymptomText] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  
  // Live Camera Preview States
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // Investigation & Timeline States
  const [investigationStepIndex, setInvestigationStepIndex] = useState<number>(0);
  const [liveConfidenceDisplay, setLiveConfidenceDisplay] = useState<number>(0);
  const [diagnosticResult, setDiagnosticResult] = useState<GemmaDiagnosticResult | null>(null);

  // Explainable AI State
  const [showExplainableAi, setShowExplainableAi] = useState<boolean>(false);

  // DIY Step Checklist State
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isCelebrated, setIsCelebrated] = useState<boolean>(false);

  // Current active step calculation & Auto-Scroll refs
  const currentStepNumber = diagnosticResult?.steps?.find((s) => !completedSteps.includes(s.stepNumber))?.stepNumber
    ?? (diagnosticResult?.steps?.length ? diagnosticResult.steps[diagnosticResult.steps.length - 1].stepNumber : 1);

  const stepRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (modalMode === 'guide' && currentStepNumber && stepRefs.current[currentStepNumber]) {
      const timer = setTimeout(() => {
        stepRefs.current[currentStepNumber]?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [modalMode, currentStepNumber]);

  // Clean raw field prefixes like 'title:', 'description:', etc.
  const cleanStepText = (str?: string): string => {
    if (!str) return '';
    return str
      .replace(/^(title|description|reason|expectedResult|safetyNotice|safetyWarning|step\s*\d*):/i, '')
      .replace(/^["']|["']$/g, '')
      .trim();
  };

  // Visual Checklist Collapse State & Refs
  const [expandedChecklists, setExpandedChecklists] = useState<{ [stepNumber: number]: boolean }>({});

  const toggleVisualChecklist = (stepNum: number) => {
    setExpandedChecklists((prev) => ({ ...prev, [stepNum]: !prev[stepNum] }));
  };

  const companionSectionRef = useRef<HTMLDivElement | null>(null);
  const companionInputRef = useRef<HTMLInputElement | null>(null);

  const handleCompareWithMyRepair = (stepNumber: number, stepTitle: string) => {
    setCompanionInputText(`I'm checking Step ${stepNumber} (${stepTitle}). Can you compare my repair with what it should look like?`);

    if (companionSectionRef.current) {
      companionSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    setTimeout(() => {
      if (companionInputRef.current) {
        companionInputRef.current.focus();
      }
    }, 300);
  };

  const getStepVisualChecklistItems = (step: GemmaStepInstruction, diagResult: GemmaDiagnosticResult | null): string[] => {
    if (step.visualChecklist && Array.isArray(step.visualChecklist) && step.visualChecklist.length > 0) {
      return step.visualChecklist.map(cleanStepText);
    }

    const applianceName = diagResult?.appliance || 'Appliance';
    const brandName = diagResult?.brand ? `${diagResult.brand} ` : '';
    const cleanTitle = cleanStepText(step.title);
    const cleanDesc = cleanStepText(step.description);
    const cleanExp = cleanStepText(step.expectedResult);

    const titleWords = cleanTitle.split(' ');
    const mainSubject = titleWords.length > 2 ? titleWords.slice(1).join(' ') : cleanTitle;

    const items: string[] = [];

    // 1. Location & Mounting
    items.push(`You should see the ${mainSubject} mounted securely inside or near the ${brandName}${applianceName} housing.`);

    // 2. Physical Condition
    if (cleanTitle.toLowerCase().includes('clean') || cleanDesc.toLowerCase().includes('clean')) {
      items.push(`Contact surfaces and housing channels should be clean, free of oil, dust webs, and corroded buildup.`);
    } else if (cleanTitle.toLowerCase().includes('replace') || cleanTitle.toLowerCase().includes('install')) {
      items.push(`The replacement part should fit flush against the mounting bracket with all alignment pins aligned.`);
    } else {
      items.push(`The top surface and casing should be completely flat, with no visible swelling, burn marks, or cracks.`);
    }

    // 3. Fasteners & Connections
    items.push(`All connecting wires or mounting screws should still be attached tightly with zero loose play.`);

    // 4. Expected outcome state
    if (cleanExp) {
      items.push(`Verification milestone: ${cleanExp}`);
    } else {
      items.push(`There should be no leaking fluid, melted plastic, or loose metal shavings in the working area.`);
    }

    // 5. Clearance & Safety
    items.push(`Maintain proper clearance from surrounding wiring harness and confirm power source remains isolated.`);

    return items;
  };

  // Active Repair Companion State
  const [companionMessages, setCompanionMessages] = useState<CompanionMessage[]>([]);
  const [companionInputText, setCompanionInputText] = useState<string>('');
  const [companionFollowUpImage, setCompanionFollowUpImage] = useState<string | null>(null);
  const [isCompanionThinking, setIsCompanionThinking] = useState<boolean>(false);
  const [isCompanionExpanded, setIsCompanionExpanded] = useState<boolean>(false);

  // Completion & Repair Summary State
  const [repairSummary, setRepairSummary] = useState<RepairSummaryResult | null>(null);

  // AI Recap State
  const [aiRecapText, setAiRecapText] = useState<string | null>(null);
  const [isGeneratingRecap, setIsGeneratingRecap] = useState<boolean>(false);

  // Restore Active Repair Session on Open
  useEffect(() => {
    if (isOpen && activeSessionToResume) {
      setDiagnosticResult(activeSessionToResume.diagnosis);
      setCompletedSteps(activeSessionToResume.completedSteps || []);
      setCompanionMessages(activeSessionToResume.gemmaHistory || []);
      setImages(activeSessionToResume.uploadedImages || []);
      setSelectedAppliance(activeSessionToResume.diagnosis?.appliance || 'washer');
      setBrand(activeSessionToResume.diagnosis?.brand || '');
      setModalMode('guide'); // Jump directly to the active repair step guide!

      let isMounted = true;
      setIsGeneratingRecap(true);

      gemmaService
        .generateRepairRecap(activeSessionToResume)
        .then((res) => {
          if (isMounted && res?.recapText) {
            setAiRecapText(res.recapText);
            setCompanionMessages((prev) => {
              const hasRecap = prev.some((m) => m.id.startsWith('msg_recap_'));
              if (hasRecap) return prev;
              const recapMsg: CompanionMessage = {
                id: `msg_recap_${Date.now()}`,
                sender: 'gemma',
                text: res.recapText,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              };
              return [recapMsg, ...prev];
            });
          }
          if (isMounted) setIsGeneratingRecap(false);
        })
        .catch((err) => {
          console.error('Recap error:', err);
          if (isMounted) setIsGeneratingRecap(false);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [isOpen, activeSessionToResume]);

  // Preset example descriptions
  const examplePresets = [
    { title: 'Standing Fan', text: 'My standing fan hums loudly when powered on but the blades do not spin.' },
    { title: 'Generator Set', text: 'My petrol generator starts, runs for 3 minutes then cuts off abruptly under load.' },
    { title: 'Washing Machine', text: 'Washing machine displays OE error code and will not drain water from the drum.' },
    { title: 'Electric Iron', text: 'Pressing iron gets hot continuously and thermostatic control dial will not cut off power.' },
    { title: 'Water Pump', text: 'Pumping machine motor turns on with buzzing sound but fails to pump water up to overhead tank.' },
  ];

  // Investigation Timeline Items
  const investigationTimeline = [
    { title: 'Inspecting appliance visual features & photo frames...', icon: <Eye className="w-4 h-4 text-blue-500" /> },
    { title: 'Identifying appliance model components & wiring layout...', icon: <Search className="w-4 h-4 text-indigo-500" /> },
    { title: 'Comparing failure signatures against 2,500+ manuals...', icon: <Cpu className="w-4 h-4 text-purple-500" /> },
    { title: 'Evaluating electrical, thermal, & gas safety risk factors...', icon: <ShieldAlert className="w-4 h-4 text-amber-500" /> },
    { title: 'Assessing AI diagnostic confidence score...', icon: <Sparkles className="w-4 h-4 text-emerald-500" /> },
    { title: 'Synthesizing step-by-step DIY repair roadmap...', icon: <Wrench className="w-4 h-4 text-teal-500" /> },
  ];

  // Handle Camera initialization
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          setIsCameraActive(true);
        }
      } else {
        setCameraError('Camera access not supported on this device/browser.');
      }
    } catch (err: any) {
      console.warn('Camera access denied or unavailable:', err);
      setCameraError('Camera access unavailable. Please use file upload instead.');
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  };

  useEffect(() => {
    if (isOpen && modalMode === 'input' && activeInputTab === 'photo') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, modalMode, activeInputTab]);

  const capturePhotoFromCamera = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const maxDim = 1024;
      let w = videoRef.current.videoWidth || 640;
      let h = videoRef.current.videoHeight || 480;
      if (w > maxDim || h > maxDim) {
        if (w > h) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
      }
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
        setImages((prev) => [...prev, dataUrl]);
        showToast('Photo captured successfully ✓', 'success');
      }
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    let count = 0;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const maxDim = 1024;
              let w = img.width || 800;
              let h = img.height || 600;
              if (w > maxDim || h > maxDim) {
                if (w > h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, w, h);
                const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                setImages((prev) => [...prev, compressedDataUrl]);
                count++;
                if (count === 1) {
                  showToast('Photo uploaded successfully ✓', 'success');
                }
              }
            };
            img.src = e.target.result as string;
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Start Multimodal Gemma Diagnosis Request
  const handleStartDiagnosis = async () => {
    stopCamera();
    setModalMode('investigating');
    setInvestigationStepIndex(0);
    setLiveConfidenceDisplay(0);
    showToast('Analyzing your appliance...', 'info');

    // Call API in parallel with smooth investigation animation
    const diagnosisPromise = gemmaService.diagnoseAppliance({
      applianceType: selectedAppliance,
      brand,
      symptomDescription: symptomText,
      imageUrls: images,
    });

    // Animate Investigation Timeline
    let currentTimelineIdx = 0;
    const interval = setInterval(() => {
      currentTimelineIdx++;
      if (currentTimelineIdx < investigationTimeline.length) {
        setInvestigationStepIndex(currentTimelineIdx);
        setLiveConfidenceDisplay(Math.round((currentTimelineIdx / investigationTimeline.length) * 80));
      } else {
        clearInterval(interval);
      }
    }, 700);

    try {
      const result = await diagnosisPromise;
      clearInterval(interval);
      setInvestigationStepIndex(investigationTimeline.length);
      
      // Smoothly animate confidence to final score
      const finalScore = result.confidenceScore || 88;
      let startScore = liveConfidenceDisplay;
      const scoreInterval = setInterval(() => {
        startScore += 2;
        if (startScore >= finalScore) {
          setLiveConfidenceDisplay(finalScore);
          clearInterval(scoreInterval);
          setDiagnosticResult(result);
          showToast('Diagnosis complete!', 'success');

          if (result.safetyLevel === 'High Hazard' || result.safetyLevel === 'Caution Required') {
            setTimeout(() => {
              showToast('This repair involves safety hazards. Stay careful!', 'warning');
            }, 800);
          }
          
          // Initial greeting from Gemma in Companion session
          const initMsg: CompanionMessage = {
            id: `msg_init_${Date.now()}`,
            sender: 'gemma',
            text: `Hello! I am Gemma 4, your master repair engineer. I have prepared your step-by-step DIY repair guide for your **${result.appliance}**. I am right here with you throughout this repair. Ask me anything if you get stuck or upload a photo of your work!`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };

          setCompanionMessages([initMsg]);

          if (auth.currentUser) {
            const newSession: ActiveRepairSession = {
              repairSessionId: result.repairSessionId,
              userId: auth.currentUser.uid,
              status: 'active',
              currentStep: 1,
              completedSteps: [],
              uploadedImages: images,
              gemmaHistory: [initMsg],
              diagnosis: result,
              progressPercentage: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              estimatedRemainingTime: `~${result.estimatedTimeMinutes} mins remaining`,
              lastActivity: new Date().toISOString(),
            };
            repairSessionService.saveSession(newSession).catch((e) =>
              console.error('Failed to save session to Firestore:', e)
            );
          }

          setTimeout(() => {
            setModalMode('result');
          }, 400);
        } else {
          setLiveConfidenceDisplay(startScore);
        }
      }, 30);
    } catch (err: any) {
      console.error('Diagnosis failed:', err);
      clearInterval(interval);
      setModalMode('input');

      const msg = String(err?.message || err?.error || err || '').toLowerCase();
      const status = err?.status || 0;

      if (
        status === 504 ||
        msg.includes('504') ||
        msg.includes('longer than usual') ||
        msg.includes('timeout') ||
        msg.includes('deadline') ||
        msg.includes('deadline_exceeded') ||
        msg.includes('abort')
      ) {
        showToast('Analysis taking longer than usual. Please try again.', 'warning');
      } else if (
        msg.includes('clearer') ||
        msg.includes('quality') ||
        msg.includes('blurry') ||
        msg.includes('unclear') ||
        msg.includes('image quality')
      ) {
        showToast('Please upload a clearer image for better diagnosis.', 'info');
      } else {
        showToast('Connection failed. Check your internet and retry.', 'error');
      }
    }
  };

  // Toggle Step Completion & Handle Celebration
  const toggleStep = async (stepNumber: number) => {
    if (!diagnosticResult) return;
    let nextSteps: number[];
    const isAdding = !completedSteps.includes(stepNumber);
    if (completedSteps.includes(stepNumber)) {
      nextSteps = completedSteps.filter((s) => s !== stepNumber);
    } else {
      nextSteps = [...completedSteps, stepNumber];
    }
    setCompletedSteps(nextSteps);

    const totalSteps = diagnosticResult.steps.length;
    const progress = Math.round((nextSteps.length / totalSteps) * 100);

    if (isAdding) {
      if (nextSteps.length === totalSteps) {
        showToast('Repair completed! Great job 🎉', 'success');
      } else {
        showToast('Repair step completed ✓', 'success');
      }
    }

    // Sync to Firestore
    if (auth.currentUser && diagnosticResult.repairSessionId) {
      if (nextSteps.length === totalSteps) {
        repairSessionService.completeSession(diagnosticResult.repairSessionId).catch((e) => console.error(e));
      } else {
        const remainingMinutes = Math.round(
          (diagnosticResult.estimatedTimeMinutes || 25) * ((totalSteps - nextSteps.length) / totalSteps)
        );
        repairSessionService
          .updateSession(diagnosticResult.repairSessionId, {
            completedSteps: nextSteps,
            currentStep: Math.min(totalSteps, nextSteps.length + 1),
            progressPercentage: progress,
            estimatedRemainingTime: `~${remainingMinutes || 5} mins remaining`,
          })
          .catch((e) => console.error(e));
      }
    }

    // Check if 100% completed
    if (nextSteps.length === totalSteps && !isCelebrated) {
      setIsCelebrated(true);

      // Launch Confetti
      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#10b981', '#6366f1', '#f59e0b', '#3b82f6'],
      });

      if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([100, 50, 150]);
      }

      // Notify parent to record completed item
      const completedRepair: RepairItem = {
        id: diagnosticResult.repairSessionId || `rep_${Date.now()}`,
        userId: 'current_user',
        title: `${diagnosticResult.appliance} • ${diagnosticResult.likelyFault}`,
        applianceType: selectedAppliance as any,
        applianceName: diagnosticResult.appliance,
        brand: diagnosticResult.brand || 'Appliance',
        status: 'completed',
        severity: 'medium',
        estimatedSavingsDollars: diagnosticResult.diySavingsUsd || 21,
        estimatedSavingsNaira: diagnosticResult.diySavingsNaira || 24500,
        techFeeAvoidedNaira: diagnosticResult.techFeeAvoidedNaira || diagnosticResult.diySavingsNaira || 11500,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progressPercent: 100,
      };

      if (onCompleteRepair) {
        onCompleteRepair(completedRepair);
      }

      // Generate Repair Summary
      const summary = await gemmaService.generateRepairSummary({
        sessionContext: diagnosticResult,
        timeSpentMinutes: diagnosticResult.estimatedTimeMinutes || 25,
      });
      setRepairSummary(summary);
      setModalMode('summary');
    }
  };

  // Companion Chat submit handler
  const handleSendCompanionMessage = async () => {
    if ((!companionInputText.trim() && !companionFollowUpImage) || isCompanionThinking || !diagnosticResult) return;

    const userText = companionInputText;
    const userImg = companionFollowUpImage;

    const userMsg: CompanionMessage = {
      id: `usr_${Date.now()}`,
      sender: 'user',
      text: userText || (userImg ? 'Uploaded follow-up photo of replaced part.' : ''),
      image: userImg || undefined,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCompanionMessages((prev) => [...prev, userMsg]);
    setCompanionInputText('');
    setCompanionFollowUpImage(null);
    setIsCompanionThinking(true);

    try {
      const activeStepObj = diagnosticResult.steps.find((s) => s.stepNumber === currentStepNumber);
      const completedStepObjs = diagnosticResult.steps.filter((s) => completedSteps.includes(s.stepNumber));

      const response = await gemmaService.sendCompanionMessage({
        repairSessionId: diagnosticResult.repairSessionId,
        message: userText,
        followUpImage: userImg || undefined,
        sessionContext: {
          ...diagnosticResult,
          completedSteps,
          completedStepTitles: completedStepObjs.map((s) => `Step ${s.stepNumber}: ${cleanStepText(s.title)}`),
          currentStepNumber,
          currentStep: `Step ${currentStepNumber}: ${cleanStepText(activeStepObj?.title || '')}`,
          currentStepObj: activeStepObj
            ? {
                ...activeStepObj,
                title: cleanStepText(activeStepObj.title),
                description: cleanStepText(activeStepObj.description),
                reason: cleanStepText(activeStepObj.reason),
                expectedResult: cleanStepText(activeStepObj.expectedResult),
                commonMistakes: cleanStepText(activeStepObj.commonMistakes),
                safetyWarning: cleanStepText(activeStepObj.safetyWarning),
              }
            : null,
          conversationHistory: companionMessages.slice(-6).map((m) => `${m.sender === 'user' ? 'User' : 'Gemma'}: ${m.text}`),
        },
      });

      const gemmaMsg: CompanionMessage = {
        id: `gem_${Date.now()}`,
        sender: 'gemma',
        text: response.text,
        imageAssessment: response.imageAssessment,
        actionRecommendation: response.actionRecommendation,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setCompanionMessages((prev) => {
        const nextMsgs = [...prev, gemmaMsg];
        if (auth.currentUser && diagnosticResult?.repairSessionId) {
          repairSessionService
            .updateSession(diagnosticResult.repairSessionId, {
              gemmaHistory: nextMsgs,
            })
            .catch((e) => console.error(e));
        }
        return nextMsgs;
      });
    } catch (err) {
      console.error('Companion query failed:', err);
    } finally {
      setIsCompanionThinking(false);
    }
  };

  // Confidence Level badge styling
  const getConfidenceBadge = (score: number) => {
    if (score >= 90) return { label: 'Highly Confident', bg: 'bg-emerald-500/10 text-emerald-600 border-emerald-200' };
    if (score >= 70) return { label: 'Likely Diagnosis', bg: 'bg-indigo-500/10 text-indigo-600 border-indigo-200' };
    if (score >= 40) return { label: 'Possible Diagnosis', bg: 'bg-amber-500/10 text-amber-600 border-amber-200' };
    return { label: 'Insufficient Evidence', bg: 'bg-rose-500/10 text-rose-600 border-rose-200' };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-[#0A0F1E]/80 backdrop-blur-md animate-in fade-in overflow-y-auto">
      
      <div className="relative w-full max-w-4xl max-h-[92vh] my-auto overflow-hidden rounded-3xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] shadow-2xl flex flex-col justify-between transition-all">
        
        {/* TOP NAVBAR HEADER */}
        <div className="sticky top-0 z-30 px-6 py-4 bg-[#111827]/95 backdrop-blur-md border-b border-[rgba(99,102,241,0.15)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <RepairLensLogo className="w-8 h-8 text-[#10B981]" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-[#F9FAFB] tracking-tight">RepairLens AI</span>
                <span className="px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold border border-[#10B981]/30 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#10B981]" /> Gemma 4 31B
                </span>
              </div>
              <p className="text-xs text-[#9CA3AF] font-medium hidden sm:block">
                Professional Multimodal Household Appliance Engineer
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {modalMode === 'guide' && (
              <button
                onClick={() => setModalMode('result')}
                className="px-3 py-1.5 rounded-xl border border-[rgba(99,102,241,0.2)] text-xs font-semibold text-[#F9FAFB] hover:bg-[#111827] flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#9CA3AF]" /> Back to Diagnosis
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-full text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#111827] transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* MODAL MAIN CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 bg-[#0A0F1E]">

          {/* ==================================================== */}
          {/* MODE 1: MAIN DIAGNOSIS SCREEN (THREE EQUAL OPTIONS) */}
          {/* ==================================================== */}
          {modalMode === 'input' && (
            <div className="space-y-6 max-w-3xl mx-auto">
              
              {/* Header Title */}
              <div className="text-center space-y-1.5 mb-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
                  Multimodal AI Diagnosis
                </h2>
                <p className="text-xs sm:text-sm text-[#9CA3AF]">
                  Select your preferred input method or combine photo + text description for Gemma AI reasoning.
                </p>
              </div>

              {/* THREE EQUAL INPUT METHOD OPTIONS TABS */}
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-[#111827] rounded-2xl border border-[rgba(99,102,241,0.15)]">
                <button
                  onClick={() => setActiveInputTab('photo')}
                  className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                    activeInputTab === 'photo'
                      ? 'bg-[#1A2035] text-[#10B981] shadow-md border border-[rgba(99,102,241,0.3)]'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  <Camera className="w-4 h-4 text-[#10B981]" />
                  <span>1. Take Photo</span>
                </button>

                <button
                  onClick={() => setActiveInputTab('upload')}
                  className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                    activeInputTab === 'upload'
                      ? 'bg-[#1A2035] text-[#6366F1] shadow-md border border-[rgba(99,102,241,0.3)]'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  <Upload className="w-4 h-4 text-[#6366F1]" />
                  <span>2. Upload Image</span>
                </button>

                <button
                  onClick={() => setActiveInputTab('text')}
                  className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold flex flex-col sm:flex-row items-center justify-center gap-2 transition-all ${
                    activeInputTab === 'text'
                      ? 'bg-[#1A2035] text-amber-400 shadow-md border border-[rgba(99,102,241,0.3)]'
                      : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  <Edit3 className="w-4 h-4 text-amber-400" />
                  <span>3. Describe Problem</span>
                </button>
              </div>

              {/* INPUT TAB 1: LIVE CAMERA PREVIEW */}
              {activeInputTab === 'photo' && (
                <div className="p-5 rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-[#F9FAFB] flex items-center gap-2">
                        <Camera className="w-4 h-4 text-[#10B981]" /> Live Device Camera Preview
                      </h3>
                      <p className="text-xs text-[#9CA3AF]">Point your camera directly at the appliance, motor, or error code.</p>
                    </div>
                    {isCameraActive && (
                      <button
                        onClick={startCamera}
                        className="px-2.5 py-1 rounded-lg bg-[#111827] text-[11px] font-semibold text-[#9CA3AF] hover:text-[#F9FAFB] flex items-center gap-1 border border-[rgba(99,102,241,0.2)]"
                      >
                        <RefreshCw className="w-3 h-3 text-[#9CA3AF]" /> Restart Camera
                      </button>
                    )}
                  </div>

                  <div className="relative aspect-video rounded-xl bg-[#0A0F1E] overflow-hidden flex items-center justify-center border border-[rgba(99,102,241,0.2)]">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${isCameraActive ? 'block' : 'hidden'}`}
                    />
                    {!isCameraActive && (
                      <div className="text-center p-6 space-y-3">
                        <Camera className="w-10 h-10 text-[#6B7280] mx-auto animate-pulse" />
                        <p className="text-xs text-[#9CA3AF]">
                          {cameraError || 'Click below to enable live camera preview.'}
                        </p>
                        <button
                          onClick={startCamera}
                          className="px-4 py-2 rounded-xl bg-[#10B981] text-white text-xs font-bold shadow-md hover:bg-[#0D9668] transition-colors"
                        >
                          Enable Live Camera
                        </button>
                      </div>
                    )}

                    {isCameraActive && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                        <button
                          onClick={capturePhotoFromCamera}
                          className="px-5 py-2.5 rounded-full bg-[#10B981] text-white text-xs font-bold shadow-lg hover:bg-[#0D9668] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-emerald-400"
                        >
                          <Camera className="w-4 h-4" /> Snap Photo
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* INPUT TAB 2: UPLOAD / DRAG & DROP */}
              {activeInputTab === 'upload' && (
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDragging(false);
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  className={`p-8 rounded-2xl border-2 border-dashed transition-all text-center space-y-4 bg-[#1A2035] ${
                    isDragging ? 'border-[#6366F1] bg-[#6366F1]/10 scale-[1.01]' : 'border-[rgba(99,102,241,0.2)] hover:border-[#6366F1]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#111827] border border-[rgba(99,102,241,0.2)] flex items-center justify-center mx-auto text-[#6366F1]">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#F9FAFB]">Drag & Drop appliance photos here</h4>
                    <p className="text-xs text-[#9CA3AF] mt-1">Supports mobile gallery, JPG, PNG, WEBP files</p>
                  </div>
                  <label className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6366F1] text-white text-xs font-bold shadow-md hover:bg-[#5558E6] cursor-pointer transition-colors">
                    <ImageIcon className="w-4 h-4" /> Choose File from Gallery
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => handleFileUpload(e.target.files)}
                    />
                  </label>
                </div>
              )}

              {/* CAPTURED / UPLOADED PHOTOS PREVIEW GRID */}
              {images.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#F9FAFB]">
                      Attached Input Photos ({images.length})
                    </span>
                    <button
                      onClick={() => setImages([])}
                      className="text-[11px] text-rose-400 font-semibold hover:underline"
                    >
                      Clear All Photos
                    </button>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden aspect-square bg-[#0A0F1E] border border-[rgba(99,102,241,0.2)]">
                        <img src={img} alt={`Input ${idx}`} className="w-full h-full object-cover" />
                        <button
                          onClick={() => removeImage(idx)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-[#0A0F1E]/80 text-white opacity-90 hover:bg-rose-600 transition-colors"
                          title="Remove photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* INPUT TAB 3 / ALWAYS VISIBLE TEXT AREA & HELPFUL PRESETS */}
              <div className="p-5 rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-[#F9FAFB] flex items-center gap-2">
                    <Edit3 className="w-4 h-4 text-amber-400" /> Describe Appliance & Problem
                  </label>
                  <span className="text-[11px] text-[#6B7280] font-medium">Optional or Combined with Photo</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase tracking-wider">
                      Appliance Type
                    </label>
                    <input
                      type="text"
                      value={selectedAppliance}
                      onChange={(e) => setSelectedAppliance(e.target.value)}
                      placeholder="e.g. Standing Fan, Petrol Generator, Washing Machine"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.2)] text-[#F9FAFB] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 placeholder:text-[#6B7280]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase tracking-wider">
                      Brand / Model Number
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="e.g. Ox, Sumec Firman, LG, Samsung"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.2)] text-[#F9FAFB] text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 placeholder:text-[#6B7280]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#9CA3AF] mb-1 uppercase tracking-wider">
                    Detailed Symptoms
                  </label>
                  <textarea
                    rows={3}
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                    placeholder="e.g. 'My standing fan hums but the blades don't spin.', 'Generator cuts off after 5 minutes under load.'"
                    className="w-full p-3.5 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.2)] text-xs text-[#F9FAFB] leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#10B981]/50 resize-none placeholder:text-[#6B7280]"
                  />
                </div>

                {/* HELPFUL PRESET PROMPTS */}
                <div>
                  <span className="text-[11px] font-bold text-[#9CA3AF] block mb-2">
                    Or Tap a Sample Issue Preset:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {examplePresets.map((preset, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => {
                          setSelectedAppliance(preset.title);
                          setSymptomText(preset.text);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#111827] border border-[rgba(99,102,241,0.2)] text-[11px] font-medium text-[#9CA3AF] hover:bg-[#6366F1]/10 hover:border-[#6366F1] hover:text-[#F9FAFB] transition-all text-left"
                      >
                        ⚡ {preset.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* MAIN SUBMIT ACTION BUTTON */}
              <div className="pt-2">
                <button
                  onClick={handleStartDiagnosis}
                  disabled={!images.length && !symptomText.trim()}
                  className={`w-full py-4 rounded-2xl text-sm font-extrabold text-white shadow-xl flex items-center justify-center gap-2 transition-all ${
                    !images.length && !symptomText.trim()
                      ? 'bg-slate-300 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                  <span>Diagnose with Gemma 4 AI ✦</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* MODE 2: LIVE INVESTIGATION EXPERIENCE (NO LOADING MSG) */}
          {/* ==================================================== */}
          {modalMode === 'investigating' && (
            <div className="py-12 px-4 max-w-xl mx-auto text-center space-y-8">
              
              {/* Animated AI Pulse Icon */}
              <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-[#10B981]/20 animate-ping" />
                <div className="absolute inset-2 rounded-full bg-[#10B981]/10 animate-pulse" />
                <div className="relative w-16 h-16 rounded-2xl bg-[#10B981] text-white flex items-center justify-center shadow-xl">
                  <Cpu className="w-8 h-8 animate-bounce" />
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#F9FAFB] tracking-tight">
                  Gemma AI Diagnostic Investigation
                </h3>
                <p className="text-xs sm:text-sm text-[#9CA3AF]">
                  Multimodal reasoning engine analyzing appliance mechanics and electrical signatures...
                </p>
              </div>

              {/* SMOOTH CONFIDENCE METER INCREMENT */}
              <div className="p-4 rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] shadow-sm space-y-2">
                <div className="flex justify-between items-center text-xs font-extrabold text-[#F9FAFB]">
                  <span>AI Investigation Confidence</span>
                  <span className="text-[#10B981] font-mono text-sm">{liveConfidenceDisplay}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#111827] overflow-hidden p-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#10B981] via-teal-500 to-[#6366F1] transition-all duration-300"
                    style={{ width: `${liveConfidenceDisplay}%` }}
                  />
                </div>
              </div>

              {/* LIVE INVESTIGATION TIMELINE ITEMS */}
              <div className="p-5 rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] shadow-sm space-y-3 text-left">
                {investigationTimeline.map((item, idx) => {
                  const isDone = idx < investigationStepIndex;
                  const isCurrent = idx === investigationStepIndex;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-2.5 rounded-xl transition-all ${
                        isDone
                          ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30'
                          : isCurrent
                          ? 'bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/30 font-bold scale-[1.01]'
                          : 'opacity-40 text-[#6B7280]'
                      }`}
                    >
                      <div className="shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                        ) : isCurrent ? (
                          <Sparkles className="w-4 h-4 text-[#6366F1] animate-spin" />
                        ) : (
                          item.icon
                        )}
                      </div>
                      <span className="text-xs font-semibold">{item.title}</span>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* MODE 3: DIAGNOSIS RESULT (PREMIUM CARDS)            */}
          {/* ==================================================== */}
          {modalMode === 'result' && diagnosticResult && (
            <div className="space-y-6">
              
              {/* RESULT HEADER BANNER */}
              <div className="p-5 rounded-2xl bg-[#111827] border border-[rgba(99,102,241,0.2)] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] text-[10px] font-bold border border-[#10B981]/30">
                      Gemma Diagnostic Report
                    </span>
                    <span className="text-xs text-[#9CA3AF] font-mono">
                      ID: {diagnosticResult.repairSessionId}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[#F9FAFB]">
                    {diagnosticResult.appliance} • {diagnosticResult.likelyFault}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowExplainableAi(!showExplainableAi)}
                    className="px-3 py-2 rounded-xl bg-[#1A2035] border border-[rgba(99,102,241,0.2)] text-xs font-bold text-amber-300 hover:bg-[#0A0F1E] flex items-center gap-1.5 transition-all shadow-sm"
                  >
                    <Info className="w-4 h-4" /> Explainable AI
                  </button>

                  <button
                    onClick={() => setModalMode('guide')}
                    className="px-5 py-2.5 rounded-xl bg-[#10B981] text-slate-950 font-extrabold text-xs shadow-lg hover:bg-[#0D9668] flex items-center gap-2 transition-all"
                  >
                    <span>Start Repair Guide</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* EXPLAINABLE AI OVERLAY PANEL */}
              {showExplainableAi && (
                <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-300/30 text-[#F9FAFB] space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> How did Gemma reach this conclusion?
                    </h3>
                    <button
                      onClick={() => setShowExplainableAi(false)}
                      className="text-xs font-bold text-amber-400 hover:underline"
                    >
                      Hide
                    </button>
                  </div>

                  {/* REASONING PIPELINE STEPS */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-[#1A2035] border border-amber-500/20 space-y-1">
                      <span className="font-bold text-amber-300 block">1. Input Frame Note</span>
                      <p className="text-[#9CA3AF] leading-relaxed">{diagnosticResult.reasoningFlow?.originalImageNote}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1A2035] border border-amber-500/20 space-y-1">
                      <span className="font-bold text-amber-300 block">2. Components & Evidence</span>
                      <p className="text-[#9CA3AF] leading-relaxed">{diagnosticResult.reasoningFlow?.evidence}</p>
                    </div>

                    <div className="p-3 rounded-xl bg-[#1A2035] border border-amber-500/20 space-y-1">
                      <span className="font-bold text-amber-300 block">3. Gemma Logic</span>
                      <p className="text-[#9CA3AF] leading-relaxed">{diagnosticResult.reasoningFlow?.reasoningText}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* PRIMARY METRICS & CARDS GRID */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* CARD 1: CONFIDENCE SCORE METER */}
                <div className="p-5 rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] shadow-sm space-y-3 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                      Diagnosis Confidence
                    </span>
                    <Sparkles className="w-4 h-4 text-[#10B981]" />
                  </div>

                  <div>
                    <div className="text-3xl font-black text-[#F9FAFB] font-mono mb-1">
                      {diagnosticResult.confidenceScore}%
                    </div>
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-extrabold border ${getConfidenceBadge(diagnosticResult.confidenceScore).bg}`}>
                      {getConfidenceBadge(diagnosticResult.confidenceScore).label}
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#111827] overflow-hidden">
                    <div
                      className="h-full bg-[#10B981] rounded-full transition-all duration-1000"
                      style={{ width: `${diagnosticResult.confidenceScore}%` }}
                    />
                  </div>
                </div>

                {/* CARD 2: DUAL COST ESTIMATES (NAIRA ₦ & USD $) */}
                <div className="p-5 rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                      Cost & Savings Estimate
                    </span>
                    <TrendingUp className="w-4 h-4 text-[#6366F1]" />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#9CA3AF] font-medium">Technician Cost:</span>
                      <span className="font-bold text-[#F9FAFB]">
                        ₦{diagnosticResult.professionalCostNaira?.toLocaleString() || '28,000'} (${diagnosticResult.professionalCostUsd || 25})
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#9CA3AF] font-medium">DIY Parts Cost:</span>
                      <span className="font-bold text-[#10B981]">
                        ₦{diagnosticResult.estimatedCostNaira?.toLocaleString() || '3,500'} (${diagnosticResult.estimatedCostUsd || 4})
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[rgba(99,102,241,0.15)] flex justify-between items-center">
                      <span className="text-xs font-extrabold text-[#F9FAFB]">Your DIY Savings:</span>
                      <span className="text-sm font-black text-[#10B981] bg-[#10B981]/10 px-2.5 py-0.5 rounded-lg border border-[#10B981]/30">
                        ₦{diagnosticResult.diySavingsNaira?.toLocaleString() || '24,500'} (${diagnosticResult.diySavingsUsd || 21})
                      </span>
                    </div>
                  </div>
                </div>

                {/* CARD 3: REPAIR DIFFICULTY & TIME */}
                <div className="p-5 rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                      Difficulty & Time
                    </span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-xl bg-amber-500/10 text-amber-400 text-xs font-bold border border-amber-500/30">
                        {diagnosticResult.difficulty || 'Moderate'}
                      </span>
                      <span className="px-3 py-1 rounded-xl bg-[#6366F1]/10 text-[#6366F1] text-xs font-bold border border-[#6366F1]/30">
                        ~{diagnosticResult.estimatedTimeMinutes || 25} Mins
                      </span>
                    </div>

                    <p className="text-[11px] text-[#9CA3AF] leading-relaxed font-normal">
                      Estimated based on standard DIY tool setup and component access.
                    </p>
                  </div>
                </div>

              </div>

              {/* CARD 4: 5-POINT SAFETY CHECK & WARNINGS */}
              <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-amber-400" />
                  <h4 className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                    Gemma 5-Point Safety Verification Check
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-[#1A2035] border border-amber-500/20 space-y-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1">⚡ Electricity</span>
                    <p className="text-[11px] text-[#9CA3AF] leading-tight">{diagnosticResult.safetyChecks?.electricity}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1A2035] border border-amber-500/20 space-y-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1">🔥 Heat</span>
                    <p className="text-[11px] text-[#9CA3AF] leading-tight">{diagnosticResult.safetyChecks?.heat}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1A2035] border border-amber-500/20 space-y-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1">💧 Water</span>
                    <p className="text-[11px] text-[#9CA3AF] leading-tight">{diagnosticResult.safetyChecks?.water}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1A2035] border border-amber-500/20 space-y-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1">⛽ Gas / Fuel</span>
                    <p className="text-[11px] text-[#9CA3AF] leading-tight">{diagnosticResult.safetyChecks?.gas}</p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-[#1A2035] border border-amber-500/20 space-y-1 col-span-2 sm:col-span-1">
                    <span className="font-bold text-amber-300 flex items-center gap-1">⚙️ Moving Parts</span>
                    <p className="text-[11px] text-[#9CA3AF] leading-tight">{diagnosticResult.safetyChecks?.movingParts}</p>
                  </div>
                </div>
              </div>

              {/* CARD 5: REQUIRED TOOLS */}
              <div className="p-5 rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] shadow-sm space-y-2">
                <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider block">
                  Required DIY Tools
                </span>
                <div className="flex flex-wrap gap-2">
                  {diagnosticResult.requiredTools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-3 py-1.5 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.2)] text-xs font-semibold text-[#F9FAFB] flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5 text-[#9CA3AF]" /> {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* FOOTER CTA TO OPEN GUIDE */}
              <div className="pt-2">
                <button
                  onClick={() => setModalMode('guide')}
                  className="w-full py-4 rounded-2xl bg-[#10B981] text-slate-950 text-sm font-extrabold shadow-xl hover:bg-[#0D9668] transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Step-by-Step DIY Repair Companion</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

            </div>
          )}

          {/* ==================================================== */}
          {/* MODE 4: STEP-BY-STEP DIY GUIDE & REPAIR COMPANION    */}
          {/* ==================================================== */}
          {modalMode === 'guide' && diagnosticResult && (
            <div className="space-y-4">
              
              {/* AI RECAP BANNER WHEN RESUMING SESSION */}
              {aiRecapText && (
                <div className="p-4 rounded-2xl bg-[#6366F1]/10 border border-[#6366F1]/30 text-[#F9FAFB] space-y-1.5 shadow-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="p-1 rounded-lg bg-[#6366F1] text-white">
                        <Sparkles className="w-3.5 h-3.5" />
                      </span>
                      <span className="text-xs font-extrabold text-[#6366F1] uppercase tracking-wider">
                        AI Welcome Back Recap • Gemma 4
                      </span>
                    </div>
                    <button
                      onClick={() => setAiRecapText(null)}
                      className="text-[11px] font-bold text-[#9CA3AF] hover:text-[#F9FAFB] transition-colors cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-[#F9FAFB] leading-relaxed font-medium">
                    "{aiRecapText}"
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* LEFT & CENTER: STEP GUIDE & PROGRESS BAR (2 COLS) */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* PROGRESS BAR HEADER */}
                <div className="p-4 rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#F9FAFB] uppercase tracking-wider">
                      Repair Completion Progress
                    </span>
                    <span className="text-xs font-black text-[#10B981] font-mono">
                      {Math.round((completedSteps.length / diagnosticResult.steps.length) * 100)}%
                    </span>
                  </div>

                  <div className="w-full h-3 rounded-full bg-[#111827] overflow-hidden p-0.5">
                    <div
                      className="h-full bg-[#10B981] rounded-full transition-all duration-500"
                      style={{ width: `${(completedSteps.length / diagnosticResult.steps.length) * 100}%` }}
                    />
                  </div>
                </div>

                {/* INDIVIDUAL REPAIR STEPS */}
                <div className="space-y-4">
                  {diagnosticResult.steps.map((step) => {
                    const isChecked = completedSteps.includes(step.stepNumber);
                    const isCurrentStep = step.stepNumber === currentStepNumber && !isChecked;

                    let cardBgStyle = 'bg-[#111827] border-[rgba(99,102,241,0.15)] shadow-xs opacity-90';
                    if (isChecked) {
                      cardBgStyle = 'bg-[#10B981]/15 border-[#10B981]/40 shadow-md shadow-[#10B981]/10';
                    } else if (isCurrentStep) {
                      cardBgStyle = 'bg-[#1A2035] border-[#6366F1] ring-1 ring-[#6366F1]/50 shadow-[0_0_24px_rgba(99,102,241,0.25)] -translate-y-0.5 scale-[1.005] z-10';
                    }

                    return (
                      <motion.div
                        key={step.stepNumber}
                        ref={(el) => (stepRefs.current[step.stepNumber] = el)}
                        initial={false}
                        animate={{
                          scale: isCurrentStep ? 1.005 : 1,
                          y: isCurrentStep ? -2 : 0,
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className={`p-5 rounded-2xl border transition-all space-y-3.5 relative overflow-hidden ${cardBgStyle}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3 flex-1">
                            <button
                              onClick={() => toggleStep(step.stepNumber)}
                              title={isChecked ? "Mark step incomplete" : "Mark step complete"}
                              className={`w-7 h-7 rounded-xl border flex items-center justify-center shrink-0 transition-all cursor-pointer mt-0.5 ${
                                isChecked
                                  ? 'bg-[#10B981] border-[#10B981] text-slate-950 shadow-md shadow-[#10B981]/30 scale-105'
                                  : isCurrentStep
                                  ? 'border-[#6366F1] bg-[#6366F1]/10 text-[#818CF8] hover:border-[#10B981]'
                                  : 'border-[rgba(99,102,241,0.3)] bg-[#111827] text-[#9CA3AF] hover:border-[#10B981]'
                              }`}
                            >
                              {isChecked ? (
                                <motion.div
                                  initial={{ scale: 0, rotate: -45 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                >
                                  <Check className="w-4.5 h-4.5 stroke-[3]" />
                                </motion.div>
                              ) : (
                                <span className="text-xs font-bold">{step.stepNumber}</span>
                              )}
                            </button>

                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-black uppercase tracking-wider text-[#6366F1]">
                                  Step {step.stepNumber}
                                </span>

                                {isChecked && (
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-[11px] font-extrabold tracking-wide"
                                  >
                                    <CheckCircle2 className="w-3 h-3 text-[#10B981]" /> Completed
                                  </motion.span>
                                )}

                                {isCurrentStep && (
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#6366F1]/25 border border-[#6366F1]/50 text-[#818CF8] text-[11px] font-black tracking-wider animate-pulse">
                                    <Sparkles className="w-3 h-3 text-amber-300" /> CURRENT STEP
                                  </span>
                                )}
                              </div>

                              <h4 className="text-base font-extrabold text-[#F9FAFB] tracking-tight leading-snug">
                                {cleanStepText(step.title)}
                              </h4>

                              <p className="text-xs sm:text-sm text-[#9CA3AF] leading-relaxed pt-1">
                                {cleanStepText(step.description)}
                              </p>
                            </div>
                          </div>

                          <span className="px-2.5 py-1 rounded-lg bg-[#111827] text-[11px] font-bold text-[#9CA3AF] border border-[rgba(99,102,241,0.2)] shrink-0 self-start">
                            ~{step.estimatedMinutes} mins
                          </span>
                        </div>

                        {/* REASON & EXPECTED RESULT */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs pt-1">
                          <div className="p-3 rounded-xl bg-[#111827]/80 border border-[rgba(99,102,241,0.15)] space-y-1">
                            <span className="font-bold text-[#F9FAFB] text-xs block">💡 Why this step matters:</span>
                            <p className="text-[#9CA3AF] text-[11px] leading-relaxed">{cleanStepText(step.reason)}</p>
                          </div>

                          <div className="p-3 rounded-xl bg-[#111827]/80 border border-[rgba(99,102,241,0.15)] space-y-1">
                            <span className="font-bold text-[#F9FAFB] text-xs block">🎯 Expected Result:</span>
                            <p className="text-[#9CA3AF] text-[11px] leading-relaxed">{cleanStepText(step.expectedResult)}</p>
                          </div>
                        </div>

                        {/* 👀 VISUAL CHECKLIST (COLLAPSIBLE) */}
                        {(() => {
                          const isExpanded = !!expandedChecklists[step.stepNumber];
                          const checklistItems = getStepVisualChecklistItems(step, diagnosticResult);
                          const cleanTitleStr = cleanStepText(step.title);

                          return (
                            <div className="p-3.5 rounded-xl bg-[#0A0F1E] border border-[rgba(99,102,241,0.2)] text-xs space-y-2.5">
                              <button
                                type="button"
                                onClick={() => toggleVisualChecklist(step.stepNumber)}
                                className="w-full flex items-center justify-between font-extrabold text-[#F9FAFB] hover:text-[#818CF8] transition-colors cursor-pointer py-0.5 select-none"
                              >
                                <span className="flex items-center gap-2 text-xs sm:text-sm">
                                  <span className="text-base">👀</span> Visual Checklist
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30">
                                    {checklistItems.length} checks
                                  </span>
                                </span>
                                <motion.div
                                  animate={{ rotate: isExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="text-[#9CA3AF] p-1 rounded-lg hover:bg-[#1A2035]"
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </motion.div>
                              </button>

                              <AnimatePresence>
                                {isExpanded && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                                    className="overflow-hidden space-y-3 pt-2.5 border-t border-[rgba(99,102,241,0.15)]"
                                  >
                                    <div className="space-y-2">
                                      {checklistItems.map((item, idx) => (
                                        <div key={idx} className="flex items-start gap-2 text-xs text-[#E5E7EB] leading-relaxed">
                                          <span className="text-[#10B981] font-bold shrink-0 mt-0.5">✓</span>
                                          <span>{item}</span>
                                        </div>
                                      ))}
                                    </div>

                                    {/* FOLLOW-UP HELP SECTION */}
                                    <div className="p-3 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.2)] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mt-3">
                                      <span className="text-xs font-semibold text-[#9CA3AF]">
                                        Does yours look different?
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleCompareWithMyRepair(step.stepNumber, cleanTitleStr)}
                                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#6366F1]/20 hover:bg-[#6366F1]/35 border border-[#6366F1]/40 text-[#818CF8] hover:text-white text-xs font-bold transition-all cursor-pointer hover:scale-[1.02] active:scale-95 shadow-xs"
                                      >
                                        <Camera className="w-3.5 h-3.5 text-[#818CF8]" />
                                        <span>📷 Compare With My Repair</span>
                                      </button>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })()}

                        {/* SAFETY WARNING IF PRESENT */}
                        {step.safetyWarning && (
                          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                            <span><strong>Safety Notice:</strong> {cleanStepText(step.safetyWarning)}</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

              </div>

              {/* RIGHT COL: ACTIVE REPAIR COMPANION (1 COL) */}
              <div ref={companionSectionRef} className="lg:col-span-1 rounded-2xl bg-[#111827] text-white border border-[rgba(99,102,241,0.2)] shadow-xl flex flex-col h-[520px]">
                
                {/* COMPANION HEADER */}
                <div className="p-3.5 border-b border-[rgba(99,102,241,0.2)] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#10B981]/20 text-[#10B981]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#F9FAFB]">Repair Companion</h4>
                      <p className="text-[10px] text-[#9CA3AF]">Active Session ID: {diagnosticResult.repairSessionId.substr(0, 12)}</p>
                    </div>
                  </div>
                </div>

                {/* MESSAGES LIST */}
                <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs">
                  {companionMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-3 rounded-2xl max-w-[90%] space-y-1.5 ${
                        msg.sender === 'user'
                          ? 'ml-auto bg-[#6366F1] text-white rounded-tr-none'
                          : 'mr-auto bg-[#1A2035] text-[#F9FAFB] border border-[rgba(99,102,241,0.2)] rounded-tl-none'
                      }`}
                    >
                      <p className="leading-relaxed">{msg.text}</p>

                      {/* IMAGE ASSESSMENT BADGE IF PRESENT */}
                      {msg.imageAssessment && (
                        <div className="p-2 rounded-xl bg-[#0A0F1E] border border-[rgba(99,102,241,0.2)] space-y-1">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            msg.imageAssessment.status === 'Looks correct'
                              ? 'bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/40'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                          }`}>
                            ✓ {msg.imageAssessment.status}
                          </span>
                          <p className="text-[10px] text-[#9CA3AF]">{msg.imageAssessment.details}</p>
                        </div>
                      )}
                    </div>
                  ))}

                  {isCompanionThinking && (
                    <div className="p-2.5 rounded-xl bg-[#1A2035] border border-[rgba(99,102,241,0.2)] text-[#9CA3AF] text-xs flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#10B981] animate-spin" />
                      <span>Gemma AI analyzing repair session...</span>
                    </div>
                  )}
                </div>

                {/* QUICK COMPANION PROMPT SUGGESTIONS */}
                <div className="p-2 bg-[#0A0F1E] border-t border-[rgba(99,102,241,0.2)] flex gap-1.5 overflow-x-auto text-[10px]">
                  <button
                    onClick={() => setCompanionInputText("I don't understand Step 2.")}
                    className="px-2 py-1 rounded bg-[#1A2035] hover:bg-[#111827] text-[#9CA3AF] whitespace-nowrap"
                  >
                    Help with Step 2
                  </button>
                  <button
                    onClick={() => setCompanionInputText("I've completed Step 3.")}
                    className="px-2 py-1 rounded bg-[#1A2035] hover:bg-[#111827] text-[#9CA3AF] whitespace-nowrap"
                  >
                    Step 3 finished
                  </button>
                  <button
                    onClick={() => setCompanionInputText("Does this look correct?")}
                    className="px-2 py-1 rounded bg-[#1A2035] hover:bg-[#111827] text-[#9CA3AF] whitespace-nowrap"
                  >
                    Does this look correct?
                  </button>
                </div>

                {/* INPUT BAR + FOLLOW-UP IMAGE ATTACHMENT */}
                <div className="p-3 border-t border-[rgba(99,102,241,0.2)] space-y-2 bg-[#0A0F1E]">
                  {companionFollowUpImage && (
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-[#10B981]">
                      <img src={companionFollowUpImage} alt="Follow up" className="w-full h-full object-cover" />
                      <button
                        onClick={() => setCompanionFollowUpImage(null)}
                        className="absolute top-0 right-0 p-0.5 bg-[#0A0F1E] text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <label className="p-2 rounded-xl bg-[#1A2035] hover:bg-[#111827] text-[#9CA3AF] hover:text-white cursor-pointer border border-[rgba(99,102,241,0.2)]">
                      <ImageIcon className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (re) => setCompanionFollowUpImage(re.target?.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    <input
                      ref={companionInputRef}
                      type="text"
                      value={companionInputText}
                      onChange={(e) => setCompanionInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendCompanionMessage()}
                      placeholder="Ask Gemma during repair..."
                      className="flex-1 bg-[#1A2035] text-xs text-[#F9FAFB] placeholder-[#6B7280] px-3 py-2 rounded-xl border border-[rgba(99,102,241,0.2)] focus:outline-none focus:ring-1 focus:ring-[#10B981]"
                    />

                    <button
                      onClick={handleSendCompanionMessage}
                      disabled={!companionInputText.trim() && !companionFollowUpImage}
                      className="p-2 rounded-xl bg-[#10B981] text-slate-950 hover:bg-[#0D9668] disabled:opacity-40"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>

            </div>
          </div>
          )}

          {/* ==================================================== */}
          {/* MODE 5: REPAIR COMPLETION SUMMARY & ACHIEVEMENT     */}
          {/* ==================================================== */}
          {modalMode === 'summary' && (() => {
            const estimatedTechFee = diagnosticResult?.professionalCostNaira || 15000;
            const estimatedPartsFee = diagnosticResult?.estimatedCostNaira || 3500;
            const nairaSaved = diagnosticResult?.diySavingsNaira || (estimatedTechFee - estimatedPartsFee);
            const usdSavedVal = (nairaSaved / 1300).toFixed(2);
            const techFeeAvoided = diagnosticResult?.techFeeAvoidedNaira || estimatedTechFee || nairaSaved;

            const itemAppliance = diagnosticResult?.appliance || 'Appliance';
            const displayTitle = repairSummary?.badgeUnlocked || repairSummary?.title || `${itemAppliance} Repair Pro`;
            const displayQuote = repairSummary?.shareableQuote || `You fixed your ${itemAppliance.toLowerCase()}! Great job!`;
            const displayLessons = repairSummary?.lessonsLearned && repairSummary.lessonsLearned.length > 0 
              ? repairSummary.lessonsLearned 
              : [
                  `Always inspect your ${itemAppliance.toLowerCase()} parts carefully.`,
                  `Clean key components every few months.`,
                  `Fix small problems before they cause major failures.`,
                ];

            return (
              <div className="py-8 px-4 max-w-2xl mx-auto text-center space-y-6">
                
                <div className="w-16 h-16 rounded-3xl bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center justify-center mx-auto shadow-xl">
                  <Award className="w-8 h-8 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-[#10B981]/20 text-[#10B981] text-xs font-bold uppercase tracking-wider border border-[#10B981]/30">
                    Achievement Unlocked
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#F9FAFB] tracking-tight">
                    {displayTitle}
                  </h2>
                  <p className="text-xs text-[#9CA3AF] max-w-md mx-auto">
                    {displayQuote}
                  </p>
                </div>

                {/* SAVINGS BADGES GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                  <div className="p-4 rounded-2xl bg-[#1A2035] border border-[#10B981]/30">
                    <span className="text-[11px] text-[#10B981] font-bold uppercase block mb-1">MONEY SAVED (NAIRA)</span>
                    <div className="text-xl font-black text-[#F9FAFB] font-mono">
                      ₦{(nairaSaved ?? 0).toLocaleString()}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1A2035] border border-[#6366F1]/30">
                    <span className="text-[11px] text-[#6366F1] font-bold uppercase block mb-1">MONEY SAVED (USD)</span>
                    <div className="text-xl font-black text-[#F9FAFB] font-mono">
                      ${usdSavedVal}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#1A2035] border border-teal-500/30">
                    <span className="text-[11px] text-teal-400 font-bold uppercase block mb-1">TECHNICIAN FEE AVOIDED</span>
                    <div className="text-xl font-black text-[#F9FAFB] font-mono">
                      ₦{(techFeeAvoided ?? 0).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* LESSONS LEARNED */}
                <div className="p-5 rounded-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] text-left space-y-2">
                  <h4 className="text-xs font-bold text-[#F9FAFB] uppercase tracking-wider">
                    Key Lessons Learned:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-[#9CA3AF]">
                    {displayLessons.map((lesson, lIdx) => (
                      <li key={lIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                        <span>{lesson}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => window.print()}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#111827] text-[#F9FAFB] text-xs font-bold flex items-center justify-center gap-2 shadow-md border border-[rgba(99,102,241,0.2)] hover:bg-[#1A2035] transition-colors"
                  >
                    <Printer className="w-4 h-4" /> Download PDF Summary
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-[#10B981] text-slate-950 text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg hover:bg-[#0D9668] transition-colors"
                  >
                    Done & Back to Dashboard
                  </button>
                </div>

              </div>
            );
          })()}

        </div>

      </div>

    </div>
  );
};
