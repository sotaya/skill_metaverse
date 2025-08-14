import { Stage } from "@pixi/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MainContainer } from "./MainContainer/MainContainer";
import { useAppSelector } from "../../../app/hooks";
import { useViewport } from "./hooks/useViewport";
import { LogEntry } from "../../../Types";
import {
  DEFAULT_POS_X,
  DEFAULT_POS_Y,
  TILE_SIZE,
} from "../constants/game-world";
import MyChatInput from "../chat/MyChatInput";
import { Direction, IPosition } from "../types/common";
import ChatPrompt from "../../chat_prompt/ChatPrompt";
import "./Experience.scss";
import { Provider } from "react-redux";
import { store } from "../../../app/store";
import TimeRestrictionOverlay from "./TimeRestrictionOverlay";

const useWindowResize = (onResize: () => void) => {
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onResize();
      }, 300);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, [onResize]);
};

interface ExperienceProps {
  allPositions: { [uid: string]: any };
  userId: string;
  addLog: (logData: Omit<LogEntry, "id" | "timestamp">) => void;
  addChatMessage: (message: string) => void;
  isChatActive: boolean;
  showChatPrompt: boolean;
  onStartChat: () => void;
  onEndChat: () => void;
  onTypingStatusChange: (isTyping: boolean) => void;
  myChatPartnerId: string | null;
  isAppActive: boolean;
  restrictionMessage: string;
  onLogout: () => void; // propsを追加
}

export const Experience = ({
  allPositions,
  userId,
  addLog,
  addChatMessage,
  isChatActive,
  showChatPrompt,
  onStartChat,
  onEndChat,
  onTypingStatusChange,
  myChatPartnerId,
  isAppActive,
  restrictionMessage,
  onLogout, // propsを受け取る
}: ExperienceProps) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scale] = useState(1.8);
  const roomId =
    useAppSelector((state) => state.room.roomId) || "default-lobby";
  const user = useAppSelector((state) => state.user.user);
  const displayRef = useRef<HTMLDivElement>(null);

  const [myCurrentMessage, setMyCurrentMessage] = useState("");
  const botPos = useMemo(() => ({ x: TILE_SIZE * 5, y: TILE_SIZE * 6 }), []);

  const [myPosition, setMyPosition] = useState<IPosition>({
    x: DEFAULT_POS_X,
    y: DEFAULT_POS_Y,
  });

  const [bubbleState, setBubbleState] = useState<"none" | "prompt" | "input">(
    "none"
  );

  const { viewportPosition, handleAvatarMove, viewportHandlers } = useViewport({
    scale,
    canvasSize,
  });

  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updateCanvasSize = useCallback(() => {
    if (displayRef.current) {
      setCanvasSize({
        width: displayRef.current.clientWidth,
        height: displayRef.current.clientHeight,
      });
    }
  }, []);

  useWindowResize(updateCanvasSize);
  useEffect(() => {
    updateCanvasSize();
  }, [updateCanvasSize]);

  useEffect(() => {
    if (isChatActive) {
      setBubbleState("input");
    } else {
      setMyCurrentMessage("");
      if (showChatPrompt) {
        setBubbleState("prompt");
      } else {
        setBubbleState("none");
      }
    }
  }, [isChatActive, showChatPrompt]);

  const handleMyMessageChange = (newMessage: string) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (newMessage.trim() !== "") {
      if (myCurrentMessage.trim() === "") {
        onTypingStatusChange(true);
      }
      typingTimeoutRef.current = setTimeout(() => {
        onTypingStatusChange(false);
      }, 2000);
    } else {
      onTypingStatusChange(false);
    }

    setMyCurrentMessage(newMessage);
  };

  const handleSubmitMyChat = (message: string) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    onTypingStatusChange(false);
    addChatMessage(message);
    setMyCurrentMessage("");
  };

  const handleMyAvatarPositionChange = useCallback(
    (pos: IPosition, direction: Direction | null) => {
      setMyPosition(pos);
      handleAvatarMove(pos);
    },
    [handleAvatarMove]
  );

  const AVATAR_SPRITE_HEIGHT = 32;

  const renderBubble = () => {
    if (!myPosition) return null;

    const bubbleStyle = {
      "--x-pos": `${viewportPosition.x + myPosition.x * scale}px`,
      "--y-pos": `${
        viewportPosition.y + (myPosition.y - AVATAR_SPRITE_HEIGHT) * scale
      }px`,
    } as React.CSSProperties;

    switch (bubbleState) {
      case "prompt":
        return (
          <div className="my-chat-wrapper" style={bubbleStyle}>
            <ChatPrompt onConfirm={onStartChat} />
          </div>
        );
      case "input":
        return (
          <div className="my-chat-wrapper" style={bubbleStyle}>
            <MyChatInput
              value={myCurrentMessage}
              onMessageChange={handleMyMessageChange}
              onSubmit={handleSubmitMyChat}
              onClose={onEndChat}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="display" ref={displayRef} {...viewportHandlers}>
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        options={{ backgroundColor: 0x000033 }}
      >
        <Provider store={store}>
          <MainContainer
            scale={scale}
            position={viewportPosition}
            onAvatarMove={handleMyAvatarPositionChange}
            allPositions={allPositions}
            userId={userId}
            roomId={roomId}
            user={user}
            botPos={botPos}
            myChatPartnerId={myChatPartnerId}
          />
        </Provider>
      </Stage>
      {renderBubble()}
      {!isAppActive && (
        <TimeRestrictionOverlay
          message={restrictionMessage}
          onLogout={onLogout}
        />
      )}
    </div>
  );
};
