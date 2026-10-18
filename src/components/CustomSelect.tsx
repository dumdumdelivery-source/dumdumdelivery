import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface CustomSelectOption {
  value: string;
  label: string;
  subLabel?: string;
  icon?: React.ReactNode;
}

export interface CustomSelectProps {
  id?: string;
  options: CustomSelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  id,
  options,
  value,
  onChange,
  placeholder = "-- Select --",
  disabled = false,
  required = false,
  icon,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div
      ref={containerRef}
      className={`custom-select-container ${className}`}
      style={{ position: "relative", width: "100%" }}
    >
      {/* Hidden input for native form validation if needed */}
      {required && (
        <input
          tabIndex={-1}
          autoComplete="off"
          style={{
            opacity: 0,
            position: "absolute",
            left: 0,
            bottom: 0,
            height: 0,
            width: 0,
            pointerEvents: "none",
          }}
          value={value}
          required={required}
          onChange={() => {}}
        />
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={id}
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={`custom-select-trigger ${isOpen ? "is-open" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {icon && <span className="custom-select-trigger-icon">{icon}</span>}
          {selectedOption ? (
            <span className="custom-select-value">
              {selectedOption.label}
              {selectedOption.subLabel && (
                <span className="custom-select-sublabel"> • {selectedOption.subLabel}</span>
              )}
            </span>
          ) : (
            <span className="custom-select-placeholder">{placeholder}</span>
          )}
        </div>
        <ChevronDown
          size={18}
          className={`custom-select-arrow ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="custom-select-menu" role="listbox">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`custom-select-option ${isSelected ? "is-selected" : ""}`}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: 1, overflow: "hidden" }}>
                  {opt.icon && <span style={{ flexShrink: 0 }}>{opt.icon}</span>}
                  <div style={{ display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    <span className="custom-select-opt-label">{opt.label}</span>
                    {opt.subLabel && <span className="custom-select-opt-sublabel">{opt.subLabel}</span>}
                  </div>
                </div>
                {isSelected && <Check size={16} className="custom-select-check" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
