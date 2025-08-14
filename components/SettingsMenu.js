"use client";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";

// Discrete mapping helpers
const MODE_TO_INDEX = { sm: 0, md: 1, lg: 2 };
const INDEX_TO_MODE = ["sm", "md", "lg"];

export default function SettingsMenu({ children, personaId }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const { resetChat } = useChatStore();

  // Initialize from localStorage (default = md)
  const [step, setStep] = useState(() => {
    if (typeof window === "undefined") return 1;
    const stored = localStorage.getItem("fontSize") || "md";
    return MODE_TO_INDEX[stored] ?? 1;
  });

  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (!menuRef.current) return;
      if (menuRef.current.contains(e.target) || btnRef.current?.contains(e.target)) return;
      setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [open]);

  // Apply mode -> sets data-font and persists; clears any pixel override
  function applyMode(idx) {
    const mode = INDEX_TO_MODE[idx] || "md";
    document.documentElement.dataset.font = mode;
    // remove any hard pixel size overrides from the previous version
    document.documentElement.style.fontSize = "";
    try {
      localStorage.setItem("fontSize", mode);
      localStorage.removeItem("fontSizePx");
    } catch {}
    setStep(idx);
  }

  // Ensure current mode is reflected on mount (in case user loaded from another tab)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("fontSize") || "md";
    const idx = MODE_TO_INDEX[stored] ?? 1;
    document.documentElement.dataset.font = stored;
    document.documentElement.style.fontSize = ""; // clear px override if any
    setStep(idx);
  }, []);

  const currentLabel = INDEX_TO_MODE[step];

  return (
    <div className="relative">
      <div
        ref={btnRef}
        onClick={() => setOpen((s) => !s)}
        className="inline-block cursor-pointer"
      >
        {children}
      </div>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-64 rounded-xl border shadow-lg p-3 z-20"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          {/* Reset Chat button (styled) */}
          <button
            onClick={() => {
              resetChat(personaId);
              setOpen(false);
            }}
            className="w-full text-left rounded-lg px-3 py-2 cursor-pointer border transition hover:opacity-90"
            style={{
              background: "color-mix(in oklab, var(--card) 90%, var(--muted))",
              borderColor: "var(--border)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "color-mix(in oklab, var(--card) 80%, var(--muted))")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "color-mix(in oklab, var(--card) 90%, var(--muted))")
            }
          >
            Reset chat
          </button>

          {/* Discrete 3-step slider: sm | md | lg */}
          <div className="mt-3 text-xs opacity-70">Font size</div>
          <div className="mt-2">
            <input
              type="range"
              min="0"
              max="2"
              step="1"
              value={step}
              onChange={(e) => applyMode(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer accent-[var(--accent)]"
              aria-label="Font size"
              title="Font size"
            />
            <div className="mt-2 grid grid-cols-3 text-xs">
              <div className={`justify-self-start ${currentLabel === "sm" ? "opacity-100 font-medium" : "opacity-60"}`}>Small</div>
              <div className={`justify-self-center ${currentLabel === "md" ? "opacity-100 font-medium" : "opacity-60"}`}>Medium</div>
              <div className={`justify-self-end ${currentLabel === "lg" ? "opacity-100 font-medium" : "opacity-60"}`}>Large</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
