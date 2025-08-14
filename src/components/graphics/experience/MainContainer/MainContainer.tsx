import { Container, Sprite } from "@pixi/react";
import { Texture } from "pixi.js";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import backgroundAsset from "../../../../assets/space-stars.jpg";
import { Room } from "../../rooms/Room";
import { Avatar } from "../../avatar/Avatar";
import { Bot } from "../../Bot/Bot";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants/game-world";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { InitialUserState, ParticipantData } from "../../../../Types";
import { OtherAvatar } from "../../avatar/OtherAvatar";
import { Direction, IPosition } from "../../types/common";
import "./MainContainer.scss";

interface IMainContainerProps {
  scale?: number;
  position?: { x: number; y: number };
  children?: React.ReactNode;
  onAvatarMove: (pos: IPosition, direction: Direction | null) => void;
  allPositions: { [uid: string]: ParticipantData };
  userId: string;
  roomId: string;
  user: InitialUserState["user"];
  botPos: IPosition;
  myChatPartnerId: string | null;
}

// 向きを計算する関数
const getDirectionTo = (
  from: IPosition,
  to: IPosition
): Direction | undefined => {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "RIGHT" : "LEFT";
  } else if (dy !== 0) {
    return dy > 0 ? "DOWN" : "UP";
  }
};

export const MainContainer = ({
  scale = 1,
  position = { x: 0, y: 0 },
  onAvatarMove,
  children,
  allPositions,
  userId,
  roomId,
  user,
  botPos,
  myChatPartnerId,
}: IMainContainerProps) => {
  const backgroundTexture = useMemo(() => Texture.from(backgroundAsset), []);

  const me = allPositions[userId];
  const botData = allPositions["Bot"];

  const [botDirection, setBotDirection] = useState<Direction | null>("DOWN");
  const [myOverrideDirection, setMyOverrideDirection] =
    useState<Direction | null>(null);

  // スロットリング（間引き）用のRefを追加
  const throttleTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const myPos = me?.position;
    if (myChatPartnerId === "Bot" && myPos) {
      const userDir = getDirectionTo(myPos, botPos);
      const botDir = getDirectionTo(botPos, myPos);

      setMyOverrideDirection(userDir || null);
      setBotDirection(botDir || null);

      if (userDir) {
        const userRef = doc(db, "rooms", roomId, "participants", userId);
        updateDoc(userRef, { direction: userDir });
      }
      if (botDir) {
        const botRef = doc(db, "rooms", roomId, "participants", "Bot");
        updateDoc(botRef, { direction: botDir });
      }
    } else {
      const partner = myChatPartnerId ? allPositions[myChatPartnerId] : null;
      if (myChatPartnerId && partner?.position && myPos) {
        setMyOverrideDirection(getDirectionTo(myPos, partner.position) || null);
        if (botPos && partner.position) {
          setBotDirection(getDirectionTo(botPos, partner.position) || "DOWN");
        } else {
          setBotDirection(botData?.direction || "DOWN");
        }
      } else {
        setMyOverrideDirection(null);
      }
      setBotDirection(botData?.direction || "DOWN");
    }
  }, [myChatPartnerId, me, botData, botPos, allPositions, roomId, userId]);

  const avatarId = user?.avatarId ?? 0;

  const saveUserPositionToRoom = useCallback(
    async (pos: IPosition, direction: Direction | null) => {
      if (!userId || !user || myChatPartnerId) return;
      try {
        const participantRef = doc(
          db,
          "rooms",
          "default-lobby",
          "participants",
          userId
        );
        await updateDoc(participantRef, {
          position: pos,
          userName: user.userName,
          avatarId: user.avatarId,
          direction: direction,
        });
      } catch (e) {
        console.error("アバター位置の保存に失敗:", e);
      }
    },
    [userId, user, myChatPartnerId]
  );

  const updateAvatarPosition = useCallback(
    (pos: IPosition, direction: Direction | null) => {
      // 自分のカメラは即座に動かす
      onAvatarMove(pos, direction);

      // Firestoreへの書き込みは150ミリ秒に1回に間引く
      if (!throttleTimeout.current) {
        saveUserPositionToRoom(pos, direction);
        throttleTimeout.current = setTimeout(() => {
          throttleTimeout.current = null;
        }, 150);
      }
    },
    [onAvatarMove, saveUserPositionToRoom]
  );

  // コンポーネントがアンマウントされるときにタイムアウトをクリア
  useEffect(() => {
    return () => {
      if (throttleTimeout.current) {
        clearTimeout(throttleTimeout.current);
      }
    };
  }, []);

  return (
    <Container scale={scale} x={position.x} y={position.y}>
      <Sprite
        texture={backgroundTexture}
        width={GAME_WIDTH + 32}
        height={GAME_HEIGHT + 32}
      />
      {children}
      <Room />
      <Avatar
        onMove={updateAvatarPosition}
        userId={userId}
        roomId={roomId}
        allPositions={allPositions}
        botPos={botPos}
        avatarId={avatarId}
        overrideDirection={myOverrideDirection}
      />
      {Object.entries(allPositions)
        .filter(([uid]) => uid !== userId && uid !== "Bot")
        .map(([uid, data]) => {
          let direction = data.direction;
          if (myChatPartnerId === uid && me?.position && data.position) {
            direction = getDirectionTo(data.position, me.position) || direction;
          }
          return (
            <OtherAvatar
              key={uid}
              avatarId={data.avatarId ?? 0}
              position={data.position}
              direction={direction}
            />
          );
        })}
      <Bot x={botPos.x} y={botPos.y} direction={botDirection || "DOWN"} />
    </Container>
  );
};
