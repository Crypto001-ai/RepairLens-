import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
  success?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, icon, rightElement, success, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    let borderStyles = 'border-[rgba(99,102,241,0.2)] focus:border-[#6366F1] focus:ring-[#6366F1]';
    if (error) {
      borderStyles = 'border-rose-500 focus:border-rose-500 focus:ring-rose-500';
    } else if (success) {
      borderStyles = 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500';
    }

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-[#F9FAFB]">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-2xs">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#6B7280]">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full rounded-xl border bg-[#111827] py-2.5 text-sm text-[#F9FAFB] placeholder:text-[#6B7280] focus:outline-none focus:ring-1 transition-colors ${
              icon ? 'pl-10' : 'pl-3.5'
            } ${rightElement ? 'pr-10' : 'pr-3.5'} ${borderStyles} ${className}`}
            {...props}
          />
          {rightElement && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
        {hint && !error && <p className="text-xs text-[#6B7280]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
