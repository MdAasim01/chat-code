# Chat Code — Two-Persona AI Chat Application

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://chat-aur-code.vercel.app/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/MdAasim01/chat-code)

An interactive, responsive, and modern **two-persona AI chat application** built with **Next.js (App Router)**, **Tailwind CSS**, **Zustand**, and **OpenAI API**.  
Features real-time streaming responses, persistent conversation history, theming, and multiple UI/UX enhancements.

---

## 🚀 Live Demo
🔗 **[View the Live App](https://chat-aur-code.vercel.app/)**

---

## ✨ Features

### **Core**
- **Two AI Personas** — Each with unique system prompts and avatars.
- **Persistent Chat** — Messages are saved per persona in `localStorage`.
- **Streaming AI Responses** — Word-by-word streaming from the OpenAI API.
- **Multi-line Input** — `Shift+Enter` for new lines, `Enter` to send.
- **Typing Indicator** — Smooth animated dots while AI is responding.
- **Sample Prompts UI** — Persona-specific example questions when starting a new chat.

### **Sidebar**
- **Search Personas** — Filter personas with an instant search bar.
- **Last Message Preview** — Shows last chat snippet or `"typing..."` in italic.
- **Responsive Layout** — Adapts to mobile, tablet, and desktop.

### **Chat Window**
- **Sticky Header** — Persona info, typing status, and settings menu.
- **Settings Menu**:
  - Reset Chat for current persona.
  - Font Size Control — Small / Medium / Large selection (slider with 3 steps).
- **Markdown Support** — Code blocks, lists, links, etc.
- **Auto-scroll** — Floating down arrow appears when scrolling up.
- **Theme Switcher** — Light & Dark mode with pastel palette.

### **Theming**
- **Pastel Palette**:
  - `#f5f2ec` — 60%
  - `#51213d` — 30%
  - `#f5f2ec` — 10%
- **Dark Mode** — Toggle instantly with smooth transitions.
- **Custom Placeholder Colors** — Dynamic placeholder color adapts to theme.

---

## 🛠 Tech Stack
- **[Next.js 14+ (App Router)](https://nextjs.org/)**
- **[Tailwind CSS](https://tailwindcss.com/)**
- **[Zustand](https://github.com/pmndrs/zustand)** — State management
- **[OpenAI Node SDK](https://github.com/openai/openai-node)**
- **[Lucide Icons](https://lucide.dev/)**
- **[react-markdown](https://github.com/remarkjs/react-markdown)** — Markdown rendering

---

## 📸 Screenshots
*(Placeholders — Add images later)*

### Light Mode
![Light Mode Screenshot](./public/screenshots/light-mode.png)

### Dark Mode
![Dark Mode Screenshot](./public/screenshots/dark-mode.png)

---

## ⚡ Getting Started

### **1. Clone the repository**
```bash
git clone https://github.com/MdAasim01/chat-code.git
cd chat-code
```

### **2. Install dependencies**
```bash
npm install
```

### **3. Create `.env.local` file**
```bash
OPENAI_API_KEY=your_openai_api_key
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini
```

*(You can change `OPENAI_BASE_URL` if using a different LLM provider.)*

### **4. Run the development server**
```bash
npm run dev
```

The app will be available at **[http://localhost:3000](http://localhost:3000)**.

---

## 🧑‍💻 Usage
1. Select a persona from the sidebar.
2. Type your message and press **Enter** to send.
3. Use the **settings menu** in the chat header to:
   - Reset chat for that persona.
   - Change font size (3-step slider).
4. Switch themes anytime with the theme toggle.
5. Click on sample prompts to quickly insert them into the input box.

---

## 👤 Author
**Md Aasim**  
- 💼 [LinkedIn](https://www.linkedin.com/in/md-aasim/)  
- 🐦 [Twitter](https://x.com/MdAasim03)  
- 💻 [GitHub](https://github.com/MdAasim01)  

---

## 📄 Deployment
Deployed on **[Vercel](https://chat-aur-code.vercel.app)** for fast, serverless performance.

---

## ⭐ Support
If you like this project, please ⭐ the [GitHub repo](https://github.com/MdAasim01/chat-code)!

---
