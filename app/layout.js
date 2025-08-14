import "@/styles/globals.css";

export const metadata = { title: "Two-Persona AI Chat" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Set theme before hydration to avoid flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function(){
                try {
                  var t = localStorage.getItem('theme') || 'light';
                  document.documentElement.dataset.theme = t;
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
