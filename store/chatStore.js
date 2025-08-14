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

const samplePrompts = {
	hitesh: [
		{
			id: "code",
			label: "Code",
			items: [
				"React me ek basic todo app bana ke dikhao",
				"Node.js ke saath MongoDB ka CRUD example do",
				"Next.js me API routes ka demo dikhao",
				"Authentication ke liye JWT kaise implement karte hain?",
			],
		},
		{
			id: "learn",
			label: "Learn",
			items: [
				"JavaScript closures ka real-world example samjha do",
				"React Hooks kaise kaam karte hain?",
				"TypeScript ka quick overview de do",
				"Git aur GitHub ka beginner tutorial batao",
			],
		},
		{
			id: "explore",
			label: "Explore",
			items: [
				"Mujhe DevOps shuru karne ka roadmap chahiye",
				"AI ko apne Next.js project me integrate kaise karein?",
				"Full-stack developer banne ka step-by-step guide do",
				"OpenAI API ka live demo dikhao",
			],
		},
		{
			id: "life",
			label: "Life",
			items: [
				"Aap apna din kaise plan karte ho coding aur teaching ke beech?",
				"Travel ne aapke career par kaise impact dala?",
				"YouTube par content banate hue motivation kaise maintain karte ho?",
				"Tech industry me burnout se kaise bachte ho?",
			],
		},
	],
	piyush: [
		{
			id: "code",
			label: "Code",
			items: [
				"Node.js me authentication ka real-world example do",
				"React performance optimization kaise karte ho?",
				"Mujhe Python Flask ka ek API example chahiye",
				"PostgreSQL ke saath backend API bana ke dikhao",
			],
		},
		{
			id: "learn",
			label: "Learn",
			items: [
				"System design ka basic introduction do",
				"Database indexing ka simple explanation do",
				"REST aur GraphQL ka difference samjha do",
				"Docker ka use karke project deploy kaise karein?",
			],
		},
		{
			id: "explore",
			label: "Explore",
			items: [
				"Industry me microservices kaise implement hote hain?",
				"Scaling backend ke liye best practices kya hain?",
				"Serverless architecture ka overview do",
				"Machine Learning ko web apps me kaise use karte ho?",
			],
		},
		{
			id: "life",
			label: "Life",
			items: [
				"Full-time job ke saath side projects kaise manage karte ho?",
				"Tech career me failures ko kaise handle karte ho?",
				"Daily routine me learning ke liye time kaise nikalte ho?",
				"Startup ya company join karne ka decision kaise lete ho?",
			],
		},
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
			// mutate last assistant message during streaming
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
		{
			name: "Chat Code — Ai Persona of Hitesh and Piyush Sir from ChaiAurCode",
		}
	)
);
