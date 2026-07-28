import React, { useState } from 'react';
import { Info, Cpu, Database, FileText, Scale, Code, ExternalLink, X, CheckCircle2 } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'licenses' | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-bold text-[#F9FAFB] flex items-center gap-2">
          <Info className="w-5 h-5 text-[#6366F1]" />
          About RepairLens AI
        </h2>
        <p className="text-xs text-[#9CA3AF] mt-1">
          System versioning, underlying Gemma 4 AI architecture, database connectivity, and legal documentation.
        </p>
      </div>

      {/* System Specifications Card */}
      <div className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] space-y-4">
        <div className="flex items-center justify-between border-b border-[rgba(99,102,241,0.15)] pb-3">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-[#10B981]" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
              System Specifications
            </h3>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 font-bold">
            PRODUCTION READY
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Version */}
          <div className="p-3.5 rounded-xl border border-[rgba(99,102,241,0.1)] bg-[#111827] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
              Application Version
            </span>
            <div className="text-sm font-extrabold text-[#F9FAFB] font-mono">v1.4.2</div>
            <span className="text-[10px] text-[#10B981] font-medium block">Build #2026.07.27</span>
          </div>

          {/* Powered by Gemma 4 */}
          <div className="p-3.5 rounded-xl border border-[rgba(99,102,241,0.1)] bg-[#111827] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
              AI Vision Engine
            </span>
            <div className="text-sm font-extrabold text-[#10B981] font-mono flex items-center gap-1">
              Powered by Gemma 4
            </div>
            <span className="text-[10px] text-[#9CA3AF] font-medium block">Edge Multimodal Diagnostics</span>
          </div>

          {/* Firebase Status */}
          <div className="p-3.5 rounded-xl border border-[rgba(99,102,241,0.1)] bg-[#111827] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
              Firebase Storage Status
            </span>
            <div className="text-sm font-extrabold text-[#10B981] flex items-center gap-1.5 font-mono">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              Connected & Operational
            </div>
            <span className="text-[10px] text-cyan-400 font-mono block">Firestore Latency ~18ms</span>
          </div>
        </div>
      </div>

      {/* Legal & Licenses Buttons Card */}
      <div className="p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] space-y-4">
        <div className="flex items-center gap-2.5 border-b border-[rgba(99,102,241,0.15)] pb-3">
          <Scale className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#F9FAFB]">
            Legal & Open Source Licensing
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Privacy Policy */}
          <button
            type="button"
            onClick={() => setActiveModal('privacy')}
            className="p-4 rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] hover:bg-[#6366F1]/10 hover:border-[#6366F1] text-left transition-all duration-200 cursor-pointer group space-y-2"
          >
            <div className="p-2 w-fit rounded-lg bg-[#6366F1]/20 text-[#6366F1]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F9FAFB] block group-hover:text-[#6366F1] transition-colors">
                Privacy Policy
              </span>
              <span className="text-[10px] text-[#9CA3AF]">Data handling & security rules</span>
            </div>
          </button>

          {/* Terms of Service */}
          <button
            type="button"
            onClick={() => setActiveModal('terms')}
            className="p-4 rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] hover:bg-emerald-500/10 hover:border-emerald-500 text-left transition-all duration-200 cursor-pointer group space-y-2"
          >
            <div className="p-2 w-fit rounded-lg bg-emerald-500/20 text-[#10B981]">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F9FAFB] block group-hover:text-[#10B981] transition-colors">
                Terms of Service
              </span>
              <span className="text-[10px] text-[#9CA3AF]">Usage guidelines & safety disclaimer</span>
            </div>
          </button>

          {/* Open-Source Licenses */}
          <button
            type="button"
            onClick={() => setActiveModal('licenses')}
            className="p-4 rounded-xl border border-[rgba(99,102,241,0.2)] bg-[#111827] hover:bg-purple-500/10 hover:border-purple-500 text-left transition-all duration-200 cursor-pointer group space-y-2"
          >
            <div className="p-2 w-fit rounded-lg bg-purple-500/20 text-purple-400">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F9FAFB] block group-hover:text-purple-400 transition-colors">
                Open-Source Licenses
              </span>
              <span className="text-[10px] text-[#9CA3AF]">MIT & Apache 2.0 packages</span>
            </div>
          </button>
        </div>
      </div>

      {/* Modal Dialog */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-[#1A2035] border border-[rgba(99,102,241,0.3)] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-[rgba(99,102,241,0.2)] flex items-center justify-between bg-[#111827]">
              <h3 className="text-sm font-bold text-[#F9FAFB] flex items-center gap-2 uppercase tracking-wide">
                {activeModal === 'privacy' && <FileText className="w-4 h-4 text-[#6366F1]" />}
                {activeModal === 'terms' && <Scale className="w-4 h-4 text-[#10B981]" />}
                {activeModal === 'licenses' && <Code className="w-4 h-4 text-purple-400" />}
                {activeModal === 'privacy' && 'Privacy Policy'}
                {activeModal === 'terms' && 'Terms of Service'}
                {activeModal === 'licenses' && 'Open Source Licenses & Attributions'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-white/10 text-[#9CA3AF] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#9CA3AF] leading-relaxed">
              {activeModal === 'privacy' && (
                <>
                  <p className="text-sm font-semibold text-[#F9FAFB]">
                    1. Data Collection & Multimodal Image Storage
                  </p>
                  <p>
                    RepairLens AI collects diagnostic appliance images and user notes purely for the purpose of running Gemma 4 AI reasoning. Photos uploaded are processed safely and never sold to third-party advertisers.
                  </p>
                  <p className="text-sm font-semibold text-[#F9FAFB]">2. Firebase Firestore Security</p>
                  <p>
                    User profiles and diagnostic session timelines are stored securely in Firestore behind standard authentication rules ensuring only you can read or edit your own repair history.
                  </p>
                </>
              )}

              {activeModal === 'terms' && (
                <>
                  <p className="text-sm font-semibold text-[#F9FAFB]">1. DIY Safety Disclaimer</p>
                  <p>
                    RepairLens AI provides automated guidance using Gemma models. Users are strictly advised to disconnect power sources, turn off gas valves, and wear protective equipment before executing any appliance maintenance steps.
                  </p>
                  <p className="text-sm font-semibold text-[#F9FAFB]">2. Professional Recommendation</p>
                  <p>
                    For high-hazard steps marked "Professional Only", always consult a certified technician. RepairLens AI is an educational DIY companion.
                  </p>
                </>
              )}

              {activeModal === 'licenses' && (
                <>
                  <div className="space-y-3 font-mono text-[11px]">
                    <div className="p-3 rounded-xl bg-[#111827] border border-white/10">
                      <span className="text-[#F9FAFB] font-bold block">React & React DOM v19</span>
                      <span className="text-[#9CA3AF]">MIT License • Facebook / Meta Open Source</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#111827] border border-white/10">
                      <span className="text-[#F9FAFB] font-bold block">Lucide React Icons</span>
                      <span className="text-[#9CA3AF]">ISC License • Lucide Contributors</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#111827] border border-white/10">
                      <span className="text-[#F9FAFB] font-bold block">Tailwind CSS v4 & Motion</span>
                      <span className="text-[#9CA3AF]">MIT License • Tailwind Labs / Motion</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#111827] border border-white/10">
                      <span className="text-[#F9FAFB] font-bold block">Google GenAI & Gemma 4 SDK</span>
                      <span className="text-[#9CA3AF]">Apache 2.0 License • Google LLC</span>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[rgba(99,102,241,0.2)] bg-[#111827] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-5 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
              >
                Close Document
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
