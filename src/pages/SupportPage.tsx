import React, { useState } from "react";
import {
  Headset,
  Store,
  Truck,
  HelpCircle,
  Mail,
  Phone,
  Copy,
  Check
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";

export const SupportPage: React.FC = () => {
  const { t } = useSettings();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => {
      setCopiedKey(null);
    }, 2000);
  };

  return (
    <div
      style={{
        minHeight: "100%",
        flex: 1,
        background: "var(--bg-app)",
        paddingTop: "0.5rem",
        paddingBottom: "calc(80px + env(safe-area-inset-bottom, 0px))",
        paddingLeft: "1rem",
        paddingRight: "1rem",
        boxSizing: "border-box",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "520px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
        }}
      >
        {/* Page Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            padding: "0.25rem 0",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #FFB347 0%, #F28C00 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              boxShadow: "0 6px 18px rgba(242, 140, 0, 0.35)",
              flexShrink: 0,
            }}
          >
            <Headset size={24} strokeWidth={2.4} />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 900,
                color: "var(--txt-primary)",
                letterSpacing: "-0.02em",
                fontFamily: "var(--font-game)",
              }}
            >
              {t("navSupport")} & Help Desk
            </h1>
            <p
              style={{
                margin: "2px 0 0 0",
                fontSize: "13px",
                color: "var(--txt-muted)",
                fontWeight: 600,
              }}
            >
              We're here to help you with stores, orders, and inquiries
            </p>
          </div>
        </div>

        {/* ── 1. New Store Registration Card ── */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--border-base)",
            borderRadius: "20px",
            padding: "1.25rem",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "14px",
                background: "rgba(242, 140, 0, 0.14)",
                color: "var(--clr-primary)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Store size={22} strokeWidth={2.4} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "var(--txt-primary)",
                }}
              >
                New Store Registration
              </h2>
              <p
                style={{
                  margin: "2px 0 0 0",
                  fontSize: "12px",
                  color: "var(--txt-muted)",
                  fontWeight: 600,
                }}
              >
                Partner with DumDum Delivery & list your shop
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.6rem",
              background: "var(--bg-app)",
              padding: "0.85rem",
              borderRadius: "14px",
              border: "1px solid var(--border-base)",
            }}
          >
            {/* Email Contact */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
              }}
            >
              <a
                href="mailto:addshop@dumdumddelivery.com"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--txt-primary)",
                  textDecoration: "none",
                  wordBreak: "break-all",
                }}
              >
                <Mail size={16} color="var(--clr-primary)" style={{ flexShrink: 0 }} />
                <span>addshop@dumdumddelivery.com</span>
              </a>

              <button
                type="button"
                onClick={() => handleCopy("addshop@dumdumddelivery.com", "store-email")}
                style={{
                  background: copiedKey === "store-email" ? "rgba(26, 110, 66, 0.15)" : "rgba(242, 140, 0, 0.12)",
                  border: "none",
                  cursor: "pointer",
                  color: copiedKey === "store-email" ? "var(--clr-success)" : "#B8420B",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "38px",
                  height: "38px",
                  minWidth: "38px",
                  minHeight: "38px",
                  borderRadius: "10px",
                  flexShrink: 0,
                  transition: "all 0.2s ease",
                }}
                aria-label="Copy Email"
                title={copiedKey === "store-email" ? "Copied!" : "Copy Email"}
              >
                {copiedKey === "store-email" ? <Check size={18} strokeWidth={2.6} /> : <Copy size={18} strokeWidth={2.4} />}
              </button>
            </div>

            {/* Phone Contact */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "0.5rem",
                paddingTop: "0.5rem",
                borderTop: "1px dashed var(--border-base)",
              }}
            >
              <a
                href="tel:9360733323"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "14px",
                  fontWeight: 800,
                  color: "var(--clr-primary)",
                  textDecoration: "none",
                }}
              >
                <Phone size={18} color="var(--clr-primary)" style={{ flexShrink: 0 }} />
                <span>9360733323</span>
              </a>

              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => handleCopy("9360733323", "store-phone")}
                  style={{
                    background: copiedKey === "store-phone" ? "rgba(26, 110, 66, 0.15)" : "rgba(242, 140, 0, 0.12)",
                    border: "none",
                    cursor: "pointer",
                    color: copiedKey === "store-phone" ? "var(--clr-success)" : "#B8420B",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "38px",
                    height: "38px",
                    minWidth: "38px",
                    minHeight: "38px",
                    borderRadius: "10px",
                    flexShrink: 0,
                    transition: "all 0.2s ease",
                  }}
                  aria-label="Copy Phone Number"
                  title={copiedKey === "store-phone" ? "Copied!" : "Copy Phone Number"}
                >
                  {copiedKey === "store-phone" ? <Check size={18} strokeWidth={2.6} /> : <Copy size={18} strokeWidth={2.4} />}
                </button>

                <a
                  href="tel:9360733323"
                  style={{
                    background: "var(--grad-primary)",
                    color: "var(--txt-on-orange)",
                    width: "38px",
                    height: "38px",
                    minWidth: "38px",
                    minHeight: "38px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 2px 8px rgba(242, 140, 0, 0.3)",
                  }}
                  aria-label="Call Now"
                  title="Call Now"
                >
                  <Phone size={15} strokeWidth={2.4} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. Track Your Order Card ── */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--border-base)",
            borderRadius: "20px",
            padding: "1.25rem",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "14px",
                background: "rgba(26, 110, 66, 0.12)",
                color: "var(--clr-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Truck size={22} strokeWidth={2.4} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "var(--txt-primary)",
                }}
              >
                Track Your Order
              </h2>
              <p
                style={{
                  margin: "2px 0 0 0",
                  fontSize: "12px",
                  color: "var(--txt-muted)",
                  fontWeight: 600,
                }}
              >
                Delivery status, delays, and real-time order inquiries
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-app)",
              padding: "0.85rem",
              borderRadius: "14px",
              border: "1px solid var(--border-base)",
              gap: "0.5rem",
            }}
          >
            <a
              href="mailto:ordertracker@dumdumdelivery.com"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--txt-primary)",
                textDecoration: "none",
                wordBreak: "break-all",
              }}
            >
              <Mail size={16} color="var(--clr-success)" style={{ flexShrink: 0 }} />
              <span>ordertracker@dumdumdelivery.com</span>
            </a>

            <button
              type="button"
              onClick={() => handleCopy("ordertracker@dumdumdelivery.com", "track-email")}
              style={{
                background: copiedKey === "track-email" ? "rgba(26, 110, 66, 0.12)" : "transparent",
                border: "none",
                cursor: "pointer",
                color: copiedKey === "track-email" ? "var(--clr-success)" : "var(--txt-muted)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
              aria-label="Copy Email"
              title={copiedKey === "track-email" ? "Copied!" : "Copy Email"}
            >
              {copiedKey === "track-email" ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </section>

        {/* ── 3. Common Support Card ── */}
        <section
          style={{
            background: "var(--bg-card)",
            border: "1.5px solid var(--border-base)",
            borderRadius: "20px",
            padding: "1.25rem",
            boxShadow: "var(--shadow-sm)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "14px",
                background: "rgba(184, 66, 11, 0.12)",
                color: "var(--clr-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <HelpCircle size={22} strokeWidth={2.4} />
            </div>
            <div>
              <h2
                style={{
                  margin: 0,
                  fontSize: "16px",
                  fontWeight: 900,
                  color: "var(--txt-primary)",
                }}
              >
                Common Support
              </h2>
              <p
                style={{
                  margin: "2px 0 0 0",
                  fontSize: "12px",
                  color: "var(--txt-muted)",
                  fontWeight: 600,
                }}
              >
                General questions, app assistance, and feedback
              </p>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "var(--bg-app)",
              padding: "0.85rem",
              borderRadius: "14px",
              border: "1px solid var(--border-base)",
              gap: "0.5rem",
            }}
          >
            <a
              href="mailto:support@dumdumdelivery.com"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontSize: "13px",
                fontWeight: 700,
                color: "var(--txt-primary)",
                textDecoration: "none",
                wordBreak: "break-all",
              }}
            >
              <Mail size={16} color="var(--clr-accent)" style={{ flexShrink: 0 }} />
              <span>support@dumdumdelivery.com</span>
            </a>

            <button
              type="button"
              onClick={() => handleCopy("support@dumdumdelivery.com", "common-email")}
              style={{
                background: copiedKey === "common-email" ? "rgba(26, 110, 66, 0.12)" : "transparent",
                border: "none",
                cursor: "pointer",
                color: copiedKey === "common-email" ? "var(--clr-success)" : "var(--txt-muted)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "32px",
                height: "32px",
                borderRadius: "8px",
                flexShrink: 0,
                transition: "all 0.2s ease",
              }}
              aria-label="Copy Email"
              title={copiedKey === "common-email" ? "Copied!" : "Copy Email"}
            >
              {copiedKey === "common-email" ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
        </section>

        {/* Brand Promise Footer Note */}
        <div
          style={{
            textAlign: "center",
            padding: "1rem",
            color: "var(--txt-muted)",
            fontSize: "12px",
            fontWeight: 700,
          }}
        >
        </div>
      </div>
    </div>
  );
};
