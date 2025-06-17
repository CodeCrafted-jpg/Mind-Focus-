import React from 'react';

function Logo() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="App logo"
    >
      {/* Define a linear gradient for a subtle depth effect on the outer circle */}
      <defs>
        <linearGradient id="primaryCircleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10B981" /> {/* Primary color at start */}
          <stop offset="100%" stopColor="#059669" /> {/* Accent color at end, for depth */}
        </linearGradient>
      </defs>

      {/* Outer circle with gradient fill for a more modern look */}
      <circle cx="32" cy="32" r="30" fill="url(#primaryCircleGradient)" />

      {/* Inner shape: a stylized "M" with slightly refined path and adjusted stroke */}
      <path
        d="M18 44 L28 22 L32 32 L36 22 L46 44" /* Adjusted points for slightly cleaner M */
        stroke="#F0FDF4" /* Changed to light text color for better contrast and modern feel */
        strokeWidth="4.5" /* Slightly increased stroke for bolder lines */
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Base line under the M, for balance and refined stroke */}
      <line
        x1="18"
        y1="48"
        x2="46"
        y2="48"
        stroke="#F0FDF4" /* Changed to light text color for consistency with M */
        strokeWidth="3.5" /* Slightly increased stroke */
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Logo;