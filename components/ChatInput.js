"use client";
import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [value, setValue] = useState("");

  function send() {
    const text = value.trim();
    if (text) {
      onSend(text);
      setValue("");
    }
  }
  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="border-t px-3 py-3" style={{ borderColor: "var(--border)", background: "var(--card)" }}>
      <div className="mx-auto flex flex-col gap-2">
        <div className="flex gap-2">
          <textarea
            rows={2}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask anything…  (Shift+Enter = new line, Enter = send)"
            className="flex-1 resize-none rounded-xl px-3 py-2 outline-none border"
            style={{
              background: "var(--bg)",
              color: "var(--fg)",
              borderColor: "var(--border)",
            }}
          />
          <button
            onClick={send}
            className="w-[66px] h-[66px] flex justify-center items-center rounded-full font-medium shadow-sm"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-up size-8"><path d="m5 12 7-7 7 7"></path><path d="M12 19V5"></path></svg>

            {/* <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-icon lucide-send ">
              <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>
            </svg> */}
          </button>
        </div>
        <div className="text-[11px] opacity-60">
          Supports Markdown & code blocks. Paste code fences like:
          <code className="ml-1 px-1 rounded" style={{ background: "var(--muted)" }}>```js</code>
        </div>
      </div>
    </div>
  );
}
