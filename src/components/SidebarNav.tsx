import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Store,
  ShoppingBag,
  Package,
  Sparkles,
  Bot,
  X,
  User,
  Sliders,
  LogOut,
  LogIn,
  MapPin,
  Compass,
  Building2,
  Headphones
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

interface SidebarNavProps {
  onCloseMobile?: () => void;
  onOpenAiModal?: () => void;
}

/* ─── Tiny NavItem Helper matching EcomInventory ─────────────────────────────── */
const NavItem: React.FC<{
  id: string;
  label: string;
  icon: React.ElementType;
  active: boolean;
  onClick: () => void;
  sub?: boolean;
  badge?: number | string | React.ReactNode;
}> = ({ label, icon: Icon, active, onClick, sub, badge }) => (
  <button
    type="button"
    onClick={onClick}
    className={`w-full flex items-center justify-between font-extrabold transition-all text-left ${
      sub ? "px-3 py-2 text-[12px] rounded-xl" : "px-4 py-3 text-[13px] rounded-2xl"
    }`}
    style={
      active
        ? {
            background: "var(--grad-primary)",
            color: "var(--txt-on-orange)",
            boxShadow: "var(--shadow-btn)",
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: sub ? "12px" : "16px",
            padding: sub ? "0.5rem 0.75rem" : "0.75rem 1rem",
            fontSize: sub ? "12px" : "13px",
            fontWeight: 800,
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }
        : {
            color: "rgba(255,247,232,0.72)",
            background: "transparent",
            display: "flex",
            alignItems: "center",
            width: "100%",
            borderRadius: sub ? "12px" : "16px",
            padding: sub ? "0.5rem 0.75rem" : "0.75rem 1rem",
            fontSize: sub ? "12px" : "13px",
            fontWeight: 800,
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          }
    }
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        e.currentTarget.style.color = "#FFF7E8";
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "rgba(255,247,232,0.72)";
      }
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: sub ? "0.6rem" : "0.75rem", minWidth: 0 }}>
      <Icon
        className={`${sub ? "w-4 h-4" : "w-5 h-5"} shrink-0`}
        size={sub ? 16 : 19}
        style={{
          color: active
            ? "var(--txt-on-orange)"
            : sub
            ? "rgba(255,247,232,0.60)"
            : "rgba(255,247,232,0.72)",
          flexShrink: 0,
        }}
      />
      <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {label}
      </span>
    </div>

    {badge && (
      <div style={{ flexShrink: 0, marginLeft: "0.5rem" }}>
        {typeof badge === "number" || typeof badge === "string" ? (
          <span
            style={{
              background: active ? "var(--clr-brown)" : "var(--clr-primary)",
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 900,
              padding: "2px 7px",
              borderRadius: "9999px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          >
            {badge}
          </span>
        ) : (
          badge
        )}
      </div>
    )}
  </button>
);

/* ─── Tiny SectionLabel matching EcomInventory ─────────────────────────────── */
const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
  <span
    style={{
      padding: "0 0.875rem",
      fontSize: "9px",
      fontWeight: 900,
      textTransform: "uppercase",
      letterSpacing: "0.18em",
      color: "rgba(255,247,232,0.45)",
      display: "block",
      marginTop: "0.5rem",
      marginBottom: "0.35rem",
      userSelect: "none",
    }}
  >
    {label}
  </span>
);

export const SidebarNav: React.FC<SidebarNavProps> = ({
  onCloseMobile,
  onOpenAiModal,
}) => {
  const { user, profile, signOutUser } = useAuth();
  const { totalItemCount } = useCart();
  const { t } = useSettings();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSelectNav = (path: string) => {
    if (onCloseMobile) onCloseMobile();
    if (path === "/" || path === "/home") {
      if (location.pathname === "/" || location.pathname === "/home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    } else if (path.includes("#stores-section")) {
      navigate("/stores");
    } else {
      navigate(path);
    }
  };

  const handleSignOut = async () => {
    if (onCloseMobile) onCloseMobile();
    await signOutUser();
    navigate("/");
  };

  const isHomeActive = location.pathname === "/" || location.pathname === "/home";
  const isStoresActive = location.pathname === "/stores";
  const isCartActive = location.pathname === "/cart";
  const isProfileActive = location.pathname === "/profile";
  const isOrdersActive = location.pathname === "/orders";
  const isSuperAdmin = (user?.email || "").trim().toLowerCase() === "business.dumdum@gmail.com";

  return (
    <aside
      className="flex flex-col justify-between w-full md:w-[264px] md:min-w-[264px] h-full overflow-y-auto shrink-0 select-none"
      style={{
        background: "var(--grad-sidebar)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        fontFamily: "var(--font-game)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        userSelect: "none",
      }}
    >
      {/* ── Top Content Section ─────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1.25rem",
          padding: "1.5rem 1rem 1rem 1rem",
        }}
      >
        {/* Brand Logo Header Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 0.25rem 0.5rem 0.25rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
            }}
            onClick={() => handleSelectNav("/")}
          >
            {/* Official Logo Capsule */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#FFFFFF",
                borderRadius: "14px",
                padding: "6px 12px",
                boxShadow: "0 4px 14px rgba(0,0,0,0.25)",
                border: "1.5px solid rgba(255,255,255,0.3)",
              }}
            >
              <img
                src="/logo.png"
                alt="DumDum Delivery"
                style={{
                  height: "36px",
                  maxWidth: "155px",
                  objectFit: "contain",
                  display: "block",
                }}
              />
            </div>
          </div>

          {/* Close button for mobile/drawer */}
          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation"
              style={{
                padding: "0.5rem",
                borderRadius: "9999px",
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,247,232,0.60)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.16)";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,247,232,0.60)";
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Home Item */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <NavItem
            id="home"
            label="Home"
            icon={Home}
            active={isHomeActive && !isStoresActive}
            onClick={() => handleSelectNav("/")}
          />
        </div>

        {/* Store & Catalog Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <SectionLabel label={t("navStores")} />
          <div style={{ marginTop: "0.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <NavItem
              id="stores"
              label={t("navStores")}
              icon={Store}
              active={isStoresActive}
              onClick={() => handleSelectNav("/stores")}
            />
            <NavItem
              id="cart"
              label={t("myCart")}
              icon={ShoppingBag}
              active={isCartActive}
              onClick={() => handleSelectNav("/cart")}
              badge={totalItemCount > 0 ? totalItemCount : undefined}
            />
          </div>
        </div>

        {/* Super Admin Section - only shown if user is business.dumdum@gmail.com */}
        {isSuperAdmin && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <SectionLabel label={t("superAdmin")} />
            <div style={{ marginTop: "0.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
              <NavItem
                id="admin-locations"
                label={t("adminLocation")}
                icon={MapPin}
                active={location.pathname.startsWith("/admin/locations")}
                onClick={() => handleSelectNav("/admin/locations")}
              />
              <NavItem
                id="admin-areas"
                label={t("adminArea")}
                icon={Compass}
                active={location.pathname.startsWith("/admin/areas")}
                onClick={() => handleSelectNav("/admin/areas")}
              />
              <NavItem
                id="admin-shops"
                label={t("adminShop")}
                icon={Building2}
                active={location.pathname.startsWith("/admin/shops")}
                onClick={() => handleSelectNav("/admin/shops")}
              />
            </div>
          </div>
        )}

        {/* Account & Orders Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <SectionLabel label={t("accountOrders")} />
          <div style={{ marginTop: "0.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <NavItem
              id="profile"
              label={user ? (profile?.name ? profile.name.split(" ")[0] + "'s Profile" : t("deliveryProfile")) : t("deliveryProfile")}
              icon={User}
              active={isProfileActive}
              onClick={() => handleSelectNav(user ? "/profile" : "/signin")}
            />
            <NavItem
              id="orders"
              label={t("orderHistory")}
              icon={Package}
              active={isOrdersActive}
              onClick={() => handleSelectNav(user ? "/orders" : "/signin")}
            />
          </div>
        </div>

        {/* System & Session Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <SectionLabel label={t("system")} />
          <div style={{ marginTop: "0.25rem", display: "flex", flexDirection: "column", gap: "0.2rem" }}>
            <NavItem
              id="settings"
              label={t("preferencesSettings")}
              icon={Sliders}
              active={location.pathname === "/settings"}
              onClick={() => handleSelectNav("/settings")}
            />

            <NavItem
              id="support"
              label={t("navSupport")}
              icon={Headphones}
              active={location.pathname === "/support"}
              onClick={() => handleSelectNav("/support")}
            />

            {user ? (
              <button
                type="button"
                onClick={handleSignOut}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "16px",
                  fontSize: "13px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,247,232,0.60)",
                  background: "transparent",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(244,63,94,0.14)";
                  e.currentTarget.style.color = "#FB7185";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "rgba(255,247,232,0.60)";
                }}
              >
                <LogOut size={19} style={{ flexShrink: 0 }} />
                <span>Logout</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleSelectNav("/signin")}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "16px",
                  fontSize: "13px",
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                  border: "1px solid rgba(242,140,0,0.30)",
                  cursor: "pointer",
                  color: "#F28C00",
                  background: "rgba(242,140,0,0.12)",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--grad-primary)";
                  e.currentTarget.style.color = "var(--txt-on-orange)";
                  e.currentTarget.style.boxShadow = "var(--shadow-btn)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(242,140,0,0.12)";
                  e.currentTarget.style.color = "#F28C00";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <LogIn size={19} style={{ flexShrink: 0 }} />
                <span>Sign In with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── AI Promo Card matching EcomInventory exactly ─────────────────────────────── */}
      <div style={{ padding: "0 1rem 1.5rem 1rem", marginTop: "0.5rem" }}>
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.75rem",
            background: "linear-gradient(135deg, rgba(184,66,11,0.30) 0%, rgba(90,42,26,0.50) 100%)",
            borderRadius: "var(--radius-lg)",
            border: "1px solid rgba(242,140,0,0.30)",
          }}
        >
          {/* Glowing radial blob */}
          <div
            style={{
              position: "absolute",
              top: "-1.5rem",
              right: "-1.5rem",
              width: "5rem",
              height: "5rem",
              borderRadius: "9999px",
              filter: "blur(20px)",
              pointerEvents: "none",
              background: "rgba(242,140,0,0.25)",
            }}
          />

          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(242,140,0,0.20)",
              border: "1px solid rgba(242,140,0,0.35)",
            }}
          >
            <Bot size={20} color="#FFFFFF" />
          </div>

          <div>
            <h4
              style={{
                fontSize: "13px",
                fontWeight: 900,
                color: "#FFFFFF",
                lineHeight: 1.25,
                margin: 0,
              }}
            >
              Empowering Decisions<br />with AI Intelligence
            </h4>
            <p
              style={{
                fontSize: "10px",
                fontWeight: 600,
                color: "rgba(255,247,232,0.65)",
                marginTop: "3px",
                margin: 0,
              }}
            >
              Real-time insights & recommendations
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              if (onOpenAiModal) onOpenAiModal();
              if (onCloseMobile) onCloseMobile();
            }}
            style={{
              width: "100%",
              padding: "0.625rem",
              borderRadius: "9999px",
              fontSize: "12px",
              fontWeight: 900,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
              background: "var(--grad-primary)",
              color: "var(--txt-on-orange)",
              boxShadow: "var(--shadow-btn)",
              border: "none",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.filter = "brightness(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.filter = "none";
            }}
          >
            <Sparkles size={14} />
            <span>Unlock AI Magic</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
