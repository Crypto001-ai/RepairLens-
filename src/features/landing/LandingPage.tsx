import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';
import { 
  Wrench, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  DollarSign, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown, 
  CheckCircle2, 
  Camera, 
  Cpu, 
  FileText, 
  ArrowRight,
  Flame,
  Wind,
  Droplets,
  Coffee,
  Tv,
  HelpCircle,
  Star,
  Globe
} from 'lucide-react';
import { Button } from '../../components/common/Button';
import { ApplianceHeroIllustration } from '../../components/illustrations/ApplianceHeroIllustration';
import { DiagnosticModal } from '../../components/diagnosis/DiagnosticModal';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [diagModalOpen, setDiagModalOpen] = useState<boolean>(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<number>(0);

  // Redirect authenticated user directly to Dashboard workspace
  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);
  const [isTestimonialHovered, setIsTestimonialHovered] = useState<boolean>(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const featureCards = [
    {
      id: 'multimodal',
      title: 'Multi-Modal Visual Scan',
      description: 'Snap a quick photo or record a short video of your malfunctioning appliance. AI identifies brand, error code, and part defects instantly.',
      gradient: 'from-blue-50/90 via-indigo-50/60 to-purple-50/90 border-blue-200/80 hover:border-blue-400/90',
      badgeBg: 'bg-blue-600 text-white shadow-blue-200',
      badgeText: 'Vision AI',
      renderVisual: () => (
        <div className="relative w-full h-24 rounded-xl bg-slate-900 border border-blue-500/30 overflow-hidden flex items-center justify-center mb-4">
          <Camera className="w-8 h-8 text-blue-400" />
          <motion.div 
            className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent shadow-[0_0_8px_#60a5fa]"
            animate={{ top: ['15%', '85%', '15%'] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <div className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded bg-blue-950/90 border border-blue-500/40 text-[9px] font-mono text-blue-300">
            DETECTING...
          </div>
        </div>
      )
    },
    {
      id: 'safety',
      title: 'Safety Protocol Verification',
      description: 'Every diagnostic guide puts personal safety first. Automatic warnings for power isolation, capacitor discharges, and gas valve cutoffs.',
      gradient: 'from-emerald-50/90 via-teal-50/60 to-green-50/90 border-emerald-200/80 hover:border-emerald-400/90',
      badgeBg: 'bg-emerald-600 text-white shadow-emerald-200',
      badgeText: '100% Safe',
      renderVisual: () => (
        <div className="relative w-full h-24 rounded-xl bg-slate-900 border border-emerald-500/30 overflow-hidden flex items-center justify-center mb-4">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400/40"
          />
          <ShieldCheck className="w-8 h-8 text-emerald-400 relative z-10" />
          <div className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded bg-emerald-950/90 border border-emerald-500/40 text-[9px] font-mono text-emerald-300">
            PASSED
          </div>
        </div>
      )
    },
    {
      id: 'diy',
      title: 'Interactive DIY Repair Guides',
      description: 'Clear, illustrated walkthroughs tailored to your exact model number. Know which tools you need before unscrewing a single bolt.',
      gradient: 'from-amber-50/90 via-orange-50/60 to-yellow-50/90 border-amber-200/80 hover:border-amber-400/90',
      badgeBg: 'bg-amber-600 text-white shadow-amber-200',
      badgeText: 'Step-By-Step',
      renderVisual: () => (
        <div className="relative w-full h-24 rounded-xl bg-slate-900 border border-amber-500/30 overflow-hidden flex items-center justify-center mb-4">
          <motion.div
            animate={{ rotate: [0, 20, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Wrench className="w-8 h-8 text-amber-400" />
          </motion.div>
          <div className="absolute bottom-1 right-2 px-1.5 py-0.5 rounded bg-amber-950/90 border border-amber-500/40 text-[9px] font-mono text-amber-300">
            TOOLS READY
          </div>
        </div>
      )
    },
    {
      id: 'savings',
      title: 'Track Your Repair Savings',
      description: 'See exactly how much money you save every time you fix instead of replace or call a technician. RepairLens tracks your savings across every repair.',
      gradient: 'from-emerald-50/90 via-teal-50/60 to-cyan-50/90 border-emerald-200/80 hover:border-emerald-400/90',
      badgeBg: 'bg-emerald-600 text-white shadow-emerald-200',
      badgeText: 'MONEY SAVED',
      renderVisual: () => (
        <div className="relative w-full h-24 rounded-xl bg-slate-900 border border-emerald-500/30 overflow-hidden flex items-center justify-center mb-4">
          <motion.div
            animate={{ scale: [0.95, 1.05, 0.95] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="flex items-center gap-2"
          >
            <span className="text-3xl" role="img" aria-label="Money Bag">💰</span>
            <div className="text-left">
              <span className="block text-[10px] text-emerald-300 font-mono uppercase">Avg Savings</span>
              <span className="text-sm font-black text-emerald-400 font-mono">Avg ₦12,500/Fix</span>
            </div>
          </motion.div>
        </div>
      )
    },
  ];

  const howItWorksSteps = [
    {
      number: '01',
      title: 'Snap or Describe',
      description: 'Upload a picture of your appliance model badge, error code, or simply describe the noise, leak, or issue.',
      icon: <Camera className="w-6 h-6 text-amber-400" />,
    },
    {
      number: '02',
      title: 'AI Instant Diagnosis',
      description: 'RepairLens AI cross-references thousands of manufacturer manuals and technician databases to pinpoint the root cause.',
      icon: <Cpu className="w-6 h-6 text-emerald-400" />,
    },
    {
      number: '03',
      title: 'Repair with Confidence',
      description: 'Follow guided, safety-checked repair steps, order verified replacement parts, and test your fix with step-by-step clarity.',
      icon: <Wrench className="w-6 h-6 text-sky-400" />,
    },
  ];

  const diagnosableItems = [
    {
      name: 'Generators',
      description: 'Petrol, diesel, & portable generator sets',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
    },
    {
      name: 'Fans & Air Conditioners',
      description: 'Standing fans, ceiling fans, AC units & cooling systems',
      icon: <Wind className="w-5 h-5 text-sky-500" />,
    },
    {
      name: 'Water Pumps & Washing Machine',
      description: 'Pumping machines, washers, spinners & water systems',
      icon: <Droplets className="w-5 h-5 text-indigo-500" />,
    },
    {
      name: 'Electric Irons & Blenders',
      description: 'Pressing irons, food blenders, kettles & heating appliances',
      icon: <Flame className="w-5 h-5 text-rose-500" />,
    },
    {
      name: 'And Any Item You Can Photograph',
      description: 'Household electronics, mechanical equipment, & tools',
      icon: <Camera className="w-5 h-5 text-emerald-500" />,
    },
  ];

  const faqs = [
    {
      question: 'What appliances and devices can it diagnose?',
      answer: 'Generators, fans, washing machines, refrigerators, electric iron and most common household and mechanical equipment. If it cannot identify the item it will tell you honestly.',
    },
    {
      question: 'How accurate is RepairLens AI at diagnosing faults?',
      answer: "RepairLens AI uses Google's Gemma 4 vision model trained on millions of appliance manuals and repair cases. It correctly identifies common faults like carburetor blockages, capacitor failures, and burnt components with high accuracy. For complex faults it will always let you know to consult a professional technician.",
    },
    {
      question: 'Is it safe for beginners to attempt DIY repairs?',
      answer: 'Yes! Safety is our highest priority. Every step includes explicit safety requirements, such as turning off circuit breakers, disconnecting water valves, or wearing insulated gloves. If an issue involves dangerous high-voltage or refrigerant handling, RepairLens AI explicitly advises professional service.',
    },
    {
      question: 'Do I need specialized tools to diagnose my appliance?',
      answer: 'Most basic diagnoses require nothing more than your smartphone camera! When a repair requires specific tools (e.g. a multimeter or screwdrivers), RepairLens AI lists them upfront so you never start unprepared.',
    },
    {
      question: 'Is RepairLens AI free to use?',
      answer: 'Our core diagnosis and step-by-step guides are free for homeowners. You can perform free diagnostic scans and track your repair savings directly in your personal dashboard.',
    },
  ];

  const nigerianTestimonials = [
    {
      id: 1,
      name: 'Chukwuemeka Obi',
      role: 'Generator owner, Lagos',
      quote: 'My generator was cutting off every 5 minutes. RepairLens diagnosed a dirty carburetor in seconds. Fixed it myself for ₦2,000 instead of paying ₦15,000 to a technician.',
      saved: '₦13,000 Saved',
      initials: 'CO',
      avatarUrl: 'https://lh3.googleusercontent.com/d/1WffSNTpaUedtJWk0vQ1WgF339bhz1p9W',
      bgGradient: 'from-indigo-600 to-purple-600',
    },
    {
      id: 2,
      name: 'Fatima Aliyu',
      role: 'Housewife, Abuja',
      quote: 'My washing machine stopped spinning. I uploaded a photo and got a step by step repair guide immediately. It worked!',
      saved: '₦18,000 Saved',
      initials: 'FA',
      avatarUrl: 'https://lh3.googleusercontent.com/d/1MaZEOsctQUCw647djPKY2t2tLkSUHYPF',
      bgGradient: 'from-emerald-600 to-teal-600',
    },
    {
      id: 3,
      name: 'Taiwo Adeyemi',
      role: 'Mechanic, Ibadan',
      quote: 'As a mechanic I use RepairLens daily to diagnose faults faster. My customers are always impressed by how quick I work.',
      saved: '₦25,000 Saved',
      initials: 'TA',
      avatarUrl: 'https://lh3.googleusercontent.com/d/1AE73Ycdd8PhPvN-y5bHUPbNRfA8xH-Iu',
      bgGradient: 'from-blue-600 to-cyan-600',
    },
    {
      id: 4,
      name: 'Aminu Garba',
      role: 'Student, Kano',
      quote: 'My fan stopped working and electricians wanted ₦8,000. RepairLens showed me it was just a capacitor. Bought it for ₦1,500 and fixed it myself.',
      saved: '₦6,500 Saved',
      initials: 'AG',
      avatarUrl: 'https://lh3.googleusercontent.com/d/1exbvw0wKLb96fcU8bPorrCEwyi_GMqDQ',
      bgGradient: 'from-amber-600 to-orange-600',
    },
  ];

  // Auto-slide every 3 seconds unless user hovers
  useEffect(() => {
    if (isTestimonialHovered) return;
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % nigerianTestimonials.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [isTestimonialHovered, nigerianTestimonials.length]);

  // Intersection Observer for Scroll Animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0F1E] text-[#9CA3AF]">
      
      {/* HERO SECTION */}
      <section id="diagnosis" className="relative min-h-screen lg:min-h-screen flex items-center justify-center pt-20 pb-16 lg:py-24 overflow-hidden">
        {/* Subtle Grid Pattern (Linear.app style) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-25" 
          style={{ 
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)`, 
            backgroundSize: '32px 32px' 
          }} 
        />

        {/* Floating Gradient Orbs (Vercel style) */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-[#6366F1]/15 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-16 items-center">
            
            {/* LEFT COLUMN: Text Content & CTAs (Left-aligned on desktop, centered on mobile) */}
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6 max-w-2xl mx-auto lg:mx-0">
              
              {/* Tagline Badge Pill */}
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 text-[#6366F1] text-xs font-semibold shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#6366F1]" />
                <span>RepairLens AI • Next-Gen Diagnostics</span>
              </motion.div>

              {/* Main Headline (56-64px on desktop) */}
              <motion.h1 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-[56px] xl:text-[64px] font-extrabold text-[#F9FAFB] tracking-tight leading-[1.08]"
              >
                See it. Diagnose it. <span className="text-[#6366F1] underline decoration-[#6366F1]/30 decoration-wavy underline-offset-8">Fix it.</span>
              </motion.h1>

              {/* Subheading */}
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-[#9CA3AF] leading-relaxed font-normal max-w-xl"
              >
                Help your household diagnose appliance problems safely using AI visual recognition and confidently repair them with step-by-step guidance.
              </motion.p>

              {/* Hero CTAs */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 w-full sm:w-auto"
              >
                <Link to="/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto text-base px-8 py-4 shadow-lg shadow-indigo-950/50">
                    Start Free Diagnosis <ChevronRight className="w-5 h-5 ml-1" />
                  </Button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-base px-6">
                    See How It Works
                  </Button>
                </a>
              </motion.div>

              {/* Trust Micro-Badges */}
              <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2.5 text-xs text-[#9CA3AF] font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" /> Free instant diagnostic check
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" /> Built-in electrical safety steps
                </span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#10B981]" /> Save ₦3,000+ per repair average
                </span>
              </div>

            </div>

            {/* RIGHT COLUMN: Tilted & Floating Phone Mockup with Primary Glow */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="relative flex items-center justify-center mt-6 lg:mt-0 w-full"
            >
              <motion.div
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-full max-w-lg lg:max-w-none mx-auto flex items-center justify-center"
              >
                {/* Primary Purple Glow Behind Mockup */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-[#6366F1]/25 rounded-full blur-[100px] pointer-events-none" />

                {/* Tilted Wrapper Container with Thin Glowing Border */}
                <div className="relative w-full transform lg:rotate-[6deg] hover:rotate-0 transition-transform duration-700 ease-out rounded-3xl border border-[#6366F1]/35 shadow-[0_0_50px_rgba(99,102,241,0.2)] bg-[#111827]/80 backdrop-blur-sm p-1.5 sm:p-2.5">
                  <ApplianceHeroIllustration />
                </div>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FEATURE CARDS */}
      <section id="features" className="py-16 md:py-24 bg-[#0A0F1E] border-y border-[rgba(99,102,241,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 lg:mb-16 animate-on-scroll">
            <h2 className="text-xs font-bold text-[#10B981] uppercase tracking-widest mb-2">Engineered for Accuracy</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
              Everything you need to fix appliances safely and fast
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featureCards.map((card, cardIdx) => (
              <motion.div 
                key={card.id} 
                whileHover={{ y: -6 }}
                className={`p-6 rounded-3xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] hover:border-[rgba(99,102,241,0.4)] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between animate-on-scroll delay-${(cardIdx + 1) * 100}`}
              >
                <div>
                  {card.renderVisual()}
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-extrabold text-[#F9FAFB]">{card.title}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#6366F1]/20 text-[#6366F1] border border-[#6366F1]/30">
                      {card.badgeText}
                    </span>
                  </div>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed font-normal">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-16 md:py-24 bg-[#0A0F1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-on-scroll">
            <h2 className="text-xs font-bold text-[#10B981] uppercase tracking-widest mb-2">Simple 3-Step Process</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
              From broken to fixed in three steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {howItWorksSteps.map((step, idx) => (
              <div 
                key={idx} 
                className={`relative bg-[#1A2035] rounded-2xl border border-[rgba(99,102,241,0.15)] p-8 shadow-sm hover:border-[rgba(99,102,241,0.3)] transition-all animate-on-scroll ${idx % 2 === 0 ? 'from-left' : 'from-right'} delay-${idx * 100}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-black text-[#6366F1]/40 font-mono">{step.number}</span>
                  <div className="w-12 h-12 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.15)] flex items-center justify-center">
                    {step.icon}
                  </div>
                </div>
                <h3 className="text-lg font-bold text-[#F9FAFB] mb-2">{step.title}</h3>
                <p className="text-xs text-[#9CA3AF] leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT CAN REPAIRLENS DIAGNOSE */}
      <section id="supported-appliances" className="py-16 md:py-24 bg-[#111827] border-t border-[rgba(99,102,241,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2 animate-on-scroll">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
              What Can RepairLens Diagnose?
            </h3>
            <p className="text-sm sm:text-base text-[#9CA3AF] font-medium">
              If you can photograph it, RepairLens AI can diagnose it.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {diagnosableItems.map((item, idx) => (
              <div 
                key={idx} 
                className={`p-5 rounded-2xl border border-[rgba(99,102,241,0.15)] bg-[#1A2035] hover:border-[#10B981]/50 transition-all flex items-start gap-4 animate-on-scroll delay-${(idx + 1) * 100} ${
                  idx === diagnosableItems.length - 1 ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                <div className="p-3 rounded-xl bg-[#111827] border border-[rgba(99,102,241,0.2)] shadow-2xs shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#F9FAFB] mb-1">{item.name}</h4>
                  <p className="text-xs text-[#9CA3AF] leading-relaxed font-normal">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS AUTO-SLIDING CAROUSEL */}
      <section id="testimonials" className="py-16 md:py-24 bg-[#0A0F1E] text-white relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2 animate-on-scroll">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Real DIY Success Stories</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F9FAFB]">
              Trusted by Homeowners Saving Real Money
            </h2>
            <p className="text-xs sm:text-sm text-[#9CA3AF]">
              Over ₦100,000+ saved on technician fees across hundreds of successful DIY repairs.
            </p>
          </div>

          {/* Carousel Main Container (Pauses on Hover) */}
          <div 
            className="relative animate-on-scroll scale-up"
            onMouseEnter={() => setIsTestimonialHovered(true)}
            onMouseLeave={() => setIsTestimonialHovered(false)}
          >
            {/* Slide Card Frame */}
            <div className="relative min-h-[300px] sm:min-h-[240px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: 'easeInOut' }}
                  className="w-full bg-[#1A2035] border border-[rgba(99,102,241,0.15)] rounded-3xl p-6 sm:p-8 shadow-2xl relative flex flex-col justify-between"
                >
                  <div>
                    {/* Header: 5 Stars + Green Saved Badge */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                      <span className="px-3.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/30 text-xs font-extrabold font-mono flex items-center gap-1.5 shadow-2xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
                        {nigerianTestimonials[currentTestimonial].saved}
                      </span>
                    </div>

                    {/* Review text in quotes */}
                    <blockquote className="text-sm sm:text-base text-[#F9FAFB] italic leading-relaxed font-normal mb-6">
                      "{nigerianTestimonials[currentTestimonial].quote}"
                    </blockquote>
                  </div>

                  {/* Footer: Circular Profile Photo / Avatar + Name + Job/Location */}
                  <div className="flex items-center gap-3.5 border-t border-[rgba(99,102,241,0.15)] pt-4">
                    <div className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#10B981]/50 shadow-md bg-[#111827] flex items-center justify-center">
                      <img 
                        src={nigerianTestimonials[currentTestimonial].avatarUrl} 
                        alt={nigerianTestimonials[currentTestimonial].name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${nigerianTestimonials[currentTestimonial].bgGradient} flex items-center justify-center text-white font-extrabold text-sm font-mono -z-10`}>
                        {nigerianTestimonials[currentTestimonial].initials}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-extrabold text-[#F9FAFB] tracking-tight">
                        {nigerianTestimonials[currentTestimonial].name}
                      </h3>
                      <p className="text-xs text-[#9CA3AF] font-medium">
                        {nigerianTestimonials[currentTestimonial].role}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Left / Right Arrow Controls */}
            <button
              onClick={() => setCurrentTestimonial((prev) => (prev - 1 + nigerianTestimonials.length) % nigerianTestimonials.length)}
              className="absolute -left-3 sm:-left-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1A2035] border border-[rgba(99,102,241,0.2)] text-[#F9FAFB] flex items-center justify-center hover:bg-[#111827] hover:scale-105 transition-all shadow-xl active:scale-95 z-10"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={() => setCurrentTestimonial((prev) => (prev + 1) % nigerianTestimonials.length)}
              className="absolute -right-3 sm:-right-5 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#1A2035] border border-[rgba(99,102,241,0.2)] text-[#F9FAFB] flex items-center justify-center hover:bg-[#111827] hover:scale-105 transition-all shadow-xl active:scale-95 z-10"
              aria-label="Next Testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 mt-8">
            {nigerianTestimonials.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => setCurrentTestimonial(idx)}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  currentTestimonial === idx 
                    ? 'w-8 bg-[#10B981] shadow-[0_0_10px_#10B981]' 
                    : 'w-2.5 bg-[#1A2035] hover:bg-[#111827]'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-16 md:py-24 bg-[#111827]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-on-scroll">
            <h2 className="text-xs font-bold text-[#10B981] uppercase tracking-widest mb-2">Got Questions?</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F9FAFB] tracking-tight">
              Frequently Asked Questions
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div 
                key={idx} 
                className={`rounded-2xl border border-[rgba(99,102,241,0.15)] overflow-hidden bg-[#1A2035] transition-all animate-on-scroll delay-${(idx + 1) * 100}`}
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between font-bold text-[#F9FAFB] text-sm hover:bg-[#111827]"
                >
                  <span>{faq.question}</span>
                  <ChevronDown className={`w-4 h-4 text-[#9CA3AF] transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 text-xs text-[#9CA3AF] leading-relaxed border-t border-[rgba(99,102,241,0.15)] pt-3 bg-[#111827]">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA BANNER */}
      <section className="py-16 bg-[#1A2035] text-white text-center border-t border-[rgba(99,102,241,0.15)] animate-on-scroll">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#F9FAFB]">Ready to diagnose your appliance in seconds?</h2>
          <p className="text-sm text-[#9CA3AF] max-w-xl mx-auto">
            Join thousands of Nigerians saving money on repairs. No technician needed. No experience required. Just upload a photo and let RepairLens AI do the rest.
          </p>
          <div className="flex items-center justify-center">
            <Link to="/register">
              <Button 
                size="lg" 
                variant="primary"
                className="font-extrabold px-8 py-3.5 shadow-lg shadow-indigo-900/40"
              >
                Start Free Diagnosis <ChevronRight className="w-5 h-5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* DIAGNOSTIC MODAL */}
      <DiagnosticModal 
        isOpen={diagModalOpen} 
        onClose={() => setDiagModalOpen(false)} 
      />

    </div>
  );
};
