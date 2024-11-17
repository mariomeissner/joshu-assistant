"use client";

import { Message, useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useRef, useState } from "react";
import styles from "@/components/chat.module.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";
import { systemPrompt } from "@/components/systemPrompt";

interface ChatPageProps {
  isScreenshotDemo?: boolean;
  mockInput?: string;
}

export default function ChatPage({
  isScreenshotDemo = false,
  mockInput,
}: ChatPageProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState<string>("");

  const initialMessages = getInitialMessages(isScreenshotDemo, knowledgeBase);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    initialMessages,
  });
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (mockInput) {
      handleInputChange({
        target: { value: mockInput },
      } as React.ChangeEvent<HTMLTextAreaElement>);
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      (messagesEndRef.current as HTMLDivElement).scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setIsAnalyzing(true);
    const formData = new FormData();
    Array.from(e.target.files).forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await fetch(
        "https://screenshot-thing-production.up.railway.app/analyze-image",
        {
          method: "POST",
          body: formData,
          credentials: "omit",
          headers: {
            Accept: "application/json",
          },
        }
      );
      const data = await response.json();
      if (data.status === "success") {
        setKnowledgeBase(data.summary);
      }
      setIsAnalyzing(false);
    } catch (error) {
      console.error("Error analyzing images:", error);
    }
  };

  const chatEnabled = !isScreenshotDemo || knowledgeBase;

  return (
    <div className="fixed inset-0 flex flex-col items-center p-6 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <h1 className="text-4xl font-bold mb-2 text-purple-800">Joshu</h1>
      <div className="flex flex-row gap-4">
        <Link
          href="/"
          className={`text-sm ${
            pathname === "/"
              ? "text-purple-800 font-semibold pointer-events-none"
              : "text-purple-600 hover:text-purple-800 underline"
          } mb-6`}
        >
          New employee onboarding
        </Link>
        <Link
          href="/screenshots"
          className={`text-sm ${
            pathname === "/screenshots"
              ? "text-purple-800 font-semibold pointer-events-none"
              : "text-purple-600 hover:text-purple-800 underline"
          } mb-6`}
        >
          Screenshot demo
        </Link>
        <Link
          href="/knowledge"
          className={`text-sm ${
            pathname === "/knowledge"
              ? "text-purple-800 font-semibold pointer-events-none"
              : "text-purple-600 hover:text-purple-800 underline"
          } mb-6`}
        >
          Joshu knowledge base
        </Link>
      </div>
      <div className="w-full max-w-2xl flex-1 flex flex-col h-full">
        <CardContent className="p-6 space-y-6 flex-1 overflow-y-auto max-h-full">
          {messages
            .filter((message) => message.role != "system")
            .map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-4 ${styles.fadeIn}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-400 to-blue-600 text-white"
                      : "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                  } shadow-md`}
                  aria-label={message.role === "user" ? "User" : "AI"}
                >
                  {message.role === "user" ? "U" : "ジョ"}
                </div>
                <div className="flex-1 bg-white p-4 rounded-xl shadow-sm">
                  <p className="text-base text-gray-900 whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
              </div>
            ))}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="p-4 border-gray-200 sticky bottom-0 bg-transparent">
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center space-x-3"
          >
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={handleInputChange}
              disabled={!chatEnabled}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 border-0 focus:ring-0 rounded-xl px-4 py-2 shadow-sm bg-white/80 resize-none overflow-y-auto"
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
      {isScreenshotDemo && (
        <div className="mb-4">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="screenshot-upload"
          />
          <label
            htmlFor="screenshot-upload"
            className="cursor-pointer bg-white/80 hover:bg-white px-4 py-2 rounded-full shadow-sm text-purple-600"
          >
            Upload Screenshots
          </label>
          {isAnalyzing && (
            <div className="mt-2 flex items-center gap-2 text-purple-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              Analyzing screenshots...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const getInitialMessages = (
  isScreenshotDemo: boolean,
  knowledgeBase: string
) => {
  let initialMessages: Message[] = [];
  if (isScreenshotDemo) {
    initialMessages = [
      {
        id: "0",
        role: "system",
        content: `You are an assistant that helps onboarding a new employee. You know everything about the past employee. You have access to their activities and the files. Help the new employe take appropriate actions based on the actions of past employees. Keep your answer very concise within one paragraph.

Here are past activities of more experienced employees
${knowledgeBase}

Now, answer questions of the new employee.
Add a short explanation to your answer, referring to the past activities.`,
      },
      {
        id: "1",
        role: "assistant",
        content: "Ask me anything about your uploaded screenshots.",
      },
    ];
  } else {
    initialMessages = [
      {
        id: "0",
        role: "system",
        content: systemPrompt,
      },
      {
        id: "1",
        role: "assistant",
        content: "How can I help you about your work?",
      },
    ];
  }
  return initialMessages;
};
