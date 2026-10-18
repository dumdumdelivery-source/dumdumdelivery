import React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useCart } from "../context/CartContext";

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`toast-item ${toast.type}`}
          role="status"
        >
          {toast.type === "success" && <CheckCircle2 size={18} color="#FFF7E8" />}
          {toast.type === "error" && <AlertCircle size={18} color="#FFFFFF" />}
          {toast.type === "info" && <Info size={18} color="#F28C00" />}
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: "transparent",
              border: "none",
              color: "inherit",
              opacity: 0.8,
              cursor: "pointer",
              marginLeft: "4px",
              display: "flex"
            }}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
