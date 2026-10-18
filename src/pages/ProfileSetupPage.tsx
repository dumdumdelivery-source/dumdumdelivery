import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldAlert
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { UserAvatar } from "../components/UserAvatar";
import type { DeliveryAddress } from "../types";

export const ProfileSetupPage: React.FC = () => {
  const { user, profile, saveProfile, loading } = useAuth();
  const { showToast } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isFirstLogin = (location.state as any)?.isFirstLogin || !profile?.profileCompleted;
  const returnTo = (location.state as any)?.returnTo || "/";

  // Step 1: "form", Step 2: "confirm_modal"
  const [step, setStep] = useState<"form" | "confirm">("form");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState<DeliveryAddress>({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: ""
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate("/signin", { state: { from: location } });
      return;
    }

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
  }, [user, profile, loading, navigate, location]);

  const handleValidateForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("Please enter your name.");
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMsg("Please enter a phone number for delivery contact.");
      return;
    }
    if (!address.addressLine1.trim() || !address.city.trim() || !address.postalCode.trim()) {
      setErrorMsg("Please fill in your complete address (Line 1, City, Postal Code).");
      return;
    }
    setErrorMsg(null);
    setStep("confirm");
  };

  const handleSaveConfirmed = async () => {
    try {
      setSaving(true);
      setErrorMsg(null);
      await saveProfile({
        name,
        phoneNumber,
        deliveryAddress: address,
        profileCompleted: true
      });
      showToast("Profile and delivery details saved to Firestore! 🎉", "success");
      setStep("form");
      if (isFirstLogin) {
        navigate(returnTo);
      }
    } catch (err: any) {
      console.error("Error saving profile:", err);
      setErrorMsg(err?.message || "Failed to save profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="app-container" style={{ padding: "4rem 1rem", textAlign: "center" }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="app-container animate-fade-in" style={{ padding: "2.5rem 1rem", maxWidth: "680px" }}>
      {/* Header Banner */}
      <div className="game-card" style={{ padding: "1.75rem", marginBottom: "1.75rem", background: "#FFFFFF" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
          <UserAvatar
            photoURL={profile?.photoURL || user.photoURL}
            name={name || user.displayName}
            size={72}
          />
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--clr-brown)" }}>
              {isFirstLogin ? "Complete Your Delivery Profile" : "My DumDum Profile"}
            </h1>
            <p style={{ fontSize: "0.875rem", color: "var(--txt-muted)", marginTop: "2px" }}>
              {user.email} · Connected via Google
            </p>
          </div>
        </div>
      </div>

      {step === "form" ? (
        <form onSubmit={handleValidateForm} className="game-card" style={{ padding: "2rem", background: "#FFFFFF" }}>
          {/* Disclaimer regarding phone number */}
          <div className="notice-box">
            <ShieldAlert size={20} color="#F28C00" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <strong>Delivery Contact Note:</strong> Entering a phone number does not verify ownership of that number. It is solely used for delivery coordination.
            </div>
          </div>

          {errorMsg && (
            <div className="notice-box" style={{ background: "var(--clr-error-lt)", color: "var(--clr-error)", borderColor: "var(--clr-error)" }}>
              <AlertCircle size={20} />
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
              <span>Delivery Contact Phone Number</span>
              <span className="label-required">Required</span>
            </label>
            <input
              type="tel"
              className="game-input required-field"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
            <span className="form-hint">Used by delivery riders to coordinate arrival.</span>
          </div>

          <div style={{ margin: "1.5rem 0 1rem", borderTop: "1.5px solid var(--border-base)", paddingTop: "1.25rem" }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--clr-brown)", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <MapPin size={18} color="#F28C00" />
              <span>Default Delivery Address</span>
            </h3>

            <div className="form-group">
              <label className="form-label">
                <span>Flat / House / Apartment</span>
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
                <span>Street / Area / Landmark</span>
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
          </div>

          <button
            type="submit"
            className="btn-primary"
            style={{ width: "100%", padding: "0.85rem", marginTop: "1rem" }}
          >
            <span>Review & Confirm Details</span>
            <ArrowRight size={16} />
          </button>
        </form>
      ) : (
        /* Confirmation step */
        <div className="game-card" style={{ padding: "2rem", background: "#FFFFFF" }}>
          <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                background: "var(--clr-primary-lt)",
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "0.75rem",
                color: "var(--clr-primary-dk)"
              }}
            >
              <CheckCircle2 size={30} />
            </div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--clr-brown)" }}>
              Confirm Your Details
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--txt-secondary)" }}>
              Please recheck your contact information and delivery address before saving.
            </p>
          </div>

          <div
            style={{
              background: "var(--bg-app)",
              borderRadius: "var(--radius-lg)",
              border: "1.5px solid var(--border-base)",
              padding: "1.25rem",
              marginBottom: "1.5rem"
            }}
          >
            <div style={{ marginBottom: "0.85rem" }}>
              <span style={{ fontSize: "0.775rem", fontWeight: 800, color: "var(--txt-muted)", textTransform: "uppercase" }}>Name</span>
              <div style={{ fontWeight: 800, color: "var(--clr-brown)", fontSize: "1rem" }}>{name}</div>
            </div>

            <div style={{ marginBottom: "0.85rem" }}>
              <span style={{ fontSize: "0.775rem", fontWeight: 800, color: "var(--txt-muted)", textTransform: "uppercase" }}>Phone Number</span>
              <div style={{ fontWeight: 700, color: "var(--txt-primary)" }}>{phoneNumber}</div>
            </div>

            <div>
              <span style={{ fontSize: "0.775rem", fontWeight: 800, color: "var(--txt-muted)", textTransform: "uppercase" }}>Delivery Address</span>
              <div style={{ fontWeight: 700, color: "var(--txt-primary)", lineHeight: 1.4 }}>
                {address.addressLine1}
                {address.addressLine2 ? `, ${address.addressLine2}` : ""}
                <br />
                {address.city}, {address.state} — {address.postalCode}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              type="button"
              className="btn-surface"
              style={{ flex: 1, padding: "0.85rem" }}
              onClick={() => setStep("form")}
              disabled={saving}
            >
              Recheck & Edit
            </button>
            <button
              type="button"
              className="btn-primary"
              style={{ flex: 2, padding: "0.85rem" }}
              onClick={handleSaveConfirmed}
              disabled={saving}
            >
              {saving ? "Saving..." : "Confirm & Save Profile"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
