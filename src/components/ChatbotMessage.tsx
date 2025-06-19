// src/components/ChatbotMessage.tsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCheck, Check, Printer } from "lucide-react";
import FeedbackButtons from "./FeedbackButtons";
import { Message } from "../types/chatbot";

// ChatbotAvatar Component (re-used from Chatbot.tsx for modularity)
interface ChatbotAvatarProps {
  isBotMessage: boolean;
}

const ChatbotAvatar: React.FC<ChatbotAvatarProps> = ({ isBotMessage }) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex-shrink-0 w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br ${
        isBotMessage
          ? "from-green-500 to-green-800"
          : "from-gray-500 to-gray-700"
      }`}
    >
      {isBotMessage ? (
        <div className="h-full w-full flex items-center justify-center text-white text-xs font-bold">
          <Printer className="h-4 w-4" />
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center text-white text-xs font-bold">
          You
        </div>
      )}
    </motion.div>
  );
};

interface ChatbotMessageProps {
  message: Message;
  isLastMessage: boolean;
  sessionId?: string;
}

const ChatbotMessage: React.FC<ChatbotMessageProps> = ({
  message,
  isLastMessage,
  sessionId,
}) => {
  const isUserMessage = message.sender === "user";

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 300,
        damping: 24,
      }}
      className={`mb-3 flex ${isUserMessage ? "justify-end" : "justify-start"}`}
    >
      {!isUserMessage && (
        <div className="mr-2 mt-1">
          <ChatbotAvatar isBotMessage={true} />
        </div>
      )}
      <div
        className={`max-w-[75%] flex flex-col ${
          isUserMessage ? "items-end" : "items-start"
        }`}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`px-3 py-2 rounded-lg shadow-sm ${
            isUserMessage
              ? "bg-blue-600 text-white rounded-br-none"
              : "bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 text-gray-800 dark:text-white rounded-bl-none"
          }`}
        >
          {message.hasImage && message.imageUrl && (
            <div className="mb-2">
              <img
                src={message.imageUrl}
                alt={message.imageName || "Uploaded image"}
                className="max-w-full h-auto rounded-md"
                style={{ maxHeight: '150px' }}
                loading="lazy"
              />
              {message.imageName && (
                <p className="text-xs mt-1 opacity-75">{message.imageName}</p>
              )}
            </div>
          )}
          <p className="text-xs break-words">{message.text}</p>
        </motion.div>

        {/* Add feedback buttons for bot messages with image analysis */}
        {!isUserMessage && (message.hasImage || message.imageAnalysis) && (
          <FeedbackButtons
            messageId={message.id}
            userQuery={message.text} // Assuming bot response is related to user's query
            aiResponse={message.text}
            imageUrl={message.imageUrl}
            sessionId={sessionId}
          />
        )}

        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
          <span className="mr-1">{formatTime(message.timestamp)}</span>
          {isUserMessage && isLastMessage && (
            <span className="flex items-center">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <CheckCheck className="h-3 w-3 text-blue-500" />
              </motion.span>
            </span>
          )}
          {isUserMessage && !isLastMessage && (
            <Check className="h-3 w-3 text-gray-400" />
          )}
        </div>
      </div>
      {isUserMessage && (
        <div className="ml-2 mt-1">
          <ChatbotAvatar isBotMessage={false} />
        </div>
      )}
    </motion.div>
  );
};

export default ChatbotMessage;