import { Container, Sprite } from "@pixi/react";
import { Texture } from "pixi.js";
import { useCallback, useMemo, useEffect, useState } from "react";
import backgroundAsset from "../../../../assets/space-stars.jpg";
import { Room } from "../../rooms/Room";
import { Avatar } from "../../avatar/Avatar";
import { Bot } from "../../Bot/Bot";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants/game-world";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { InitialUserState } from "../../../../Types";
import { OtherAvatar } from "../../avatar/OtherAvatar";
import { Direction, IPosition } from "../../types/common";
import "./MainContainer.scss";

interface ParticipantData {
  position: IPosition;
  userName: string;
  avatarId: number;
  direction: Direction;
}

interface IMainContainerProps {
  scale?: number;
  position?: { x: number; y: number };
  children?: React.ReactNode;
  // onAvatarMoveの型を修正
  onAvatarMove: (pos: IPosition, direction: Direction | null) => void;
  allPositions: { [uid: string]: ParticipantData };
  userId: string;
  roomId: string;
  user: InitialUserState["user"];
  botPos: IPosition;
}

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
}: IMainContainerProps) => {
  const backgroundTexture = useMemo(() => Texture.from(backgroundAsset), []);
  const [botDirection, setBotDirection] = useState<Direction>("DOWN");
  const avatarId = user?.avatarId ?? 0;

  useEffect(() => {
    const myPos = allPositions[userId]?.position;
    if (!myPos) return;

    if (Math.abs(myPos.x - botPos.x) > Math.abs(myPos.y - botPos.y)) {
      setBotDirection(myPos.x > botPos.x ? "RIGHT" : "LEFT");
    } else {
      setBotDirection(myPos.y > botPos.y ? "DOWN" : "UP");
    }
  }, [allPositions, userId, botPos]);

  const saveUserPositionToRoom = useCallback(
    async (pos: IPosition, direction: Direction | null) => {
      if (!userId || !user) return;
      try {
        await setDoc(
          doc(db, "rooms", "default-lobby", "participants", userId),
          {
            position: pos,
            userName: user.userName,
            avatarId: user.avatarId,
            direction: direction,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (e) {
        console.error("アバター位置の保存に失敗:", e);
      }
    },
    [userId, user]
  );

  const updateAvatarPosition = useCallback(
    (pos: IPosition, direction: Direction | null) => {
      onAvatarMove(pos, direction); // 親コンポーネントに通知
      saveUserPositionToRoom(pos, direction); // DBに保存
    },
    [onAvatarMove, saveUserPositionToRoom]
  );

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
      />
      {Object.entries(allPositions)
        .filter(([uid]) => uid !== userId && uid !== "bot")
        .map(([uid, data]) => (
          <OtherAvatar
            key={uid}
            avatarId={data.avatarId ?? 0}
            position={data.position}
            direction={data.direction}
          />
        ))}
      <Bot x={botPos.x} y={botPos.y} direction={botDirection} />
    </Container>
  );
};
