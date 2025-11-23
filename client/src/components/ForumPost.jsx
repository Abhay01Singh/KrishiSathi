import React, { useState, useEffect, useRef } from "react";
import { useAppContext } from "../context/AppContext";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { API_URL } from "../utils/api";

const socket = io(API_URL);

function ForumChat() {
  const { user, setUser, axios } = useAppContext();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const endRef = useRef(null);

  // Auto-generate username only once
  useEffect(() => {
    if (!user) {
      setUser({ name: `Farmer${Math.floor(Math.random() * 1000)}` });
    }
  }, [user, setUser]);

  // Load messages + socket listener
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await axios.get("/api/forum/messages");
        setMessages(res.data);
      } catch (err) {
        console.error("Error loading messages", err);
      }
    };

    loadMessages();

    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));

    return () => socket.off("receiveMessage");
  }, [axios]);

  // Auto-scroll
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return toast.error("Message cannot be empty");

    const msg = {
      sender: user.name,
      text,
      timestamp: new Date(),
    };

    socket.emit("sendMessage", msg);

    try {
      await axios.post("/api/forum/messages", msg);
    } catch (err) {
      console.error("Error saving message", err);
    }
    setText("");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-green-50 via-green-100 to-green-200 p-4">
      <div className="max-w-2xl w-full bg-white/90 rounded-3xl shadow-2xl p-8">
        <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-2 justify-center">
          <span className="text-green-600">🌱</span> Farming Forum Chat
          <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
            {user?.name}
          </span>
        </h1>

        {/* Messages */}
        <div className="border-2 border-green-100 rounded-2xl bg-green-50/60 h-96 overflow-y-auto p-4 mb-6 shadow-inner scroll-smooth">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-green-600">
              <span className="text-6xl mb-4">💬</span>
              <p className="text-lg font-medium">
                No messages yet. Be the first to say hi!
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`mb-4 p-3 rounded-xl max-w-[75%] ${
                m.sender === user?.name
                  ? "bg-green-200 ml-auto shadow-sm"
                  : "bg-white shadow"
              }`}>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-green-700">{m.sender}</span>
                <span className="text-xs text-gray-400">
                  {new Date(m.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="text-gray-800">{m.text}</p>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="flex gap-3 mt-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type your message and press Enter..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-green-200 bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow"
          />
          <button
            onClick={sendMessage}
            className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-md transition">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForumChat;
