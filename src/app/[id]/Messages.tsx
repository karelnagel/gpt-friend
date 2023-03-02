"use client";

import type { Chat, Message, Person } from "@prisma/client";
import type { FormEventHandler } from "react";
import { useState } from "react";

export const Messages = ({
  chat,
}: {
  chat: Chat & { messages: Message[]; person: Person };
}) => {
  const [messages, setMessages] = useState(chat.messages);
  const [input, setInput] = useState("");
  const submit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!input) return;
  };
  return (
    <>
      <div className="h-full">
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div
              key={message.id}
              className={`chat ${isUser ? "chat-end" : "chat-start"}`}
            >
              {!isUser && (
                <div className="chat-image avatar">
                  <img
                    alt="sender"
                    className="w-10 rounded-full"
                    src={chat.person.image}
                  />
                </div>
              )}
              <div className="chat-header">
                {isUser ? "You" : chat.person.name}
                <time className="text-xs opacity-50">12:45</time>
              </div>
              <div
                className={`chat-bubble ${isUser ? "chat-bubble-primary" : ""}`}
              >
                {message.content}
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={submit} className="flex items-center space-x-3">
        <input
          type="text"
          placeholder="Type a message"
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">
          <SendIcon />
        </button>
      </form>
    </>
  );
};

const SendIcon = () => {
  return (
    <svg height="24px" viewBox="0 0 24 24" width="24px">
      <path
        className="fill-primary"
        d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
        data-darkreader-inline-fill=""
      ></path>
    </svg>
  );
};
