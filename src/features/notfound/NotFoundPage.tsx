import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Home, Wrench } from 'lucide-react';
import { Button } from '../../components/common/Button';

const BrokenApplianceIllustration: React.FC = () => (
  <svg
    viewBox="0 0 320 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full max-w-[280px] sm:max-w-[340px] h-auto drop-shadow-2xl mx-auto"
  >
    {/* Soft Glow Background */}
    <circle cx="160" cy="150" r="110" fill="url(#bgGlow)" opacity="0.3" />
    
    {/* Fan Base & Stand */}
    <rect x="115" y="240" width="90" height="14" rx="7" fill="#1F2937" stroke="#6366F1" strokeWidth="2.5" />
    <path d="M160 195 L160 240" stroke="#6366F1" strokeWidth="6" strokeLinecap="round" />
    <path d="M150 200 L170 200" stroke="#374151" strokeWidth="3" strokeLinecap="round" />

    {/* Fan Main Outer Casing */}
    <circle cx="160" cy="130" r="65" fill="#111827" stroke="#6366F1" strokeWidth="3.5" />
    <circle cx="160" cy="130" r="58" fill="#1E1E38" stroke="#10B981" strokeWidth="1.5" strokeDasharray="4 3" />

    {/* Fan Center Hub */}
    <circle cx="160" cy="130" r="18" fill="#6366F1" stroke="#F9FAFB" strokeWidth="2" />

    {/* X-Eyes on Hub (Humorous Cartoon Expression) */}
    <path d="M152 125 L158 131 M158 125 L152 131" stroke="#F9FAFB" strokeWidth="2" strokeLinecap="round" />
    <path d="M162 125 L168 131 M168 125 L162 131" stroke="#F9FAFB" strokeWidth="2" strokeLinecap="round" />
    {/* Dizzy mouth line */}
    <path d="M154 137 Q 160 141 166 137" stroke="#10B981" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Fan Blades (Stopped / Asymmetrical) */}
    <path d="M160 112 Q 170 95 180 110 Q 168 122 160 112 Z" fill="#10B981" opacity="0.85" />
    <path d="M178 130 Q 195 140 180 150 Q 168 138 178 130 Z" fill="#10B981" opacity="0.85" />
    <path d="M142 130 Q 125 120 140 110 Q 152 122 142 130 Z" fill="#10B981" opacity="0.85" />
    <path d="M160 148 Q 150 165 140 150 Q 152 138 160 148 Z" fill="#10B981" opacity="0.85" />

    {/* Subtle Crack & Bandage on Casing */}
    <path d="M195 88 L203 98 L198 106 L210 116" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <rect x="185" y="103" width="22" height="10" rx="3" fill="#374151" stroke="#10B981" strokeWidth="1" transform="rotate(-20 185 103)" />

    {/* Power Cord Dangling Out */}
    <path d="M160 240 C 130 255, 90 230, 75 260 C 68 275, 80 295, 95 290" stroke="#6366F1" strokeWidth="3.5" strokeLinecap="round" fill="none" />

    {/* Unplugged Wall Plug at End of Cord */}
    <g transform="translate(90, 278) rotate(25)">
      <rect x="0" y="0" width="22" height="14" rx="4" fill="#374151" stroke="#10B981" strokeWidth="2" />
      <rect x="22" y="2" width="8" height="3" rx="1" fill="#10B981" />
      <rect x="22" y="9" width="8" height="3" rx="1" fill="#10B981" />
    </g>

    {/* Sparks near Plug */}
    <path d="M125 285 L129 275 L124 275 L130 263 L122 272 L126 272 Z" fill="#10B981" stroke="#10B981" strokeWidth="0.5" />
    <path d="M115 300 L118 293 L114 293 L119 284 L113 291 L116 291 Z" fill="#6366F1" stroke="#6366F1" strokeWidth="0.5" />

    {/* Floating Question Mark */}
    <path d="M225 70 C 225 60, 238 60, 238 70 C 238 80, 230 80, 230 90" stroke="#818CF8" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <circle cx="230" cy="98" r="1.5" fill="#818CF8" />

    {/* Radial Glow Definition */}
    <defs>
      <radialGradient id="bgGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(160 150) scale(110)">
        <stop stopColor="#6366F1" />
        <stop offset="0.7" stopColor="#10B981" stopOpacity="0.4" />
        <stop offset="1" stopColor="#0A0F1E" stopOpacity="0" />
      </radialGradient>
    </defs>
  </svg>
);

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[calc(100vh-8rem)] bg-[#0A0F1E] flex items-center justify-center p-4 sm:p-6 lg:p-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center py-6"
      >
        {/* LEFT COLUMN: SVG ILLUSTRATION */}
        <div className="flex justify-center items-center order-1 lg:order-1">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full flex justify-center"
          >
            <BrokenApplianceIllustration />
          </motion.div>
        </div>

        {/* RIGHT COLUMN: TEXT CONTENT & ACTIONS */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 order-2 lg:order-2">
          
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full border border-[#10B981]/20">
            Error 404
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F9FAFB] tracking-tight leading-tight">
            Looks like this page needs repairing too.
          </h1>

          <p className="text-sm sm:text-base text-[#9CA3AF] leading-relaxed max-w-md">
            Don't worry — even the best appliances break sometimes. Let's get you back on track.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link to="/" className="w-full sm:w-auto">
              <Button
                variant="primary"
                className="w-full sm:w-auto bg-[#6366F1] hover:bg-[#4F46E5] text-white font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#6366F1]/20 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Button>
            </Link>

            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-[rgba(99,102,241,0.4)] text-[#818CF8] hover:bg-[#6366F1]/10 font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <Wrench className="w-4 h-4 text-[#10B981]" />
                <span>Start Free Diagnosis</span>
              </Button>
            </Link>
          </div>

          <p className="text-xs text-[#6B7280] italic pt-1">
            RepairLens AI can fix appliances but unfortunately not missing URLs 😄
          </p>

        </div>
      </motion.div>
    </div>
  );
};
