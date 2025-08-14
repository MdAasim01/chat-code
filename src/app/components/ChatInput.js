"use client";
import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const text = value.trim();
      if (text) {
        onSend(text);
        setValue("");
      }
    }
  }

  return (
    <div className="border-t border-black/10 bg-white/80 backdrop-blur px-3 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Type your message…  (Shift+Enter = new line, Enter = send)"
            className="flex-1 resize-none rounded-xl border border-black/10 px-3 py-2 outline-none focus:ring-2 focus:ring-[var(--accent)]/40 bg-[var(--base)]"
          />
          <button
            onClick={() => { const t = value.trim(); if (t) { onSend(t); setValue(""); } }}
            className="px-4 py-2 rounded-xl bg-[var(--accent)] text-white hover:opacity-90 transition"
            aria-label="Send message"
          >
            Send
          </button>
        </div>
        <div className="mt-1 text-[11px] text-black/50">Model: {process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-4o-mini"}</div>
      </div>
    </div>
  );
}
