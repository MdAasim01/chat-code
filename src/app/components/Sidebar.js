"use client";
import { useChatStore } from "../store/chatStore";

export default function Sidebar() {
  const { personas, activePersonaId, setActivePersona } = useChatStore();

  return (
    <aside className="w-72 bg-[var(--accent)] text-white flex flex-col">
      <div className="px-5 py-4 text-xl font-semibold tracking-tight">AI Personas</div>
      <div className="flex-1 overflow-y-auto">
        {personas.map((p) => {
          const active = p.id === activePersonaId;
          return (
            <button
              key={p.id}
              onClick={() => setActivePersona(p.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition
               ${active ? "bg-white/10" : "hover:bg-white/5"}`}
            >
              <img src={p.avatar} alt={p.name} className="h-10 w-10 rounded-full ring-2 ring-white/30" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{p.name}</span>
                <span className="text-xs text-white/70">{active ? "Active" : "Tap to chat"}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="p-4 text-xs text-white/70">
        Palette: <span className="underline">:root</span> CSS vars — swap to rebrand.
      </div>
    </aside>
  );
}
