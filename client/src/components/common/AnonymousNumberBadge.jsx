import React from "react";

function AnonymousNumberBadge({ number, size = 14 }) {
  if (!number) return null;
  
  return (
    <div 
      className="flex items-center gap-[0.3rem] bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-[0.6rem] py-[0.2rem] rounded-md border border-cyan-500/30"
      title="Anonymous Number (NFT)"
    >
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <path 
          d="M22 16.92V19.92C22 20.48 21.56 20.93 21 20.99C20.83 21 20.67 21 20.5 21C10.29 21 2 12.71 2 2.5C2 2.33 2 2.17 2.01 2C2.07 1.44 2.52 1 3.08 1H6.08C6.57 1 6.99 1.35 7.07 1.83C7.14 2.27 7.26 2.7 7.43 3.11C7.56 3.43 7.48 3.79 7.23 4.04L5.39 5.88C6.86 8.55 9.45 11.14 12.12 12.61L13.96 10.77C14.21 10.52 14.57 10.44 14.89 10.57C15.3 10.74 15.73 10.86 16.17 10.93C16.65 11.01 17 11.43 17 11.92V14.92C17 15.47 16.55 15.92 16 15.92" 
          stroke="url(#anon-gradient)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <circle cx="17" cy="5" r="4" fill="url(#anon-gradient)" opacity="0.3"/>
        <text x="17" y="7" textAnchor="middle" fontSize="5" fill="url(#anon-gradient)" fontWeight="bold">#</text>
        <defs>
          <linearGradient id="anon-gradient" x1="2" y1="1" x2="22" y2="21" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06b6d4"/>
            <stop offset="1" stopColor="#3b82f6"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[1rem] font-medium bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
        +{number}
      </span>
    </div>
  );
}

export default AnonymousNumberBadge;
