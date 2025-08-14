"use client";
import { useChatStore } from "@/store/chatStore";
import { useMemo, useState } from "react";
import {
	PanelLeft,
	Search as SearchIcon,
	X,
	Linkedin,
	Github,
} from "lucide-react";

export default function Sidebar() {
	const { personas, activePersonaId, setActivePersona, getMessages, typing } =
		useChatStore();
	const [open, setOpen] = useState(true);
	const [showSearch, setShowSearch] = useState(true);
	const [query, setQuery] = useState("");

	const filtered = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return personas;
		return personas.filter((p) => p.name.toLowerCase().includes(q));
	}, [personas, query]);

	return (
		<aside
			className={`h-full flex flex-col border-r transition-all duration-200 relative ${
				open ? "w-lg" : "w-24"
			}`}
			style={{ background: "var(--card)", borderColor: "var(--border)" }}
		>
			<div className="flex-1 overflow-y-auto">
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

					{open && (
						<button
							onClick={() => setShowSearch((s) => !s)}
							className="rounded-lg p-1 cursor-pointer"
							title="Search personas"
							aria-label="Search personas"
						>
							<SearchIcon size={16} />
						</button>
					)}

					{!open && <div className="w-6" />}
				</div>

				{open && (
					<div
						className={`px-3 transition-all duration-200 ${
							showSearch
								? "max-h-24 opacity-100"
								: "max-h-0 opacity-0 overflow-hidden"
						}`}
					>
						<div
							className="relative mt-1 rounded-xl border flex items-center"
							style={{
								background: "var(--bg)",
								borderColor: "var(--border)",
							}}
						>
							<SearchIcon
								size={16}
								className="absolute left-2 opacity-60 pointer-events-none"
							/>
							<input
								value={query}
								onChange={(e) => setQuery(e.target.value)}
								placeholder="Search by name"
								className="w-full rounded-lg pl-8 pr-8 py-3.5 text-sm outline-none bg-transparent"
								style={{ color: "var(--fg)" }}
							/>
							{query && (
								<button
									onClick={() => setQuery("")}
									className="absolute right-2 p-1 rounded-md cursor-pointer hover:opacity-80"
									aria-label="Clear search"
									title="Clear"
									style={{ color: "var(--fg)" }}
								>
									<X size={16} />
								</button>
							)}
						</div>
					</div>
				)}

				<div className="p-3 space-y-2">
					{filtered.map((p) => {
						const active = p.id === activePersonaId;
						const msgs = getMessages(p.id);
						const last = msgs[msgs.length - 1];
						const preview = typing?.[p.id]
							? "typing..."
							: last?.content
							? String(last.content)
									.replace(/\s+/g, " ")
									.slice(0, 60)
							: "No messages yet";

						return (
							<button
								key={p.id}
								onClick={() => setActivePersona(p.id)}
								className={`group w-full flex items-center gap-3 rounded-lg p-2 text-left border transition cursor-pointer`}
								style={{
									background: active
										? "color-mix(in oklab, var(--muted) 75%, var(--card))"
										: "color-mix(in oklab, var(--card) 94%, var(--muted))",
									borderColor: active
										? "var(--accent)"
										: "var(--border)",
									color: "var(--fg)",
								}}
								onMouseEnter={(e) => {
									if (!active) {
										e.currentTarget.style.background =
											"color-mix(in oklab, var(--card) 86%, var(--muted))";
									}
								}}
								onMouseLeave={(e) => {
									if (!active) {
										e.currentTarget.style.background =
											"color-mix(in oklab, var(--card) 94%, var(--muted))";
									}
								}}
							>
								<img
									src={p.avatar}
									alt={p.name}
									className="h-10 w-10 rounded-full border object-cover"
									style={{ borderColor: "var(--border)" }}
								/>
								{open && (
									<div className="flex flex-col min-w-0">
										<div className="text-sm font-medium truncate">
											{p.name}
										</div>
										<div
											className={`text-xs opacity-60 truncate mt-1 ${
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
			</div>

			<div className="flex justify-center gap-4 p-4 sticky bottom-0 left-0 w-full">
				<a
					href="https://www.linkedin.com/in/md-aasim/"
					target="_blank"
					rel="noopener noreferrer"
					className="cursor-pointer  items-center gap-2 rounded-full border w-12 h-12 grid place-content-center text-sm transition"
					style={{
						background:
							"color-mix(in oklab, var(--card) 94%, var(--muted))",
					}}
					onMouseEnter={(e) =>
						(e.currentTarget.style.background =
							"color-mix(in oklab, var(--card) 86%, var(--muted))")
					}
					onMouseLeave={(e) =>
						(e.currentTarget.style.background =
							"color-mix(in oklab, var(--card) 94%, var(--muted))")
					}
				>
					<Linkedin className="w-5 h-5 text-fg" />
				</a>

				<a
					href="https://github.com/MdAasim01"
					target="_blank"
					rel="noopener noreferrer"
					className="cursor-pointer  items-center gap-2 rounded-full border w-12 h-12 grid place-content-center text-sm transition"
					style={{
						background:
							"color-mix(in oklab, var(--card) 94%, var(--muted))",
					}}
					onMouseEnter={(e) =>
						(e.currentTarget.style.background =
							"color-mix(in oklab, var(--card) 86%, var(--muted))")
					}
					onMouseLeave={(e) =>
						(e.currentTarget.style.background =
							"color-mix(in oklab, var(--card) 94%, var(--muted))")
					}
				>
					<Github className="w-5 h-5 text-fg" />
				</a>

				<a
					href="https://x.com/MdAasim03"
					target="_blank"
					rel="noopener noreferrer"
					className="cursor-pointer  items-center gap-2 rounded-full border w-12 h-12 grid place-content-center text-sm transition"
					style={{
						background:
							"color-mix(in oklab, var(--card) 94%, var(--muted))",
					}}
					onMouseEnter={(e) =>
						(e.currentTarget.style.background =
							"color-mix(in oklab, var(--card) 86%, var(--muted))")
					}
					onMouseLeave={(e) =>
						(e.currentTarget.style.background =
							"color-mix(in oklab, var(--card) 94%, var(--muted))")
					}
				>
					<X className="w-5 h-5 text-fg" />
				</a>
			</div>
		</aside>
	);
}
