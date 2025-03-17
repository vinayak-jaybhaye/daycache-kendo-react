import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Loader } from "@progress/kendo-react-indicators";

function DayCacheChat() {
  const user = useSelector((state) => state.user.user);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  // Scroll to bottom when new message is added
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");

    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/${user.id}/cachechat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: input }),
          credentials: "include",
        }
      );

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();

      // Add AI's response to chat
      setMessages((prev) => [...prev, { text: data, sender: "ai" }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Failed to get response. Try again.", sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-18 right-14 flex flex-col w-96 h-[600px] bg-gradient-to-br from-rose-50 to-amber-50 border border-rose-100 rounded-2xl shadow-xl p-0 overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-rose-200 to-pink-200 p-4 border-b border-rose-100 flex items-center justify-evenly">
        <h2 className="text-xl font-bold text-rose-800 flex items-center gap-2">
          <span className="text-2xl">💬</span>
          DayCache Chat
        </h2>
      </div>

      {/* Chat Messages */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              msg.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div
              className={`w-7 h-7 flex items-center justify-center rounded-full ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-rose-400 to-pink-400"
                  : "bg-gradient-to-br from-amber-400 to-orange-400"
              }`}
            >
              {msg.sender === "user" ? (
                <span className="text-white text-sm">👤</span>
              ) : (
                <span className="text-white text-sm">🤖</span>
              )}
            </div>
            <div
              className={`max-w-[75%] p-3 rounded-2xl text-sm transition-all duration-200 ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-md"
                  : "bg-white text-gray-700 border border-amber-100 shadow-md"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-center pt-2">
            <div className="bg-white px-3 py-2 rounded-full shadow-sm border border-amber-100">
              <Loader
                themeColor="primary"
                size="small"
                className="text-rose-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-rose-100 bg-white/50 backdrop-blur-sm">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.value)}
            placeholder="Type your message..."
            className="flex-1 border-2 border-rose-100 rounded-xl p-2 text-sm focus:border-rose-200 focus:ring-0 placeholder:text-rose-300"
          />
          <Button
            themeColor="primary"
            onClick={handleSend}
            className={`rounded-xl px-4 transition-all ${
              loading
                ? "bg-rose-300 border-rose-300 cursor-not-allowed"
                : "bg-gradient-to-br from-rose-400 to-pink-400 hover:from-rose-500 hover:to-pink-500"
            }`}
            disabled={loading}
          >
            {loading ? "✈️..." : "Send"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DayCacheChat;
