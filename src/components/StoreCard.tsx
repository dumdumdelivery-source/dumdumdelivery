import React from "react";
import { Star, Clock, ArrowRight } from "lucide-react";
import type { Store } from "../types";

interface StoreCardProps {
  store: Store;
  isSelected: boolean;
  onSelect: (storeId: string) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  isSelected,
  onSelect
}) => {
  return (
    <div
      className={`game-card store-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect(store.id)}
      style={{
        border: isSelected ? "2px solid var(--clr-primary)" : "1.5px solid var(--border-base)",
        boxShadow: isSelected ? "0 8px 24px var(--clr-primary-glow)" : undefined
      }}
    >
      <div className="store-card-img-wrapper">
        <img
          src={store.imageUrl}
          alt={store.name}
          className="store-card-img"
          loading="lazy"
        />
        {store.rating && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              background: "rgba(53, 23, 15, 0.85)",
              color: "#FFF7E8",
              padding: "0.2rem 0.55rem",
              borderRadius: "var(--radius-pill)",
              fontSize: "0.75rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
              backdropFilter: "blur(4px)"
            }}
          >
            <Star size={12} color="#F28C00" fill="#F28C00" />
            <span>{store.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="store-card-content">
        <div className="store-card-header">
          <h3 className="store-card-title">{store.name}</h3>
        </div>

        <p className="store-card-desc">{store.description}</p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "0.75rem",
            borderTop: "1px dashed var(--border-base)"
          }}
        >
          {store.deliveryEstimate ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.35rem",
                fontSize: "0.775rem",
                fontWeight: 700,
                color: "var(--txt-muted)"
              }}
            >
              <Clock size={13} color="#B8420B" />
              <span>{store.deliveryEstimate}</span>
            </div>
          ) : (
            <div />
          )}

          <button
            type="button"
            className={isSelected ? "btn-primary" : "btn-surface"}
            style={{ padding: "0.4rem 0.9rem", fontSize: "0.8rem" }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(store.id);
            }}
          >
            <span>{isSelected ? "Selected" : "View Store"}</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
