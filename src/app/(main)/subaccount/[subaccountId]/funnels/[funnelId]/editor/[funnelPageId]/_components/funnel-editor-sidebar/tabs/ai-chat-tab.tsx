"use client";

import { FunnelPage } from "@prisma/client";
import { ArrowUpIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useEditor } from "@/providers/editor/editor-provider";

interface Message {
  content: string;
  role: "user" | "assistant" | "system" | "tool" | string;
  id?: string;
  createdAt?: string;
}

interface Props {
  funnelId: string;
  funnelPageDetails: FunnelPage;
  subaccountId: string;
}

const systemMessage = `
You are an intelligent assistant integrated into a drag-and-drop editor interface. Your primary purpose is to help users with contextual, accurate, and actionable suggestions based on the editor's current state, which is provided as JSON data from messages with the role "tool".

Guidelines for your behavior:
1. Be concise and clear in your responses.
2. Prioritize helpfulness and relevance to the user's query.
3. When referencing the editor context, use the JSON data from the "tool" role to infer details about the current state.
4. Do not make assumptions about the editor state without explicitly provided data.
5. If the user asks for guidance, explanations, or examples, provide detailed and structured assistance.
6. Maintain a professional tone and focus on enhancing the user's productivity.
7. Never answer in JSON explain what the user neeeds to do.
8. Never give unnecessary data such the id of a component the human user will never see.

Your role is to enhance the user's experience by providing insights, answering questions, and assisting with tasks related to the editor and its content. Only respond to direct user input or context derived from the "tool" role.
`;

export default function ChatPage({
  subaccountId,
  funnelPageDetails,
  funnelId,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: systemMessage,
    },
  ]);
  const [userInput, setUserInput] = useState("");
  const { state } = useEditor();

  useEffect(() => {
    const storedMessages = localStorage.getItem(
      `${subaccountId}-${funnelId}-${funnelPageDetails.pathName}`,
    );
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    }
  }, []);

  useEffect(() => {
    if (!state.editor.elements) return;
    const editorContextMessage = {
      role: "tool",
      content: JSON.stringify(state.editor.elements),
    };

    setMessages((prevMessages) => {
      const updatedMessages = prevMessages.filter((msg) => msg.role !== "tool");
      return [...updatedMessages, editorContextMessage];
    });
  }, [state]);

  useEffect(() => {
    localStorage.setItem(
      `${subaccountId}-${funnelId}-${funnelPageDetails.pathName}`,
      JSON.stringify(messages),
    );
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMessages = [...messages, { role: "user", content: userInput }];
    setMessages(newMessages);
    setUserInput("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error("Error fetching AI response");
      }

      const updatedMessages = await response.json();
      setMessages(updatedMessages);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const header = (
    <header className="flex flex-col gap-5 text-center justify-center h-full">
      <h1 className="text-2xl font-semibold leading-none tracking-tight">
        Chat with AI
      </h1>
      <p className="text-muted-foreground text-sm">
        This is an AI integrated with the editor. You can chat with it.
      </p>
    </header>
  );

  const messageList = (
    <div className="my-2 flex h-fit min-h-full flex-col gap-2">
      {messages
        .filter((message) => message.role !== "tool")
        .filter((message) => message.role !== "system")
        .map((message, index) => (
          <div
            key={index}
            data-role={message.role}
            className="max-w-[80%] rounded-xl px-3 py-2 text-sm data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 data-[role=user]:bg-blue-500 data-[role=assistant]:text-black data-[role=user]:text-white"
          >
            {message.content}
          </div>
        ))}
    </div>
  );

  return (
    <div
      className={cn(
        "flex flex-col h-full w-full max-w-[325px] justify-between",
      )}
    >
      <div className="grow overflow-y-auto px-2">
        {messages.length > 2 ? (
          messageList
        ) : (
          <div className="flex h-full items-center justify-center">
            {header}
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-0 flex gap-2 px-2 pb-[100px] dark:bg-slate-900 dark:text-white bg-white text-black"
      >
        <Textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
        />
        <Button type="submit" className="h-full flex flex-col">
          <ArrowUpIcon />
          Send
        </Button>
      </form>
    </div>
  );
}
