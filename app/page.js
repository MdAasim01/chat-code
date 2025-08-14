import Sidebar from "@/components/Sidebar";
import ChatWindow from "@/components/ChatWindow";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <main className="h-full w-full">
      {/* Top Bar */}
      <div
        className="h-14 flex items-center justify-between px-4 border-b"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-8 w-8 rounded-lg grid place-items-center font-bold text-sm"
            style={{ background: "var(--bubble-user)", color: "var(--bubble-user-ink)" }}
          >
            AI
          </div>
          <div className="font-semibold">Chat Code — Ai Persona of Hitesh and Piyush Sir from ChaiAurCode</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block text-xs px-2 py-1 rounded-lg" style={{ background: "var(--chip)" }}>
            Model: {process.env.OPENAI_MODEL || "gpt-4o-mini"}
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Main area */}
      <div className="flex h-full">
        <Sidebar />
        <ChatWindow />
      </div>
    </main>
  );
}
