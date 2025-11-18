// app/chatgpt/page.tsx
"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import Sidebar from "@/components/sidebar";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function ChatGptPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi, I’m your Planora travel assistant. Ask me anything about trips, destinations, or travel planning. ✈️🌍",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    setError(null);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => null);
        console.error("API error:", errJson || res.statusText);
        setError(
          (errJson && errJson.error) ||
            `Request failed (status ${res.status})`
        );
        return;
      }

      const data: { reply: string } = await res.json();

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      setError("Something went wrong while talking to ChatGPT.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Left sidebar like other pages */}
      <Sidebar currentPath="/chatgpt" />

      <main className="ml-64 p-8 flex flex-col h-screen">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Planora ChatGPT
          </h1>
          <p className="text-sm text-gray-500">
            Ask questions about destinations, trips, hotels, flights, and more.
          </p>
        </div>

        {/* Chat card */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-4 sm:p-6 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex max-w-[80%] gap-3">
                    {m.role === "assistant" && (
                      <div className="mt-1 hidden sm:block">
                        <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-semibold">
                          AI
                        </div>
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm transition-transform ${
                        m.role === "user"
                          ? "bg-emerald-500 text-white rounded-br-sm hover:scale-[1.01]"
                          : "bg-gray-100 text-gray-900 rounded-bl-sm hover:scale-[1.01]"
                      }`}
                    >
                      {m.content}
                    </div>

                    {m.role === "user" && (
                      <div className="mt-1 hidden sm:block">
                        <div className="h-8 w-8 rounded-full bg-gray-700 text-white flex items-center justify-center text-sm font-semibold">
                          U
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="flex max-w-[80%] gap-3">
                    <div className="mt-1 hidden sm:block">
                      <div className="h-8 w-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-semibold">
                        AI
                      </div>
                    </div>
                    <div className="rounded-2xl px-4 py-3 text-sm bg-gray-100 text-gray-800 rounded-bl-sm shadow-sm">
                      <span className="inline-flex items-center gap-2">
                        Thinking
                        <span className="flex gap-1">
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.2s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce [animation-delay:-0.1s]" />
                          <span className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Error message (inside card, above input) */}
            {error && (
              <div className="mt-3 text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </div>
            )}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="mt-4 flex items-end gap-2 border-t border-gray-200 pt-4"
            >
              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Send a message about your next trip…"
                className="flex-1 resize-none bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent max-h-32"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    // call with a fake event only if not loading
                    if (!isLoading && input.trim()) {
                      handleSubmit(
                        // @ts-expect-error – synthetic submit from keydown
                        { preventDefault: () => {} }
                      );
                    }
                  }
                }}
              />

              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-sm"
              >
                {isLoading ? "Sending…" : "Send"}
              </button>
            </form>
          </div>

          <p className="mt-2 text-[11px] text-gray-400 text-center">
            Planora uses OpenAI. Messages may be used to improve our models.
          </p>
        </div>
      </main>
    </div>
  );
}
