import React from "react";

interface IllustrationProps {
  className?: string;
  primaryColor?: string;
  accentColor?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * unDraw "Secure Login / Authentication" vector illustration themed for DumDum Delivery
 * Open source by Katerina Limpitsouni (https://undraw.co)
 */
export const LoginIllustration: React.FC<IllustrationProps> = ({
  className = "",
  primaryColor = "#F28C00",
  accentColor = "#B8420B",
  width = "100%",
  height = "auto"
}) => {
  return (
    <svg
      viewBox="0 0 800 600"
      width={width}
      height={height}
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ maxWidth: "100%", height: "auto" }}
      aria-label="Secure login illustration"
    >
      {/* Ground & Ambient Blobs */}
      <ellipse cx="400" cy="515" rx="300" ry="20" fill="#E8D9C6" fillOpacity="0.4" />
      <circle cx="480" cy="240" r="150" fill={primaryColor} fillOpacity="0.08" />
      <circle cx="250" cy="190" r="80" fill={accentColor} fillOpacity="0.06" />

      {/* Floating security & treat symbols */}
      <circle cx="610" cy="180" r="14" fill={primaryColor} fillOpacity="0.25" />
      <circle cx="230" cy="290" r="9" fill={accentColor} fillOpacity="0.3" />

      {/* Giant Smartphone Device */}
      <rect
        x="360"
        y="140"
        width="220"
        height="350"
        rx="36"
        fill="#FFFFFF"
        stroke="#35170F"
        strokeWidth="10"
      />
      {/* Phone Screen Speaker & Notch */}
      <rect x="435" y="160" width="70" height="8" rx="4" fill="#35170F" />

      {/* Phone Screen Content: DumDum Login Mock */}
      <rect x="385" y="195" width="170" height="260" rx="20" fill="#FFF7E8" />

      {/* Lock Shield on Phone Screen */}
      <circle cx="470" cy="280" r="42" fill="rgba(242, 140, 0, 0.15)" />
      {/* Padlock Icon */}
      <rect x="450" y="270" width="40" height="32" rx="8" fill={primaryColor} />
      <path
        d="M458 270V254C458 247 463 242 470 242C477 242 482 247 482 254V270"
        stroke="#35170F"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="470" cy="285" r="4" fill="#35170F" />

      {/* Google Sign In mock pill on phone screen */}
      <rect x="405" y="340" width="130" height="34" rx="17" fill="#FFFFFF" stroke="#35170F" strokeWidth="2.5" />
      <circle cx="425" cy="357" r="7" fill={accentColor} />
      <rect x="440" y="354" width="75" height="6" rx="3" fill="#35170F" />

      {/* Character Standing Beside Phone */}
      {/* Legs & Shoes */}
      <path d="M260 400L245 495H215" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M295 400L305 495H335" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="205" y="485" width="45" height="18" rx="8" fill={primaryColor} />
      <rect x="305" y="485" width="45" height="18" rx="8" fill={primaryColor} />

      {/* Upper Body */}
      <path
        d="M235 270C235 270 300 260 310 300L300 410H235L235 270Z"
        fill={accentColor}
      />

      {/* Head & Hair */}
      <ellipse cx="270" cy="210" rx="22" ry="24" fill="#FAD0B1" />
      <path
        d="M255 195C250 180 265 170 285 175C300 180 305 195 295 210C290 200 280 195 265 195Z"
        fill="#35170F"
      />

      {/* Arm pointing towards phone login */}
      <path
        d="M270 300L330 285L390 285"
        stroke="#FAD0B1"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M255 295L300 290"
        stroke={accentColor}
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Sparkles */}
      <g transform="translate(630, 290)">
        <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill={primaryColor} />
      </g>
      <g transform="translate(180, 230) scale(0.65)">
        <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill={accentColor} />
      </g>
    </svg>
  );
};
