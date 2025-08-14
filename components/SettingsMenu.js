"use client";
import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";

export default function SettingsMenu({ children, personaId }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);
  const { resetChat } = useChatStore();

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

  function setFontSize(mode) {
    const m = mode || "md";
    document.documentElement.dataset.font = m;
    try { localStorage.setItem("fontSize", m); } catch {}
  }

  // read current font mode for UI highlight
  const current = typeof window !== "undefined"
    ? (document.documentElement.dataset.font || "md")
    : "md";

  return (
    <div className="relative">
      <div ref={btnRef} onClick={() => setOpen((s) => !s)} className="inline-block">
        {/* parent passes the trigger button */}
        {children}
      </div>

      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-56 rounded-xl border shadow-lg p-2 z-20"
          style={{ background: "var(--card)", borderColor: "var(--border)" }}
        >
          <button
            onClick={() => { resetChat(personaId); setOpen(false); }}
            className="w-full text-left rounded-lg px-3 py-2 hover:opacity-90 cursor-pointer"
            style={{ background: "transparent" }}
          >
            Reset chat
          </button>

          <div className="mt-1 px-3 py-2 text-xs opacity-70">Font size</div>
          <div className="grid grid-cols-3 gap-2 px-2 pb-2">
            {["sm","md","lg"].map(mode => (
              <button
                key={mode}
                onClick={() => setFontSize(mode)}
                className={`rounded-lg px-2 py-1 text-sm border cursor-pointer ${current===mode ? "opacity-100" : "opacity-70"}`}
                style={{ borderColor: "var(--border)" }}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
