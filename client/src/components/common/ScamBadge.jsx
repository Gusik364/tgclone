import React from "react";

function ScamBadge({ size = 16, showText = true, reason = null }) {
  return (
    <div 
      className="flex items-center gap-[0.4rem] bg-danger/20 px-[0.6rem] py-[0.2rem] rounded-md cursor-help"
      title={reason || "This account has been marked as scam"}
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
          d="M12 9V13M12 17H12.01M12 3L2 21H22L12 3Z" 
          stroke="#ef4444" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className="text-danger text-[1rem] font-semibold uppercase">
          SCAM
        </span>
      )}
    </div>
  );
}

export default ScamBadge;
