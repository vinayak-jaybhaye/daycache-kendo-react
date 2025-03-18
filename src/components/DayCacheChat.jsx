import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Input } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { Loader } from "@progress/kendo-react-indicators";
import { paperPlaneIcon } from "@progress/kendo-svg-icons";

import { Slide, Fade, Zoom, Reveal } from "@progress/kendo-react-animation";

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
    <div className="flex flex-col w-full h-full bg-gradient-to-br border rounded-xl from-rose-50 to-amber-50  shadow-2xl overflow-hidden transform transition-all duration-300 hover:shadow-2xl">
      {/* Animated Header */}
      <Fade transitionEnterDuration={500}>
        <div className="bg-[#FAFAFC] p-4  flex items-center justify-center">
          <h2 className="text-xl font-bold text-black flex items-center gap-3">
            <Zoom appear={true} transitionEnterDuration={500}>
              <span className="text-2xl">💬</span>
            </Zoom>
            <Slide appear={true} direction="up" transitionEnterDuration={500}>
              <span>DayCache Chat</span>
            </Slide>
          </h2>
        </div>
      </Fade>

      {/* Chat Messages Container */}
      <div ref={chatRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start gap-2 ${
              msg.sender === "user"
                ? "justify-start flex-row-reverse"
                : "justify-start"
            }`}
          >
            {/* Animated Avatar */}
            <Zoom appear={true} transitionEnterDuration={200}>
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full ${
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
            </Zoom>

            {/* Animated Message Bubble */}
            <Slide
              appear={true}
              transitionEnterDuration={250}
              transitionExitDuration={200}
              direction={msg.sender === "user" ? "right" : "left"}
              className="w-[70%]"
            >
              <div
                className={`max-w-[100%] p-3 rounded-lg text-sm ${
                  msg.sender === "user"
                    ? "bg-gradient-to-br from-rose-500 to-pink-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-800 shadow-md"
                }`}
              >
                <Reveal transitionEnterDuration={400}>
                  <div className="leading-relaxed">{msg.text}</div>
                </Reveal>
              </div>
            </Slide>
          </div>
        ))}

        {/* Animated Loading Indicator */}
        {loading && (
          <Fade transitionEnterDuration={300} transitionExitDuration={200}>
            <div className="flex justify-center pt-2">
              <Reveal transitionEnterDuration={400}>
                <div className="bg-gray-100 px-4 py-2 rounded-full shadow-md border border-gray-200">
                  <Loader
                    themeColor="primary"
                    size="small"
                    className="text-rose-500"
                  />
                </div>
              </Reveal>
            </div>
          </Fade>
        )}
      </div>

      {/* Animated Input Area */}
      <div className="p-4 border-t  border-rose-100 bg-white/50 backdrop-blur-sm">
        <div className="flex justify-between">
          <Input
            value={input}
            onChange={(e) => setInput(e.value)}
            placeholder="Type your message..."
          />
          <Slide direction="up" appear={true} transitionEnterDuration={300}>
            <Button
              themeColor="primary"
              onClick={handleSend}
              style={{ backgroundColor: "green", color: "whitesmoke" }}
              disabled={loading}
              svgIcon={paperPlaneIcon}
            ></Button>
          </Slide>
        </div>
      </div>
    </div>
  );
}

export default DayCacheChat;
