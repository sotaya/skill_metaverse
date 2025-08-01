import React, { useEffect, useMemo, useRef } from "react";
import { Stage, Sprite } from "@pixi/react";
import { Rectangle, Texture } from "pixi.js";
import { AvatarList } from "../graphics/avatar/AvatarList";
import { TILE_SIZE } from "../graphics/constants/game-world";
import { ChatMessage, ParticipantData } from "../../Types";
import avatarBot from "../../assets/avatar_bot.png";
import "./ChatLog.scss";

interface ChatLogProps {
  userId: string;
  allPositions: { [uid: string]: ParticipantData };
  onEndChat: () => void;
}

const STAGE_WIDTH = 48;
const STAGE_HEIGHT = 48;

const ChatLog: React.FC<ChatLogProps> = ({
  userId,
  allPositions,
  onEndChat,
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  const getAvatarTextureUrl = (uid: string) => {
    if (uid === "Bot") {
      return avatarBot;
    }
    const avatarId = allPositions[uid]?.avatarId ?? 0;
    return AvatarList[avatarId] || AvatarList[0];
  };

  const displayMessages = useMemo(() => {
    const me = allPositions[userId];
    const chatPartnerId = me?.chattingWith;
    const chatPartner = chatPartnerId ? allPositions[chatPartnerId] : null;

    const messagesToShow: ChatMessage[] = [];

    // 自分の最新メッセージを追加
    if (me && me.message && (me as any).messageTimestamp) {
      messagesToShow.push({
        id: `${me.uid}-latest`,
        uid: me.uid,
        userName: me.userName,
        message: me.message,
        timestamp: (me as any).messageTimestamp.toDate(),
      });
    }

    // チャット相手の最新メッセージを追加
    if (
      chatPartner &&
      chatPartner.message &&
      (chatPartner as any).messageTimestamp
    ) {
      messagesToShow.push({
        id: `${chatPartner.uid}-latest`,
        uid: chatPartner.uid,
        userName: chatPartner.userName,
        message: chatPartner.message,
        timestamp: (chatPartner as any).messageTimestamp.toDate(),
      });
    }

    // 時系列でソート
    messagesToShow.sort((a, b) => +a.timestamp - +b.timestamp);

    return messagesToShow;
  }, [allPositions, userId]);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [displayMessages]);

  return (
    <div className="chat-log-container">
      <div className="chat-log-header">
        <h3>チャットログ</h3>
        <button className="end-chat-button" onClick={onEndChat}>
          トーク終了
        </button>
      </div>
      <div className="chat-log-messages" ref={logContainerRef}>
        {displayMessages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-log-entry ${
              msg.uid === userId ? "my-message" : "other-message"
            }`}
          >
            <div className="avatar-icon">
              <Stage
                width={STAGE_WIDTH}
                height={STAGE_HEIGHT}
                options={{ backgroundAlpha: 0 }}
              >
                <Sprite
                  texture={
                    new Texture(
                      Texture.from(getAvatarTextureUrl(msg.uid)).baseTexture,
                      new Rectangle(0, 64 * 2, 64, 64)
                    )
                  }
                  x={STAGE_WIDTH / 2}
                  y={STAGE_HEIGHT / 2}
                  width={TILE_SIZE * 1.5}
                  height={TILE_SIZE * 1.5}
                  anchor={0.5}
                />
              </Stage>
            </div>
            <div className="message-content">
              <div className="username">{msg.userName}</div>
              <div className="message-bubble">{msg.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatLog;
