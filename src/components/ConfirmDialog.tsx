import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, Info, X } from "lucide-react";

export type ConfirmType = "danger" | "warning" | "info";

export interface ConfirmDialogProps {
  isOpen: boolean;
  title?: string;
  message: string;
  subMessage?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  subMessage,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "danger",
  onConfirm,
  onCancel,
  loading = false,
}) => {
  // Handle ESC key press
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, loading]);

  if (!isOpen) return null;

  // Icon and tone styling based on type
  const isDanger = type === "danger";
  const isWarning = type === "warning";

  const defaultTitle = isDanger
    ? "Are you sure?"
    : isWarning
    ? "Please Confirm"
    : "Information";

  const dialogContent = (
    <div
      className="confirm-dialog-overlay"
      onClick={() => {
        if (!loading) onCancel();
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        className="confirm-dialog-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Icon Button */}
        <button
          type="button"
          className="confirm-dialog-close"
          onClick={onCancel}
          disabled={loading}
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        {/* Icon Badge */}
        <div
          className={`confirm-dialog-icon-wrap ${
            isDanger ? "is-danger" : isWarning ? "is-warning" : "is-info"
          }`}
        >
          {isDanger ? (
            <Trash2 size={28} strokeWidth={2.2} />
          ) : isWarning ? (
            <AlertTriangle size={28} strokeWidth={2.2} />
          ) : (
            <Info size={28} strokeWidth={2.2} />
          )}
        </div>

        {/* Title */}
        <h3 id="confirm-dialog-title" className="confirm-dialog-title">
          {title || defaultTitle}
        </h3>

        {/* Main Message */}
        <p className="confirm-dialog-message">{message}</p>

        {/* Sub / Note Message */}
        {subMessage && (
          <p className="confirm-dialog-submessage">{subMessage}</p>
        )}

        {/* Action Buttons */}
        <div className="confirm-dialog-actions">
          <button
            type="button"
            className="confirm-btn-cancel"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`confirm-btn-action ${
              isDanger ? "is-danger" : isWarning ? "is-warning" : "is-primary"
            }`}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? (
              <span className="confirm-loading-spinner" />
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(dialogContent, document.body)
    : dialogContent;
};

// ── Hook for Promise-based usage ──
export interface ConfirmOptions {
  title?: string;
  message: string;
  subMessage?: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmType;
}

export const useConfirmDialog = () => {
  const [state, setState] = React.useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const handleConfirm = useCallback(() => {
    if (state) {
      state.resolve(true);
      setState(null);
    }
  }, [state]);

  const handleCancel = useCallback(() => {
    if (state) {
      state.resolve(false);
      setState(null);
    }
  }, [state]);

  const ConfirmDialogRenderer: React.FC = () => {
    if (!state || !state.isOpen) return null;
    return (
      <ConfirmDialog
        isOpen={state.isOpen}
        title={state.options.title}
        message={state.options.message}
        subMessage={state.options.subMessage}
        confirmText={state.options.confirmText}
        cancelText={state.options.cancelText}
        type={state.options.type || "danger"}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );
  };

  return { confirm, ConfirmDialogRenderer };
};
