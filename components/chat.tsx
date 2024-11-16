"use client";

import { Message, useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { systemPrompt } from "./systemPrompt";
import { useEffect, useRef } from "react";
import styles from "./chat.module.css";

const mockMessages = [
  { id: "0", role: "system", content: systemPrompt },
  { id: "1", role: "assistant", content: "Hello, how can I help you?" },
];

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: mockMessages as Message[],
  });
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLDivElement).scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="fixed inset-0 flex items-end justify-center p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <div className="w-full max-w-2xl">
        <CardContent className="p-6 space-y-6">
          {messages.filter((message) => message.role != "system").map((message) => (
            <div key={message.id} className={`flex items-start space-x-4 ${styles.fadeIn}`}>
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${message.role === "user"
                  ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                  : "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                  } shadow-md`}
                aria-label={message.role === "user" ? "User" : "AI"}
              >
                {message.role === "user" ? "U" : "AI"}
              </div>
              <div className="flex-1 bg-white p-4 rounded-xl shadow-sm">
                <p className="text-base text-gray-900">{message.content}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-t border-gray-200 bg-gradient-to-r from-purple-100 to-blue-100">
          <form onSubmit={handleSubmit} className="flex w-full items-center space-x-3">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 rounded-full px-4 py-2 shadow-sm bg-gradient-to-r from-white to-blue-50"
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 focus:ring focus:ring-pink-300 focus:ring-opacity-50 px-5 py-2 rounded-full shadow-md transition duration-300 ease-in-out"
            >
              Send
            </Button>
          </form>
        </CardFooter>
      </div>
    </div>
  );
}