import React from "react";
import "./Chat.scss";

interface ChatProps {
  userName: string;
  message?: string;
}

export const Chat: React.FC<ChatProps> = ({ userName, message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="chat-container">
      <div className="chat-display-bubble">
        <span className="chat-username">{userName}:</span>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Chat;
