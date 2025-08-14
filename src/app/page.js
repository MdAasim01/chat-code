"use client";
import Sidebar from "./components/Sidebar";
// import ChatWindow from "./components/ChatWindow";
import dynamic from "next/dynamic";

const ChatWindow = dynamic(() => import("./components/ChatWindow"), {
	ssr: false,
});

export default function Home() {
	return (
		<main className="h-full w-full flex">
			<Sidebar />
			<ChatWindow />
		</main>
	);
}
