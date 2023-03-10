"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";
import { UserImage } from "~/components/UserImage";
import { defaultPrompt } from "~/config";
import type { Message } from "~/types";

type Person = {
  name: string;
  image: string;
  id: string;
  prompt: string;
};

export const Messages = ({
  messages: startMessages,
  person,
}: {
  messages: Message[];
  person: Person;
}) => {
  const [messages, setMessages] = useState(startMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input || loading) return;

    setLoading(true);
    setMessages((m) => [
      ...m,
      {
        chatId: "",
        content: input,
        id: "",
        createdAt: new Date(),
        role: "user",
      },
    ]);
    router.refresh();
    setInput("");
    try {
      const res = await fetch(`/chat/${person.id}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          personId: person.id,
        }),
      });
      setMessages((m) => [...m, { role: "assistant", content: "" }]);
      const reader = res.body?.getReader();
      if (!reader) return;

      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunkValue = decoder.decode(value);
        console.log(chunkValue);
        setMessages((m) => {
          const last = m[m.length - 1];
          const others = m.slice(0, -1);
          return [
            ...others,
            { role: "assistant", content: (last?.content || "") + chunkValue },
          ];
        });
      }
    } catch (e) {
      console.log(e);
    }
    router.refresh();
    setLoading(false);
  };
  return (
    <>
      <div className="relative my-3 h-full">
        <div className="absolute top-0 flex h-full w-full flex-col-reverse overflow-y-auto px-3">
          {!messages.length && (
            <div className="flex h-full items-center justify-center">
              <div className=" flex w-full flex-col items-center space-y-3">
                <p className="text-xl">Prompt</p>
                <textarea
                  className="min-h-[140px] w-full max-w-lg rounded-lg bg-base-300 p-3"
                  value={person.prompt || defaultPrompt(person.name)}
                  readOnly
                />
              </div>
            </div>
          )}
          {[...messages].reverse().map((message, i) => {
            const isUser = message.role === "user";
            const texts = message.content.match(
              /([^\.!\?]+[\.!\?]+)|([^\.!\?]+$)/g
            ) || [message.content];
            console.log(texts);
            return (
              <div
                key={i}
                className={`flex items-end space-x-2 ${
                  isUser ? " ml-10 justify-end text-right" : " mr-10 "
                }`}
              >
                {!isUser && (
                  <UserImage image={person.image} className="h-6 md:h-8" />
                )}
                <div
                  className={`flex flex-col space-y-1 ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  <div className="text-xs opacity-80">
                    {isUser ? "You" : person.name}
                  </div>
                  {texts?.map((text, i) => {
                    const big = "16px";
                    const small = "7px";
                    const isLast = i === texts.length - 1;
                    const isFirst = i === 0;

                    const lt = isUser ? big : isFirst ? big : small;
                    const lb = isUser ? big : isLast ? big : small;

                    const rt = isUser ? (isFirst ? big : small) : big;
                    const rb = isUser ? (isLast ? big : small) : big;

                    return (
                      <div
                        key={i}
                        style={{ borderRadius: `${lt} ${rt} ${rb} ${lb}` }}
                        className={`py-2 px-3 text-[16px] ${
                          isUser ? "bg-primary" : "bg-base-300"
                        }`}
                      >
                        {text}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <form
        onSubmit={(e) => void submit(e)}
        className="flex items-center space-x-3 p-3 pt-0"
      >
        <input
          type="text"
          placeholder="Type a message"
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="text-primary disabled:text-base-content"
          disabled={loading}
        >
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
        fill="currentColor"
        d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,11.0605983 22.3423792,10.4322088 21.714504,10.118014 L4.13399899,1.16346272 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z"
        data-darkreader-inline-fill=""
      ></path>
    </svg>
  );
};
