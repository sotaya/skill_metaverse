import React from "react";
import "./Chat.scss";

interface ChatProps {
  userName: string;
  message?: string;
}

/**
 * 他のユーザーのチャットメッセージを表示するコンポーネント。
 */
export const Chat: React.FC<ChatProps> = ({ userName, message }) => {
  // メッセージがない、または空の場合は何も表示しない
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
