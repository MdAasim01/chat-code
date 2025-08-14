"use client";
import { Send } from "lucide-react";
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
		<div
			className="border-t px-3 py-3 sticky bottom-0"
			style={{ borderColor: "var(--border)", background: "var(--card)" }}
		>
			<div className="flex flex-col gap-2">
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
						className="w-14 h-14 rounded-full font-medium shadow-sm cursor-pointer grid place-items-center"
						style={{
							background: "var(--accent)",
							color: "var(--accent-ink)",
						}}
						aria-label="Send message"
						title="Send message"
					>
						<Send size={24} />
					</button>
				</div>
				<div className="text-[11px] opacity-60">
					Supports Markdown & code blocks. Paste code fences like:
					<code
						className="ml-1 px-1 rounded"
						style={{ background: "var(--muted)" }}
					>
						```js
					</code>
				</div>
			</div>
		</div>
  );
}
