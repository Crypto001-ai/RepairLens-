import React from 'react';
import { ShieldAlert, ChevronLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const DisclaimerPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#F9FAFB] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <div>
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-[#9CA3AF] hover:text-[#F9FAFB]">
              <ChevronLeft className="w-4 h-4 mr-1" /> Back to Home
            </Button>
          </Link>
        </div>

        {/* Card Container */}
        <div className="p-8 sm:p-10 rounded-3xl bg-[#1A2035] border border-[rgba(99,102,241,0.15)] shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
                Safety Disclaimer
              </h1>
              <p className="text-xs text-[#9CA3AF] font-medium">Important User Safety Notice</p>
            </div>
          </div>

          <div className="text-sm text-[#9CA3AF] leading-relaxed space-y-4 font-normal">
            <p>
              RepairLens AI provides repair guidance for informational and educational purposes only. Always disconnect power before attempting any electrical repair. For gas appliances, always shut off gas supply first.
            </p>
            <p>
              RepairLens AI and its creators are not liable for any injury, damage or loss resulting from following repair guidance. When in doubt, always consult a certified professional technician. Safety is always your responsibility.
            </p>
          </div>

          <div className="pt-6 border-t border-[rgba(99,102,241,0.15)] flex items-center justify-between text-xs text-[#6B7280]">
            <span>Last updated: July 2026</span>
            <span className="font-semibold text-[#10B981]">RepairLens AI Safety Standard</span>
          </div>
        </div>

      </div>
    </div>
  );
};
