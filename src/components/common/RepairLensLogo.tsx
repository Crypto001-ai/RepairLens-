import React, { useState } from 'react';
import { Wrench, Sparkles } from 'lucide-react';

interface RepairLensLogoProps {
  className?: string;
  alt?: string;
}

export const RepairLensLogo: React.FC<RepairLensLogoProps> = ({ 
  className = "w-9 h-9",
  alt = "RepairLens AI Logo"
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div 
        className={`${className} shrink-0 rounded-xl bg-gradient-to-br from-[#10B981] to-[#6366F1] p-1.5 flex items-center justify-center text-white shadow-md shadow-[#10B981]/20`}
        title={alt}
      >
        <div className="relative flex items-center justify-center w-full h-full">
          <Wrench className="w-full h-full text-white stroke-[2.5]" />
          <Sparkles className="w-1/2 h-1/2 text-emerald-200 absolute -top-1 -right-1" />
        </div>
      </div>
    );
  }

  return (
    <img 
      src="/logo.png" 
      alt={alt}
      className={`${className} shrink-0 object-contain`}
      onError={() => setHasError(true)}
      referrerPolicy="no-referrer"
    />
  );
};

