import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getFriendlyErrorMessage } from "../utils/errorUtils";
import { LoginIllustration } from "../components/illustrations";

export const SignInPage: React.FC = () => {
  const { user, profile, signInWithGoogle, signInWithGoogleRedirect, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPopupBlocked, setIsPopupBlocked] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || "/";

  // If user is already signed in, guide them appropriately
  useEffect(() => {
    if (!loading && user) {
      if (!profile?.profileCompleted) {
        navigate("/profile", { state: { isFirstLogin: true, returnTo: from } });
      } else {
        navigate(from, { replace: true });
      }
    }
  }, [user, profile, loading, navigate, from]);

  const handleGoogleSignIn = async () => {
    try {
      setSigningIn(true);
      setErrorMessage(null);
      setIsPopupBlocked(false);
      await signInWithGoogle();
    } catch (err: any) {
      console.error("Sign-in failure:", err);
      const code = err?.code || "";
      const msg = err?.message || "";
      if (code === "auth/popup-blocked" || msg.includes("popup-blocked")) {
        setIsPopupBlocked(true);
        setErrorMessage("Popup blocked by browser. You can allow popups in your address bar or sign in via page redirect.");
      } else {
        setErrorMessage(getFriendlyErrorMessage(err));
      }
      setSigningIn(false);
    }
  };

  const handleRedirectSignIn = async () => {
    try {
      setRedirecting(true);
      setErrorMessage(null);
      await signInWithGoogleRedirect();
    } catch (err: any) {
      console.error("Redirect sign-in failure:", err);
      setErrorMessage(getFriendlyErrorMessage(err));
      setRedirecting(false);
    }
  };

  // Prevent any document/body scrolling while on the sign-in page (just like home page)
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
          overflowY: "auto",
          padding: "clamp(1.25rem, 3.5vh, 2.25rem) clamp(1.25rem, 4vw, 2rem)",
          textAlign: "center",
          background: "#FFFFFF",
          margin: "auto",
          boxSizing: "border-box",
        }}
      >
        {/* Official Brand Logo */}
        <img
          src="/logo.png"
          alt="DumDum Delivery - Many Things. One Beat."
          style={{
            height: "clamp(42px, 6vh, 60px)",
            width: "auto",
            objectFit: "contain",
            margin: "0 auto clamp(0.5rem, 1.5vh, 1rem)",
            display: "block",
          }}
        />

        {/* unDraw Authentication Illustration */}
        <div
          className="empty-illustration"
          style={{
            margin: "0 auto clamp(0.5rem, 1.5vh, 1rem)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "clamp(90px, 15vh, 130px)",
          }}
        >
          <div style={{ transform: "scale(clamp(0.75, 0.9, 1))", transformOrigin: "center center" }}>
            <LoginIllustration width={170} height={120} />
          </div>
        </div>

        <h1
          style={{
            fontSize: "clamp(1.35rem, 3vh, 1.7rem)",
            fontWeight: 900,
            color: "var(--clr-brown)",
            marginBottom: "0.35rem",
          }}
        >
          Welcome to DumDum
        </h1>
        <p
          style={{
            fontSize: "clamp(0.85rem, 1.8vh, 0.95rem)",
            color: "var(--txt-secondary)",
            marginBottom: "clamp(1rem, 2.5vh, 1.5rem)",
            lineHeight: 1.4,
          }}
        >
          Sign in with Google to complete your delivery orders, manage track your orders.
        </p>

        {/* Helpful Popup Blocked Guidance Box */}
        {isPopupBlocked ? (
          <div
            className="notice-box"
            style={{
              background: "#FFF4E5",
              borderColor: "var(--clr-primary)",
              color: "var(--clr-brown)",
              textAlign: "left",
              flexDirection: "column",
              gap: "0.6rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                fontWeight: 800,
                fontSize: "0.9rem",
                color: "var(--clr-accent)",
              }}
            >
              <AlertCircle size={18} />
              <span>Browser Blocked the Google Sign-In Popup</span>
            </div>
            <p style={{ fontSize: "0.8rem", lineHeight: 1.4 }}>
              Your browser blocked the popup window. Choose an option to proceed:
            </p>
            <div
              style={{
                background: "#FFFFFF",
                padding: "0.6rem",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--border-base)",
                fontSize: "0.75rem",
                lineHeight: 1.4,
              }}
            >
              <strong>Option 1 (Recommended):</strong> Look at the right side of your address bar, click the <strong>Pop-up blocked icon (🚫)</strong>, choose <em>"Always allow pop-ups"</em>, and click Done.
            </div>
            <div style={{ fontSize: "0.8rem", fontWeight: 700, margin: "0.2rem 0" }}>
              OR click below to sign in without popups:
            </div>
            <button
              type="button"
              className="btn-accent"
              onClick={handleRedirectSignIn}
              disabled={redirecting}
              style={{ width: "100%", padding: "0.65rem", fontSize: "0.85rem" }}
            >
              {redirecting ? "Redirecting to Google..." : "Sign In via Page Redirect (No Popup Required)"}
            </button>
          </div>
        ) : errorMessage ? (
          <div
            className="notice-box"
            style={{
              background: "var(--clr-error-lt)",
              color: "var(--clr-error)",
              borderColor: "var(--clr-error)",
              textAlign: "left",
              marginBottom: "1rem",
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: "0.85rem" }}>{errorMessage}</span>
          </div>
        ) : null}

        {/* Primary Google Sign-in Button */}
        <button
          type="button"
          className="btn-primary"
          onClick={handleGoogleSignIn}
          disabled={signingIn || redirecting || loading}
          style={{
            width: "100%",
            padding: "clamp(0.75rem, 1.8vh, 0.9rem)",
            fontSize: "clamp(0.9rem, 2vh, 1rem)",
            marginBottom: "0.25rem",
          }}
        >
          {signingIn ? (
            <span>Connecting to Google...</span>
          ) : (
            <>
              {/* Google SVG Icon */}
              <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
