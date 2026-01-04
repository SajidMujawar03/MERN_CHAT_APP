import React from "react";
import type { Message } from "../miscelleneous/SingleChat";
import useUser from "../../store/userStore";
import "./MessageComponent.css";

type MessageComponentProps = {
  messages: Message[];
  messageEndRef: React.RefObject<HTMLDivElement | null>;
  isTyping: boolean;
};

const MessageComponent: React.FC<MessageComponentProps> = ({
  messages,
  messageEndRef,
  isTyping,
}) => {
  const { user } = useUser();

  return (
    <div className="h-[525px] overflow-y-auto w-full flex flex-col-reverse gap-2 px-2">
      <div className="flex flex-col gap-2">
        {messages.map((msg, index) => {
          const isCurrentUser = msg.sender._id === user?._id;
          const nextMsg = messages[index + 1];
          const showName =
            !isCurrentUser && (!nextMsg || nextMsg.sender._id !== msg.sender._id);

          return (
            <div
              key={msg._id}
              className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[75%]`}>
                {/* Show name only for other users at the last message in sequence */}
                {showName && !isCurrentUser && (
                  <span className="block text-sm text-gray-500">
                    {msg.sender.name}
                  </span>
                )}

                {/* Message bubble */}
                <span
                  className={`block px-3 py-1 rounded-lg break-words 
                    ${isCurrentUser ? "bg-blue-100 text-blue-500" : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"}`}
                >
                  {msg.content}
                </span>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="text-left dark:text-white text-gray-700 text-sm italic">
            typing...
          </div>
        )}

        <div ref={messageEndRef}></div>
      </div>
    </div>
  );
};

export default MessageComponent;
