import { Container, Sprite } from "@pixi/react";
import { Texture } from "pixi.js";
import { useCallback, useMemo } from "react";
import backgroundAsset from "../../../../assets/space-stars.jpg";
import { Room } from "../../rooms/Room";
import { Avatar } from "../../avatar/Avatar";
import { Bot } from "../../Bot/Bot";
import { GAME_WIDTH, GAME_HEIGHT } from "../../constants/game-world";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
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

  const botDirection = useMemo(() => {
    if (myChatPartnerId === "bot" && me?.position) {
      return getDirectionTo(botPos, me.position) || "DOWN";
    }
    const myPos = allPositions[userId]?.position;
    if (!myPos) return "DOWN";

    if (Math.abs(myPos.x - botPos.x) > Math.abs(myPos.y - botPos.y)) {
      return myPos.x > botPos.x ? "RIGHT" : "LEFT";
    } else {
      return myPos.y > botPos.y ? "DOWN" : "UP";
    }
  }, [allPositions, userId, botPos, myChatPartnerId, me?.position]);

  const myDirectionOverride = useMemo(() => {
    const partner = myChatPartnerId ? allPositions[myChatPartnerId] : null;
    if (
      myChatPartnerId &&
      myChatPartnerId !== "bot" &&
      partner?.position &&
      me?.position
    ) {
      return getDirectionTo(me.position, partner.position);
    }
    if (myChatPartnerId === "bot" && me?.position) {
      return getDirectionTo(me.position, botPos);
    }
    return null;
  }, [myChatPartnerId, allPositions, me, botPos]);
  const avatarId = user?.avatarId ?? 0;

  const saveUserPositionToRoom = useCallback(
    async (pos: IPosition, direction: Direction | null) => {
      if (!userId || !user) return;
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
          updatedAt: serverTimestamp(),
        });
      } catch (e) {
        console.error("アバター位置の保存に失敗:", e);
      }
    },
    [userId, user]
  );

  const updateAvatarPosition = useCallback(
    (pos: IPosition, direction: Direction | null) => {
      onAvatarMove(pos, direction);
      saveUserPositionToRoom(pos, direction);
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
        overrideDirection={myDirectionOverride}
      />
      {Object.entries(allPositions)
        .filter(([uid]) => uid !== userId && uid !== "bot")
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
      <Bot x={botPos.x} y={botPos.y} direction={botDirection} />
    </Container>
  );
};
