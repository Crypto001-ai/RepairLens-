import React, { useState } from 'react';
import { Palette, Sun, Moon, Monitor, Check, Eye, Sparkles } from 'lucide-react';
import { AppSettingsState, ThemeOption } from '../types';

interface AppearanceSectionProps {
  settings: AppSettingsState;
  updateSetting: <K extends keyof AppSettingsState>(key: K, value: AppSettingsState[K]) => void;
  onSave: (overrideSettings?: Partial<AppSettingsState>, message?: string) => Promise<void>;
  saving: boolean;
}

export const AppearanceSection: React.FC<AppearanceSectionProps> = ({
  settings,
  updateSetting,
  onSave,
  saving,
}) => {
  const [selectedTheme, setSelectedTheme] = useState<ThemeOption>(settings.theme);

  const handleApply = async (theme: ThemeOption) => {
    setSelectedTheme(theme);
    updateSetting('theme', theme);
    await onSave({ theme }, `Appearance theme set to ${theme.toUpperCase()}!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[#F9FAFB] flex items-center gap-2">
          <Palette className="w-5 h-5 text-[#6366F1]" />
          Appearance & Theme Preferences
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1">
          Customize how RepairLens AI looks on your device with interactive live previews.
        </p>
      </div>

      {/* Theme Options Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Dark Mode */}
        <button
          type="button"
          onClick={() => handleApply('dark')}
          className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
            selectedTheme === 'dark'
              ? 'border-[#6366F1] bg-[#1A2035] ring-2 ring-[#6366F1]/50 shadow-lg shadow-indigo-500/10'
              : 'border-[rgba(99,102,241,0.15)] bg-[#111827]/80 hover:border-[#6366F1]/40 hover:bg-[#1A2035]/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-[#0A0F1E] border border-[rgba(99,102,241,0.2)] text-[#6366F1]">
              <Moon className="w-5 h-5" />
            </div>
            {selectedTheme === 'dark' && (
              <span className="p-1 rounded-full bg-[#6366F1] text-white">
                <Check className="w-3.5 h-3.5 font-bold" />
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-[#F9FAFB]">Dark Mode</h3>
          <p className="text-[11px] text-[#9CA3AF] mt-1">
            Deep navy theme designed for low-light environments and long diagnostic sessions.
          </p>
          <div className="mt-3 h-2 w-full bg-[#0A0F1E] rounded-full overflow-hidden flex">
            <div className="w-1/3 bg-[#6366F1]" />
            <div className="w-1/3 bg-[#10B981]" />
            <div className="w-1/3 bg-[#374151]" />
          </div>
        </button>

        {/* Light Mode */}
        <button
          type="button"
          onClick={() => handleApply('light')}
          className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
            selectedTheme === 'light'
              ? 'border-[#6366F1] bg-[#1A2035] ring-2 ring-[#6366F1]/50 shadow-lg shadow-indigo-500/10'
              : 'border-[rgba(99,102,241,0.15)] bg-[#111827]/80 hover:border-[#6366F1]/40 hover:bg-[#1A2035]/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sun className="w-5 h-5" />
            </div>
            {selectedTheme === 'light' && (
              <span className="p-1 rounded-full bg-[#6366F1] text-white">
                <Check className="w-3.5 h-3.5 font-bold" />
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-[#F9FAFB]">Light Mode</h3>
          <p className="text-[11px] text-[#9CA3AF] mt-1">
            Clean, high-contrast light workspace for bright outdoor or daylight conditions.
          </p>
          <div className="mt-3 h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
            <div className="w-1/3 bg-indigo-600" />
            <div className="w-1/3 bg-emerald-500" />
            <div className="w-1/3 bg-slate-300" />
          </div>
        </button>

        {/* System Default */}
        <button
          type="button"
          onClick={() => handleApply('system')}
          className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative overflow-hidden group ${
            selectedTheme === 'system'
              ? 'border-[#6366F1] bg-[#1A2035] ring-2 ring-[#6366F1]/50 shadow-lg shadow-indigo-500/10'
              : 'border-[rgba(99,102,241,0.15)] bg-[#111827]/80 hover:border-[#6366F1]/40 hover:bg-[#1A2035]/60'
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Monitor className="w-5 h-5" />
            </div>
            {selectedTheme === 'system' && (
              <span className="p-1 rounded-full bg-[#6366F1] text-white">
                <Check className="w-3.5 h-3.5 font-bold" />
              </span>
            )}
          </div>
          <h3 className="text-sm font-bold text-[#F9FAFB]">System Default</h3>
          <p className="text-[11px] text-[#9CA3AF] mt-1">
            Automatically switches theme based on your operating system settings.
          </p>
          <div className="mt-3 h-2 w-full bg-linear-to-r from-[#0A0F1E] to-slate-200 rounded-full" />
        </button>
      </div>

      {/* Live Preview Container */}
      <div className="p-6 rounded-2xl border border-[rgba(99,102,241,0.2)] bg-[#1A2035] space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(99,102,241,0.15)] pb-3">
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
              Interactive Live Theme Preview
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 font-bold">
            {selectedTheme.toUpperCase()} ACTIVE
          </span>
        </div>

        {/* Live Card Preview according to theme */}
        <div
          className={`p-5 rounded-2xl transition-all duration-300 space-y-3 ${
            selectedTheme === 'light'
              ? 'bg-slate-50 text-slate-900 border border-slate-200 shadow-md'
              : 'bg-[#0A0F1E] text-[#F9FAFB] border border-[#6366F1]/30 shadow-xl'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-[#6366F1] text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold">Generator Carburetor Diagnosis</h4>
                <p className={`text-[10px] ${selectedTheme === 'light' ? 'text-slate-500' : 'text-[#9CA3AF]'}`}>
                  RepairLens AI Model Session #8420
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-[#10B981]/20 text-[#10B981]">
              Saved ₦13,000
            </span>
          </div>

          <p className={`text-xs ${selectedTheme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>
            Clean fuel bowl nozzle with wire to unblock main jet. Estimated step time: 15 mins.
          </p>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              className="px-3 py-1.5 rounded-xl bg-[#6366F1] text-white text-xs font-bold shadow-xs hover:bg-[#4F46E5]"
            >
              Start Step 1
            </button>
            <button
              type="button"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                selectedTheme === 'light'
                  ? 'border-slate-300 bg-white text-slate-800'
                  : 'border-[rgba(99,102,241,0.2)] bg-[#111827] text-white'
              }`}
            >
              View Diagram
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
