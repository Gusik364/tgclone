import React from "react";

function VerifiedBadge({ size = 16 }) {
  return (
    <img 
      src="/major.png" 
      alt="Verified" 
      className="shrink-0"
      style={{ width: size, height: size }}
      title="Verified by Major"
    />
  );
}

export default VerifiedBadge;
