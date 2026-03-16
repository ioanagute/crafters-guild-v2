import React from "react";

interface DecorativeCornersProps {
  className?: string;
  color?: string;
  size?: number | string;
}

export default function DecorativeCorners({ 
  className = "", 
  color = "currentColor",
  size = 32 
}: DecorativeCornersProps) {
  return (
    <>
      {/* Top Left */}
      <div className={`absolute left-1 top-1 pointer-events-none ${className}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M4 20V8C4 5.79086 5.79086 4 8 4H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M4 8L8 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="4" cy="4" r="2" fill={color} className="opacity-50"/>
        </svg>
      </div>
      
      {/* Top Right */}
      <div className={`absolute right-1 top-1 pointer-events-none rotate-90 ${className}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M4 20V8C4 5.79086 5.79086 4 8 4H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M4 8L8 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="4" cy="4" r="2" fill={color} className="opacity-50"/>
        </svg>
      </div>

      {/* Bottom Left */}
      <div className={`absolute left-1 bottom-1 pointer-events-none -rotate-90 ${className}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M4 20V8C4 5.79086 5.79086 4 8 4H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M4 8L8 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="4" cy="4" r="2" fill={color} className="opacity-50"/>
        </svg>
      </div>

      {/* Bottom Right */}
      <div className={`absolute right-1 bottom-1 pointer-events-none rotate-180 ${className}`} style={{ width: size, height: size }}>
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M4 20V8C4 5.79086 5.79086 4 8 4H20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M4 8L8 4" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="4" cy="4" r="2" fill={color} className="opacity-50"/>
        </svg>
      </div>
    </>
  );
}
