import React from "react";

interface IllustrationProps {
  className?: string;
  primaryColor?: string;
  accentColor?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * unDraw "Store / Shop Partner" vector illustration themed for DumDum Delivery
 * Open source by Katerina Limpitsouni (https://undraw.co)
 */
export const EmptyShopIllustration: React.FC<IllustrationProps> = ({
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
      aria-label="Shop partner storefront illustration"
    >
      {/* Ground & Ambient Blobs */}
      <ellipse cx="400" cy="515" rx="310" ry="22" fill="#E8D9C6" fillOpacity="0.45" />
      <circle cx="480" cy="220" r="140" fill={primaryColor} fillOpacity="0.08" />
      <circle cx="210" cy="240" r="75" fill={accentColor} fillOpacity="0.06" />

      {/* Modern Storefront Building */}
      {/* Main Building Base */}
      <rect
        x="330"
        y="190"
        width="280"
        height="300"
        rx="24"
        fill="#FFFFFF"
        stroke="#35170F"
        strokeWidth="10"
      />

      {/* Awning (Striped beat orange & warm sand) */}
      <path
        d="M310 200C310 170 330 160 350 160H590C610 160 630 170 630 200L610 230H330L310 200Z"
        fill={primaryColor}
        stroke="#35170F"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Awning Stripes */}
      <path d="M370 160L360 230M430 160L420 230M490 160L480 230M550 160L540 230" stroke="#FFF7E8" strokeWidth="18" />
      <path d="M370 160L360 230M430 160L420 230M490 160L480 230M550 160L540 230" stroke="#35170F" strokeWidth="4" />

      {/* Store Window & Door */}
      <rect x="360" y="270" width="100" height="120" rx="14" fill="#FFF7E8" stroke="#35170F" strokeWidth="6" />
      {/* Window Glare */}
      <path d="M380 285L440 345M400 285L445 330" stroke="#FFFFFF" strokeWidth="6" strokeLinecap="round" />

      {/* Store Door */}
      <rect x="490" y="280" width="90" height="210" rx="8" fill="#FFF2DC" stroke="#35170F" strokeWidth="6" />
      <circle cx="510" cy="380" r="7" fill={accentColor} />
      <rect x="505" y="300" width="60" height="60" rx="6" fill="#FFFFFF" stroke="#35170F" strokeWidth="4" />

      {/* Character / Merchant Partner standing outside */}
      {/* Legs & Shoes */}
      <path d="M220 400L205 495H175" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M255 400L265 495H295" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="165" y="485" width="45" height="18" rx="8" fill={primaryColor} />
      <rect x="265" y="485" width="45" height="18" rx="8" fill={primaryColor} />

      {/* Apron / Torso */}
      <path
        d="M200 270C200 270 265 260 275 300L265 410H200L200 270Z"
        fill={accentColor}
      />
      {/* Apron Over-Ties */}
      <path d="M215 285L215 380M255 285L255 380" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" />

      {/* Head & Baker/Merchant Hat */}
      <ellipse cx="235" cy="215" rx="22" ry="24" fill="#FAD0B1" />
      {/* Baker / Chef Puffy Hat */}
      <path
        d="M210 200C205 175 220 160 235 160C250 160 265 175 260 200H210Z"
        fill="#FFFFFF"
        stroke="#35170F"
        strokeWidth="4"
      />
      <circle cx="225" cy="170" r="14" fill="#FFFFFF" stroke="#35170F" strokeWidth="3" />
      <circle cx="245" cy="170" r="14" fill="#FFFFFF" stroke="#35170F" strokeWidth="3" />

      {/* Arm with welcoming gesture */}
      <path
        d="M245 300L295 285L340 310"
        stroke="#FAD0B1"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M230 295L270 290"
        stroke={accentColor}
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Sparkles */}
      <g transform="translate(650, 260)">
        <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill={primaryColor} />
      </g>
      <g transform="translate(150, 210) scale(0.65)">
        <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill={accentColor} />
      </g>
    </svg>
  );
};
