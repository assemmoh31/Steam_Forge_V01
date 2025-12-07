import React from 'react';

interface AdUnitProps {
  type?: 'banner' | 'rectangle';
  className?: string;
  label?: string;
}

const AdUnit: React.FC<AdUnitProps> = ({ type = 'banner', className = '', label = 'Advertisement' }) => {
  const heightClass = type === 'banner' ? 'h-[90px] w-full' : 'h-[250px] w-full';

  return (
    <div 
      className={`
        bg-gray-200 dark:bg-black/20 
        border-2 border-dashed border-gray-300 dark:border-white/10 
        flex flex-col items-center justify-center 
        rounded-lg overflow-hidden 
        transition-colors
        ${heightClass}
        ${className}
      `}
    >
      <span className="text-gray-400 dark:text-gray-600 text-xs font-bold tracking-widest uppercase mb-1">
        {label}
      </span>
      <div className="w-8 h-1 bg-gray-300 dark:bg-white/5 rounded-full"></div>
    </div>
  );
};

export default AdUnit;