"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const current = document.documentElement.dataset.theme || "light";
    setTheme(current);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("theme", next);
    setTheme(next);
  }

  return (
    <button
      onClick={toggle}
      className="rounded-xl border px-3 py-1.5 text-sm"
      style={{
        background: "var(--card)",
        color: "var(--fg)",
        borderColor: "var(--border)",
      }}
      aria-label="Toggle theme"
      title="Toggle theme"
    >
      {theme === "light" ? "🌙 Dark" : "🌤️ Light"}
    </button>
  );
}
