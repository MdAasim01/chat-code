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

/** Persona-specific sample prompts (tabs) */
const samplePrompts = {
  hitesh: [
    { id: "create", label: "Create", items: [
      "Build a responsive Next.js landing page with Tailwind",
      "Scaffold a Node API with auth and Prisma",
      "Generate a devops checklist for a monorepo"
    ]},
    { id: "explore", label: "Explore", items: [
      "Explain React Server Components in simple Hinglish",
      "Compare Vite vs Next.js for SPA use-cases",
      "How do WebWorkers help with performance?"
    ]},
    { id: "code", label: "Code", items: [
      "Write a debounce utility in modern JS",
      "Convert a callback API into Promises",
      "Show an example of Zustand selector optimization"
    ]},
    { id: "learn", label: "Learn", items: [
      "Roadmap to master modern JavaScript in 30 days",
      "What is ISR vs SSR vs SSG in Next.js?",
      "Explain Docker basics with a real analogy"
    ]},
  ],
  piyush: [
    { id: "create", label: "Create", items: [
      "Design a scalable folder structure for a Next.js app",
      "Create a RESTful products API with pagination & filters",
      "Make a GitHub Actions pipeline for lint/test/deploy"
    ]},
    { id: "explore", label: "Explore", items: [
      "Monolith vs microservices — practical tradeoffs",
      "What’s a message queue? SQS vs Kafka",
      "Rate limiting strategies for production APIs"
    ]},
    { id: "code", label: "Code", items: [
      "Implement JWT auth (access + refresh) in Express",
      "Write a Postgres query for top N items per group",
      "Add file uploads to Next.js route handlers"
    ]},
    { id: "learn", label: "Learn", items: [
      "System design: load balancer in simple words",
      "How to structure services on AWS (ALB, ECS, ECR)",
      "Caching strategies: CDN, Redis, HTTP cache"
    ]},
  ],
};

export const useChatStore = create(
	persist(
		(set, get) => ({
			personas,
			activePersonaId: personas[0].id,
			setActivePersona: (id) => set({ activePersonaId: id }),

			// messages per persona
			messages: {},
			getMessages: (personaId) => get().messages[personaId] || [],
			addMessage: (personaId, message) => {
				const existing = get().messages[personaId] || [];
				set({
					messages: {
						...get().messages,
						[personaId]: [...existing, message],
					},
				});
			},
			appendToLastAssistant: (personaId, chunk) => {
				const msgs = get().messages[personaId] || [];
				const lastIdx = msgs.length - 1;
				if (lastIdx >= 0 && msgs[lastIdx].role === "assistant") {
					const updated = [...msgs];
					updated[lastIdx] = {
						...updated[lastIdx],
						content: (updated[lastIdx].content || "") + chunk,
					};
					set({
						messages: { ...get().messages, [personaId]: updated },
					});
				}
			},

			// typing state per persona
			typing: {},
			setTyping: (personaId, value) => {
				const t = { ...(get().typing || {}) };
				t[personaId] = !!value;
				set({ typing: t });
			},

			// reset chat for persona
			resetChat: (personaId) => {
				const next = { ...(get().messages || {}) };
				next[personaId] = [];
				set({ messages: next });
			},

			// sample prompts
			samplePrompts,

			// input draft per persona (so clicking a suggestion fills input)
			inputDrafts: {},
			getDraft: (personaId) => get().inputDrafts?.[personaId] || "",
			setDraft: (personaId, value) => {
				const drafts = { ...(get().inputDrafts || {}) };
				drafts[personaId] = value;
				set({ inputDrafts: drafts });
			},

			// allow ChatWindow/SamplePrompts to programmatically focus the input
			_focusHandler: null,
			registerInputFocus: (fn) => set({ _focusHandler: fn }),
			focusInput: () => {
				const fn = get()._focusHandler;
				if (typeof fn === "function") fn();
			},
		}),
		{ name: "two-persona-chat" }
	)
);
