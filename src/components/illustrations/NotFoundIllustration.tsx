import React from "react";

interface IllustrationProps {
  className?: string;
  primaryColor?: string;
  accentColor?: string;
  width?: number | string;
  height?: number | string;
}

/**
 * unDraw "Void / Not Found / Searching" vector illustration themed for DumDum Delivery
 * Open source by Katerina Limpitsouni (https://undraw.co)
 */
export const NotFoundIllustration: React.FC<IllustrationProps> = ({
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
      aria-label="Nothing found illustration"
    >
      {/* Ground Shadow & Ambient Circles */}
      <ellipse cx="400" cy="515" rx="300" ry="22" fill="#E8D9C6" fillOpacity="0.4" />
      <circle cx="360" cy="220" r="140" fill={primaryColor} fillOpacity="0.08" />
      <circle cx="560" cy="290" r="85" fill={accentColor} fillOpacity="0.06" />

      {/* Floating 404 & Question Marks */}
      <text
        x="510"
        y="190"
        fontFamily="sans-serif"
        fontSize="72"
        fontWeight="900"
        fill="#35170F"
        fillOpacity="0.12"
      >
        ?
      </text>

      {/* Character looking through Giant Magnifying Glass */}
      {/* Legs & Shoes */}
      <path d="M260 410L245 500H215" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M295 410L305 500H335" stroke="#35170F" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="205" y="490" width="45" height="18" rx="8" fill={primaryColor} />
      <rect x="305" y="490" width="45" height="18" rx="8" fill={primaryColor} />

      {/* Body / Sweater */}
      <path
        d="M240 290C240 290 310 280 320 320L310 420H240L240 290Z"
        fill={accentColor}
      />

      {/* Head & Hair */}
      <ellipse cx="275" cy="235" rx="22" ry="24" fill="#FAD0B1" />
      <path
        d="M260 220C255 205 270 195 290 200C305 205 310 220 300 235C295 225 285 220 270 220Z"
        fill="#35170F"
      />

      {/* Arm holding the magnifying glass stem */}
      <path
        d="M280 320L350 320L410 290"
        stroke="#FAD0B1"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M265 315L310 320"
        stroke={accentColor}
        strokeWidth="14"
        strokeLinecap="round"
      />

      {/* Giant Magnifying Glass */}
      {/* Glass Shadow */}
      <ellipse cx="490" cy="270" rx="90" ry="90" fill={primaryColor} fillOpacity="0.08" />

      {/* Glass Rim */}
      <circle
        cx="490"
        cy="260"
        r="88"
        stroke="#35170F"
        strokeWidth="14"
        fill="#FFFFFF"
        fillOpacity="0.85"
      />
      {/* Glass Lens Highlight */}
      <path
        d="M440 220C460 200 500 195 530 215"
        stroke={primaryColor}
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Magnifying Glass Handle */}
      <path
        d="M428 322L360 390"
        stroke="#35170F"
        strokeWidth="18"
        strokeLinecap="round"
      />
      <rect x="350" y="380" width="40" height="20" rx="8" fill={primaryColor} transform="rotate(45 350 380)" />

      {/* Empty Paper Sheet / Folder inside Glass */}
      <rect x="460" y="230" width="60" height="75" rx="6" fill="#FDE8D8" stroke="#35170F" strokeWidth="4" />
      <circle cx="490" cy="260" r="10" fill={primaryColor} />
      <path d="M472 280H508M472 292H496" stroke="#35170F" strokeWidth="3" strokeLinecap="round" />

      {/* Decorative floating shapes */}
      <g transform="translate(630, 390)">
        <path d="M0 -16L3 -3L16 0L3 3L0 16L-3 3L-16 0L-3 -3Z" fill={primaryColor} />
      </g>
      <g transform="translate(180, 220) scale(0.7)">
        <path d="M0 -16L3 -3L16 0L3 3L0 16L-3 3L-16 0L-3 -3Z" fill={accentColor} />
      </g>
    </svg>
  );
};
