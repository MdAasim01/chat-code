"use client";
import { useMemo, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { Sparkles, Compass, Code2, GraduationCap } from "lucide-react";

/**
 * Pills-as-tabs + question list. Shows when persona has no messages.
 * Clicking a question fills the chat input and focuses it.
 */
const ICONS = {
  create: Sparkles,
  explore: Compass,
  code: Code2,
  learn: GraduationCap,
};

export default function SamplePrompts() {
  const { activePersonaId, samplePrompts, setDraft, focusInput } = useChatStore();

  const tabs = samplePrompts[activePersonaId] || [];
  const [active, setActive] = useState(tabs[0]?.id || "create");
  const activeTab = useMemo(
    () => tabs.find((t) => t.id === active) || tabs[0],
    [tabs, active]
  );

  function useSample(text) {
    setDraft(activePersonaId, text);
    focusInput();
  }

  return (
    <div className="max-w-3xl mx-auto pt-10 pb-8">
      <h1 className="text-3xl md:text-4xl font-semibold mb-6" style={{ color: "var(--fg)" }}>
        How can I help you?
      </h1>

      {/* Pills / Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {tabs.map((t) => {
          const Icon = ICONS[t.id] || Sparkles;
          const selected = t.id === active;
          return (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={`cursor-pointer inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition`}
              style={{
                background: selected ? "var(--muted)" : "color-mix(in oklab, var(--card) 94%, var(--muted))",
                borderColor: "var(--border)",
              }}
            >
              <Icon size={16} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <div className="space-y-2">
        {(activeTab?.items || []).map((q, i) => (
          <button
            key={i}
            onClick={() => useSample(q)}
            className="w-full text-left rounded-xl border px-4 py-3 cursor-pointer transition"
            style={{
              background: "color-mix(in oklab, var(--card) 92%, var(--muted))",
              borderColor: "var(--border)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "color-mix(in oklab, var(--card) 86%, var(--muted))")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "color-mix(in oklab, var(--card) 92%, var(--muted))")
            }
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
