import React from "react";
import { useSettings } from "../context/SettingsContext";
import { Sun, Moon, Globe, Check, Sliders } from "lucide-react";

export const SettingsPage: React.FC = () => {
  const { theme, language, setTheme, setLanguage, t } = useSettings();

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
          gap: "1rem",
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
            <Sliders size={24} strokeWidth={2.4} />
          </div>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "22px",
                fontWeight: 900,
                color: "var(--txt-primary)",
                lineHeight: 1.2,
                letterSpacing: "-0.01em",
              }}
            >
              {t("settingsTitle")}
            </h1>
            <p
              style={{
                margin: "4px 0 0 0",
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--txt-muted)",
              }}
            >
              {t("settingsSubtitle")}
            </p>
          </div>
        </div>

        {/* ── Theme Section ── */}
        <div
          className="game-card"
          style={{
            background: "var(--bg-card)",
            borderRadius: "24px",
            border: "1.5px solid var(--border-base)",
            padding: "1.25rem",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "rgba(242, 140, 0, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#F28C00",
              }}
            >
              {theme === "dark" ? <Moon size={18} /> : <Sun size={18} />}
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
                {t("themeSection")}
              </h2>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--txt-muted)",
                }}
              >
                {t("themeDescription")}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {/* Light Theme Card */}
            <div
              onClick={() => setTheme("light")}
              style={{
                padding: "1rem 0.85rem",
                borderRadius: "18px",
                background: theme === "light" ? "#FFF7E8" : "var(--bg-surface)",
                border: theme === "light" ? "2px solid #F28C00" : "1.5px solid var(--border-base)",
                boxShadow: theme === "light" ? "0 4px 14px rgba(242, 140, 0, 0.2)" : "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {theme === "light" && (
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#28A745",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "#FFF2D8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#D9730D",
                  border: "1.5px solid #FCECD9",
                }}
              >
                <Sun size={22} strokeWidth={2.4} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 900, color: "#35170F" }}>
                  {t("themeLight")}
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: "#8C6D62", marginTop: "2px" }}>
                  {t("themeLightDesc")}
                </div>
              </div>
            </div>

            {/* Dark Theme Card */}
            <div
              onClick={() => setTheme("dark")}
              style={{
                padding: "1rem 0.85rem",
                borderRadius: "18px",
                background: theme === "dark" ? "#2A140C" : "var(--bg-surface)",
                border: theme === "dark" ? "2px solid #F28C00" : "1.5px solid var(--border-base)",
                boxShadow: theme === "dark" ? "0 4px 14px rgba(0, 0, 0, 0.45)" : "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                gap: "0.5rem",
                transition: "all 0.2s ease",
                position: "relative",
              }}
            >
              {theme === "dark" && (
                <div
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "8px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: "#28A745",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                  }}
                >
                  <Check size={12} strokeWidth={3} />
                </div>
              )}
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "#1E0A05",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFB347",
                  border: "1.5px solid rgba(242, 140, 0, 0.3)",
                }}
              >
                <Moon size={22} strokeWidth={2.4} />
              </div>
              <div>
                <div style={{ fontSize: "14px", fontWeight: 900, color: theme === "dark" ? "#FFF7E8" : "var(--txt-primary)" }}>
                  {t("themeDark")}
                </div>
                <div style={{ fontSize: "11px", fontWeight: 600, color: theme === "dark" ? "#D4B2A7" : "var(--txt-muted)", marginTop: "2px" }}>
                  {t("themeDarkDesc")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Language Section ── */}
        <div
          className="game-card"
          style={{
            background: "var(--bg-card)",
            borderRadius: "24px",
            border: "1.5px solid var(--border-base)",
            padding: "1.25rem",
            boxShadow: "var(--shadow-md)",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            transition: "all 0.3s ease",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "10px",
                background: "rgba(184, 66, 11, 0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#B8420B",
              }}
            >
              <Globe size={18} />
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
                {t("languageSection")}
              </h2>
              <p
                style={{
                  margin: "2px 0 0",
                  fontSize: "12px",
                  fontWeight: 600,
                  color: "var(--txt-muted)",
                }}
              >
                {t("languageDescription")}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {/* English Option */}
            <div
              onClick={() => setLanguage("en")}
              style={{
                padding: "1rem 1.15rem",
                borderRadius: "18px",
                background: language === "en" ? (theme === "dark" ? "#2A140C" : "#FFF7E8") : "var(--bg-surface)",
                border: language === "en" ? "2px solid #F28C00" : "1.5px solid var(--border-base)",
                boxShadow: language === "en" ? "0 4px 14px rgba(242, 140, 0, 0.18)" : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: language === "en" ? "linear-gradient(135deg, #FFB347 0%, #F28C00 100%)" : "rgba(242, 140, 0, 0.12)",
                    color: language === "en" ? "#FFFFFF" : "#F28C00",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: 900,
                  }}
                >
                  EN
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 900, color: "var(--txt-primary)" }}>
                    {t("langEnglish")}
                  </div>
                  <div style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--txt-muted)", marginTop: "2px" }}>
                    {t("langEnglishDesc")}
                  </div>
                </div>
              </div>

              {language === "en" ? (
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#28A745",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                  }}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
              ) : (
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: "2px solid var(--border-base)",
                  }}
                />
              )}
            </div>

            {/* Tamil Option */}
            <div
              onClick={() => setLanguage("ta")}
              style={{
                padding: "1rem 1.15rem",
                borderRadius: "18px",
                background: language === "ta" ? (theme === "dark" ? "#2A140C" : "#FFF7E8") : "var(--bg-surface)",
                border: language === "ta" ? "2px solid #F28C00" : "1.5px solid var(--border-base)",
                boxShadow: language === "ta" ? "0 4px 14px rgba(242, 140, 0, 0.18)" : "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "12px",
                    background: language === "ta" ? "linear-gradient(135deg, #FFB347 0%, #F28C00 100%)" : "rgba(242, 140, 0, 0.12)",
                    color: language === "ta" ? "#FFFFFF" : "#F28C00",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "16px",
                    fontWeight: 900,
                  }}
                >
                  த
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 900, color: "var(--txt-primary)" }}>
                    {t("langTamil")}
                  </div>
                  <div style={{ fontSize: "11.5px", fontWeight: 600, color: "var(--txt-muted)", marginTop: "2px" }}>
                    {t("langTamilDesc")}
                  </div>
                </div>
              </div>

              {language === "ta" ? (
                <div
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    background: "#28A745",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#FFFFFF",
                  }}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
              ) : (
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    border: "2px solid var(--border-base)",
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
