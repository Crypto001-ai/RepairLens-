import React from 'react';

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  id?: string;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  checked,
  onChange,
  label,
  description,
  id,
  disabled = false,
}) => {
  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 rounded-xl border border-[rgba(99,102,241,0.12)] bg-[#111827]/70 hover:bg-[#111827] hover:border-[rgba(99,102,241,0.25)] transition-all duration-200">
      {(label || description) && (
        <div className="space-y-0.5 select-none">
          {label && <span className="text-xs font-bold text-[#F9FAFB] block">{label}</span>}
          {description && <span className="text-[11px] text-[#9CA3AF] block leading-snug">{description}</span>}
        </div>
      )}

      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#6366F1] focus:ring-offset-2 focus:ring-offset-[#0A0F1E] ${
          checked ? 'bg-[#6366F1] shadow-[0_0_12px_rgba(99,102,241,0.5)]' : 'bg-[#374151]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <span
          tabIndex={-1}
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};
