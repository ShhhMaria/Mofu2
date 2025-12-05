import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: string;
  isTextArea?: boolean;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  error, 
  className = '', 
  value, 
  isTextArea = false,
  ...props 
  
}) => {
  const base = "w-full bg-white border rounded-lg px-3 py-2 transition outline-none focus:ring-1 disabled:opacity-50 disabled:bg-orange-50";
  const border = error 
    ? "border-red-200 focus:border-red-400 focus:ring-red-300" 
    : "border-orange-200 focus:border-orange-400 focus:ring-orange-300";

  return (
    <div className="w-full space-y-1">
      <label className="block text-sm font-medium text-amber-900">{label}</label>
      <div className="relative">
        {isTextArea ? (
          <textarea 
            className={`${base} ${border} ${className} min-h-[100px] resize-none`}
            value={value}
            {...props as any}
          />
        ) : (
          <input 
            className={`${base} ${border} ${className}`}
            value={value}
            {...props}
          />
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500">{error}</span>
      )}
    </div>
  );
};