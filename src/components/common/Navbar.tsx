import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../../hooks/useAuth';
import { User, Settings, LogOut, Menu, X, ChevronRight, LayoutDashboard, Sparkles, Wrench, Home } from 'lucide-react';
import { Button } from './Button';
import { RepairLensLogo } from './RepairLensLogo';

export const Navbar: React.FC = () => {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await logout();
      setUserDropdownOpen(false);
      navigate('/');
    } catch (err) {
      console.error('Failed to sign out', err);
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  // Determine active app navigation view when logged in
  const searchParams = new URLSearchParams(location.search);
  const currentView = searchParams.get('view');

  let activeTab: 'home' | 'diagnose' | 'repairs' | null = null;
  if (location.pathname === '/dashboard' || location.pathname === '/') {
    if (currentView === 'diagnose') {
      activeTab = 'diagnose';
    } else if (currentView === 'repairs') {
      activeTab = 'repairs';
    } else {
      activeTab = 'home';
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[rgba(99,102,241,0.15)] bg-[#111827]/90 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5 group">
          <RepairLensLogo className="w-9 h-9 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <span className="font-bold text-[#F9FAFB] tracking-tight text-base flex items-center gap-1.5">
              RepairLens <span className="text-[#6366F1] font-extrabold text-[10px] px-2 py-0.5 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30">AI</span>
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {!isAuthPage && (
          <nav className="hidden md:flex items-center gap-2 text-sm font-medium">
            {user ? (
              /* AUTHENTICATED APP NAVIGATION: ONLY HOME, DIAGNOSE, MY REPAIRS */
              <div className="flex items-center gap-1 bg-[#0A0F1E]/60 p-1 rounded-2xl border border-[rgba(99,102,241,0.15)]">
                {/* Home */}
                <Link
                  to="/dashboard?view=home"
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-colors flex items-center gap-2 cursor-pointer ${
                    activeTab === 'home' ? 'text-[#F9FAFB]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-[#10B981]' : 'text-[#9CA3AF]'}`} />
                  <span>Home</span>
                  {activeTab === 'home' && (
                    <motion.div
                      layoutId="activeNavbarTab"
                      className="absolute inset-0 bg-[#6366F1]/20 border border-[#6366F1]/40 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>

                {/* Diagnose */}
                <Link
                  to="/dashboard?view=diagnose"
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-colors flex items-center gap-2 cursor-pointer ${
                    activeTab === 'diagnose' ? 'text-[#F9FAFB]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${activeTab === 'diagnose' ? 'text-amber-400' : 'text-[#9CA3AF]'}`} />
                  <span>Diagnose</span>
                  {activeTab === 'diagnose' && (
                    <motion.div
                      layoutId="activeNavbarTab"
                      className="absolute inset-0 bg-[#6366F1]/20 border border-[#6366F1]/40 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>

                {/* My Repairs */}
                <Link
                  to="/dashboard?view=repairs"
                  className={`relative px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-colors flex items-center gap-2 cursor-pointer ${
                    activeTab === 'repairs' ? 'text-[#F9FAFB]' : 'text-[#9CA3AF] hover:text-[#F9FAFB]'
                  }`}
                >
                  <Wrench className={`w-4 h-4 ${activeTab === 'repairs' ? 'text-[#6366F1]' : 'text-[#9CA3AF]'}`} />
                  <span>My Repairs</span>
                  {activeTab === 'repairs' && (
                    <motion.div
                      layoutId="activeNavbarTab"
                      className="absolute inset-0 bg-[#6366F1]/20 border border-[#6366F1]/40 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              </div>
            ) : (
              /* MARKETING NAVIGATION FOR VISITORS (NOT LOGGED IN) */
              <div className="flex items-center gap-8 text-[#9CA3AF]">
                <a href="#features" className="hover:text-[#F9FAFB] transition-colors">
                  Features
                </a>
                <a href="#how-it-works" className="hover:text-[#F9FAFB] transition-colors">
                  How It Works
                </a>
                <a href="#supported-appliances" className="hover:text-[#F9FAFB] transition-colors">
                  Supported Appliances
                </a>
                <a href="#faq" className="hover:text-[#F9FAFB] transition-colors">
                  FAQ
                </a>
              </div>
            )}
          </nav>
        )}

        {/* Desktop Action Buttons / Auth Menu */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl border border-[rgba(99,102,241,0.2)] hover:border-[rgba(99,102,241,0.4)] bg-[#1A2035] hover:bg-[#1A2035]/80 transition-all text-left cursor-pointer"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-[#F9FAFB] leading-none">
                    {profile?.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-[#9CA3AF] font-medium">Account</span>
                </div>
                <div className="w-8 h-8 rounded-lg bg-[#6366F1] text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                  {profile?.displayName ? profile.displayName[0] : user.email ? user.email[0] : 'U'}
                </div>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-52 rounded-2xl border border-[rgba(99,102,241,0.2)] bg-[#1A2035] p-2 shadow-xl z-50 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150"
                  onMouseLeave={() => setUserDropdownOpen(false)}
                >
                  <Link
                    to="/dashboard"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#F9FAFB] hover:bg-[#111827] rounded-xl transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#10B981]" /> Dashboard
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#F9FAFB] hover:bg-[#111827] rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-[#9CA3AF]" /> Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-[#F9FAFB] hover:bg-[#111827] rounded-xl transition-colors"
                  >
                    <Settings className="w-4 h-4 text-[#9CA3AF]" /> Settings
                  </Link>
                  <div className="my-1 border-t border-[rgba(99,102,241,0.15)]" />
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm">
                  Start Free Diagnosis <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex md:hidden items-center gap-2">
          {user && (
            <Link to="/dashboard">
              <Button variant="ghost" size="sm" className="p-2">
                <LayoutDashboard className="w-4 h-4 text-[#F9FAFB]" />
              </Button>
            </Link>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1A2035] transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[rgba(99,102,241,0.15)] bg-[#111827] px-4 pt-3 pb-6 space-y-4 animate-in fade-in slide-in-from-top-4">
          {!isAuthPage && (
            user ? (
              /* AUTHENTICATED MOBILE APPLICATION NAVIGATION */
              <nav className="flex flex-col space-y-2 text-sm font-semibold text-[#9CA3AF]">
                <Link
                  to="/dashboard?view=home"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                    activeTab === 'home' ? 'bg-[#6366F1]/20 text-[#F9FAFB] border border-[#6366F1]/30 font-bold' : 'hover:bg-[#1A2035] hover:text-[#F9FAFB]'
                  }`}
                >
                  <Home className={`w-4 h-4 ${activeTab === 'home' ? 'text-[#10B981]' : ''}`} /> Home
                </Link>

                <Link
                  to="/dashboard?view=diagnose"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                    activeTab === 'diagnose' ? 'bg-[#6366F1]/20 text-[#F9FAFB] border border-[#6366F1]/30 font-bold' : 'hover:bg-[#1A2035] hover:text-[#F9FAFB]'
                  }`}
                >
                  <Sparkles className={`w-4 h-4 ${activeTab === 'diagnose' ? 'text-amber-400' : ''}`} /> Diagnose
                </Link>

                <Link
                  to="/dashboard?view=repairs"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3.5 py-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                    activeTab === 'repairs' ? 'bg-[#6366F1]/20 text-[#F9FAFB] border border-[#6366F1]/30 font-bold' : 'hover:bg-[#1A2035] hover:text-[#F9FAFB]'
                  }`}
                >
                  <Wrench className={`w-4 h-4 ${activeTab === 'repairs' ? 'text-[#6366F1]' : ''}`} /> My Repairs
                </Link>
              </nav>
            ) : (
              /* UNAUTHENTICATED MARKETING NAVIGATION */
              <nav className="flex flex-col space-y-2 text-sm font-medium text-[#9CA3AF]">
                <a 
                  href="#features" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[#1A2035] hover:text-[#F9FAFB]"
                >
                  Features
                </a>
                <a 
                  href="#how-it-works" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[#1A2035] hover:text-[#F9FAFB]"
                >
                  How It Works
                </a>
                <a 
                  href="#supported-appliances" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[#1A2035] hover:text-[#F9FAFB]"
                >
                  Supported Appliances
                </a>
                <a 
                  href="#faq" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg hover:bg-[#1A2035] hover:text-[#F9FAFB]"
                >
                  FAQ
                </a>
              </nav>
            )
          )}

          <div className="pt-2 border-t border-[rgba(99,102,241,0.15)] flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <User className="w-4 h-4 mr-2" /> Profile
                  </Button>
                </Link>
                <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" /> Settings
                  </Button>
                </Link>
                <Button variant="danger" className="w-full justify-start" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="primary" className="w-full">
                    Start Free Diagnosis
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

