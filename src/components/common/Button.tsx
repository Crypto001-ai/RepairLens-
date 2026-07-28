import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-cursor-not-allowed select-none rounded-full';

  const variants = {
    primary: 'bg-[#6366F1] text-white hover:bg-[#5558E6] focus:ring-[#6366F1] shadow-lg shadow-indigo-900/30 active:scale-[0.98]',
    secondary: 'bg-[#10B981] text-white hover:bg-[#0EA5E9] focus:ring-[#10B981] shadow-sm active:scale-[0.98]',
    outline: 'border border-[rgba(99,102,241,0.25)] bg-[#1A2035] text-[#F9FAFB] hover:bg-[#111827] hover:border-[rgba(99,102,241,0.5)] focus:ring-[#6366F1]',
    ghost: 'text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-[#1A2035] focus:ring-[#6366F1]',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-600 shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-medium gap-1.5',
    md: 'px-4 py-2.5 text-sm font-medium gap-2',
    lg: 'px-6 py-3.5 text-base font-semibold gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin text-current" />}
      {children}
    </button>
  );
};
