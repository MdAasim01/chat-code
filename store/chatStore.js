import { create } from "zustand";
import { persist } from "zustand/middleware";
import { HITESH_PROMPT, PIYUSH_PROMPT } from "@/lib/prompts";

const personas = [
  {
    id: "hitesh",
    name: "Hitesh Choudhary",
    avatar:
      "https://yt3.ggpht.com/arHIKjc6JTqF_b4QJKPHhQC_Jr8q0XfI7LEpJ0-VuiI0ZRz9xFNz94TWl4CLOcozLx-iAhV_=s176-c-k-c0x00ffffff-no-rj-mo",
    systemPrompt: HITESH_PROMPT,
  },
  {
    id: "piyush",
    name: "Piyush Garg",
    avatar:
      "https://pbs.twimg.com/profile_images/1879075502356586496/V9wQzW7V_400x400.jpg",
    systemPrompt: PIYUSH_PROMPT,
  },
];

export const useChatStore = create(
  persist(
    (set, get) => ({
      personas,
      activePersonaId: personas[0].id,
      setActivePersona: (id) => set({ activePersonaId: id }),

      // { personaId: [ { role:'user'|'assistant', content, timestamp } ] }
      messages: {},
      getMessages: (personaId) => get().messages[personaId] || [],
      addMessage: (personaId, message) => {
        const existing = get().messages[personaId] || [];
        set({
          messages: { ...get().messages, [personaId]: [...existing, message] },
        });
      },
      // Mutate last assistant message during streaming
      appendToLastAssistant: (personaId, chunk) => {
        const msgs = get().messages[personaId] || [];
        const lastIdx = msgs.length - 1;
        if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
          const updated = [...msgs];
          updated[lastIdx] = {
            ...updated[lastIdx],
            content: (updated[lastIdx].content || "") + chunk,
          };
          set({ messages: { ...get().messages, [personaId]: updated } });
        }
      },

      // Typing indicator per persona
      typing: {}, // { personaId: boolean }
      setTyping: (personaId, value) => {
        const t = { ...(get().typing || {}) };
        t[personaId] = !!value;
        set({ typing: t });
      },

      // Reset chat for a given persona
      resetChat: (personaId) => {
        const next = { ...(get().messages || {}) };
        next[personaId] = [];
        set({ messages: next });
      },
    }),
    { name: "two-persona-chat" }
  )
);
