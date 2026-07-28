import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { RepairLensLogo } from './RepairLensLogo';

export const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, elementId: string) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  return (
    <footer className="bg-[#111827] text-[#9CA3AF] border-t border-[rgba(99,102,241,0.15)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <RepairLensLogo className="w-8 h-8" />
              <span className="font-bold text-[#F9FAFB] text-lg tracking-tight">
                RepairLens <span className="text-[#10B981]">AI</span>
              </span>
            </div>
            <p className="text-xs text-[#9CA3AF] leading-relaxed max-w-sm font-normal">
              See it. Diagnose it. Fix it. Empowering homeowners and DIYers to safely diagnose household appliance issues using AI and fix them with step-by-step confidence.
            </p>

          </div>

          {/* Links Grid: 2 Clean Columns */}
          <div className="md:col-span-6 grid grid-cols-2 gap-8">
            
            {/* PRODUCT Column */}
            <div>
              <h4 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider mb-4">PRODUCT</h4>
              <ul className="space-y-3 text-xs font-medium">
                <li>
                  <a 
                    href="#diagnosis" 
                    onClick={(e) => handleScrollTo(e, 'diagnosis')} 
                    className="hover:text-[#10B981] transition-colors cursor-pointer"
                  >
                    AI Diagnostics
                  </a>
                </li>
                <li>
                  <a 
                    href="#how-it-works" 
                    onClick={(e) => handleScrollTo(e, 'how-it-works')} 
                    className="hover:text-[#10B981] transition-colors cursor-pointer"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a 
                    href="#features" 
                    onClick={(e) => handleScrollTo(e, 'features')} 
                    className="hover:text-[#10B981] transition-colors cursor-pointer"
                  >
                    About Us
                  </a>
                </li>
              </ul>
            </div>

            {/* LEGAL & TRUST Column */}
            <div>
              <h4 className="text-xs font-semibold text-[#F9FAFB] uppercase tracking-wider mb-4">LEGAL & TRUST</h4>
              <ul className="space-y-3 text-xs font-medium">
                <li>
                  <Link 
                    to="/disclaimer" 
                    className="hover:text-[#10B981] transition-colors"
                  >
                    Safety Disclaimer
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:YOURGMAIL@gmail.com" 
                    className="hover:text-[#10B981] transition-colors"
                  >
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-[rgba(99,102,241,0.15)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <p>© 2026 RepairLens AI. Built with Gemma 4 AI</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-[#9CA3AF] font-medium">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Enterprise Safety Standard
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
