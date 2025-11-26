"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send } from "lucide-react";
import { useWallets } from "../context/WalletProvider";

export default function AIPage() {
  const { address, isConnected, connectWallet } = useWallets();
  const [messages, setMessages] = useState([
    {
      id: "1",
      role: "assistant",
      content: "Hi, I'm Kuhle, your AI assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = address || "guest";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/nebula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, walletAddress: address || userId }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
        },
      ]);
    } catch (error) {
      console.error("AI Request Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Oops! Something went wrong.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="flex flex-col items-center justify-center border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-6">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 mb-3">
          <MessageCircle className="h-8 w-8 text-white" />
        </div>
        <div className="text-center">
          <h3 className="font-semibold text-gray-800 text-lg">Kuhle</h3>
          <p className="text-sm text-gray-500">Your AI Assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                    : "bg-white text-gray-800 shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-2xl bg-white px-4 py-3 shadow-sm">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-gray-400"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 bg-white p-4 pb-6">
        {!isConnected ? (
          <button
            onClick={connectWallet}
            className="w-full rounded-full bg-blue-500 py-3 text-white shadow-md transition hover:bg-blue-600"
          >
            Connect Wallet to Chat
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white disabled:opacity-50 flex items-center justify-center"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
