"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("theme");
	const prefersDark = window.matchMedia(
		"(prefers-color-scheme: dark)"
	).matches;
	const current = saved || (prefersDark ? "dark" : "light");

	document.documentElement.dataset.theme = current;
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
			className="rounded-xl border px-3 py-1.5 text-sm cursor-pointer"
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
