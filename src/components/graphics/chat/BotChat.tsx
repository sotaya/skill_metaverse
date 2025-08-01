import React from "react";
import "./BotChat.scss";

interface BotChatProps {
  onClose: () => void;
}

const BotChat: React.FC<BotChatProps> = ({ onClose }) => {
  return (
    <div className="bot-chat-bubble">
      <button className="bot-chat-close-button" onClick={onClose}>
        ×
      </button>
      <div className="bot-chat-content">
        <p>こんにちは！何かプログラミングで気になることはありますか？</p>
      </div>
    </div>
  );
};

export default BotChat;
