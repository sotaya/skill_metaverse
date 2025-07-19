import React, { useState, useEffect } from "react";
import "./MyChatInput.scss";

interface MyChatInputProps {
  onMessageChange: (message: string) => void;
  onClose: () => void;
  initialMessage?: string;
}

/**
 * ログインユーザー自身のチャット入力用吹き出しコンポーネント。
 */
const MyChatInput: React.FC<MyChatInputProps> = ({
  onMessageChange,
  onClose,
  initialMessage = "",
}) => {
  const [message, setMessage] = useState(initialMessage);

  useEffect(() => {
    setMessage(initialMessage);
  }, [initialMessage]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    onMessageChange(e.target.value);
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  return (
    <div className="my-chat-input-bubble">
      <button
        className="my-chat-input-close-button"
        onClick={handleClose}
        aria-label="Clear message"
      >
        ×
      </button>
      <input
        type="text"
        className="my-chat-input-field"
        value={message}
        onChange={handleChange}
        placeholder="メッセージを入力..."
        autoFocus
      />
    </div>
  );
};

export default MyChatInput;
