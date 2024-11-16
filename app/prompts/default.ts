import { Message } from "ai/react";

export const defaultSystemPrompt = `
You are an AI assistant that helps users with their questions.
How can I help you today?
`;

export const defaultInitialMessages = [
  { id: "0", role: "system", content: defaultSystemPrompt },
  {
    id: "1",
    role: "assistant",
    content: "Hello! How can I help you today?",
  },
] as Message[];
