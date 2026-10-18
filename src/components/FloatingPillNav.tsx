import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Store, ShoppingCart, User, Settings } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useSettings } from "../context/SettingsContext";

interface FloatingPillNavProps {
  onOpenAiModal?: () => void;
}

export const FloatingPillNav: React.FC<FloatingPillNavProps> = ({ onOpenAiModal: _onOpenAiModal }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalItemCount } = useCart();
  const { t } = useSettings();

  const isHome = location.pathname === "/" || location.pathname === "/home";
  const isStores = location.pathname === "/stores";
  const isCart = location.pathname === "/cart";
  const isProfile =
    location.pathname === "/profile" ||
    location.pathname === "/orders" ||
    location.pathname === "/signin";
  const isSettings = location.pathname === "/settings";

  const handleNav = (path: string) => {
    if (path === "/" || path === "/home") {
      if (location.pathname === "/" || location.pathname === "/home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/");
      }
    } else {
      navigate(path);
    }
  };

  const navItems = [
    {
      id: "stores",
      label: t("navStores"),
      icon: Store,
      path: "/stores",
      active: isStores,
    },
    {
      id: "cart",
      label: t("navCart"),
      icon: ShoppingCart,
      path: "/cart",
      active: isCart,
      badge: totalItemCount > 0 ? totalItemCount : undefined,
    },
    {
      id: "home",
      label: t("navHome"),
      icon: Home,
      path: "/",
      active: isHome,
    },
    {
      id: "settings",
      label: t("navSettings"),
      icon: Settings,
      path: "/settings",
      active: isSettings,
    },
    {
      id: "profile",
      label: t("navProfile"),
      icon: User,
      path: "/profile",
      active: isProfile,
    },
  ];

  const activeIndex = navItems.findIndex((item) => item.active);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        width: "100%",
        pointerEvents: "none",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
      className="floating-pill-dock-container"
    >
      <nav
        aria-label="Bottom Navigation Bar"
        style={{
          pointerEvents: "auto",
          position: "relative",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: "100%",
          height: "calc(64px + env(safe-area-inset-bottom, 0px))",
          background: "var(--grad-sidebar)",
          borderRadius: "0",
          borderTop: "1.5px solid rgba(242, 140, 0, 0.28)",
          borderLeft: "none",
          borderRight: "none",
          borderBottom: "none",
          boxShadow: "0 -8px 26px rgba(53, 23, 15, 0.35), 0 -2px 10px rgba(242, 140, 0, 0.12)",
          padding: "0 0.5rem calc(6px + env(safe-area-inset-bottom, 0px))",
          boxSizing: "border-box",
        }}
      >
        {/* ── Elevated Floating Circular Active Indicator Token (Matches User Reference Image) ── */}
        {activeIndex !== -1 && (
          <div
            style={{
              position: "absolute",
              top: "-26px",
              left: "0.5rem",
              width: "calc((100% - 1rem) / 5)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              transform: `translateX(${activeIndex * 100}%)`,
              transition: "transform 0.4s cubic-bezier(0.2, 0.9, 0.25, 1.25)",
              zIndex: 3,
            }}
          >
            {/* Outer base bubble matching side nav dark chocolate */}
            <div
              style={{
                width: "58px",
                height: "58px",
                borderRadius: "50%",
                background: "#35170F",
                padding: "4px",
                boxShadow: "0 8px 24px rgba(53, 23, 15, 0.45), 0 2px 10px rgba(242, 140, 0, 0.25)",
                border: "2px solid rgba(242, 140, 0, 0.45)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxSizing: "border-box",
              }}
            >
              {/* Inner branded orange circle */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #FFB347 0%, #F28C00 55%, #D9730D 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  boxShadow: "inset 0 1px 2px rgba(255, 255, 255, 0.45), 0 3px 8px rgba(242, 140, 0, 0.4)",
                }}
              >
                {(() => {
                  const ActiveIcon = navItems[activeIndex].icon;
                  return (
                    <ActiveIcon
                      size={22}
                      strokeWidth={2.6}
                      style={{
                        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
                      }}
                    />
                  );
                })()}
              </div>
            </div>
          </div>
        )}

        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = item.active;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleNav(item.path)}
              title={item.label}
              className="game-nav-btn"
              style={{
                flex: "1 1 0",
                maxWidth: "20%",
                height: "54px",
                padding: "2px 0 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                position: "relative",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                zIndex: 4,
                userSelect: "none",
                outline: "none",
                WebkitTapHighlightColor: "transparent",
                boxSizing: "border-box",
              }}
            >
              {/* Inactive Icon Placeholder */}
              <div
                style={{
                  position: "relative",
                  width: "36px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: isActive ? "transparent" : "#D4B2A7",
                  opacity: isActive ? 0 : 1,
                  transition: "opacity 0.25s ease, color 0.25s ease",
                  marginBottom: "2px",
                }}
              >
                {!isActive && (
                  <IconComponent
                    size={20}
                    strokeWidth={2.0}
                    style={{
                      transition: "transform 0.25s ease",
                    }}
                  />
                )}

                {/* Badge on cart when inactive */}
                {!isActive && item.badge !== undefined && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-4px",
                      right: "-4px",
                      background: "linear-gradient(135deg, #FF453A 0%, #D70015 100%)",
                      color: "#FFFFFF",
                      fontSize: "9px",
                      fontWeight: 900,
                      minWidth: "16px",
                      height: "16px",
                      padding: "0 3px",
                      borderRadius: "9999px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "1.5px solid #220C06",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
                      zIndex: 5,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Menu Label */}
              <span
                style={{
                  fontSize: isActive ? "11px" : "10px",
                  fontWeight: isActive ? 900 : 700,
                  color: isActive ? "#FFB347" : "#BFA095",
                  lineHeight: 1.2,
                  letterSpacing: "0.015em",
                  whiteSpace: "nowrap",
                  textAlign: "center",
                  display: "block",
                  transition: "color 0.25s ease, transform 0.25s ease",
                  marginBottom: "4px",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};


