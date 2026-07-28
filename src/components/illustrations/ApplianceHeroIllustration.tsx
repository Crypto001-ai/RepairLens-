import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Wrench, 
  Clock, 
  DollarSign, 
  Zap, 
  Cpu, 
  AlertTriangle,
  Award,
  Play,
  ArrowRight,
  TrendingUp,
  Layers
} from 'lucide-react';

export const ApplianceHeroIllustration: React.FC = () => {
  const [activeScene, setActiveScene] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);

  // Auto-play story cycle loop across 5 scenes
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveScene((prev) => (prev >= 5 ? 1 : prev + 1));
    }, 3800);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Animate confidence meter during Scene 2
  useEffect(() => {
    if (activeScene === 2) {
      setScanProgress(0);
      const timer = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 96) {
            clearInterval(timer);
            return 96;
          }
          return prev + 6;
        });
      }, 80);
      return () => clearInterval(timer);
    }
  }, [activeScene]);

  return (
    <div 
      className="relative w-full py-8 md:py-12 px-4 rounded-3xl border border-slate-200/80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 shadow-2xl overflow-hidden text-slate-100 flex flex-col items-center justify-center select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Tech Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none" 
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #94a3b8 1px, transparent 0)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Ambient Gradient Glows */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* FLOATING GLASS CARDS (PART 4) */}
      
      {/* Floating Card 1: Confidence (Top Left) */}
      <motion.div 
        animate={{ y: [-5, 5, -5] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden lg:flex absolute top-12 left-6 xl:left-12 z-20 items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 backdrop-blur-md shadow-xl text-xs font-semibold"
      >
        <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-slate-400">AI Confidence</span>
          <span className="text-sm font-extrabold text-emerald-400 font-mono">96% Verified</span>
        </div>
      </motion.div>

      {/* Floating Card 2: Estimated Savings (Top Right) */}
      <motion.div 
        animate={{ y: [5, -5, 5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden lg:flex absolute top-16 right-6 xl:right-12 z-20 items-center gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 backdrop-blur-md shadow-xl text-xs font-semibold"
      >
        <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
          <DollarSign className="w-4 h-4" />
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-slate-400">Avg. DIY Savings</span>
          <span className="text-sm font-extrabold text-indigo-300 font-mono">$215 Saved</span>
        </div>
      </motion.div>

      {/* Floating Card 3: Repair Time (Middle Left) */}
      <motion.div 
        animate={{ y: [4, -6, 4] }}
        transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden xl:flex absolute top-1/2 -translate-y-1/2 left-4 z-20 items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-900/80 border border-amber-500/30 backdrop-blur-md shadow-xl text-xs font-semibold"
      >
        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
          <Clock className="w-4 h-4" />
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-slate-400">Repair Time</span>
          <span className="text-xs font-bold text-slate-200">18 Minutes</span>
        </div>
      </motion.div>

      {/* Floating Card 4: Difficulty (Middle Right) */}
      <motion.div 
        animate={{ y: [-6, 4, -6] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden xl:flex absolute top-1/2 -translate-y-1/2 right-4 z-20 items-center gap-3 px-3.5 py-2 rounded-2xl bg-slate-900/80 border border-teal-500/30 backdrop-blur-md shadow-xl text-xs font-semibold"
      >
        <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400">
          <Wrench className="w-4 h-4" />
        </div>
        <div>
          <span className="block text-[10px] uppercase tracking-wider text-slate-400">Difficulty Level</span>
          <span className="text-xs font-bold text-teal-300">Beginner Friendly</span>
        </div>
      </motion.div>

      {/* Floating Card 5: AI Verified Badge (Bottom Left/Center) */}
      <motion.div 
        animate={{ y: [3, -5, 3] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden lg:flex absolute bottom-12 left-8 xl:left-16 z-20 items-center gap-2.5 px-3.5 py-2 rounded-full bg-indigo-950/90 border border-indigo-500/40 text-[11px] font-mono text-indigo-300 shadow-xl"
      >
        <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
        <Cpu className="w-3.5 h-3.5 text-indigo-400" />
        <span>Gemma AI Engine • Safety First</span>
      </motion.div>

      {/* SMARTPHONE MOCKUP FRAME */}
      <div className="relative z-10 w-72 sm:w-80 h-[510px] rounded-[42px] border-[10px] border-slate-800 bg-slate-950 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col justify-between select-none">
        
        {/* Top Camera Notch & Status Bar */}
        <div className="relative z-30 pt-3 px-6 flex items-center justify-between text-[10px] font-mono text-slate-400 bg-slate-950/90 border-b border-slate-900 pb-2">
          <span>9:41</span>
          <div className="w-16 h-3 bg-slate-900 rounded-full border border-slate-800 flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-slate-800" />
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>5G</span>
          </div>
        </div>

        {/* PHONE SCREEN CONTENT AREA */}
        <div className="relative flex-grow bg-slate-950 p-4 flex flex-col justify-between overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* SCENE 1: HOME SCREEN / PHOTO INITIATION */}
            {activeScene === 1 && (
              <motion.div
                key="scene1"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-between space-y-4"
              >
                <div className="space-y-1 text-center pt-2">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] font-bold tracking-wider uppercase border border-indigo-500/30">
                    Scene 1 • Capture
                  </span>
                  <h3 className="text-sm font-extrabold text-white">Select Diagnosis Mode</h3>
                  <p className="text-[11px] text-slate-400">Point phone camera at appliance</p>
                </div>

                <div className="space-y-2.5 my-auto">
                  <div className="p-3 rounded-2xl bg-indigo-600/20 border border-indigo-500/50 flex items-center gap-3 relative overflow-hidden group">
                    <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md">
                      <Camera className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-white">Take Photo</span>
                      <span className="text-[10px] text-indigo-200">Auto-detect brand & fault code</span>
                    </div>
                    {/* Simulated Finger Tap Pointer */}
                    <motion.div
                      animate={{ scale: [1, 1.3, 1], opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute right-3 w-6 h-6 rounded-full bg-white/40 border border-white flex items-center justify-center"
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 opacity-60">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-slate-200">Upload Photo</span>
                      <span className="text-[10px] text-slate-400">Select from photo library</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3 opacity-60">
                    <div className="p-2.5 rounded-xl bg-slate-800 text-slate-300">
                      <Wrench className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <span className="block text-xs font-bold text-slate-200">Describe Fault</span>
                      <span className="text-[10px] text-slate-400">Type noise or error symptom</span>
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-slate-500 font-mono">
                  Gemma AI Ready • Multi-Modal Scanner
                </div>
              </motion.div>
            )}

            {/* SCENE 2: CAMERA SCANNING ANIMATION */}
            {activeScene === 2 && (
              <motion.div
                key="scene2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-between relative"
              >
                <div className="absolute top-1 left-0 right-0 z-10 flex justify-between items-center px-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-900/90 border border-slate-700 text-[10px] font-mono text-emerald-400">
                    Scene 2 • Scanning
                  </span>
                  <span className="text-[10px] font-mono text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded-full border border-amber-800">
                    {scanProgress}% Confidence
                  </span>
                </div>

                {/* Simulated Camera Viewfinder */}
                <div className="relative my-auto w-full h-64 rounded-2xl border-2 border-indigo-500/40 bg-slate-900 overflow-hidden flex flex-col items-center justify-center">
                  
                  {/* Mock Washer Front Panel graphic */}
                  <div className="w-36 h-36 rounded-full border-4 border-slate-700 bg-slate-950 flex items-center justify-center relative">
                    <div className="w-28 h-28 rounded-full border border-indigo-500/30 flex items-center justify-center">
                      <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
                    </div>

                    {/* Target Bounding Box around suspect filter */}
                    <div className="absolute bottom-1 right-2 w-12 h-12 border-2 border-amber-400 border-dashed rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <span className="text-[8px] font-mono text-amber-300 font-bold">OE FILTER</span>
                    </div>
                  </div>

                  {/* Laser Scanning Beam */}
                  <motion.div
                    className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-[0_0_12px_#818cf8]"
                    animate={{ top: ['10%', '90%', '10%'] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                  />

                  <div className="absolute bottom-2 inset-x-2 px-2 py-1 rounded-lg bg-slate-950/90 border border-slate-800 text-[10px] font-mono text-slate-300 text-center">
                    DETECTING: <span className="text-emerald-400 font-bold">LG Front-Load Washer (OE)</span>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-indigo-950/80 border border-indigo-800 text-center text-[10px] text-indigo-300 font-mono">
                  Gemma AI analyzing component patterns...
                </div>
              </motion.div>
            )}

            {/* SCENE 3: DIAGNOSIS RESULTS */}
            {activeScene === 3 && (
              <motion.div
                key="scene3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1 text-center pt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-wider uppercase border border-emerald-500/30">
                    Scene 3 • Diagnosis
                  </span>
                  <h4 className="text-xs font-extrabold text-white">Drain Pump Filter Blockage</h4>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">96% Match • OE Code</span>
                </div>

                <div className="space-y-2 my-auto">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Estimated DIY Cost:</span>
                      <span className="font-extrabold text-emerald-400">$15 Parts</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Pro Service Fee:</span>
                      <span className="font-bold text-rose-400 line-through">$230 Fee</span>
                    </div>
                    <div className="pt-1.5 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-[10px] text-slate-300 font-bold uppercase">Estimated Savings:</span>
                      <span className="text-xs font-extrabold text-emerald-400 font-mono">$215 Saved</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <span className="block text-slate-400">Repair Time</span>
                      <span className="font-bold text-white">18 Minutes</span>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
                      <span className="block text-slate-400">Difficulty</span>
                      <span className="font-bold text-teal-300">Easy (DIY)</span>
                    </div>
                  </div>
                </div>

                <button className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/30">
                  Open Repair Guide <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

            {/* SCENE 4: REPAIR GUIDE PROGRESS */}
            {activeScene === 4 && (
              <motion.div
                key="scene4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-between space-y-3"
              >
                <div className="space-y-1 text-center pt-1">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold tracking-wider uppercase border border-amber-500/30">
                    Scene 4 • DIY Steps
                  </span>
                  <h4 className="text-xs font-extrabold text-white">Guided Step-By-Step</h4>
                </div>

                <div className="space-y-2 my-auto text-[11px]">
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center justify-between">
                    <span className="font-medium">1. Disconnect Power Plug</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center justify-between">
                    <span className="font-medium">2. Open Lower Filter Cap</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 flex items-center justify-between">
                    <span className="font-medium">3. Clean Debris & Re-test</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Progress</span>
                      <span className="font-bold text-emerald-400">100% Complete</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-emerald-400 h-2 rounded-full"
                        initial={{ width: '33%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.5 }}
                      />
                    </div>
                  </div>
                </div>

                <div className="text-center text-[10px] text-emerald-400 font-mono font-bold">
                  ✓ Safety Protocol Verified
                </div>
              </motion.div>
            )}

            {/* SCENE 5: CELEBRATION */}
            {activeScene === 5 && (
              <motion.div
                key="scene5"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="h-full flex flex-col justify-between items-center text-center py-2 space-y-3"
              >
                <div className="p-3 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 my-auto shadow-[0_0_30px_#10b981]">
                  <Award className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-500/30">
                    🏆 DIY Hero Badge Unlocked
                  </span>
                  <h3 className="text-sm font-black text-white">Repair Completed!</h3>
                  <p className="text-[11px] text-emerald-400 font-bold">₦15,000 Saved • ₦15,000 Tech Fee Avoided</p>
                </div>

                <div className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[10px] text-slate-400">
                  Technician fees avoided. Appliance life extended!
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Bottom Interactive Scene Selector Dots */}
        <div className="p-3 bg-slate-950 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="text-[9px]">STEP {activeScene}/5</span>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onClick={() => setActiveScene(s)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  activeScene === s 
                    ? 'bg-indigo-500 scale-125 shadow-[0_0_8px_#6366f1]' 
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Jump to Scene ${s}`}
              />
            ))}
          </div>
          <span className="text-[9px] text-slate-500">{isPaused ? 'PAUSED' : 'AUTO'}</span>
        </div>

      </div>

    </div>
  );
};
