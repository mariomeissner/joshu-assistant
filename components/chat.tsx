"use client";

import { Message, useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { systemPrompt } from "./systemPrompt";

const mockMessages = [
  { id: "0", role: "system", content: systemPrompt },
  { id: "1", role: "assistant", content: "Hello, how can I help you?" },
];

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages: mockMessages as Message[],
  });

  return (
    <div className="fixed inset-x-0 bottom-0 p-4">
      <Card className="w-full max-w-2xl mx-auto border-gray-200">
        <CardContent className="p-4 space-y-4">
          {messages.filter((message) => message.role != "system").map((message) => (
            <div key={message.id} className="flex items-start space-x-4">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${message.role === "user"
                  ? "bg-gray-200 text-gray-600"
                  : "bg-gray-600 text-gray-200"
                  }`}
                aria-label={message.role === "user" ? "User" : "AI"}
              >
                {message.role === "user" ? "U" : "AI"}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm text-gray-800">{message.content}</p>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSubmit} className="flex w-full space-x-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1 border-gray-300 focus:border-gray-500 focus:ring-gray-500"
            />
            <Button
              type="submit"
              className="bg-gray-800 text-white hover:bg-gray-700"
            >
              Send
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
