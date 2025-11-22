// app/page.tsx (Next.js 13+ App Router)
"use client";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

// Simple in-page types for chat
type ChatMessage = { id: string; role: "user" | "assistant"; content: string; ts: string };

export default function Page() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  // --- Chat widget state ---
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "",
      role: "assistant",
      content: "Hi! I'm your AI assistant. Ask me anything about this page or your intake.",
      ts: new Date().toISOString()
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  // Stubbed responder: replace with your API call
  async function getAssistantReply(prompt: string): Promise<string> {
    // TODO: wire this to your backend or /api/chat route
    await new Promise((r) => setTimeout(r, 400));
    return `You said: "${prompt}" — (stubbed reply).`;
  }

  async function handleChatSend(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const text = chatInput.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: "",
      role: "user",
      content: text,
      ts: new Date().toISOString()
    };
    setMessages((m) => [...m, userMsg]);
    setChatInput("");

    try {
      const replyText = await getAssistantReply(text);
      const botMsg: ChatMessage = {
        id: "",
        role: "assistant",
        content: replyText,
        ts: new Date().toISOString()
      };
      setMessages((m) => [...m, botMsg]);
    } catch (err) {
      const errMsg: ChatMessage = {
        id: "",
        role: "assistant",
        content: "Sorry — I couldn’t process that.",
        ts: new Date().toISOString()
      };
      setMessages((m) => [...m, errMsg]);
      console.error(err);
    }
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget as HTMLFormElement;
    console.log("Submitting form", form.elements);
    const data = {
      email: (form.elements.namedItem("email") as HTMLInputElement).value,
      company: (form.elements.namedItem("client_name") as HTMLInputElement).value,
      client_short_name: (form.elements.namedItem("client_short_name") as HTMLInputElement).value,
      client_address: (form.elements.namedItem("client_address") as HTMLInputElement).value,
      industry: (form.elements.namedItem("industry") as HTMLInputElement).value,
      softwareUsed: (form.elements.namedItem("software_Used") as HTMLInputElement).value,
      productInterest: (form.elements.namedItem("productInterest") as HTMLInputElement).value,
      message: (form.elements.namedItem("message") as HTMLTextAreaElement).value,
      // keep it non-PII: no names, no emails, no phone numbers
      ts: new Date().toISOString()
    };
    console.log("Data:", data);
    try {
      const res = await axios.post("https://4rcjfh4rx8.execute-api.us-east-1.amazonaws.com/submit", data, {
        headers: { "Content-Type": "application/json" }
      });
      
      if (res.status === 200) console.log("Form submitted successfully");
      setStatus("ok");
      form.reset();
    } catch (e) {
      setStatus("err");
      console.error(e);
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-xl font-semibold">Simple POC Intake (Client Document)</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="border p-2 w-full"
          pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
          title="Please enter a valid email address"
          required
        />
        <input name="client_name" placeholder="Client Name" className="border p-2 w-full" required />
        <input name="client_short_name" placeholder="Client Short Name" className="border p-2 w-full" required />
        <input name="client_address" placeholder="Client Address" className="border p-2 w-full" required />
        <input name="industry" placeholder="Industry" className="border p-2 w-full" required />
        <input name="software_Used" placeholder="Software Used" className="border p-2 w-full" required />
        <input name="productInterest" placeholder="What are you interested in?" className="border p-2 w-full" required />
        <textarea name="message" rows={5} placeholder="Optional notes" className="border p-2 w-full" />
        <button className="border px-4 py-2">{status === "sending" ? "Sending..." : "Submit"}</button>
        {status === "ok" && <p className="text-green-700">Thanks — saved & emailed.</p>}
        {status === "err" && <p className="text-red-700">Something went wrong.</p>}
      </form>
      <p className="text-xs text-gray-500">We do not collect personal identifiers in this demo.</p>

      {/* Floating Chat Button */}
      <button
        aria-label={chatOpen ? "Close chat" : "Open chat"}
        onClick={() => setChatOpen((v) => !v)}
        className="fixed bottom-5 right-5 inline-flex h-12 w-12 items-center justify-center rounded-full border bg-white shadow-lg hover:bg-gray-50"
      >
        {/* Chat bubble icon */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
          <path d="M12 3c-4.97 0-9 3.582-9 8 0 1.96.76 3.76 2.05 5.17-.13 1.09-.53 2.56-1.5 3.83 1.85-.35 3.32-.98 4.31-1.53C9.02 18.81 10.47 19 12 19c4.97 0 9-3.58 9-8s-4.03-8-9-8z" />
        </svg>
      </button>

      {/* Chat Window */}
      {chatOpen && (
        <div className="fixed bottom-20 right-5 w-[22rem] max-w-[calc(100vw-2.5rem)] overflow-hidden rounded-2xl border bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b px-3 py-2">
            <div>
              <p className="text-sm font-semibold">AI Assistant</p>
              <p className="text-xs text-gray-500">Ask about this form or your project</p>
            </div>
            <button
              className="rounded p-1 text-gray-600 hover:bg-gray-100"
              aria-label="Close chat"
              onClick={() => setChatOpen(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 11-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto px-3 py-2 text-sm" role="log" aria-live="polite">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={
                    "mb-2 inline-block max-w-[85%] rounded-2xl px-3 py-2 " +
                    (m.role === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900")
                  }
                >
                  <p>{m.content}</p>
                  <span className="mt-1 block text-[10px] opacity-60">{new Date(m.ts).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleChatSend} className="flex items-center gap-2 border-t px-2 py-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 rounded-full border px-3 py-2 text-sm outline-none focus:ring-2"
            />
            <button
              type="submit"
              className="rounded-full border px-3 py-2 text-sm hover:bg-gray-50"
              aria-label="Send message"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </main>
  );
}