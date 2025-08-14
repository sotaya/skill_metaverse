import React, { useEffect, useMemo, useRef, useState } from "react";
import { Stage, Sprite } from "@pixi/react";
import { Rectangle, Texture } from "pixi.js";
import { Timestamp } from "firebase/firestore";
import { AvatarList } from "../graphics/avatar/AvatarList";
import { TILE_SIZE } from "../graphics/constants/game-world";
import { ChatMessage, ParticipantData } from "../../Types";
import avatarBot from "../../assets/avatar_bot.png";
import "./ChatLog.scss";

interface ChatLogProps {
  userId: string;
  allPositions: { [uid: string]: ParticipantData };
  onEndChat: () => void;
  addChatMessage: (message: string) => void;
}

const STAGE_WIDTH = 48;
const STAGE_HEIGHT = 48;

const ChatLog: React.FC<ChatLogProps> = ({
  userId,
  allPositions,
  onEndChat,
  addChatMessage,
}) => {
  const [isConfirmingEnd, setIsConfirmingEnd] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);
  const lastUserMessageTimestamp = useRef<Date | null>(null);

  const getAvatarTextureUrl = (uid: string) => {
    if (uid === "Bot") {
      return avatarBot;
    }
    const avatarId = allPositions[uid]?.avatarId ?? 0;
    return AvatarList[avatarId] || AvatarList[0];
  };

  const toDate = (timestamp: Date | Timestamp): Date => {
    if (timestamp instanceof Timestamp) {
      return timestamp.toDate();
    }
    if (timestamp instanceof Date) {
      return timestamp;
    }
    return new Date();
  };

  const { displayMessages, isPartnerTyping, partner } = useMemo(() => {
    const me = allPositions[userId];
    const chatPartnerId = me?.chattingWith;
    const chatPartner = chatPartnerId ? allPositions[chatPartnerId] : null;

    const messagesToShow: ChatMessage[] = [];

    if (me && me.message && (me as any).messageTimestamp) {
      messagesToShow.push({
        id: `${me.uid}-latest`,
        uid: me.uid,
        userName: me.userName,
        message: me.message,
        timestamp: toDate((me as any).messageTimestamp),
      });
    }

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
        timestamp: toDate((chatPartner as any).messageTimestamp),
      });
    }

    messagesToShow.sort((a, b) => +a.timestamp - +b.timestamp);

    const partnerIsTyping = chatPartner?.isTyping === true;

    return {
      displayMessages: messagesToShow,
      isPartnerTyping: partnerIsTyping,
      partner: chatPartner,
    };
  }, [allPositions, userId]);

  const lastMessage =
    displayMessages.length > 0
      ? displayMessages[displayMessages.length - 1]
      : null;

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [displayMessages, isPartnerTyping]);

  useEffect(() => {
    if (!partner) {
      setIsConfirmingEnd(false);
    }
  }, [partner]);

  useEffect(() => {
    const closingMessage = "そろそろ締めませんか";
    if (
      isConfirmingEnd &&
      lastMessage &&
      lastMessage.uid === userId &&
      lastMessage.message !== closingMessage
    ) {
      const lastMessageDate = toDate(lastMessage.timestamp);

      if (
        !lastUserMessageTimestamp.current ||
        lastMessageDate > lastUserMessageTimestamp.current
      ) {
        setIsConfirmingEnd(false);
      }
    }
    if (lastMessage && lastMessage.uid === userId) {
      lastUserMessageTimestamp.current = toDate(lastMessage.timestamp);
    }
  }, [displayMessages, isConfirmingEnd, userId, lastMessage]);

  const handleEndChatClick = () => {
    if (isConfirmingEnd) {
      onEndChat();
    } else {
      addChatMessage("そろそろ締めませんか");
      setIsConfirmingEnd(true);
    }
  };

  const showAttachedIndicator =
    lastMessage && lastMessage.uid !== userId && isPartnerTyping;

  const showSeparateIndicator =
    isPartnerTyping && (!lastMessage || lastMessage.uid === userId);

  return (
    <div className="chat-log-container">
      <div className="chat-log-header">
        <h3>チャットログ</h3>
        <button
          className={`end-chat-button ${isConfirmingEnd ? "confirming" : ""}`}
          onClick={handleEndChatClick}
        >
          {isConfirmingEnd ? "トーク終了" : "終了を提案する"}
        </button>
      </div>
      <div className="chat-log-messages" ref={logContainerRef}>
        {displayMessages.map((msg, index) => {
          const isLastMessage = index === displayMessages.length - 1;
          const showTypingIndicator = isLastMessage && showAttachedIndicator;

          return (
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
                <div className="username-wrapper">
                  <div className="username">{msg.userName}</div>
                  {showTypingIndicator && (
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
                <div className="message-bubble">{msg.message}</div>
              </div>
            </div>
          );
        })}
        {showSeparateIndicator && partner && (
          <div className="chat-log-entry other-message">
            <div className="avatar-icon">
              <Stage
                width={STAGE_WIDTH}
                height={STAGE_HEIGHT}
                options={{ backgroundAlpha: 0 }}
              >
                <Sprite
                  texture={
                    new Texture(
                      Texture.from(
                        getAvatarTextureUrl(partner.uid)
                      ).baseTexture,
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
              <div className="username-wrapper">
                <div className="username">{partner.userName}</div>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLog;
