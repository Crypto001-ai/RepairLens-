import React from 'react';
import { SlidersHorizontal, Languages, Ruler, DollarSign, Volume2, Sparkles, Save, Clock } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';
import { AppSettingsState, LanguageOption, UnitOption, CurrencyOption, ReminderFrequency } from '../types';

interface RepairPreferencesSectionProps {
  settings: AppSettingsState;
  updateSetting: <K extends keyof AppSettingsState>(key: K, value: AppSettingsState[K]) => void;
  onSave: (overrideSettings?: Partial<AppSettingsState>, message?: string) => Promise<void>;
  saving: boolean;
}

const LANGUAGES: { value: LanguageOption; label: string }[] = [
  { value: 'en', label: 'English (US/UK Standard)' },
  { value: 'pcm', label: 'Nigerian Pidgin English 🇳🇬' },
  { value: 'yo', label: 'Èdè Yorùbá' },
  { value: 'ha', label: 'Hausa (Harshen Hausa)' },
  { value: 'ig', label: 'Asụsụ Igbo' },
  { value: 'fr', label: 'Français (French)' },
  { value: 'es', label: 'Español (Spanish)' },
];

const CURRENCIES: { value: CurrencyOption; label: string }[] = [
  { value: 'NGN', label: 'NGN (₦ Nigerian Naira)' },
  { value: 'USD', label: 'USD ($ United States Dollar)' },
  { value: 'EUR', label: 'EUR (€ Euro)' },
  { value: 'GBP', label: 'GBP (£ British Pound)' },
  { value: 'CAD', label: 'CAD ($ Canadian Dollar)' },
];

const FREQUENCIES: { value: ReminderFrequency; label: string }[] = [
  { value: 'daily', label: 'Daily Reminders' },
  { value: 'three_days', label: 'Every 3 Days' },
  { value: 'weekly', label: 'Weekly Summary (Recommended)' },
  { value: 'on_demand', label: 'On-Demand Only' },
  { value: 'never', label: 'Never Send Reminders' },
];

export const RepairPreferencesSection: React.FC<RepairPreferencesSectionProps> = ({
  settings,
  updateSetting,
  onSave,
  saving,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(undefined, 'Repair preferences updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[#F9FAFB] flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-[#6366F1]" />
          Repair & Diagnostic Preferences
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Configure diagnostic unit standards, preferred language, currency display, and audio-visual feedback.
        </p>
      </div>

      {/* Select Controls Grid */}
      <div className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Preferred Language */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Preferred Diagnostic Language
            </label>
            <div className="relative">
              <Languages className="absolute left-3.5 top-3 w-4 h-4 text-[#9CA3AF]" />
              <select
                value={settings.preferredLanguage}
                onChange={(e) => updateSetting('preferredLanguage', e.target.value as LanguageOption)}
                className="w-full rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] pl-10 pr-3.5 py-2.5 text-sm text-[#F9FAFB] focus:border-[#6366F1] focus:outline-none appearance-none cursor-pointer"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value} className="bg-[#111827] text-white">
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Preferred Currency */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Preferred Currency Display
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3.5 top-3 w-4 h-4 text-[#9CA3AF]" />
              <select
                value={settings.preferredCurrency}
                onChange={(e) => updateSetting('preferredCurrency', e.target.value as CurrencyOption)}
                className="w-full rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] pl-10 pr-3.5 py-2.5 text-sm text-[#F9FAFB] focus:border-[#6366F1] focus:outline-none appearance-none cursor-pointer"
              >
                {CURRENCIES.map((curr) => (
                  <option key={curr.value} value={curr.value} className="bg-[#111827] text-white">
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Measurement Units */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Measurement Units System
            </label>
            <div className="relative">
              <Ruler className="absolute left-3.5 top-3 w-4 h-4 text-[#9CA3AF]" />
              <select
                value={settings.measurementUnits}
                onChange={(e) => updateSetting('measurementUnits', e.target.value as UnitOption)}
                className="w-full rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] pl-10 pr-3.5 py-2.5 text-sm text-[#F9FAFB] focus:border-[#6366F1] focus:outline-none appearance-none cursor-pointer"
              >
                <option value="metric" className="bg-[#111827] text-white">
                  Metric (mm, cm, Liters, °C)
                </option>
                <option value="imperial" className="bg-[#111827] text-white">
                  Imperial (Inches, Gallons, °F)
                </option>
              </select>
            </div>
          </div>

          {/* Reminder Frequency */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Repair Follow-Up Frequency
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3 w-4 h-4 text-[#9CA3AF]" />
              <select
                value={settings.repairReminderFrequency}
                onChange={(e) => updateSetting('repairReminderFrequency', e.target.value as ReminderFrequency)}
                className="w-full rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] pl-10 pr-3.5 py-2.5 text-sm text-[#F9FAFB] focus:border-[#6366F1] focus:outline-none appearance-none cursor-pointer"
              >
                {FREQUENCIES.map((freq) => (
                  <option key={freq.value} value={freq.value} className="bg-[#111827] text-white">
                    {freq.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Feature Toggles */}
      <div className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
          Automation & Media Effects
        </label>

        <ToggleSwitch
          checked={settings.autoSaveProgress}
          onChange={(val) => updateSetting('autoSaveProgress', val)}
          label="Auto-Save Repair Progress"
          description="Automatically sync finished steps and companion image notes as you complete them."
        />

        <ToggleSwitch
          checked={settings.enableCelebrationAnimations}
          onChange={(val) => updateSetting('enableCelebrationAnimations', val)}
          label="Enable Celebration Animations"
          description="Play interactive confetti and celebratory badge animations when finishing repairs."
        />

        <ToggleSwitch
          checked={settings.enableSoundEffects}
          onChange={(val) => updateSetting('enableSoundEffects', val)}
          label="Enable Sound Effects"
          description="Play subtle audio cues when steps complete or Gemma companion messages arrive."
        />
      </div>

      {/* Save Action */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-sm shadow-md hover:shadow-indigo-500/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          Save Repair Preferences
        </button>
      </div>
    </form>
  );
};
