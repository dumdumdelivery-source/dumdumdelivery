import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  AlertCircle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  LogIn,
  Store
} from "lucide-react";
import type { StoreCartGroup, DeliveryAddress } from "../types";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/orderService";

interface CheckoutModalProps {
  storeGroup: StoreCartGroup | null;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  storeGroup,
  onClose
}) => {
  const { user, profile, signInWithGoogle, signInWithGoogleRedirect, saveProfile } = useAuth();
  const { clearStoreCart, showToast } = useCart();
  const navigate = useNavigate();

  // Step 1: "edit" details, Step 2: "confirm" details
  const [step, setStep] = useState<"edit" | "confirm">("edit");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState<DeliveryAddress>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: ""
  });

  // Populate from user profile
  useEffect(() => {
    if (profile) {
      setName(profile.name || user?.displayName || "");
      setPhoneNumber(profile.phoneNumber || user?.phoneNumber || "");
      if (profile.deliveryAddress) {
        setAddress({
          addressLine1: profile.deliveryAddress.addressLine1 || "",
          addressLine2: profile.deliveryAddress.addressLine2 || "",
          city: profile.deliveryAddress.city || "",
          state: profile.deliveryAddress.state || "",
          postalCode: profile.deliveryAddress.postalCode || ""
        });
      }
    } else if (user) {
      setName(user.displayName || "");
      setPhoneNumber(user.phoneNumber || "");
    }
  }, [profile, user]);

  if (!storeGroup) return null;

  const handleGoogleSignIn = async () => {
    try {
      setAuthLoading(true);
      setErrorMsg(null);
      setIsPopupBlocked(false);
      await signInWithGoogle();
    } catch (err: any) {
      const code = err?.code || "";
      const msg = err?.message || "";
      if (code === "auth/popup-blocked" || msg.includes("popup-blocked")) {
        setIsPopupBlocked(true);
        setErrorMsg("Browser blocked popup. Click the popup icon in your address bar or use redirect below.");
      } else if (code === "auth/configuration-not-found" || msg.includes("configuration-not-found")) {
        setErrorMsg("Google Sign-In is not enabled yet in Firebase Console > Authentication > Sign-in method.");
      } else {
        setErrorMsg(msg || "Failed to sign in with Google.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRedirectSignIn = async () => {
    try {
      setAuthLoading(true);
      await signInWithGoogleRedirect();
    } catch (err: any) {
      setErrorMsg(err?.message || "Failed to start redirect sign-in.");
      setAuthLoading(false);
    }
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg("Please provide your delivery contact phone number.");
      return;
    }
    if (!address.addressLine1.trim() || !address.city.trim() || !address.postalCode.trim()) {
      setErrorMsg("Please provide your complete delivery address.");
      return;
    }
    setErrorMsg(null);
    setStep("confirm");
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setErrorMsg("Sign-in is required before placing an order.");
      return;
    }

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMsg(null);

      // Save/persist customer delivery details in their user profile for future checkouts
      try {
        await saveProfile({
          name,
          phoneNumber,
          deliveryAddress: address,
          profileCompleted: true
        });
      } catch (profileErr) {
        console.warn("Could not sync profile:", profileErr);
      }

      // Create Order in Firestore
      const newOrder = await createOrder({
        userId: user.uid,
        storeId: storeGroup.storeId,
        storeName: storeGroup.storeName,
        items: storeGroup.items,
        customerDetails: {
          name,
          phoneNumber,
          deliveryAddress: address
        }
      });

      // Clear only this store's cart items
      clearStoreCart(storeGroup.storeId);
      showToast(`Order #${newOrder.orderNumber} placed successfully! 🍩`, "success");

      // Navigate to order confirmation
      onClose();
      navigate(`/order-confirmation/${newOrder.id || newOrder.orderNumber}`, {
        state: { order: newOrder }
      });
    } catch (err: any) {
      console.error("Order placement failed:", err);
      setErrorMsg(err?.message || "Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title">
            <Store size={20} color="#F28C00" />
            <span>Checkout: {storeGroup.storeName}</span>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close checkout"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Sign In Required Notice */}
          {!user ? (
            <div style={{ textAlign: "center", padding: "1.5rem 0" }}>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: "var(--clr-primary-lt)",
                  borderRadius: "50%",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  color: "var(--clr-primary-dk)"
                }}
              >
                <LogIn size={28} />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 900, color: "var(--clr-brown)", marginBottom: "0.5rem" }}>
                Sign In to Complete Order
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--txt-secondary)", marginBottom: "1.5rem" }}>
                To save your delivery address, track orders, and place checkout from <strong>{storeGroup.storeName}</strong>, please sign in with Google.
              </p>

              {isPopupBlocked ? (
                <div
                  className="notice-box"
                  style={{
                    background: "#FFF4E5",
                    borderColor: "var(--clr-primary)",
                    color: "var(--clr-brown)",
                    textAlign: "left",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginBottom: "1.25rem"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: 800, color: "var(--clr-accent)" }}>
                    <AlertCircle size={18} />
                    <span>Popup Blocked by Browser</span>
                  </div>
                  <p style={{ fontSize: "0.8rem", lineHeight: 1.4 }}>
                    Click the pop-up icon in your Chrome address bar to allow popups, or sign in directly via page redirect below:
                  </p>
                  <button
                    type="button"
                    className="btn-accent"
                    onClick={handleRedirectSignIn}
                    disabled={authLoading}
                    style={{ width: "100%", padding: "0.7rem", fontSize: "0.85rem" }}
                  >
                    {authLoading ? "Redirecting..." : "Sign In via Page Redirect"}
                  </button>
                </div>
              ) : errorMsg ? (
                <div className="notice-box" style={{ background: "var(--clr-error-lt)", color: "var(--clr-error)", borderColor: "var(--clr-error)" }}>
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              ) : null}

              <button
                type="button"
                className="btn-primary"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                style={{ width: "100%", padding: "0.85rem", marginBottom: "0.5rem" }}
              >
                {authLoading ? "Connecting..." : "Continue with Google"}
              </button>

              {!isPopupBlocked && (
                <button
                  type="button"
                  onClick={handleRedirectSignIn}
                  disabled={authLoading}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--clr-accent)",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    textDecoration: "underline",
                    padding: "0.3rem"
                  }}
                >
                  Can't open popups? Sign in via page redirect
                </button>
              )}
            </div>
          ) : step === "edit" ? (
            /* Step 1: Customer Details Form */
            <form onSubmit={handleProceedToReview}>
              {/* Demo Notice */}
              <div className="notice-box">
                <ShieldAlert size={20} color="#F28C00" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <strong>Demo Mode / Payment Pending:</strong> You will not be charged real money. Orders are placed with status <em>Pending Payment</em>.
                </div>
              </div>

              {/* Phone ownership disclaimer */}
              <div
                style={{
                  fontSize: "0.775rem",
                  color: "var(--txt-muted)",
                  background: "#FFFDF9",
                  padding: "0.5rem 0.75rem",
                  borderRadius: "var(--radius-sm)",
                  border: "1px solid var(--border-base)",
                  marginBottom: "1.25rem"
                }}
              >
                ℹ️ <em>Entering a phone number is for delivery contact only and does not verify ownership of that number.</em>
              </div>

              {errorMsg && (
                <div className="notice-box" style={{ background: "var(--clr-error-lt)", color: "var(--clr-error)", borderColor: "var(--clr-error)" }}>
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  <span>Full Name</span>
                  <span className="label-required">Required</span>
                </label>
                <input
                  type="text"
                  className="game-input required-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Contact Phone Number</span>
                  <span className="label-required">Required</span>
                </label>
                <input
                  type="tel"
                  className="game-input required-field"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
                <span className="form-hint">Used by the delivery agent to reach you.</span>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Address Line 1</span>
                  <span className="label-required">Required</span>
                </label>
                <input
                  type="text"
                  className="game-input required-field"
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>Address Line 2</span>
                  <span className="label-optional">Optional</span>
                </label>
                <input
                  type="text"
                  className="game-input"
                  value={address.addressLine2 || ""}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">
                    <span>City</span>
                    <span className="label-required">Required</span>
                  </label>
                  <input
                    type="text"
                    className="game-input required-field"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">
                    <span>Postal / PIN Code</span>
                    <span className="label-required">Required</span>
                  </label>
                  <input
                    type="text"
                    className="game-input required-field"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <span>State</span>
                  <span className="label-optional">Optional</span>
                </label>
                <input
                  type="text"
                  className="game-input"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                />
              </div>

              {/* Order quick summary */}
              <div className="checkout-order-summary">
                <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--clr-brown)", marginBottom: "0.5rem" }}>
                  Store Order Subtotal ({storeGroup.items.length} items): ₹{storeGroup.subtotal}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", color: "var(--txt-secondary)" }}>
                  <span>Ground Shipping:</span>
                  <span>{storeGroup.shippingCharge === 0 ? "FREE" : `₹${storeGroup.shippingCharge}`}</span>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%", padding: "0.85rem", marginTop: "0.5rem" }}
              >
                <span>Review & Confirm Details</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* Step 2: Confirm Your Details Screen */
            <div>
              <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
                <div
                  style={{
                    width: "48px",
                    height: "48px",
                    background: "var(--clr-success-lt)",
                    borderRadius: "50%",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "0.5rem",
                    color: "var(--clr-success)"
                  }}
                >
                  <CheckCircle2 size={24} />
                </div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--clr-brown)" }}>
                  Confirm Your Details
                </h3>
                <p style={{ fontSize: "0.825rem", color: "var(--txt-muted)" }}>
                  Please recheck your order items and delivery destination before submitting.
                </p>
              </div>

              {errorMsg && (
                <div className="notice-box" style={{ background: "var(--clr-error-lt)", color: "var(--clr-error)", borderColor: "var(--clr-error)" }}>
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Delivery Details Review Box */}
              <div
                style={{
                  background: "var(--bg-app)",
                  borderRadius: "var(--radius-md)",
                  padding: "1rem",
                  border: "1.5px solid var(--border-base)",
                  marginBottom: "1rem",
                  fontSize: "0.85rem"
                }}
              >
                <div style={{ fontWeight: 800, color: "var(--clr-brown)", marginBottom: "0.3rem" }}>
                  Delivery Recipient:
                </div>
                <div style={{ fontWeight: 700, color: "var(--txt-primary)" }}>{name}</div>
                <div style={{ color: "var(--txt-secondary)" }}>Phone: {phoneNumber}</div>
                <div style={{ color: "var(--txt-secondary)", marginTop: "0.4rem" }}>
                  {address.addressLine1}
                  {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                  <br />
                  {address.city}, {address.state} — {address.postalCode}
                </div>
              </div>

              {/* Store Items List */}
              <div
                style={{
                  background: "#FFFFFF",
                  borderRadius: "var(--radius-md)",
                  padding: "0.85rem",
                  border: "1.5px solid var(--border-base)",
                  marginBottom: "1.25rem"
                }}
              >
                <div style={{ fontWeight: 800, fontSize: "0.85rem", color: "var(--clr-brown)", marginBottom: "0.5rem" }}>
                  Purchasing from: {storeGroup.storeName}
                </div>
                <div style={{ maxHeight: "150px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  {storeGroup.items.map((item) => (
                    <div
                      key={item.productId}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: "0.825rem",
                        padding: "0.25rem 0",
                        borderBottom: "1px dashed var(--border-base)"
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>
                        {item.name} × {item.quantity}
                      </span>
                      <span style={{ fontWeight: 800, color: "var(--clr-brown)" }}>
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "0.75rem", paddingTop: "0.5rem", borderTop: "1.5px solid var(--border-base)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.825rem", color: "var(--txt-secondary)" }}>
                    <span>Items Subtotal:</span>
                    <span>₹{storeGroup.subtotal}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.825rem", color: "var(--txt-secondary)", marginTop: "0.2rem" }}>
                    <span>Ground Shipping:</span>
                    <span>{storeGroup.shippingCharge === 0 ? "FREE" : `₹${storeGroup.shippingCharge}`}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: 900,
                      fontSize: "1.1rem",
                      color: "var(--clr-brown)",
                      marginTop: "0.4rem",
                      paddingTop: "0.4rem",
                      borderTop: "1px solid var(--border-base)"
                    }}
                  >
                    <span>Total:</span>
                    <span style={{ color: "var(--clr-primary-dk)" }}>₹{storeGroup.total}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  className="btn-surface"
                  style={{ flex: 1, padding: "0.75rem" }}
                  onClick={() => setStep("edit")}
                  disabled={isSubmitting}
                >
                  Edit Details
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ flex: 2, padding: "0.75rem" }}
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : `Place Order (₹${storeGroup.total})`}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
