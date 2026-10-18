import React, { useState } from "react";

interface UserAvatarProps {
  photoURL?: string | null;
  name?: string | null;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  photoURL,
  name,
  size = 36,
  className = "",
  style = {}
}) => {
  const [imgError, setImgError] = useState(false);

  const initial = (name?.trim()?.[0] || "U").toUpperCase();

  // If there's a photoURL and it hasn't errored out, try rendering the Google photo with no-referrer
  if (photoURL && !imgError) {
    return (
      <img
        src={photoURL}
        alt={name || "User Avatar"}
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onError={() => setImgError(true)}
        className={className}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2px solid var(--clr-primary)",
          display: "inline-block",
          flexShrink: 0,
          ...style
        }}
      />
    );
  }

  // Fallback: Crisp monogram circle using DumDum beat orange & dark chocolate theme
  return (
    <div
      className={className}
      aria-label={name || "User Avatar"}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: "var(--grad-primary)",
        color: "var(--clr-brown)",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 900,
        fontSize: `${Math.round(size * 0.44)}px`,
        border: "2px solid rgba(255,255,255,0.8)",
        boxShadow: "0 2px 6px rgba(53,23,15,0.15)",
        flexShrink: 0,
        userSelect: "none",
        ...style
      }}
    >
      {initial}
    </div>
  );
};
