import { Container, Sprite } from "@pixi/react";
import { Texture } from "pixi.js";
import { useCallback, useEffect, useMemo, useState } from "react";
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

  // --- ここから修正 ---
  const [botDirection, setBotDirection] = useState<Direction | null>("DOWN");
  const [myOverrideDirection, setMyOverrideDirection] =
    useState<Direction | null>(null);

  // チャット状態に応じて、アバターとBotの向きを決定する副作用
  useEffect(() => {
    const myPos = me?.position;
    // 1. Botとチャット中の場合
    if (myChatPartnerId === "Bot" && myPos) {
      // ユーザーがBotを向くべき方向 (ユーザーの向きは正しい)
      const userDir = getDirectionTo(myPos, botPos);
      // Botがユーザーを向くべき方向
      const botDir = getDirectionTo(botPos, myPos);

      // stateを更新して、即座に描画に反映
      setMyOverrideDirection(userDir || null);
      setBotDirection(botDir || null);

      // Firestoreには、セマンティックに正しい向きを保存
      if (userDir) {
        const userRef = doc(db, "rooms", roomId, "participants", userId);
        updateDoc(userRef, {
          direction: userDir,
          updatedAt: serverTimestamp(),
        });
      }
      if (botDir) {
        // 保存するのは補正前の正しい向き
        const botRef = doc(db, "rooms", roomId, "participants", "Bot");
        updateDoc(botRef, {
          direction: botDir,
          updatedAt: serverTimestamp(),
        });
      }
    } else {
      // 2. 他のユーザーとチャット中の場合
      const partner = myChatPartnerId ? allPositions[myChatPartnerId] : null;
      if (myChatPartnerId && partner?.position && myPos) {
        setMyOverrideDirection(getDirectionTo(myPos, partner.position) || null);
        // Botがチャット相手を向く
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
  // --- ここまで修正 ---

  const avatarId = user?.avatarId ?? 0;

  const saveUserPositionToRoom = useCallback(
    async (pos: IPosition, direction: Direction | null) => {
      // --- ここから修正 ---
      // チャット中は、移動による向きの更新を停止し、競合を防ぐ
      if (!userId || !user || myChatPartnerId) return;
      // --- ここまで修正 ---
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
    [userId, user, myChatPartnerId]
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
