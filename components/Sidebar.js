"use client";
import { useChatStore } from "@/store/chatStore";
import { useState } from "react";

export default function Sidebar() {
  const { personas, activePersonaId, setActivePersona } = useChatStore();
  const [open, setOpen] = useState(true);

  return (
    <aside
      className={`h-full border-r transition-all duration-200 ${open ? "w-lg" : "w-16"}`}
      style={{ background: "var(--card)", borderColor: "var(--border)" }}
    >
      <div className="h-12 flex items-center justify-between px-3">
        <button
          onClick={() => setOpen((s) => !s)}
          className="rounded-lg border px-2 py-1 text-xs"
          style={{ borderColor: "var(--border)", background: "var(--muted)" }}
          aria-label="Toggle sidebar"
        >
          {open ? "◀" : "▶"}
        </button>
        {open && <div className="text-xs opacity-70">Personas</div>}
        {!open && <div className="w-6" />}
      </div>

      <div className="px-2 pb-3 space-y-2">
        {personas.map((p) => {
          const active = p.id === activePersonaId;
          return (
            <button
              key={p.id}
              onClick={() => setActivePersona(p.id)}
              className={`group w-full flex items-center gap-3 rounded-xl p-2 text-left border transition`}
              style={{
                background: active ? "var(--muted)" : "transparent",
                borderColor: "var(--border)",
              }}
            >
              <img src={p.avatar} alt={p.name} className="h-10 w-10 rounded-full border" style={{ borderColor: "var(--border)" }} />
              {open && (
                <div className="flex flex-col min-w-0">
                  <div className="text-sm font-medium truncate">{p.name}</div>
                  <div className="text-xs opacity-60 truncate">{active ? "Active" : "Tap to chat"}</div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
