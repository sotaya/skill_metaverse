import React, { useState } from "react";

const Chat = ({ x, y, userId }: { x: number; y: number; userId: string }) => {
  const [open, setOpen] = useState(true);
  const [message, setMessage] = useState("");

  if (!open) return null;

  return (
    <foreignObject x={x} y={y} width={120} height={60}>
      <div className="chat-bubble">
        <button className="close-btn" onClick={() => setOpen(false)}>
          ✕
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力"
        />
      </div>
    </foreignObject>
  );
};

export default Chat;
