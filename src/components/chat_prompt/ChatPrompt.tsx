import React, { useEffect } from "react";
import "./ChatPrompt.scss";

interface ChatPromptProps {
  onConfirm: () => void;
}

const ChatPrompt: React.FC<ChatPromptProps> = ({ onConfirm }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        onConfirm();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onConfirm]);

  return (
    <div className="chat-prompt-bubble" onClick={onConfirm}>
      <p>トークを始めますか？</p>
      <span>(Enter / クリックで開始)</span>
    </div>
  );
};

export default ChatPrompt;
