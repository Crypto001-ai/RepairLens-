export type SettingsCategory =
  | 'general'
  | 'appearance'
  | 'notifications'
  | 'preferences'
  | 'privacy'
  | 'data'
  | 'account'
  | 'about';

export type ThemeOption = 'dark' | 'light' | 'system';
export type UnitOption = 'metric' | 'imperial';
export type CurrencyOption = 'NGN' | 'USD' | 'EUR' | 'GBP' | 'CAD';
export type LanguageOption = 'en' | 'fr' | 'yo' | 'ha' | 'ig' | 'es' | 'pcm';
export type ReminderFrequency = 'daily' | 'three_days' | 'weekly' | 'on_demand' | 'never';

export interface AppSettingsState {
  // General
  displayName: string;
  photoURL: string;
  country: string;
  timeZone: string;

  // Appearance
  theme: ThemeOption;

  // Notifications
  repairReminders: boolean;
  activeSessionReminders: boolean;
  achievementNotifications: boolean;
  productUpdates: boolean;

  // Repair Preferences
  preferredLanguage: LanguageOption;
  measurementUnits: UnitOption;
  preferredCurrency: CurrencyOption;
  autoSaveProgress: boolean;
  repairReminderFrequency: ReminderFrequency;
  enableCelebrationAnimations: boolean;
  enableSoundEffects: boolean;
}

export interface UserSessionInfo {
  id: string;
  device: string;
  browser: string;
  location: string;
  ipAddress: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface StorageUsageMetrics {
  repairSessionsCount: number;
  storageUsedMb: number;
  imagesUploadedCount: number;
  reportsGeneratedCount: number;
}
