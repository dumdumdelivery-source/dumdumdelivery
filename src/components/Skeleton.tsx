import React from "react";

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Universal Skeleton element with smooth shimmer animation
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = "100%",
  height = "1rem",
  borderRadius = "8px",
  style,
  className = "",
}) => {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
        ...style,
      }}
    />
  );
};

/**
 * Skeleton for Admin List Pages (Shops, Locations, Areas)
 * Renders table row shimmer for desktop and card shimmer for mobile
 */
export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", width: "100%" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="game-card"
          style={{
            padding: "1rem 1.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            background: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(53, 23, 15, 0.04)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", flex: 1 }}>
            <Skeleton width={42} height={42} borderRadius={12} />
            <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem", flex: 1, maxWidth: "340px" }}>
              <Skeleton width="70%" height="1.05rem" borderRadius={6} />
              <Skeleton width="45%" height="0.8rem" borderRadius={4} />
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <Skeleton width={80} height={26} borderRadius={8} />
            <Skeleton width={64} height={32} borderRadius={10} />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Skeleton for Admin Form Pages (ShopForm, LocationForm, AreaForm)
 */
export const FormSkeleton: React.FC = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
      <div className="form-section-card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <Skeleton width={38} height={38} borderRadius={10} />
          <div style={{ flex: 1 }}>
            <Skeleton width="40%" height="1.1rem" borderRadius={6} style={{ marginBottom: "0.4rem" }} />
            <Skeleton width="65%" height="0.8rem" borderRadius={4} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <Skeleton width="28%" height="0.85rem" borderRadius={4} style={{ marginBottom: "0.45rem" }} />
            <Skeleton width="100%" height={44} borderRadius={12} />
          </div>
          <div>
            <Skeleton width="32%" height="0.85rem" borderRadius={4} style={{ marginBottom: "0.45rem" }} />
            <Skeleton width="100%" height={44} borderRadius={12} />
          </div>
        </div>
      </div>
      <div className="form-section-card" style={{ padding: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
          <Skeleton width={38} height={38} borderRadius={10} />
          <div style={{ flex: 1 }}>
            <Skeleton width="35%" height="1.1rem" borderRadius={6} style={{ marginBottom: "0.4rem" }} />
            <Skeleton width="55%" height="0.8rem" borderRadius={4} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
          <div>
            <Skeleton width="30%" height="0.85rem" borderRadius={4} style={{ marginBottom: "0.45rem" }} />
            <Skeleton width="100%" height={44} borderRadius={12} />
          </div>
          <div>
            <Skeleton width="30%" height="0.85rem" borderRadius={4} style={{ marginBottom: "0.45rem" }} />
            <Skeleton width="100%" height={44} borderRadius={12} />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Stores Trail Page while locations and partner shops load
 */
export const StoresTrailSkeleton: React.FC = () => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      <div
        className="game-card"
        style={{
          width: "100%",
          maxWidth: "460px",
          padding: "2rem 1.5rem",
          borderRadius: "28px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1.25rem",
          background: "#FFFFFF",
          boxShadow: "0 8px 24px rgba(53, 23, 15, 0.05)",
        }}
      >
        <Skeleton width={96} height={96} borderRadius="50%" />
        <Skeleton width="60%" height="1.25rem" borderRadius={8} />
        <Skeleton width="85%" height="0.9rem" borderRadius={6} />
        <div style={{ display: "flex", gap: "0.75rem", width: "100%", marginTop: "0.5rem" }}>
          <Skeleton width="50%" height={42} borderRadius={14} />
          <Skeleton width="50%" height={42} borderRadius={14} />
        </div>
      </div>
    </div>
  );
};

/**
 * Skeleton for Orders History Page
 */
export const OrdersHistorySkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", width: "100%" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="game-card"
          style={{
            padding: "1.5rem",
            background: "#FFFFFF",
            boxShadow: "0 2px 10px rgba(53, 23, 15, 0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", width: "50%" }}>
              <Skeleton width="75%" height="1.15rem" borderRadius={6} />
              <Skeleton width="45%" height="0.8rem" borderRadius={4} />
            </div>
            <Skeleton width={90} height={28} borderRadius={12} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", borderTop: "1px dashed var(--border-base)", paddingTop: "0.85rem" }}>
            <Skeleton width="90%" height="0.85rem" borderRadius={4} />
            <Skeleton width="60%" height="0.85rem" borderRadius={4} />
          </div>
        </div>
      ))}
    </div>
  );
};
