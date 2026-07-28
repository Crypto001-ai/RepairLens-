import React from 'react';
import { Bell, ShieldAlert, Award, Sparkles, Save } from 'lucide-react';
import { ToggleSwitch } from './ToggleSwitch';
import { AppSettingsState } from '../types';

interface NotificationsSectionProps {
  settings: AppSettingsState;
  updateSetting: <K extends keyof AppSettingsState>(key: K, value: AppSettingsState[K]) => void;
  onSave: (overrideSettings?: Partial<AppSettingsState>, message?: string) => Promise<void>;
  saving: boolean;
}

export const NotificationsSection: React.FC<NotificationsSectionProps> = ({
  settings,
  updateSetting,
  onSave,
  saving,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(undefined, 'Notification preferences updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[#F9FAFB] flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#6366F1]" />
          Notification Preferences
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Choose which alerts, repair follow-ups, and product updates you receive.
        </p>
      </div>

      {/* Toggles Container Card */}
      <div className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] space-y-4">
        {/* 1. Repair Reminders */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-[#6366F1] mt-1">
            <Bell className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <ToggleSwitch
              checked={settings.repairReminders}
              onChange={(val) => updateSetting('repairReminders', val)}
              label="Repair Reminders"
              description="Receive gentle reminders to complete open DIY diagnostic steps and follow-ups."
            />
          </div>
        </div>

        {/* 2. Active Session Reminders */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-1">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <ToggleSwitch
              checked={settings.activeSessionReminders}
              onChange={(val) => updateSetting('activeSessionReminders', val)}
              label="Active Session Reminders"
              description="Get instant alerts when an active diagnostic session requires safety confirmation or companion photo upload."
            />
          </div>
        </div>

        {/* 3. Achievement Notifications */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[#10B981] mt-1">
            <Award className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <ToggleSwitch
              checked={settings.achievementNotifications}
              onChange={(val) => updateSetting('achievementNotifications', val)}
              label="Achievement & Savings Milestones"
              description="Celebrate money saved (₦/$) and unlock new DIY Hero badges in your profile."
            />
          </div>
        </div>

        {/* 4. Product Updates */}
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 mt-1">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <ToggleSwitch
              checked={settings.productUpdates}
              onChange={(val) => updateSetting('productUpdates', val)}
              label="Product Updates & Gemma Model News"
              description="Be the first to learn about new appliance diagnosis models, safety recalls, and feature releases."
            />
          </div>
        </div>
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
          Save Notification Settings
        </button>
      </div>
    </form>
  );
};
