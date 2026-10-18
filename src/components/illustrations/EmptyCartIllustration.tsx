import React from "react";

interface IllustrationProps {
  className?: string;
  primaryColor?: string;
  accentColor?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * unDraw "Empty Cart" vector illustration themed for DumDum Delivery
 * Open source by Katerina Limpitsouni (https://undraw.co)
 */
export const EmptyCartIllustration: React.FC<IllustrationProps> = ({
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
      aria-label="Empty shopping cart illustration"
    >
      {/* Ground baseline & ambient glow */}
      <ellipse cx="400" cy="520" rx="220" ry="12" fill="#E8D9C6" fillOpacity="0.35" />
      <circle cx="560" cy="180" r="110" fill={primaryColor} fillOpacity="0.06" />

      {/* Floating decorative food/treat elements */}
      <circle cx="590" cy="140" r="16" fill={primaryColor} fillOpacity="0.25" />
      <circle cx="260" cy="220" r="10" fill={accentColor} fillOpacity="0.3" />
      <circle cx="680" cy="290" r="12" fill={primaryColor} fillOpacity="0.2" />

      {/* Modern Shopping Cart Structure */}
      {/* Cart Basket Base */}
      <path
        d="M230 250H600L550 420H280L230 250Z"
        fill="#FFFFFF"
        stroke="#35170F"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Basket Grid Lines */}
      <path
        d="M260 290H585M270 330H570M280 370H555M310 250L330 420M390 250L400 420M470 250L470 420M540 250L530 420"
        stroke="#E8D9C6"
        strokeWidth="4"
        strokeLinecap="round"
      />

      {/* Cart Handle & Frame */}
      <path
        d="M190 200H240L280 440H560"
        stroke="#35170F"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Handle Grip */}
      <rect x="160" y="190" width="40" height="20" rx="10" fill={accentColor} />

      {/* Cart Wheels */}
      <circle cx="310" cy="470" r="28" fill="#35170F" />
      <circle cx="310" cy="470" r="14" fill="#FFFFFF" />
      <circle cx="310" cy="470" r="7" fill={primaryColor} />

      <circle cx="520" cy="470" r="28" fill="#35170F" />
      <circle cx="520" cy="470" r="14" fill="#FFFFFF" />
      <circle cx="520" cy="470" r="7" fill={primaryColor} />

      {/* Friendly unDraw character looking into the empty cart */}
      {/* Legs & Shoes */}
      <path d="M190 440L170 515H140" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M220 440L230 515H260" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="130" y="505" width="45" height="16" rx="8" fill={primaryColor} />
      <rect x="230" y="505" width="45" height="16" rx="8" fill={primaryColor} />

      {/* Body / Torso */}
      <path
        d="M175 320C175 320 220 320 230 350L215 445H170L175 320Z"
        fill={primaryColor}
      />

      {/* Head & Hair */}
      <ellipse cx="195" cy="265" rx="22" ry="26" fill="#FAD0B1" />
      {/* Hair */}
      <path
        d="M180 250C175 235 190 225 210 230C225 235 230 250 220 265C215 255 205 250 190 250Z"
        fill="#35170F"
      />
      {/* Face profile & curious expression */}
      <circle cx="205" cy="265" r="3" fill="#35170F" />
      <path d="M205 273C208 276 214 276 216 273" stroke="#35170F" strokeWidth="2" strokeLinecap="round" />

      {/* Arm leaning on cart handle */}
      <path
        d="M185 340L155 310L170 210"
        stroke="#FAD0B1"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M185 335L170 310"
        stroke={primaryColor}
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Empty Sparkle effect inside basket */}
      <g transform="translate(400, 310)">
        <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill={primaryColor} />
      </g>
      <g transform="translate(470, 350) scale(0.65)">
        <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill={accentColor} />
      </g>
      <g transform="translate(340, 360) scale(0.5)">
        <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill="#F5A020" />
      </g>
    </svg>
  );
};
