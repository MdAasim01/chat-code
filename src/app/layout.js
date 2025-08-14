import "./styles/globals.css";

export const metadata = { title: "Two-Persona AI Chat" };

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className="h-screen w-screen">{children}</body>
		</html>
	);
}
