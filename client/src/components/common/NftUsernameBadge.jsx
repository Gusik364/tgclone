import React from "react";

function NftUsernameBadge({ username, size = 14 }) {
  if (!username) return null;
  
  return (
    <div 
      className="flex items-center gap-[0.3rem] bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-[0.6rem] py-[0.2rem] rounded-md border border-purple-500/30"
      title="NFT Username"
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
          d="M12 2L2 7L12 12L22 7L12 2Z" 
          fill="url(#nft-gradient)"
        />
        <path 
          d="M2 17L12 22L22 17" 
          stroke="url(#nft-gradient)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <path 
          d="M2 12L12 17L22 12" 
          stroke="url(#nft-gradient)" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
        <defs>
          <linearGradient id="nft-gradient" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#a855f7"/>
            <stop offset="1" stopColor="#ec4899"/>
          </linearGradient>
        </defs>
      </svg>
      <span className="text-[1rem] font-medium bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
        @{username}
      </span>
    </div>
  );
}

export default NftUsernameBadge;
