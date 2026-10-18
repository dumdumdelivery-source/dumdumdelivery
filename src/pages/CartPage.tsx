import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Truck,
  Store,
  ShieldCheck
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";
import { SHIPPING_FREE_THRESHOLD } from "../services/orderService";
import { EmptyCartIllustration } from "../components/illustrations";
import { CheckoutModal } from "../components/CheckoutModal";
import type { StoreCartGroup } from "../types";

export const CartPage: React.FC = () => {
  const { t } = useSettings();
  const {
    items,
    storeGroups,
    totalItemCount,
    overallSubtotal,
    updateQuantity,
    removeFromCart
  } = useCart();

  const [checkoutGroup, setCheckoutGroup] = useState<StoreCartGroup | null>(null);

  // Prevent any document/body scrolling while on the cart page (just like home & signin pages)
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;
    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  if (items.length === 0) {
    return (
      <div
        className="home-non-scrollable non-scrollable-page animate-fade-in"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          paddingTop: "calc(70px + env(safe-area-inset-top, 0px))",
          paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "var(--bg-app)",
          zIndex: 1,
          touchAction: "none",
          userSelect: "none",
          paddingLeft: "1rem",
          paddingRight: "1rem",
          boxSizing: "border-box",
        }}
      >
        <div
          className="game-card"
          style={{
            maxWidth: "460px",
            width: "100%",
            maxHeight: "100%",
            padding: "clamp(1.5rem, 4vh, 2.5rem) clamp(1.25rem, 4vw, 2rem)",
            textAlign: "center",
            background: "#FFFFFF",
            margin: "auto",
            boxSizing: "border-box",
          }}
        >
          <div
            className="empty-illustration"
            style={{
              margin: "0 auto clamp(0.75rem, 2vh, 1.25rem)",
              maxHeight: "clamp(100px, 18vh, 160px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ transform: "scale(clamp(0.8, 0.95, 1))", transformOrigin: "center center" }}>
              <EmptyCartIllustration />
            </div>
          </div>
          <h2
            className="empty-title"
            style={{
              fontSize: "clamp(1.35rem, 3vh, 1.7rem)",
              fontWeight: 900,
              color: "var(--clr-brown)",
              marginBottom: "0.4rem",
            }}
          >
            {t("emptyCartTitle")}
          </h2>
          <p
            className="empty-desc"
            style={{
              fontSize: "clamp(0.85rem, 1.8vh, 0.95rem)",
              color: "var(--txt-secondary)",
              marginBottom: "clamp(1.25rem, 3vh, 1.75rem)",
              lineHeight: 1.45,
            }}
          >
            {t("emptyCartSubtitle")}
          </p>
          <Link
            to="/stores"
            className="btn-primary"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              padding: "clamp(0.75rem, 1.8vh, 0.9rem) 1.5rem",
              fontSize: "clamp(0.9rem, 2vh, 1rem)",
            }}
          >
            <span>{t("exploreStores")}</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="home-non-scrollable non-scrollable-page animate-fade-in"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: "calc(70px + env(safe-area-inset-top, 0px))",
        paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "var(--bg-app)",
        zIndex: 1,
        boxSizing: "border-box",
      }}
    >
      <div
        className="app-container"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          padding: "1rem 1rem 1.5rem",
          boxSizing: "border-box",
        }}
      >
        <div style={{ marginTop: "0.25rem", marginBottom: "0.75rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <div>
              <h1 className="section-title" style={{ margin: 0, fontSize: "clamp(1.25rem, 2.5vw, 1.6rem)" }}>
                <ShoppingBag size={24} color="#F28C00" />
                <span>Your Cart ({totalItemCount} {totalItemCount === 1 ? "item" : "items"})</span>
              </h1>
              <p className="section-subtitle" style={{ margin: "0.25rem 0 0" }}>
                Items are grouped by store. Purchase from each store independently!
              </p>
            </div>

            <Link to="/stores" className="btn-surface" style={{ fontSize: "0.825rem", padding: "0.45rem 0.85rem" }}>
              Add More
            </Link>
          </div>
        </div>

        <div className="cart-page-layout" style={{ margin: 0, flex: 1 }}>
        {/* Left Column: Store Groups */}
        <div>
          {storeGroups.map((group) => {
            const hasFreeShipping = group.subtotal >= SHIPPING_FREE_THRESHOLD;
            const progressPercent = Math.min(
              100,
              Math.round((group.subtotal / SHIPPING_FREE_THRESHOLD) * 100)
            );

            return (
              <div key={group.storeId} className="game-card cart-store-card">
                {/* Store Header */}
                <div className="cart-store-header">
                  <div className="cart-store-title">
                    <Store size={18} color="#B8420B" />
                    <span>{group.storeName}</span>
                  </div>
                  <span className="badge-tag">{group.items.length} {group.items.length === 1 ? "item" : "items"}</span>
                </div>

                {/* Items List */}
                <div className="cart-store-items">
                  {group.items.map((item) => (
                    <div key={item.productId} className="cart-item-row">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="cart-item-thumb"
                      />

                      <div className="cart-item-info">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-price">₹{item.price} each</span>
                      </div>

                      {/* Quantity Selector */}
                      <div className="quantity-ctrl">
                        <button
                          type="button"
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="quantity-val">{item.quantity}</span>
                        <button
                          type="button"
                          className="quantity-btn"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Subtotal & Remove */}
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span className="cart-item-subtotal">
                          ₹{item.price * item.quantity}
                        </span>
                        <button
                          type="button"
                          className="cart-item-remove-btn"
                          onClick={() => removeFromCart(item.productId)}
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Shipping Progress */}
                  <div className="shipping-progress-box">
                    <div className="shipping-progress-text">
                      <span>
                        <Truck size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
                        {hasFreeShipping ? (
                          <strong style={{ color: "var(--clr-success)" }}>
                            🎉 You've unlocked FREE Ground Shipping for this store!
                          </strong>
                        ) : (
                          <span>
                            Add <strong>₹{group.freeShippingRemaining}</strong> more to unlock <strong>FREE ground shipping</strong>
                          </span>
                        )}
                      </span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${progressPercent}%`,
                          background: hasFreeShipping
                            ? "var(--grad-success)"
                            : "var(--grad-primary)"
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Store Footer with Separate Store Checkout Button */}
                <div className="cart-store-footer">
                  <div className="store-checkout-info">
                    <div className="store-checkout-subtotal">
                      Store Subtotal: <strong>₹{group.subtotal}</strong>
                      {" + "}
                      <span>
                        Shipping: {hasFreeShipping ? "FREE" : `₹${group.shippingCharge}`}
                      </span>
                    </div>
                    <div style={{ fontWeight: 900, color: "var(--clr-brown)", fontSize: "1.1rem" }}>
                      Store Total: ₹{group.total}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => setCheckoutGroup(group)}
                  >
                    <span>Buy from {group.storeName}</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Overall Summary */}
        <div className="game-card cart-summary-card">
          <h3 className="summary-title">
            <span>Overall Cart Summary</span>
          </h3>

          <div className="summary-row">
            <span>Total Items:</span>
            <span>{totalItemCount}</span>
          </div>

          <div className="summary-row">
            <span>Participating Stores:</span>
            <span>{storeGroups.length}</span>
          </div>

          <div className="summary-row">
            <span>Combined Subtotal:</span>
            <span>₹{overallSubtotal}</span>
          </div>

          <div
            style={{
              fontSize: "0.775rem",
              color: "var(--txt-muted)",
              background: "#FFFDF9",
              padding: "0.6rem 0.75rem",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--border-base)",
              margin: "0.85rem 0"
            }}
          >
            <ShieldCheck size={14} color="#F28C00" style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
            Each store ships independently. Click <strong>"Buy from this Store"</strong> on any store card above to complete checkout for that store.
          </div>

          <div className="summary-row total">
            <span>All Stores Subtotal:</span>
            <span>₹{overallSubtotal}</span>
          </div>

          <Link
            to="/"
            className="btn-surface"
            style={{ width: "100%", marginTop: "1rem", textAlign: "center" }}
          >
            Add More Items
          </Link>
        </div>
      </div>

      {/* Shop-Wise Checkout Modal */}
      {checkoutGroup && (
        <CheckoutModal
          storeGroup={checkoutGroup}
          onClose={() => setCheckoutGroup(null)}
        />
      )}
      </div>
    </div>
  );
};
