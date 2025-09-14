import React, { useEffect, useMemo, useRef, useState } from "react";
import { FaUserCircle, FaRobot } from "react-icons/fa";

const API_BASE = "http://localhost:8000";

type Message = {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
};

type ApiResponse = {
  answer: string;
  sources?: string[];
};

const COMMON_QUESTIONS = [
  "What schemes are available for students?",
  "How to apply for a pension?",
  "Eligibility for health insurance?",
  "Subsidy schemes for farmers?",
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({
      top: listRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const canSend = useMemo(
    () => input.trim().length > 0 && !loading,
    [input, loading]
  );

  const send = async (question?: string) => {
    const userQuestion = question ?? input.trim();
    if (!userQuestion) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userQuestion }]);
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });

      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const data: ApiResponse = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer,
          sources:
            data.sources && data.sources.length > 0
              ? data.sources
              : undefined,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `⚠️ Error: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-5 flex flex-col rounded-t-3xl">
          <div className="text-2xl font-bold">SchemesConnect</div>
          <div className="text-sm font-light text-blue-100 mt-1">
            Your one-stop portal for government schemes & citizen services
          </div>
        </div>

        {/* Common Questions */}
        <div className="p-4 bg-gray-50 border-b flex flex-wrap gap-3">
          {COMMON_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => send(q)}
              className="px-5 py-2 bg-blue-100 text-blue-800 rounded-full font-medium hover:bg-blue-200 transition-all duration-200 shadow-sm"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
          style={{ minHeight: "550px" }}
        >
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {/* Assistant Avatar */}
              {msg.role === "assistant" && (
                <div className="flex-shrink-0 text-2xl">
                  <FaRobot className="text-gray-600" />
                </div>
              )}

              {/* Message Bubble */}
              <div
                className={`px-5 py-3 rounded-3xl max-w-[75%] break-words shadow-md ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                {msg.content}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-2 text-xs text-gray-700 flex flex-wrap gap-1">
                    {msg.sources.map((s, j) => (
                      <span
                        key={j}
                        className="inline-block px-2 py-0.5 bg-gray-300 rounded-full text-gray-800"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* User Avatar */}
              {msg.role === "user" && (
                <div className="flex-shrink-0 text-2xl">
                  <FaUserCircle className="text-blue-600" />
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center gap-3 justify-start">
              <FaRobot className="text-gray-600 text-2xl" />
              <div className="flex space-x-1">
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-600 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (canSend) send();
          }}
          className="flex p-4 border-t bg-white items-center gap-3"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={1}
            placeholder="Type a message..."
            className="flex-1 resize-none border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (canSend) send();
              }
            }}
          />
          <button
            type="submit"
            disabled={!canSend}
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            Send
          </button>
        </form>

        {/* Disclaimer */}
        <div className="text-xs text-gray-400 text-center py-2">
          *SchemesConnect assistant may make mistakes. Always verify important information.
        </div>
      </div>
    </div>
  );
}
