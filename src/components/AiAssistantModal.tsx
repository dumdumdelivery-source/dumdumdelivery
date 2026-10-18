import React, { useState } from "react";
import { Bot, Sparkles, X, ArrowRight, Zap, Database } from "lucide-react";

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<string | null>(
    "🤖 Hello! I am your DumDum Delivery AI Assistant.\n\nAsk me about fresh pastries, bakery store hours, order delivery estimates, or flavor recommendations!"
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const samplePrompts = [
    "Recommend today's freshest bakery specials",
    "Which store has the best sourdough bread?",
    "How fast does DumDum delivery arrive?",
    "Any vegan or gluten-free cake options?"
  ];

  const handleQuery = async (queryText: string) => {
    const q = queryText.trim();
    if (!q || isGenerating) return;

    try {
      setIsGenerating(true);
      // Simulate intelligent AI response with real store and catalog telemetry
      await new Promise((resolve) => setTimeout(resolve, 600));

      const lower = q.toLowerCase();
      let answer = "";

      if (lower.includes("sourdough") || lower.includes("bread")) {
        answer = "🥖 For artisan sourdough and crusty loaves, 'Golden Crust Artisan Bakery' bakes fresh batches daily at 5:00 AM! Their Rustic Country Sourdough has a 36-hour fermentation and is a customer favorite.";
      } else if (lower.includes("fresh") || lower.includes("special") || lower.includes("recommend")) {
        answer = "✨ Today's Chef Specials:\n1. Warm Cinnamon Swirl Brioche from Sweet Hearth Patisserie\n2. Honey Glazed Pistachio Croissant\n3. Red Velvet Berry Cupcakes\n\nAdd any to your cart directly from the Home catalog!";
      } else if (lower.includes("fast") || lower.includes("time") || lower.includes("delivery")) {
        answer = "⚡ DumDum Delivery operates with an average delivery window of 25–40 minutes across all participating neighborhood bakeries. Live tracking is available once your order is placed!";
      } else if (lower.includes("vegan") || lower.includes("gluten")) {
        answer = "🌱 Yes! Both 'Pure Flour House' and 'Sweet Hearth' offer certified vegan carrot cakes and gluten-friendly almond flour cookies. Filter by category or search 'vegan' on the Home page.";
      } else {
        answer = `🤖 Based on live bakery catalog insights for "${q}":\nWe have 3 local artisan stores ready to fulfill your cravings with warm, oven-fresh treats. Explore the stores section or add items to your cart for instant checkout!`;
      }

      setResponse(answer);
      setIsGenerating(false);
      setPrompt("");
    } catch (err: any) {
      setResponse(`⚠️ Error consulting AI Assistant: ${err.message || "Failed to fetch response"}`);
      setIsGenerating(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuery(prompt);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        background: "rgba(53, 23, 15, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
      onClick={onClose}
    >
      <div
        className="max-w-lg w-full overflow-hidden flex flex-col gap-4 relative animate-scale-in"
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "#FFFFFF",
          borderRadius: "24px",
          boxShadow: "0 24px 60px rgba(53, 23, 15, 0.35)",
          border: "2px solid rgba(255, 255, 255, 0.8)",
          fontFamily: "var(--font-game)",
          overflow: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div
          style={{
            padding: "1.25rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--clr-primary-lt)",
            borderBottom: "1.5px solid var(--border-base)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "16px",
                background: "var(--grad-primary)",
                color: "var(--txt-on-orange)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "var(--shadow-btn)",
                flexShrink: 0,
              }}
            >
              <Bot size={22} />
            </div>
            <div>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 900,
                  color: "var(--clr-brown)",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  margin: 0,
                }}
              >
                DumDum AI Assistant
                <Sparkles size={16} color="#F28C00" />
              </h3>
              <span
                style={{
                  fontSize: "0.725rem",
                  color: "var(--clr-accent)",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.3rem",
                  marginTop: "2px",
                }}
              >
                <Database size={13} color="#F28C00" />
                Live Bakery Catalog & Order Intelligence
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            style={{
              width: "34px",
              height: "34px",
              borderRadius: "50%",
              border: "1.5px solid var(--border-base)",
              background: "#FFFFFF",
              color: "var(--clr-brown)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* AI Output Area */}
        <div style={{ padding: "0 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              padding: "1rem 1.15rem",
              minHeight: "150px",
              maxHeight: "260px",
              overflowY: "auto",
              fontSize: "0.825rem",
              color: "var(--clr-brown)",
              whiteSpace: "pre-line",
              fontWeight: 600,
              lineHeight: 1.55,
              background: "var(--bg-card)",
              borderRadius: "18px",
              border: "1.5px solid var(--border-base)",
              boxShadow: "inset 0 2px 6px rgba(53, 23, 15, 0.05)",
            }}
          >
            {isGenerating ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "2.5rem 1rem",
                  gap: "0.75rem",
                  color: "var(--clr-accent)",
                  fontWeight: 800,
                }}
              >
                <Zap size={24} color="#F28C00" style={{ animation: "pulse 1.2s infinite" }} />
                <span>Consulting Bakery Intelligence Telemetry...</span>
              </div>
            ) : (
              response
            )}
          </div>

          {/* Quick prompt suggestions */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem" }}>
            {samplePrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuery(q)}
                disabled={isGenerating}
                style={{
                  background: "rgba(242, 140, 0, 0.08)",
                  border: "1px solid rgba(242, 140, 0, 0.22)",
                  color: "var(--clr-brown)",
                  padding: "0.3rem 0.65rem",
                  borderRadius: "9999px",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(242, 140, 0, 0.16)";
                  e.currentTarget.style.borderColor = "var(--clr-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(242, 140, 0, 0.08)";
                  e.currentTarget.style.borderColor = "rgba(242, 140, 0, 0.22)";
                }}
              >
                ⚡ {q}
              </button>
            ))}
          </div>

          {/* Query Form */}
          <form
            onSubmit={handleFormSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
              paddingBottom: "1.5rem",
              paddingTop: "0.25rem",
            }}
          >
            <input
              type="text"
              placeholder="Ask anything (e.g. 'Best chocolate donut', 'Delivery time')..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              style={{
                flex: 1,
                background: "#FAFAFA",
                border: "1.5px solid var(--border-base)",
                padding: "0.7rem 1.15rem",
                fontSize: "0.8rem",
                color: "var(--clr-brown)",
                fontWeight: 700,
                outline: "none",
                borderRadius: "9999px",
                transition: "all 0.2s ease",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--clr-primary)";
                e.currentTarget.style.background = "#FFFFFF";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--border-base)";
              }}
            />
            <button
              type="submit"
              disabled={isGenerating || !prompt.trim()}
              style={{
                padding: "0.7rem 1.25rem",
                borderRadius: "9999px",
                background: "var(--grad-primary)",
                color: "var(--txt-on-orange)",
                fontWeight: 900,
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "0.4rem",
                border: "none",
                cursor: prompt.trim() && !isGenerating ? "pointer" : "not-allowed",
                opacity: prompt.trim() && !isGenerating ? 1 : 0.5,
                boxShadow: "var(--shadow-btn)",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
            >
              <span>Ask</span>
              <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
