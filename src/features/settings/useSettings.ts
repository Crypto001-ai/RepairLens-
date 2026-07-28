import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { updateUserProfileData } from '../../firebase/auth';
import { AppSettingsState } from './types';

const SETTINGS_STORAGE_KEY = 'repairlens_settings_v2';

const defaultSettings: AppSettingsState = {
  displayName: '',
  photoURL: '',
  country: 'Nigeria',
  timeZone: 'Africa/Lagos (WAT, UTC+1)',
  theme: 'dark',
  repairReminders: true,
  activeSessionReminders: true,
  achievementNotifications: true,
  productUpdates: false,
  preferredLanguage: 'en',
  measurementUnits: 'metric',
  preferredCurrency: 'NGN',
  autoSaveProgress: true,
  repairReminderFrequency: 'weekly',
  enableCelebrationAnimations: true,
  enableSoundEffects: true,
};

export function useSettings() {
  const { user, profile, refreshProfile } = useAuth();
  const [settings, setSettings] = useState<AppSettingsState>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        return { ...defaultSettings, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed to parse local settings:', e);
    }
    return defaultSettings;
  });

  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Sync profile values when auth profile loads
  useEffect(() => {
    if (profile) {
      setSettings((prev) => ({
        ...prev,
        displayName: prev.displayName || profile.displayName || user?.displayName || '',
        photoURL: prev.photoURL || profile.photoURL || user?.photoURL || '',
      }));
    }
  }, [profile, user]);

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'light') {
      root.classList.add('light-theme-mode');
      root.classList.remove('dark');
    } else if (settings.theme === 'dark') {
      root.classList.remove('light-theme-mode');
      root.classList.add('dark');
    } else {
      // System default
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (isSystemDark) {
        root.classList.remove('light-theme-mode');
        root.classList.add('dark');
      } else {
        root.classList.add('light-theme-mode');
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  const showToast = useCallback((text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  }, []);

  const updateSetting = useCallback(<K extends keyof AppSettingsState>(key: K, value: AppSettingsState[K]) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save settings locally:', err);
      }
      return next;
    });
  }, []);

  const saveSettings = useCallback(
    async (overrideSettings?: Partial<AppSettingsState>, customSuccessMessage?: string) => {
      setSaving(true);
      try {
        const nextSettings = { ...settings, ...overrideSettings };
        setSettings(nextSettings);
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextSettings));

        if (user && user.uid) {
          await updateUserProfileData(user.uid, {
            displayName: nextSettings.displayName,
            photoURL: nextSettings.photoURL,
          });
          await refreshProfile();
        }

        showToast(customSuccessMessage || 'Settings saved successfully!', 'success');
      } catch (err: any) {
        console.error('Failed to save settings:', err);
        showToast(err.message || 'Failed to save settings. Please try again.', 'error');
      } finally {
        setSaving(false);
      }
    },
    [settings, user, refreshProfile, showToast]
  );

  return {
    settings,
    updateSetting,
    saveSettings,
    saving,
    toastMessage,
    showToast,
  };
}
