"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import ChatInput from "./ChatInput";
import Markdown from "./Markdown";
import { Send } from "lucide";

function fmt(ts) {
  try { return new Date(ts).toLocaleTimeString(); } catch { return ""; }
}
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

export default function ChatWindow() {
  const { personas, activePersonaId, getMessages, addMessage, appendToLastAssistant } = useChatStore();
  const persona = useMemo(() => personas.find(p => p.id === activePersonaId), [personas, activePersonaId]);
  const messages = getMessages(activePersonaId);
  const [isTyping, setIsTyping] = useState(false);
  const isClient = useIsClient();
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  async function handleSend(userText) {
    addMessage(activePersonaId, { role: "user", content: userText, timestamp: Date.now() });
    addMessage(activePersonaId, { role: "assistant", content: "", timestamp: Date.now() });

    setIsTyping(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personaId: activePersonaId,
          systemPrompt: persona.systemPrompt,
          history: getMessages(activePersonaId),
        }),
      });

      if (!res.ok || !res.body) {
        appendToLastAssistant(activePersonaId, `\n[Error ${res.status}] ${await res.text()}`);
        return setIsTyping(false);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (chunk) appendToLastAssistant(activePersonaId, chunk);
      }
    } catch (e) {
      appendToLastAssistant(activePersonaId, "\n[Error streaming response]");
    } finally {
      setIsTyping(false);
    }
  }

  return (
    <section className="flex-1 flex flex-col">
      {/* Persona header strip */}
      <div
        className="h-14 flex items-center gap-3 px-4 border-b"
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
      >
        <img className="h-9 w-9 rounded-full border" style={{ borderColor: "var(--border)" }} src={persona.avatar} alt={persona.name} />
        <div className="flex flex-col">
          <div className="font-semibold">{persona.name}</div>
          <div className="text-xs opacity-60">Hinglish • Friendly • Practical</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3" style={{ background: "var(--bg)" }}>
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          return (
            <div
              key={i}
              className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"} animate-[fadeIn_.2s_ease]`}
            >
              {!isUser && (
                <img src={persona.avatar} className="h-8 w-8 rounded-full translate-y-1 border" style={{ borderColor: "var(--border)" }} alt={persona.name} />
              )}

              <div
                className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm"
                style={{
                  background: isUser ? "var(--bubble-user)" : "color-mix(in oklab, var(--bubble-ai) 92%, var(--muted))",
                  color: isUser ? "var(--bubble-user-ink)" : "var(--bubble-ai-ink)",
                  border: `1px solid var(--border)`,
                  borderTopLeftRadius: isUser ? "1rem" : "0.35rem",
                  borderTopRightRadius: isUser ? "0.35rem" : "1rem",
                }}
              >
                <Markdown>{m.content}</Markdown>
                <div className="mt-1 text-[10px] opacity-60" suppressHydrationWarning>
                  {isClient ? fmt(m.timestamp) : ""}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs opacity-70">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full" style={{ background: "var(--accent)" }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: "var(--accent)" }} />
            </span>
            typing…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} icon={<Send />} />
    </section>
  );
}
