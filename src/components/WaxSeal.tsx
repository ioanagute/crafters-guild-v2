import React from "react";

export default function WaxSeal({ className = "", color = "#8a0303" }) {
  return (
    <div className={`relative flex h-10 w-10 items-center justify-center ${className}`}>
      {/* Outer irregular shape */}
      <div 
        className="absolute inset-0 rounded-full opacity-90 shadow-lg" 
        style={{ 
          backgroundColor: color,
          clipPath: "polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)"
        }} 
      />
      {/* Inner stamp area */}
      <div 
        className="absolute inset-1.5 rounded-full border border-black/20 shadow-inner" 
        style={{ backgroundColor: color }}
      />
      {/* Symbol/Logo placeholder */}
      <div className="relative z-10 text-white/40 font-serif text-[0.6rem] font-bold select-none">
        CG
      </div>
    </div>
  );
}
