import React, { useState } from "react";
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
  const [showExamples, setShowExamples] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const exampleMessages = [
    "プログラミングについて何かしていることはありますか？",
    "使ったことがあるプログラミングスキルはありますか？",
    "普段どうやってプログラミングを学んでいますか？",
  ];

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

  const handleCopy = (text: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      setCopiedText(text);
      setTimeout(() => {
        setCopiedText(null);
      }, 1500); // Keep "Copied!" message a bit longer
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="my-chat-input-bubble">
      {showExamples && (
        <div className="example-messages-popup">
          <p className="example-title">クリックしてコピー</p>
          <div className="example-messages-list">
            {exampleMessages.map((msg, index) => (
              <div
                key={index}
                className={`example-message-item ${
                  copiedText === msg ? "copied" : ""
                }`}
                onClick={() => handleCopy(msg)}
              >
                {copiedText === msg ? "コピーしました！" : msg}
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="my-chat-input-buttons">
        <button
          className="my-chat-input-button close"
          onClick={onTextDelete}
          aria-label="Clear message"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <button
          className="my-chat-input-button examples"
          onClick={() => setShowExamples(!showExamples)}
          aria-label="Show example messages"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15.09 16.05a1 1 0 0 1-1.41 0L12 14.41l-1.68 1.64a1 1 0 0 1-1.41 0l-.3-.29a1 1 0 0 1 0-1.41L10.59 13l-1.68-1.64a1 1 0 0 1 0-1.41l.3-.29a1 1 0 0 1 1.41 0L12 11.59l1.68-1.64a1 1 0 0 1 1.41 0l.3.29a1 1 0 0 1 0 1.41L13.41 13l1.68 1.64a1 1 0 0 1 .02 1.41z" />
            <path d="M9 18h6" />
            <path d="M10 22h4" />
            <path d="M12 2a7 7 0 0 0-7 7c0 2.35 1.13 4.41 2.87 5.74" />
            <path d="M12 2a7 7 0 0 1 7 7c0 2.35-1.13 4.41-2.87 5.74" />
          </svg>
        </button>
      </div>
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
