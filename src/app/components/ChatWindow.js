"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatStore } from "../store/chatStore";
import ChatInput from "./ChatInput";
import Markdown from "./Markdown";

function fmt(ts) {
	try {
		return new Date(ts).toLocaleTimeString();
	} catch {
		return "";
	}
}

export default function ChatWindow() {
	const {
		personas,
		activePersonaId,
		getMessages,
		addMessage,
		appendToLastAssistant,
	} = useChatStore();
	const persona = useMemo(
		() => personas.find((p) => p.id === activePersonaId),
		[personas, activePersonaId]
	);
	const messages = getMessages(activePersonaId);
	const [isTyping, setIsTyping] = useState(false);
	const bottomRef = useRef(null);

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages, isTyping]);

	async function handleSend(userText) {
		// push user message
		addMessage(activePersonaId, {
			role: "user",
			content: userText,
			timestamp: Date.now(),
		});
		// push empty assistant stub (we'll stream into it)
		addMessage(activePersonaId, {
			role: "assistant",
			content: "",
			timestamp: Date.now(),
		});

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

			const reader = res.body.getReader();
			const decoder = new TextDecoder();

			// while (true) {
			//   const { value, done } = await reader.read();
			//   if (done) break;
			//   const chunk = decoder.decode(value, { stream: true });
			//   if (chunk) appendToLastAssistant(activePersonaId, chunk);
			// }

			let buffer = "";

			while (true) {
				const { value, done } = await reader.read();
				if (done) break;
				const chunk = decoder.decode(value, { stream: true });
				buffer += chunk;
				// flush in small frames (animation-friendly)
				appendToLastAssistant(activePersonaId, buffer);
				buffer = "";
			}
		} catch (e) {
			appendToLastAssistant(
				activePersonaId,
				"\n[Error streaming response]"
			);
		} finally {
			setIsTyping(false);
		}
	}

	return (
		<section className="flex-1 flex flex-col bg-[var(--base)]">
			{/* Header */}
			<div className="h-16 border-b border-black/5 flex items-center gap-3 px-5">
				<img
					className="h-9 w-9 rounded-full"
					src={persona.avatar}
					alt={persona.name}
				/>
				<div className="flex flex-col">
					<div className="font-semibold">{persona.name}</div>
					<div className="text-xs text-black/50">
						Hinglish · Friendly · Practical
					</div>
				</div>
			</div>

			{/* Messages */}
			<div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
				{messages.map((m, i) => {
					const isUser = m.role === "user";
					return (
						<div
							key={i}
							className={`flex items-end gap-2 ${
								isUser ? "justify-end" : "justify-start"
							}`}
						>
							{!isUser && (
								<img
									src={persona.avatar}
									className="h-8 w-8 rounded-full translate-y-1"
									alt={persona.name}
								/>
							)}
							<div
								className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm transition
                ${
					isUser
						? "bg-[var(--accent)] text-white rounded-br-sm"
						: "bg-white/80 backdrop-blur border border-black/5 rounded-bl-sm"
				}`}
							>
								<Markdown className={isUser ? "" : ""}>
									{m.content}
								</Markdown>
								<div
									className={`mt-1 text-[10px] ${
										isUser
											? "text-white/70"
											: "text-black/50"
									}`}
								>
									{fmt(m.timestamp)}
								</div>
							</div>
						</div>
					);
				})}

				{isTyping && (
					<div className="flex items-center gap-2 text-xs text-black/60">
						<span className="relative flex h-2 w-2">
							<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
							<span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
						</span>
						typing…
					</div>
				)}

				<div ref={bottomRef} />
			</div>

			{/* Input */}
			<ChatInput onSend={handleSend} />
		</section>
	);
}
