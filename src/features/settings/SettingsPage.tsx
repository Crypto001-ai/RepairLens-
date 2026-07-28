import React, { useState } from 'react';
import {
  User,
  Palette,
  Bell,
  SlidersHorizontal,
  ShieldCheck,
  Database,
  UserCheck,
  Info,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useSettings } from './useSettings';
import { SettingsCategory } from './types';

import { GeneralSection } from './components/GeneralSection';
import { AppearanceSection } from './components/AppearanceSection';
import { NotificationsSection } from './components/NotificationsSection';
import { RepairPreferencesSection } from './components/RepairPreferencesSection';
import { PrivacySecuritySection } from './components/PrivacySecuritySection';
import { DataStorageSection } from './components/DataStorageSection';
import { AccountSection } from './components/AccountSection';
import { AboutSection } from './components/AboutSection';

interface CategoryNavItem {
  id: SettingsCategory;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const CATEGORIES: CategoryNavItem[] = [
  {
    id: 'general',
    label: 'General',
    description: 'Display name, avatar, region',
    icon: User,
  },
  {
    id: 'appearance',
    label: 'Appearance',
    description: 'Light, dark, live preview',
    icon: Palette,
  },
  {
    id: 'notifications',
    label: 'Notifications',
    description: 'Reminders & alerts',
    icon: Bell,
  },
  {
    id: 'preferences',
    label: 'Repair Preferences',
    description: 'Units, currency, language',
    icon: SlidersHorizontal,
  },
  {
    id: 'privacy',
    label: 'Privacy & Security',
    description: 'Password, sessions, delete',
    icon: ShieldCheck,
  },
  {
    id: 'data',
    label: 'Data & Storage',
    description: 'Metrics, export JSON, CSV',
    icon: Database,
  },
  {
    id: 'account',
    label: 'Account',
    description: 'Plan, creation date, UID',
    icon: UserCheck,
  },
  {
    id: 'about',
    label: 'About',
    description: 'Version, Gemma 4, licenses',
    icon: Info,
    badge: 'v1.4.2',
  },
];

export const SettingsPage: React.FC = () => {
  const { logout } = useAuth();
  const { settings, updateSetting, saveSettings, saving, toastMessage, showToast } = useSettings();
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Filter categories by search query
  const filteredCategories = CATEGORIES.filter(
    (cat) =>
      cat.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteAccount = async () => {
    if (deleteInput.trim().toUpperCase() !== 'DELETE') {
      showToast('Please type "DELETE" to confirm account deletion.', 'error');
      return;
    }

    setDeletingAccount(true);
    setTimeout(async () => {
      setDeletingAccount(false);
      setShowDeleteModal(false);
      showToast('Account successfully deleted.', 'success');
      await logout();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F9FAFB] pb-24 font-sans selection:bg-[#6366F1]/30">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-2xl backdrop-blur-md animate-slideIn ${
            toastMessage.type === 'success'
              ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#F9FAFB] shadow-emerald-500/10'
              : 'bg-red-500/15 border-red-500/40 text-[#F9FAFB] shadow-red-500/10'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          )}
          <span className="text-xs font-bold">{toastMessage.text}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(99,102,241,0.15)] pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black text-[#F9FAFB] tracking-tight flex items-center gap-3">
              Application Settings
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30">
                Gemma 4 Edge Connected
              </span>
            </h1>
            <p className="text-xs text-[#9CA3AF]">
              Configure workspace appearance, repair unit standards, safety alerts, and account preferences.
            </p>
          </div>

          {/* Quick Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-[#9CA3AF]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search settings..."
              className="w-full rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] pl-10 pr-3.5 py-2 text-xs text-[#F9FAFB] placeholder-[#9CA3AF] focus:border-[#6366F1] focus:ring-1 focus:ring-[#6366F1] focus:outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-[#9CA3AF] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Responsive Layout: Mobile Tabs / Desktop Left Sidebar + Right Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Category Sidebar */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-2 lg:sticky lg:top-8">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] px-1 block mb-2">
              Categories ({filteredCategories.length})
            </span>

            {/* Mobile horizontal scroll / Desktop vertical stack */}
            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 scrollbar-none">
              {filteredCategories.map((cat) => {
                const Icon = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex-shrink-0 lg:flex-shrink flex items-center justify-between gap-3 group hover:-translate-y-0.5 ${
                      isActive
                        ? 'border-[#6366F1] bg-[#1A2035] ring-2 ring-[#6366F1]/40 shadow-lg shadow-indigo-500/10'
                        : 'border-[rgba(99,102,241,0.12)] bg-[#111827]/70 hover:bg-[#1A2035]/60 hover:border-[rgba(99,102,241,0.3)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-xl transition-colors ${
                          isActive
                            ? 'bg-[#6366F1] text-white shadow-md'
                            : 'bg-[#111827] border border-[rgba(99,102,241,0.2)] text-[#9CA3AF] group-hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="space-y-0.5">
                        <span
                          className={`text-xs font-bold block ${
                            isActive ? 'text-[#F9FAFB]' : 'text-[#9CA3AF] group-hover:text-[#F9FAFB]'
                          }`}
                        >
                          {cat.label}
                        </span>
                        <span className="text-[10px] text-[#9CA3AF] hidden sm:block lg:block">
                          {cat.description}
                        </span>
                      </div>
                    </div>

                    {cat.badge && (
                      <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 hidden lg:inline-block">
                        {cat.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Content Panel */}
          <div className="lg:col-span-8 xl:col-span-9">
            <div className="rounded-3xl border border-[rgba(99,102,241,0.18)] bg-[#0F1629]/90 backdrop-blur-md p-6 sm:p-8 shadow-xl shadow-black/40 min-h-[550px] transition-all duration-300">
              {activeCategory === 'general' && (
                <GeneralSection
                  settings={settings}
                  updateSetting={updateSetting}
                  onSave={saveSettings}
                  saving={saving}
                />
              )}

              {activeCategory === 'appearance' && (
                <AppearanceSection
                  settings={settings}
                  updateSetting={updateSetting}
                  onSave={saveSettings}
                  saving={saving}
                />
              )}

              {activeCategory === 'notifications' && (
                <NotificationsSection
                  settings={settings}
                  updateSetting={updateSetting}
                  onSave={saveSettings}
                  saving={saving}
                />
              )}

              {activeCategory === 'preferences' && (
                <RepairPreferencesSection
                  settings={settings}
                  updateSetting={updateSetting}
                  onSave={saveSettings}
                  saving={saving}
                />
              )}

              {activeCategory === 'privacy' && (
                <PrivacySecuritySection
                  showToast={showToast}
                  onRequestDeleteAccount={() => setShowDeleteModal(true)}
                />
              )}

              {activeCategory === 'data' && <DataStorageSection showToast={showToast} />}

              {activeCategory === 'account' && <AccountSection showToast={showToast} />}

              {activeCategory === 'about' && <AboutSection />}
            </div>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-[#1A2035] border border-red-500/40 rounded-3xl shadow-2xl p-6 space-y-5">
            <div className="flex items-center gap-3 text-red-400">
              <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#F9FAFB]">Confirm Account Deletion</h3>
                <p className="text-xs text-[#9CA3AF]">This action is permanent and cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-[#9CA3AF] leading-relaxed bg-[#111827] p-3.5 rounded-xl border border-white/5">
              All saved DIY repair logs, companion image histories, money saved milestones, and custom settings will be erased forever.
            </p>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#F9FAFB]">
                Type <span className="font-mono text-red-400 font-bold">DELETE</span> to confirm:
              </label>
              <input
                type="text"
                value={deleteInput}
                onChange={(e) => setDeleteInput(e.target.value)}
                placeholder="DELETE"
                className="w-full rounded-xl border border-red-500/30 bg-[#111827] px-3.5 py-2.5 text-sm text-[#F9FAFB] font-mono focus:border-red-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteInput('');
                }}
                className="px-4 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-xs font-bold text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={deletingAccount || deleteInput.trim().toUpperCase() !== 'DELETE'}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                {deletingAccount ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Permanently Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
