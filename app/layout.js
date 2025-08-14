import "@/styles/globals.css";

export const metadata = { title: "Chat Code — Ai Persona of Hitesh and Piyush Sir from ChaiAurCode" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* DM Sans font */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Set theme + font size before hydration to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('theme') || 'light';
                  document.documentElement.dataset.theme = t;
                  // Legacy mode (kept): sm|md|lg
                  var f = localStorage.getItem('fontSize') || 'md';
                  document.documentElement.dataset.font = f;
                  // New: pixel-based font size from slider (overrides)
                  var fpx = localStorage.getItem('fontSizePx');
                  if (fpx) { document.documentElement.style.fontSize = fpx + 'px'; }
                } catch(e){}
              })();
            `,
          }}
        />
      </head>
      <body className="h-screen w-screen">{children}</body>
    </html>
  );
}
