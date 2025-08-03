import React from "react";
import "./MyChatInput.scss";

interface MyChatInputProps {
  value: string;
  onMessageChange: (message: string) => void;
  onClose: () => void;
  onSubmit: (message: string) => void;
}

const MyChatInput: React.FC<MyChatInputProps> = ({
  value,
  onMessageChange,
  onClose,
  onSubmit,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onMessageChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (value.trim()) {
        onSubmit(value);
      }
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  const onTextDelete = () => {
    onMessageChange("");
  };

  return (
    <div className="my-chat-input-bubble">
      <button
        className="my-chat-input-close-button"
        onClick={onTextDelete}
        aria-label="Clear message"
      >
        ×
      </button>
      <input
        type="text"
        className="my-chat-input-field"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="メッセージを入力 (Enterで送信)"
        autoFocus
      />
    </div>
  );
};

export default MyChatInput;
