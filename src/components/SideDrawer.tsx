import React, { useState, useEffect } from "react";
import { SidebarNav } from "./SidebarNav";
import { AiAssistantModal } from "./AiAssistantModal";

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({ isOpen, onClose }) => {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isAiModalOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isAiModalOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Dimmed backdrop blur overlay matching EcomInventory modal/drawer */}
      <div
        id="side-drawer-backdrop"
        className={`drawer-backdrop ${isOpen ? "open" : ""}`}
        onClick={onClose}
        aria-hidden="true"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 998,
          background: "rgba(53, 23, 15, 0.65)",
          backdropFilter: isOpen ? "blur(6px)" : "none",
          WebkitBackdropFilter: isOpen ? "blur(6px)" : "none",
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.3s ease",
        }}
      />

      {/* Side Menu Drawer matching D:\EcomInventory\src SidebarNav */}
      <aside
        id="side-drawer"
        className={`side-drawer ${isOpen ? "open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "284px",
          maxWidth: "min(320px, 92vw)",
          zIndex: 999,
          background: "var(--grad-sidebar)",
          boxShadow: isOpen ? "14px 0 44px rgba(0, 0, 0, 0.45)" : "none",
          visibility: isOpen ? "visible" : "hidden",
          pointerEvents: isOpen ? "auto" : "none",
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.32s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.32s ease, visibility 0.32s ease",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          fontFamily: "var(--font-game)",
          overflow: "hidden",
        }}
      >
        <SidebarNav
          onCloseMobile={onClose}
          onOpenAiModal={() => setIsAiModalOpen(true)}
        />
      </aside>

      {/* AI Assistant Modal from EcomInventory */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />
    </>
  );
};
