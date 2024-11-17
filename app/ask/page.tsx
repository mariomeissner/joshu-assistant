"use client";

import ChatPage from "@/components/chat";
import React from "react";

const mockInput =
  'Hi, \nI\'ve received the following email. What should I do? \n\n"I’m checking that everything is OK for the next shipment.\nI hope there won’t be any problems with box sizes."';

export default function AskPage() {
  return (
    <>
      <ChatPage mockInput={mockInput} />
    </>
  );
}
