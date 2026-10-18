import React from "react";

interface IllustrationProps {
  className?: string;
  primaryColor?: string;
  accentColor?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * unDraw "No Orders Yet" vector illustration themed for DumDum Delivery
 * Open source by Katerina Limpitsouni (https://undraw.co)
 */
export const EmptyOrdersIllustration: React.FC<IllustrationProps> = ({
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
      aria-label="No orders illustration"
    >
      {/* Ground Shadow & Ambient Circles */}
      <ellipse cx="400" cy="515" rx="300" ry="22" fill="#E8D9C6" fillOpacity="0.4" />
      <circle cx="340" cy="220" r="130" fill={primaryColor} fillOpacity="0.08" />
      <circle cx="580" cy="280" r="80" fill={accentColor} fillOpacity="0.06" />

      {/* Decorative floating dots */}
      <circle cx="210" cy="180" r="12" fill={primaryColor} fillOpacity="0.3" />
      <circle cx="590" cy="160" r="15" fill={accentColor} fillOpacity="0.25" />
      <circle cx="660" cy="380" r="10" fill={primaryColor} fillOpacity="0.2" />

      {/* Large Delivery Box / Parcel Centerpiece */}
      <g id="parcel-box">
        {/* Box Shadow */}
        <ellipse cx="470" cy="470" rx="140" ry="20" fill="#35170F" fillOpacity="0.08" />

        {/* Box Faces */}
        {/* Front Face */}
        <path d="M370 330L550 330L550 460L370 460Z" fill="#F4DCB9" stroke="#35170F" strokeWidth="6" strokeLinejoin="round" />
        {/* Left Perspective Face */}
        <path d="M300 270L370 330L370 460L300 390Z" fill="#E8CBA0" stroke="#35170F" strokeWidth="6" strokeLinejoin="round" />
        {/* Top Perspective Face */}
        <path d="M300 270L460 270L550 330L370 330Z" fill="#FFF2DC" stroke="#35170F" strokeWidth="6" strokeLinejoin="round" />

        {/* Packing Tape */}
        <path d="M440 270L440 460" stroke={primaryColor} strokeWidth="22" strokeLinecap="round" />
        <path d="M300 330L550 330" stroke={primaryColor} strokeWidth="18" strokeLinecap="round" strokeDasharray="6 6" />

        {/* DumDum Brand Tag on Box */}
        <rect x="400" y="370" width="80" height="50" rx="8" fill="#FFFFFF" stroke="#35170F" strokeWidth="3" />
        <circle cx="440" cy="390" r="10" fill={primaryColor} />
        <path d="M415 410H465" stroke="#35170F" strokeWidth="3" strokeLinecap="round" />
      </g>

      {/* unDraw Delivery Person / Rider checking clipboard */}
      {/* Legs & Boots */}
      <path d="M210 390L190 495H160" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M245 390L255 495H285" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="150" y="485" width="45" height="18" rx="8" fill={accentColor} />
      <rect x="255" y="485" width="45" height="18" rx="8" fill={accentColor} />

      {/* Pants */}
      <path d="M195 360L190 410M245 360L255 410" stroke="#35170F" strokeWidth="16" strokeLinecap="round" />

      {/* Jacket / Hoodie */}
      <path
        d="M185 240C185 240 250 230 260 270L250 380H185L185 240Z"
        fill={primaryColor}
      />

      {/* DumDum Cap & Head */}
      <ellipse cx="215" cy="180" rx="22" ry="24" fill="#FAD0B1" />
      {/* Cap Visor */}
      <path d="M200 165H245L255 175H210Z" fill={accentColor} />
      <ellipse cx="220" cy="165" rx="20" ry="12" fill={accentColor} />

      {/* Arm holding clipboard */}
      <path
        d="M230 260L270 300L260 340"
        stroke="#FAD0B1"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M210 255L245 285"
        stroke={primaryColor}
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Clipboard */}
      <rect x="250" y="270" width="60" height="85" rx="6" fill="#FFFFFF" stroke="#35170F" strokeWidth="4" transform="rotate(-10 250 270)" />
      <rect x="268" y="265" width="22" height="10" rx="3" fill="#35170F" transform="rotate(-10 268 265)" />
      {/* Checklist Lines */}
      <path d="M260 295H295M257 315H292M254 335H280" stroke={primaryColor} strokeWidth="3" strokeLinecap="round" transform="rotate(-10 250 270)" />

      {/* Decorative Sparkles */}
      <g transform="translate(630, 240)">
        <path d="M0 -16L3 -3L16 0L3 3L0 16L-3 3L-16 0L-3 -3Z" fill={primaryColor} />
      </g>
      <g transform="translate(130, 260) scale(0.65)">
        <path d="M0 -16L3 -3L16 0L3 3L0 16L-3 3L-16 0L-3 -3Z" fill={accentColor} />
      </g>
    </svg>
  );
};
