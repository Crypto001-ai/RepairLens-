import React, { useState } from 'react';
import { User, Globe, Clock, Camera, Check, Save } from 'lucide-react';
import { AppSettingsState } from '../types';

interface GeneralSectionProps {
  settings: AppSettingsState;
  updateSetting: <K extends keyof AppSettingsState>(key: K, value: AppSettingsState[K]) => void;
  onSave: (overrideSettings?: Partial<AppSettingsState>, message?: string) => Promise<void>;
  saving: boolean;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
  'https://lh3.googleusercontent.com/d/1AE73Ycdd8PhPvN-y5bHUPbNRfA8xH-Iu',
];

const COUNTRIES = [
  { code: 'NG', name: 'Nigeria 🇳🇬' },
  { code: 'US', name: 'United States 🇺🇸' },
  { code: 'GB', name: 'United Kingdom 🇬🇧' },
  { code: 'CA', name: 'Canada 🇨🇦' },
  { code: 'GH', name: 'Ghana 🇬🇭' },
  { code: 'ZA', name: 'South Africa 🇿🇦' },
  { code: 'KE', name: 'Kenya 🇰🇪' },
  { code: 'DE', name: 'Germany 🇩🇪' },
  { code: 'FR', name: 'France 🇫🇷' },
  { code: 'AU', name: 'Australia 🇦🇺' },
];

const TIMEZONES = [
  'Africa/Lagos (WAT, UTC+1)',
  'UTC (Coordinated Universal Time)',
  'America/New_York (EST, UTC-5)',
  'America/Chicago (CST, UTC-6)',
  'America/Los_Angeles (PST, UTC-8)',
  'Europe/London (GMT, UTC+0)',
  'Europe/Paris (CET, UTC+1)',
  'Africa/Accra (GMT, UTC+0)',
  'Africa/Johannesburg (SAST, UTC+2)',
  'Asia/Dubai (GST, UTC+4)',
];

export const GeneralSection: React.FC<GeneralSectionProps> = ({
  settings,
  updateSetting,
  onSave,
  saving,
}) => {
  const [customAvatarInput, setCustomAvatarInput] = useState(settings.photoURL || '');
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleSelectAvatar = (url: string) => {
    updateSetting('photoURL', url);
    setCustomAvatarInput(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(undefined, 'General profile settings updated successfully!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-lg font-bold text-[#F9FAFB] flex items-center gap-2">
          <User className="w-5 h-5 text-[#6366F1]" />
          General Account Settings
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Manage your public profile identity, country region, and system time zone.
        </p>
      </div>

      {/* Profile Picture Card */}
      <div className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] space-y-4 hover:border-[rgba(99,102,241,0.3)] transition-all">
        <label className="block text-xs font-bold uppercase tracking-wider text-[#9CA3AF]">
          Profile Avatar
        </label>
        
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="relative group">
            <img
              src={settings.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
              alt="Avatar preview"
              className="w-20 h-20 rounded-2xl object-cover ring-2 ring-[#6366F1] shadow-lg group-hover:opacity-90 transition-opacity"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
              }}
            />
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="absolute -bottom-1 -right-1 p-1.5 rounded-xl bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-md transition-colors"
              title="Change Custom URL"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 flex-1 w-full">
            <span className="text-xs text-[#9CA3AF] block">
              Choose from preset avatars or paste a custom image URL:
            </span>
            <div className="flex flex-wrap gap-2.5">
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectAvatar(url)}
                  className={`relative w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                    settings.photoURL === url
                      ? 'border-[#6366F1] ring-2 ring-[#6366F1]/50 scale-105'
                      : 'border-transparent hover:border-[#6366F1]/50 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt={`Preset ${idx}`} className="w-full h-full object-cover" />
                  {settings.photoURL === url && (
                    <span className="absolute inset-0 bg-[#6366F1]/40 flex items-center justify-center text-white">
                      <Check className="w-4 h-4 font-bold" />
                    </span>
                  )}
                </button>
              ))}
            </div>

            {showUrlInput && (
              <div className="pt-2 animate-fadeIn">
                <input
                  type="url"
                  placeholder="Paste image URL (https://...)"
                  value={customAvatarInput}
                  onChange={(e) => {
                    setCustomAvatarInput(e.target.value);
                    updateSetting('photoURL', e.target.value);
                  }}
                  className="w-full rounded-xl border border-[rgba(99,102,241,0.25)] bg-[#111827] px-3.5 py-2 text-xs text-[#F9FAFB] focus:border-[#6366F1] focus:outline-none"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Form Fields Card */}
      <div className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] space-y-5">
        {/* Display Name */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
            Display Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-3 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              required
              value={settings.displayName}
              onChange={(e) => updateSetting('displayName', e.target.value)}
              placeholder="Your name or DIY Alias"
              className="w-full rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] pl-10 pr-3.5 py-2.5 text-sm text-[#F9FAFB] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] focus:outline-none transition-all"
            />
          </div>
        </div>

        {/* Country & Timezone Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Country / Region
            </label>
            <div className="relative">
              <Globe className="absolute left-3.5 top-3 w-4 h-4 text-[#9CA3AF]" />
              <select
                value={settings.country}
                onChange={(e) => updateSetting('country', e.target.value)}
                className="w-full rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] pl-10 pr-3.5 py-2.5 text-sm text-[#F9FAFB] focus:border-[#6366F1] focus:outline-none transition-all appearance-none cursor-pointer"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.name} className="bg-[#111827] text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">
              Time Zone
            </label>
            <div className="relative">
              <Clock className="absolute left-3.5 top-3 w-4 h-4 text-[#9CA3AF]" />
              <select
                value={settings.timeZone}
                onChange={(e) => updateSetting('timeZone', e.target.value)}
                className="w-full rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] pl-10 pr-3.5 py-2.5 text-sm text-[#F9FAFB] focus:border-[#6366F1] focus:outline-none transition-all appearance-none cursor-pointer"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz} value={tz} className="bg-[#111827] text-white">
                    {tz}
                  </option>
                ))}
              </select>
            </div>
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
          Save General Settings
        </button>
      </div>
    </form>
  );
};
