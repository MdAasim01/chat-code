"use client";
import { useChatStore } from "@/store/chatStore";
import { useMemo, useState } from "react";
import { PanelLeft, Search as SearchIcon } from "lucide-react";

export default function Sidebar() {
  const { personas, activePersonaId, setActivePersona, getMessages, typing } =
		useChatStore();
  const [open, setOpen] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return personas;
		return personas.filter((p) => p.name.toLowerCase().includes(q));
  }, [personas, query]);

  return (
		<aside
			className={`h-full border-r transition-all duration-200 ${
				open ? "w-lg" : "w-16"
			}`}
			style={{ background: "var(--card)", borderColor: "var(--border)" }}
		>
			<div className="h-12 flex items-center justify-between px-3">
				<button
					onClick={() => setOpen((s) => !s)}
					className="rounded-lg border px-2 py-1 text-xs cursor-pointer"
					style={{
						borderColor: "var(--border)",
						background: "var(--muted)",
					}}
					aria-label="Toggle sidebar"
					title="Toggle sidebar"
				>
					<PanelLeft size={16} />
				</button>

				{/* Replace 'Personas' text with search icon */}
				<button
					onClick={() => setShowSearch((s) => !s)}
					className="rounded-lg p-1 cursor-pointer"
					title="Search personas"
					aria-label="Search personas"
				>
					<SearchIcon size={16} />
				</button>

				{!open && <div className="w-6" />}
			</div>

			{/* Search bar with slide animation */}
			<div
				className={`px-2 overflow-hidden transition-all duration-200 ${
					showSearch ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
				}`}
			>
				<input
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search personas…"
					className="w-full mb-2 rounded-lg px-2 py-1 text-sm border"
					style={{
						background: "var(--bg)",
						color: "var(--fg)",
						borderColor: "var(--border)",
					}}
				/>
			</div>

			<div className="px-2 pb-3 space-y-2">
				{filtered.map((p) => {
					const active = p.id === activePersonaId;
					const msgs = getMessages(p.id);
					const last = msgs[msgs.length - 1];
					const preview = typing?.[p.id]
						? "typing..."
						: last?.content
						? String(last.content).replace(/\s+/g, " ").slice(0, 60)
						: "No messages yet";

					return (
						<button
							key={p.id}
							onClick={() => setActivePersona(p.id)}
							className={`group w-full flex items-center gap-3 rounded-xl p-2 text-left border transition cursor-pointer`}
							style={{
								background: active
									? "var(--muted)"
									: "transparent",
								borderColor: "var(--border)",
							}}
						>
							<img
								src={p.avatar}
								alt={p.name}
								className="h-10 w-10 rounded-full border"
								style={{ borderColor: "var(--border)" }}
							/>
							{open && (
								<div className="flex flex-col min-w-0">
									<div className="text-sm font-medium truncate">
										{p.name}
									</div>
									<div
										className={`text-xs opacity-60 truncate ${
											typing?.[p.id] ? "italic" : ""
										}`}
									>
										{preview}
									</div>
								</div>
							)}
						</button>
					);
				})}
			</div>
		</aside>
  );
}
