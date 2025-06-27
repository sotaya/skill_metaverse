import { Container, Sprite } from "@pixi/react";
import { Texture } from "pixi.js";
import { useCallback, useMemo, useEffect, useState } from "react";
import backgroundAsset from "../../../../assets/space-stars.jpg";
import { Room } from "../../rooms/Room";
import { Avatar } from "../../avatar/Avatar";
import { TILE_SIZE } from "../../constants/game-world";
import { Bot } from "../../Bot/Bot";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants/game-world";
import Chat from "../../chat/chat";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../../firebase";
import { AvatarList } from "../../avatar/AvatarList";

//描画管理(背景・空間・アバターなど)
interface IMainContainerProps {
  canvasSize: { width: number; height: number };
  scale?: number;
  position?: { x: number; y: number };
  children?: React.ReactNode;
  onAvatarMove: (pos: { x: number; y: number }) => void;
  allPositions: { [uid: string]: { x: number; y: number } };
  userId: string;
  roomId: string;
}

export const MainContainer = ({
  scale = 1,
  position = { x: 0, y: 0 },
  onAvatarMove,
  children,
  allPositions,
  userId,
  roomId,
}: IMainContainerProps) => {
  const backgroundTexture = useMemo(() => Texture.from(backgroundAsset), []);
  const [avatarId, setAvatarId] = useState(0);

  useEffect(() => {
    const fetchAvatarId = async () => {
      if (!userId) return;
      const userDoc = await getDoc(doc(db, "users", userId));
      if (userDoc.exists()) {
        setAvatarId(userDoc.data().avatarId ?? 0);
      }
    };
    fetchAvatarId();
  }, [userId]);

  const avatarTexture = useMemo(
    () =>
      AvatarList[avatarId]
        ? Texture.from(AvatarList[avatarId])
        : Texture.from(AvatarList[0]),
    [avatarId]
  );

  const updateAvatarPosition = useCallback(
    (x: number, y: number) => {
      onAvatarMove({ x, y });
    },
    [onAvatarMove]
  );

  const adjacentUsers = Object.entries(allPositions).filter(([uid, pos]) => {
    if (uid === userId) return false;
    const myPos = allPositions[userId];
    if (!myPos) return false;
    return Math.abs(myPos.x - pos.x) + Math.abs(myPos.y - pos.y) === TILE_SIZE;
  });

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
        texture={avatarTexture}
        onMove={updateAvatarPosition}
        userId={userId}
        roomId={roomId}
        allPositions={allPositions}
      />
      {adjacentUsers.map(([uid, pos]) => (
        <Chat key={uid} x={pos.x} y={pos.y - 32} userId={uid} />
      ))}
      <Bot x={TILE_SIZE * 5} y={TILE_SIZE * 5.5} />
    </Container>
  );
};
