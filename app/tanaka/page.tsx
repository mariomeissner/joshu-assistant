import ChatPage from "@/components/chat";
import { systemPrompt } from "@/components/systemPrompt";
import { Message } from "ai/react";

const tanakaInitialMessages = [
  { id: "0", role: "system", content: systemPrompt },
  {
    id: "1",
    role: "assistant",
    content: "How can I help you about Tanaka-san's work?",
  },
] as Message[];

export default function TanakaPage() {
  return (
    <>
      <ChatPage initialMessages={tanakaInitialMessages} />
    </>
  );
}
