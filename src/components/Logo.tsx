
import React from 'react';

const Logo = () => {
  return (
    <div className="relative w-10 h-10">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="animate-pulse-glow"
      >
        <path
          d="M20 5L5 20L20 35L35 20L20 5Z"
          stroke="#00F0FF"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="rgba(0, 240, 255, 0.1)"
        />
        <path
          d="M12 20H28"
          stroke="#00F0FF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M20 12V28"
          stroke="#00F0FF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 15L25 25"
          stroke="#00F0FF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M25 15L15 25"
          stroke="#00F0FF"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle 
          cx="20" 
          cy="20" 
          r="8" 
          fill="url(#gradient)" 
          fillOpacity="0.7" 
          filter="blur(2px)"
        />
        <defs>
          <radialGradient id="gradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(20 20) rotate(90) scale(10)">
            <stop stopColor="#00F0FF" />
            <stop offset="1" stopColor="#00F0FF" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export default Logo;
