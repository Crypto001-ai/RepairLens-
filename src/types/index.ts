export type ApplianceCategory = 
  | 'generator'
  | 'fan'
  | 'washer'
  | 'refrigerator'
  | 'iron'
  | 'pump'
  | 'ac'
  | 'blender'
  | 'microwave'
  | 'oven'
  | 'other';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
  totalSavedDollars: number;
  totalSavedNaira: number;
  totalTechFeesAvoidedNaira: number;
  completedRepairsCount: number;
  diyLevel?: 'beginner' | 'intermediate' | 'expert';
}

export interface RepairItem {
  id: string;
  userId: string;
  title: string;
  applianceType: ApplianceCategory;
  applianceName: string;
  brand: string;
  modelNumber?: string;
  status: 'diagnosed' | 'in_progress' | 'completed' | 'archived' | 'cancelled';
  severity: 'low' | 'medium' | 'high' | 'critical';
  estimatedSavingsDollars: number;
  estimatedSavingsNaira: number;
  techFeeAvoidedNaira: number;
  timeSpentMinutes?: number;
  difficulty?: string;
  confidenceScore?: number;
  createdAt: string;
  updatedAt: string;
  progressPercent: number;
  userNotes?: string;
  diagnosis?: GemmaDiagnosticResult;
  completedSteps?: number[];
  uploadedImages?: string[];
  gemmaHistory?: CompanionMessage[];
  timelineEvents?: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  description?: string;
  type: 'diagnosis' | 'image' | 'step' | 'gemma' | 'completion' | 'note';
}

export interface GemmaDiagnosticInput {
  applianceType: string;
  brand?: string;
  symptomDescription: string;
  imageUrls?: string[];
}

export interface GemmaStepInstruction {
  stepNumber: number;
  title: string;
  description: string;
  reason: string;
  estimatedMinutes: number;
  requiredTools: string[];
  expectedResult: string;
  commonMistakes: string;
  safetyWarning?: string;
  visualChecklist?: string[];
}

export interface GemmaReasoningFlow {
  originalImageNote: string;
  highlightedComponents: string[];
  damagedAreaNotes: string;
  evidence: string;
  reasoningText: string;
}

export interface GemmaSafetyChecks {
  electricity: string;
  heat: string;
  water: string;
  gas: string;
  movingParts: string;
}

export interface GemmaDiagnosticResult {
  repairSessionId: string;
  appliance: string;
  brand?: string;
  confidenceScore: number; // 0 to 100
  confidenceLevel: 'Insufficient Evidence' | 'Possible Diagnosis' | 'Likely Diagnosis' | 'Highly Confident';
  likelyFault: string;
  alternativeCauses: string[];
  estimatedTimeMinutes: number;
  estimatedCostNaira: number;
  estimatedCostUsd: number;
  professionalCostNaira: number;
  professionalCostUsd: number;
  diySavingsNaira: number;
  diySavingsUsd: number;
  techFeeAvoidedNaira: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert Only';
  safetyLevel: 'Safe for DIY' | 'Caution Required' | 'High Hazard' | 'Professional Only';
  safetyChecks: GemmaSafetyChecks;
  safetyWarnings: string[];
  requiredTools: string[];
  reasoningFlow: GemmaReasoningFlow;
  steps: GemmaStepInstruction[];
  followUpQuestion?: string | null;
}

export interface CompanionMessage {
  id: string;
  sender: 'user' | 'gemma';
  text: string;
  timestamp: string;
  image?: string;
  imageAssessment?: {
    status: 'Looks correct' | 'Looks incorrect' | 'Needs adjustment';
    details: string;
    highlightedDifferences: string[];
  };
  actionRecommendation?: string;
}

export interface RepairSummaryResult {
  title: string;
  problemSummary: string;
  solutionSummary: string;
  badgeUnlocked: string;
  lessonsLearned: string[];
  shareableQuote: string;
}

export interface ActiveRepairSession {
  repairSessionId: string;
  userId: string;
  status: 'active' | 'completed' | 'cancelled' | 'archived';
  currentStep: number;
  completedSteps: number[];
  uploadedImages: string[];
  gemmaHistory: CompanionMessage[];
  diagnosis: GemmaDiagnosticResult;
  progressPercentage: number;
  createdAt: string;
  updatedAt: string;
  estimatedRemainingTime: string;
  lastActivity: string;
  aiRecap?: string;
  userNotes?: string;
  timelineEvents?: TimelineEvent[];
}
