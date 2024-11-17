"use client";

import ChatPage from "@/components/chat";
import { systemPrompt } from "@/components/systemPrompt";
import { Message } from "ai/react";
import React from "react";

const initialMessages = [
  { id: "0", role: "system", content: systemPrompt },
  {
    id: "1",
    role: "assistant",
    content: "Hello! How can I help you today?",
  },
  {
    id: "2",
    role: "user",
    content:
      'Hi, \nI\'ve received the following email. What should I do? \n\n"I’m checking that everything is OK for the next shipment.\nI hope there won’t be any problems with box sizes."',
  },
] as Message[];

export default function TanakaPage() {
  const [messages, setMessages] = React.useState(initialMessages);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        ...initialMessages,
        {
          id: "3",
          role: "assistant",
          content: "We need to use boxes of smaller sizes.",
        },
      ]);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <>
      <ChatPage mockMessages={messages} />
    </>
  );
}
