"use client";
import { useMemo, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import { Sparkles, Compass, Code2, GraduationCap } from "lucide-react";

/**
 * Pills-as-tabs + question list. Shows when persona has no messages.
 * Clicking a question fills the chat input and focuses it.
 */
const ICONS = {
  code: Code2,
  explore: Compass,
  learn: GraduationCap,
  life: Sparkles,
};

export default function SamplePrompts() {
  const { activePersonaId, samplePrompts, setDraft, focusInput } = useChatStore();

  const tabs = samplePrompts[activePersonaId] || [];
  const [active, setActive] = useState(tabs[0]?.id || (tabs[0] && tabs[0].id));
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
      <div
        className="flex flex-wrap gap-3 mb-6"
        role="tablist"
        aria-label="Suggestion categories"
      >
        {tabs.map((t) => {
          const Icon = ICONS[t.id] || Sparkles;
          const selected = t.id === active;

          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={selected}
              onClick={() => setActive(t.id)}
              className={`cursor-pointer inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition
                ${selected ? "shadow-sm" : ""}
              `}
              style={{
                background: selected
                  ? "color-mix(in oklab, var(--muted) 75%, var(--card))"
                  : "color-mix(in oklab, var(--card) 94%, var(--muted))",
                borderColor: selected ? "var(--accent)" : "var(--border)",
                color: "var(--fg)",
              }}
              onMouseEnter={(e) => {
                if (!selected) {
                  e.currentTarget.style.background =
                    "color-mix(in oklab, var(--card) 86%, var(--muted))";
                }
              }}
              onMouseLeave={(e) => {
                if (!selected) {
                  e.currentTarget.style.background =
                    "color-mix(in oklab, var(--card) 94%, var(--muted))";
                }
              }}
            >
              <Icon size={16} />
              <span className={`${selected ? "font-medium" : ""}`}>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Questions */}
      <div className="space-y-2" role="list" aria-label="Sample questions">
        {(activeTab?.items || []).map((q, i) => (
          <button
            key={i}
            role="listitem"
            onClick={() => useSample(q)}
            className="w-full text-left rounded-xl border px-4 py-3 cursor-pointer transition group"
            style={{
              background: "color-mix(in oklab, var(--card) 92%, var(--muted))",
              borderColor: "var(--border)",
              color: "var(--fg)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background =
                "color-mix(in oklab, var(--card) 86%, var(--muted))";
              e.currentTarget.style.borderColor = "var(--accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background =
                "color-mix(in oklab, var(--card) 92%, var(--muted))";
              e.currentTarget.style.borderColor = "var(--border)";
            }}
          >
            <span className="inline-block transition-transform group-hover:translate-x-[1px]">
              {q}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
