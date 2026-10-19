import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { User, LogOut, Package, Menu, AlertTriangle, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { UserAvatar } from "./UserAvatar";
import { SideDrawer } from "./SideDrawer";

export const Header: React.FC = () => {
  const { user, profile, signOutUser } = useAuth();
  const { t } = useSettings();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isSignInPage = location.pathname === "/signin";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (!user) {
      navigate("/signin");
    } else {
      setDropdownOpen((prev) => !prev);
    }
  };

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOutUser();
    navigate("/");
  };

  return (
    <>
      <header className="app-header">
        <div className="app-container header-inner">
          {/* Left section: Menu button + Brand Logo */}
          <div className="header-left">
            <button
              type="button"
              id="btn-header-menu"
              className="btn-menu-toggle"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open navigation menu"
              aria-expanded={drawerOpen}
            >
              <Menu size={24} strokeWidth={2.2} />
            </button>

            <Link to="/" className="brand-logo" aria-label="DumDum Delivery - Many Things. One Beat.">
              <img
                src="/logo.png"
                alt="DumDum Delivery"
                className="brand-logo-img"
              />
            </Link>
          </div>

          {/* Right side navigation & actions */}
          <div className="header-actions">
            {/* Settings Icon Button (before signin/profile) */}
            <button
              type="button"
              id="btn-header-settings"
              className="header-settings-btn"
              onClick={() => navigate("/settings")}
              aria-label={t("navSettings")}
              title={t("navSettings")}
            >
              <Settings size={23} strokeWidth={2.2} />
            </button>

            {/* User profile / Sign In action */}
            <div style={{ position: "relative" }} ref={dropdownRef}>
              {user ? (
                <button
                  type="button"
                  id="btn-header-profile"
                  className="user-profile-circle-btn"
                  onClick={handleProfileClick}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="true"
                  aria-label="User account menu"
                >
                  <UserAvatar
                    photoURL={profile?.photoURL || user.photoURL}
                    name={profile?.name || user.displayName}
                    size={38}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  id="btn-header-signin"
                  className="header-signin-btn"
                  onClick={handleProfileClick}
                  aria-label={t("signIn")}
                  title={t("signIn")}
                >
                  <User size={19} strokeWidth={2.4} />
                  {/* Warning badge is shown on the /signin page when not signed in */}
                  {isSignInPage && (
                    <span className="signin-warning-badge" aria-hidden="true">
                      <AlertTriangle size={10} fill="#FFCC00" color="#35170F" strokeWidth={2.6} />
                    </span>
                  )}
                </button>
              )}

              {/* Profile Dropdown Menu */}
              {user && dropdownOpen && (
                <div className="profile-dropdown" role="menu">
                  <div className="profile-dropdown-header">
                    <div className="profile-dropdown-name">
                      {profile?.name || user.displayName || "DumDum Member"}
                    </div>
                    <div className="profile-dropdown-email">
                      {user.email}
                    </div>
                  </div>

                  <Link
                    to="/profile"
                    role="menuitem"
                    className="profile-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} color="#F28C00" />
                    <span>{t("profileAddress")}</span>
                  </Link>

                  <Link
                    to="/orders"
                    role="menuitem"
                    className="profile-dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <Package size={16} color="#F28C00" />
                    <span>{t("orderHistory")}</span>
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    className="profile-dropdown-item danger"
                    onClick={handleSignOut}
                  >
                    <LogOut size={16} />
                    <span>{t("signOut")}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer so layout content starts below fixed header */}
      <div className="header-spacer" aria-hidden="true" />

      {/* Animated Side Drawer */}
      <SideDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

