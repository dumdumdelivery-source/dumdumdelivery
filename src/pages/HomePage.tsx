import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Prevent any document/body scrolling while on the landing page
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
      }}
    >
      {/* Centered DumDum Delivery Logo Landing Viewport */}
      <section
        className="landing-viewport"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          padding: "1rem",
          boxSizing: "border-box",
          overflow: "hidden",
          margin: 0,
        }}
      >
        <div className="landing-content" style={{ margin: "auto" }}>
          <div
            id="landing-logo-btn"
            className="landing-logo-wrapper"
            onClick={() => navigate("/stores")}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                navigate("/stores");
              }
            }}
            aria-label="View stores"
          >
            <img
              src="/logo.png"
              alt="DumDum Delivery - Many Things. One Beat."
              className="landing-central-logo"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

