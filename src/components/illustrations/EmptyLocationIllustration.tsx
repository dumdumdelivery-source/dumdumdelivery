import React from "react";

interface IllustrationProps {
  className?: string;
  primaryColor?: string;
  accentColor?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * unDraw "Destinations / Navigation Map" vector illustration themed for DumDum Delivery
 * Open source by Katerina Limpitsouni (https://undraw.co)
 */
export const EmptyLocationIllustration: React.FC<IllustrationProps> = ({
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
      aria-label="Location territory navigation illustration"
    >
      {/* Ground & Ambient Blobs */}
      <ellipse cx="400" cy="515" rx="310" ry="22" fill="#E8D9C6" fillOpacity="0.45" />
      <circle cx="500" cy="220" r="140" fill={primaryColor} fillOpacity="0.08" />
      <circle cx="220" cy="240" r="75" fill={accentColor} fillOpacity="0.06" />

      {/* Folded Territory Map in Perspective */}
      {/* Fold 1 (Left) */}
      <path
        d="M340 220L420 200L420 440L340 460Z"
        fill="#FFFFFF"
        stroke="#35170F"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Fold 2 (Center) */}
      <path
        d="M420 200L500 230L500 470L420 440Z"
        fill="#FFF2DC"
        stroke="#35170F"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      {/* Fold 3 (Right) */}
      <path
        d="M500 230L580 210L580 450L500 470Z"
        fill="#FFFFFF"
        stroke="#35170F"
        strokeWidth="6"
        strokeLinejoin="round"
      />

      {/* Map Roads & Trails */}
      <path
        d="M360 270Q400 300 420 280T500 310T560 290"
        stroke={primaryColor}
        strokeWidth="8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M370 380Q430 350 460 390T550 370"
        stroke={accentColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="8 8"
        fill="none"
      />

      {/* Giant Map Pin on Map */}
      <g transform="translate(450, 240)">
        {/* Pin Drop Shadow */}
        <ellipse cx="0" cy="80" rx="18" ry="6" fill="#35170F" fillOpacity="0.2" />
        {/* Pin Body */}
        <path
          d="M0 75C-2 -5 -40 -35 -40 -70C-40 -92 -22 -110 0 -110C22 -110 40 -92 40 -70C40 -35 2 -5 0 75Z"
          fill={primaryColor}
          stroke="#35170F"
          strokeWidth="6"
          strokeLinejoin="round"
        />
        <circle cx="0" cy="-70" r="16" fill="#FFFFFF" />
      </g>

      {/* Character examining the location map */}
      {/* Legs & Shoes */}
      <path d="M230 400L215 495H185" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M265 400L275 495H305" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="175" y="485" width="45" height="18" rx="8" fill={primaryColor} />
      <rect x="275" y="485" width="45" height="18" rx="8" fill={primaryColor} />

      {/* Torso */}
      <path
        d="M210 270C210 270 275 260 285 300L275 410H210L210 270Z"
        fill={accentColor}
      />

      {/* Head & Hair */}
      <ellipse cx="245" cy="210" rx="22" ry="24" fill="#FAD0B1" />
      <path
        d="M230 195C225 180 240 170 260 175C275 180 280 195 270 210C265 200 255 195 240 195Z"
        fill="#35170F"
      />

      {/* Arm pointing to the destination pin */}
      <path
        d="M255 300L315 285L390 270"
        stroke="#FAD0B1"
        strokeWidth="11"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M240 295L285 290"
        stroke={accentColor}
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Compass Rose icon badge floating top-right */}
      <g transform="translate(630, 160)">
        <circle cx="0" cy="0" r="38" fill="#FFFFFF" stroke="#35170F" strokeWidth="5" />
        <path d="M0 -26L7 0H-7Z" fill={accentColor} />
        <path d="M0 26L7 0H-7Z" fill="#35170F" />
        <path d="M26 0L0 7V-7Z" fill="#E8D9C6" />
        <path d="-26 0L0 7V-7Z" fill="#E8D9C6" />
      </g>

      {/* Sparkles */}
      <g transform="translate(640, 340)">
        <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill={primaryColor} />
      </g>
      <g transform="translate(140, 220) scale(0.65)">
        <path d="M0 -18L4 -4L18 0L4 4L0 18L-4 4L-18 0L-4 -4Z" fill={accentColor} />
      </g>
    </svg>
  );
};
