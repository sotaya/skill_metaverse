import { Stage } from "@pixi/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MainContainer } from "./MainContainer/MainContainer";
import { useAppSelector } from "../../../app/hooks";
import { useViewport } from "./hooks/useViewport";
import "./Experience.scss";
import { LogEntry } from "../../../Types";
import Chat from "../chat/Chat";
import BotChat from "../chat/BotChat";
import {
  DEFAULT_POS_X,
  DEFAULT_POS_Y,
  TILE_SIZE,
} from "../constants/game-world";
import MyChatInput from "../chat/MyChatInput";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import { Direction, IPosition } from "../types/common";

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
}

export const Experience = ({
  allPositions,
  userId,
  addLog,
}: ExperienceProps) => {
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const [scale] = useState(1.8);
  const roomId =
    useAppSelector((state) => state.room.roomId) || "default-lobby";
  const user = useAppSelector((state) => state.user.user);
  const displayRef = useRef<HTMLDivElement>(null);

  const [myCurrentMessage, setMyCurrentMessage] = useState("");
  const [isBotChatVisible, setIsBotChatVisible] = useState(false);
  const botPos = useMemo(() => ({ x: TILE_SIZE * 5, y: TILE_SIZE * 6 }), []);

  const [myPosition, setMyPosition] = useState<IPosition>({
    x: DEFAULT_POS_X,
    y: DEFAULT_POS_Y,
  });

  const { viewportPosition, handleAvatarMove, viewportHandlers } = useViewport({
    scale,
    canvasSize,
  });

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

  const updateMyParticipantData = useCallback(
    async (dataToUpdate: object) => {
      if (!userId) return;
      try {
        const participantRef = doc(db, "rooms", roomId, "participants", userId);
        await setDoc(
          participantRef,
          {
            ...dataToUpdate,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        console.error("Failed to update participant data:", e);
      }
    },
    [userId, roomId]
  );

  // ### 根本的な原因の解決策 ###
  // 以前は、距離計算にDBから取得した古い自分の位置情報(`allPositions[userId]`)を
  // 使っていたため、タイミングの問題で吹き出しが表示されませんでした。
  //
  // この修正では、距離計算にリアルタイムで更新されるローカルの
  // `myPosition` state を使うように変更しました。
  // これにより、見た目の位置と計算上の位置が常に一致し、問題が解決されます。
  const adjacentUsers = useMemo(() => {
    return Object.entries(allPositions).filter(([uid, data]) => {
      // 自分自身、Bot、位置情報がないユーザーは判定対象外
      if (uid === userId || uid === "bot" || !data.position) {
        return false;
      }
      // リアルタイムの自分の位置(`myPosition`)を使って距離を計算
      const distance = Math.sqrt(
        Math.pow(myPosition.x - data.position.x, 2) +
          Math.pow(myPosition.y - data.position.y, 2)
      );
      return distance <= TILE_SIZE * 1.5;
    });
  }, [allPositions, userId, myPosition]);

  const isChatting = adjacentUsers.length > 0;

  const prevIsChattingRef = useRef(isChatting);
  useEffect(() => {
    if (prevIsChattingRef.current && !isChatting && myCurrentMessage) {
      setMyCurrentMessage("");
      updateMyParticipantData({ message: "" });
    }
    prevIsChattingRef.current = isChatting;
  }, [isChatting, myCurrentMessage, updateMyParticipantData]);

  useEffect(() => {
    const isAdjacentToBot =
      Math.abs(myPosition.x - botPos.x) + Math.abs(myPosition.y - botPos.y) <=
      TILE_SIZE * 1.5;
    setIsBotChatVisible(isAdjacentToBot);
  }, [myPosition, botPos]);

  const handleMyMessageChange = (newMessage: string) => {
    setMyCurrentMessage(newMessage);
    updateMyParticipantData({ message: newMessage });
  };

  const handleCloseMyChat = () => {
    setMyCurrentMessage("");
    updateMyParticipantData({ message: "" });
  };

  const handleCloseBotChat = () => setIsBotChatVisible(false);

  const handleMyAvatarPositionChange = useCallback(
    (pos: IPosition, direction: Direction | null) => {
      setMyPosition(pos);
      handleAvatarMove(pos);
    },
    [handleAvatarMove]
  );

  return (
    <div className="display" ref={displayRef} {...viewportHandlers}>
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        options={{ backgroundColor: 0x000033 }}
      >
        <MainContainer
          scale={scale}
          position={viewportPosition}
          onAvatarMove={handleMyAvatarPositionChange}
          allPositions={allPositions}
          userId={userId}
          roomId={roomId}
          user={user}
          botPos={botPos}
        />
      </Stage>

      {isChatting && myPosition && (
        <div
          className="my-chat-wrapper"
          style={
            {
              "--x-pos": `${viewportPosition.x + myPosition.x * scale}px`,
              "--y-pos": `${viewportPosition.y + myPosition.y * scale}px`,
            } as React.CSSProperties
          }
        >
          <MyChatInput
            onMessageChange={handleMyMessageChange}
            onClose={handleCloseMyChat}
            initialMessage={myCurrentMessage}
          />
        </div>
      )}

      {adjacentUsers.map(([uid, data]) => {
        const screenX = viewportPosition.x + data.position.x * scale;
        const screenY = viewportPosition.y + data.position.y * scale;
        return (
          <div
            key={uid}
            className="chat-wrapper"
            style={
              {
                "--x-pos": `${screenX}px`,
                "--y-pos": `${screenY}px`,
              } as React.CSSProperties
            }
          >
            <Chat userName={data.userName} message={data.message} />
          </div>
        );
      })}

      {isBotChatVisible && (
        <div
          className="bot-chat-wrapper"
          style={
            {
              "--x-pos": `${viewportPosition.x + botPos.x * scale}px`,
              "--y-pos": `${viewportPosition.y + botPos.y * scale}px`,
            } as React.CSSProperties
          }
        >
          <BotChat onClose={handleCloseBotChat} />
        </div>
      )}
    </div>
  );
};
