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
      {/* Shield glyph */}
      <svg
        viewBox="0 0 16 18"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 h-4 w-4"
        aria-hidden="true"
      >
        <path
          d="M8 1L2 3.5V9C2 12.5 4.5 15.5 8 17C11.5 15.5 14 12.5 14 9V3.5L8 1Z"
          stroke="rgba(255,255,255,0.55)"
          strokeWidth="1.2"
          strokeLinejoin="round"
          fill="rgba(0,0,0,0.2)"
        />
      </svg>
    </div>
  );
}
