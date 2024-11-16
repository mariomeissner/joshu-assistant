import ChatPage from "@/components/chat";
import { defaultInitialMessages } from "./prompts/default";

export default function Home() {
  return (
    <>
      <ChatPage initialMessages={defaultInitialMessages} />
    </>
  );
}
