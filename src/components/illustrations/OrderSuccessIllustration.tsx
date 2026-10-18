import React from "react";

interface IllustrationProps {
  className?: string;
  primaryColor?: string;
  accentColor?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * unDraw "Order Confirmed / Celebration" vector illustration themed for DumDum Delivery
 * Open source by Katerina Limpitsouni (https://undraw.co)
 */
export const OrderSuccessIllustration: React.FC<IllustrationProps> = ({
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
      aria-label="Order confirmation celebration illustration"
    >
      {/* Ground Shadow & Ambient Circles */}
      <ellipse cx="400" cy="520" rx="320" ry="22" fill="#E8D9C6" fillOpacity="0.45" />
      <circle cx="400" cy="240" r="160" fill={primaryColor} fillOpacity="0.08" />
      <circle cx="620" cy="180" r="90" fill={accentColor} fillOpacity="0.07" />

      {/* Confetti & Joyful Elements */}
      <rect x="230" y="140" width="16" height="8" rx="3" fill={primaryColor} transform="rotate(35 230 140)" />
      <rect x="580" y="130" width="14" height="7" rx="3" fill={accentColor} transform="rotate(-25 580 130)" />
      <rect x="300" y="90" width="18" height="9" rx="3" fill="#28B870" transform="rotate(45 300 90)" />
      <rect x="490" y="95" width="16" height="8" rx="3" fill={primaryColor} transform="rotate(-15 490 95)" />
      <circle cx="270" cy="190" r="7" fill={accentColor} />
      <circle cx="530" cy="180" r="8" fill="#28B870" />
      <circle cx="640" cy="260" r="10" fill={primaryColor} />

      {/* Centerpiece: Delivery Scooter with Order Box */}
      {/* Scooter Wheels */}
      <circle cx="280" cy="460" r="42" fill="#35170F" />
      <circle cx="280" cy="460" r="22" fill="#FFFFFF" />
      <circle cx="280" cy="460" r="10" fill={primaryColor} />

      <circle cx="520" cy="460" r="42" fill="#35170F" />
      <circle cx="520" cy="460" r="22" fill="#FFFFFF" />
      <circle cx="520" cy="460" r="10" fill={primaryColor} />

      {/* Scooter Frame & Body */}
      <path
        d="M280 460H360L420 410H490L520 460"
        stroke="#35170F"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Scooter Floorboard & Shield */}
      <path
        d="M360 440H440L470 330H430"
        stroke="#35170F"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M380 435L440 435L475 330H420Z"
        fill={primaryColor}
      />

      {/* Handlebar & Headlight */}
      <path d="M470 330L490 270H450" stroke="#35170F" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="490" cy="270" r="12" fill="#FFF2DC" stroke="#35170F" strokeWidth="4" />

      {/* Delivery Trunk / Hot-Box on the back of scooter */}
      <rect x="250" y="320" width="100" height="90" rx="14" fill={accentColor} stroke="#35170F" strokeWidth="6" />
      {/* Box Latch & Logo circle */}
      <circle cx="300" cy="365" r="18" fill="#FFFFFF" />
      <path d="M294 365L298 369L308 359" stroke={primaryColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

      {/* Big Green Success Badge Floating Overhead */}
      <g transform="translate(400, 150)">
        <circle cx="0" cy="0" r="46" fill="#D3EFE2" />
        <circle cx="0" cy="0" r="38" fill="#1A6E42" />
        <path d="M-14 0L-4 10L16 -10" stroke="#FFFFFF" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      {/* Sparkles */}
      <g transform="translate(190, 240)">
        <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill={primaryColor} />
      </g>
      <g transform="translate(610, 320) scale(0.7)">
        <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill={accentColor} />
      </g>
    </svg>
  );
};
