// components/InfoHub.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X, Info } from "lucide-react";
import { useWallets } from "../context/WalletProvider";

export default function InfoHub() {
  const { address, isConnected, connectWallet } = useWallets();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: "1", role: "assistant", content: "Hi, I'm Kuhle, your AI assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Toggle Chat Visibility
  const toggleChatbot = () => setIsOpen((prev) => !prev);

  // Scroll to latest message when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle AI Requests
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Identify if it's a Web3-related query (transaction or wallet keywords)
      const isWeb3Query = input.toLowerCase().includes("transaction") || input.toLowerCase().includes("wallet");
     

      // Use the Nebula API route (which is now configured for Celo Mainnet) for Web3 queries
      const response = await fetch("/api/nebula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, walletAddress: address || null }),
      });

      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: data.response },
      ]);
    } catch (error) {
      console.error("AI Request Error:", error);
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: "Oops! Something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", zIndex: 50 }}>
      {/* Chat Button */}
      <button
        onClick={toggleChatbot}
        className={`fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transition-all duration-300 hover:scale-105 ${
          isOpen ? "scale-0 opacity-0" : "scale-100 opacity-100"
        } animate-float`}
        aria-label="Open chat"
      >
        <Info className="h-6 w-6" />
      </button>

      {/* Chat Popup */}
      {isOpen && (
        <div
          className="fixed inset-x-0 bottom-0 mx-auto max-w-md rounded-t-2xl bg-white shadow-2xl"
          style={{ maxHeight: "90vh", zIndex: 51 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500 to-blue-600">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Kuhle</h3>
                <p className="text-xs text-gray-500">AI Assistant</p>
              </div>
            </div>
            <button onClick={toggleChatbot} className="rounded-full p-2 text-gray-500 hover:bg-gray-100" aria-label="Close chat">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[60vh] overflow-y-auto bg-gray-50 p-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
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
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.2s" }}></div>
                      <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-100 bg-white p-4">
            {!isConnected ? (
              <button
                onClick={connectWallet}
                className="w-full rounded-full bg-blue-500 py-2 text-white shadow-md transition hover:bg-blue-600"
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
                  className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Animation */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 20px; }
      `}</style>
    </div>
  );
}
