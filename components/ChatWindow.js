"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import ChatInput from "./ChatInput";
import Markdown from "./Markdown";
import { Settings2, ArrowDown } from "lucide-react";
import SettingsMenu from "./SettingsMenu";

function fmt(ts) {
  try {
    return new Date(ts).toLocaleTimeString();
  } catch {
    return "";
  }
}
function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

export default function ChatWindow() {
  const {
    personas,
    activePersonaId,
    getMessages,
    addMessage,
    appendToLastAssistant,
    setTyping,
    typing,
  } = useChatStore();
  const persona = useMemo(
    () => personas.find((p) => p.id === activePersonaId),
    [personas, activePersonaId]
  );
  const messages = getMessages(activePersonaId);
  const isTyping = !!typing?.[activePersonaId];
  const isClient = useIsClient();
  const bottomRef = useRef(null);
  const scrollRef = useRef(null);
  const [showDown, setShowDown] = useState(false);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // detect scroll up -> show floating down arrow
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      const nearBottom =
        el.scrollHeight - el.scrollTop - el.clientHeight < 48;
      setShowDown(!nearBottom);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSend(userText) {
    addMessage(activePersonaId, {
      role: "user",
      content: userText,
      timestamp: Date.now(),
    });
    addMessage(activePersonaId, {
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    });

    setTyping(activePersonaId, true);
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
        appendToLastAssistant(
          activePersonaId,
          `\n[Error ${res.status}] ${await res.text()}`
        );
        setTyping(activePersonaId, false);
        return;
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
      setTyping(activePersonaId, false);
    }
  }

  return (
    <section className="flex-1 flex flex-col">
      {/* Persona header strip (sticky within right pane) */}
      <div
        className="h-14 flex items-center justify-between px-4 border-b sticky top-0 z-10"
        style={{ borderColor: "var(--border)", background: "var(--bg)" }}
      >
        <div className="flex items-center gap-3">
          <img
            className="h-9 w-9 rounded-full border"
            style={{ borderColor: "var(--border)" }}
            src={persona.avatar}
            alt={persona.name}
          />
          <div className="flex flex-col">
            <div className="font-semibold">{persona.name}</div>
            <div className="text-xs opacity-60">
              {isTyping ? "typing..." : "Hinglish • Friendly • Practical"}
            </div>
          </div>
        </div>
        <div className="relative">
          <SettingsMenu personaId={activePersonaId}>
            <button
              className="cursor-pointer p-1 rounded-lg border"
              style={{ borderColor: "var(--border)" }}
              aria-label="Open settings"
              title="Open settings"
            >
              <Settings2 size={18} />
            </button>
          </SettingsMenu>
        </div>
      </div>

      {/* Messages (scroll container) */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 relative"
        style={{ background: "var(--bg)" }}
      >
        {messages.map((m, i) => {
          const isUser = m.role === "user";
          const isLatest = i === messages.length - 1;
          const showTypingDots =
            !isUser && isLatest && isTyping && (!m.content || m.content.length === 0);

          return (
            <div
              key={i}
              className={`flex items-end gap-2 ${
                isUser ? "justify-end" : "justify-start"
              } animate-[fadeIn_.2s_ease]`}
            >
              {!isUser && (
                <img
                  src={persona.avatar}
                  className="h-8 w-8 rounded-full translate-y-1 border"
                  style={{ borderColor: "var(--border)" }}
                  alt={persona.name}
                />
              )}

              <div
                className="max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm"
                style={{
                  background: isUser
                    ? "var(--bubble-user)"
                    : "color-mix(in oklab, var(--bubble-ai) 92%, var(--muted))",
                  color: isUser
                    ? "var(--bubble-user-ink)"
                    : "var(--bubble-ai-ink)",
                  border: `1px solid var(--border)`,
                  borderTopLeftRadius: isUser ? "1rem" : "0.35rem",
                  borderTopRightRadius: isUser ? "0.35rem" : "1rem",
                }}
              >
                {showTypingDots ? (
                  <div className="typing-dots">
                    <span></span><span></span><span></span>
                  </div>
                ) : (
                  <Markdown>{m.content}</Markdown>
                )}
                <div
                  className="mt-1 text-[10px] opacity-60"
                  suppressHydrationWarning
                >
                  {isClient ? fmt(m.timestamp) : ""}
                </div>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />

        {/* Scroll-to-bottom FAB */}
        {showDown && (
          <button
            onClick={() =>
              bottomRef.current?.scrollIntoView({ behavior: "smooth" })
            }
            className="cursor-pointer absolute right-4 bottom-4 rounded-full shadow-md border p-2"
            style={{ background: "var(--card)", borderColor: "var(--border)" }}
            aria-label="Scroll to bottom"
            title="Scroll to bottom"
          >
            <ArrowDown size={18} />
          </button>
        )}
      </div>

      {/* Input */}
      <ChatInput onSend={handleSend} />
    </section>
  );
}
