"use client";
import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { useChatStore } from "@/store/chatStore";

export default function ChatInput({ onSend }) {
	const { activePersonaId, getDraft, setDraft, registerInputFocus } =
		useChatStore();

	const value = getDraft(activePersonaId);
	const ref = useRef(null);

	useEffect(() => {
		// register a focus function other components can call
		registerInputFocus(() => {
			ref.current?.focus();
			// place caret at end
			const el = ref.current;
			if (el) {
				const len = el.value.length;
				el.setSelectionRange(len, len);
			}
		});
	}, [registerInputFocus]);

	function send() {
		const text = (value || "").trim();
		if (text) {
			onSend(text);
			setDraft(activePersonaId, ""); // clear draft
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
						ref={ref}
						rows={2}
						value={value}
						onChange={(e) =>
							setDraft(activePersonaId, e.target.value)
						}
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
