import { Container, Sprite, useTick } from "@pixi/react";
import type { Texture } from "pixi.js";
import { useCallback, useEffect, useRef } from "react";
import {
  ANIMATION_SPEED,
  COLS,
  DEFAULT_POS_X,
  DEFAULT_POS_Y,
  MOVE_SPEED,
  ROWS,
  TILE_SIZE,
} from "../constants/game-world";
import { useAvatarControls } from "./useAvatarControls";
import type { Direction, IPosition } from "../types/common";
import {
  calculateNewTarget,
  checkCanMove,
  handleMovement,
  updateCollisionMapWithCharacter,
} from "../helpers/common";
import { useAvatarAnimation } from "./useAvatarAnimation";
import { COLLISION_MAP } from "../constants/collision-map";
import { auth, db } from "../../../firebase";
import { doc, setDoc } from "firebase/firestore";

//アバターの描画・移動操作管理
interface IAvatarProps {
  texture: Texture;
  onMove: (gridX: number, gridY: number) => void;
  userId: string;
  roomId: string;
  allPositions: { [uid: string]: IPosition };
}

export const Avatar = ({
  texture,
  onMove,
  userId,
  roomId,
  allPositions,
}: IAvatarProps) => {
  const position = useRef<IPosition>({ x: DEFAULT_POS_X, y: DEFAULT_POS_Y });
  const prevPosition = useRef<IPosition>({
    x: DEFAULT_POS_X,
    y: DEFAULT_POS_Y,
  });
  const targetPosition = useRef<IPosition | null>(null);
  const currentDirection = useRef<Direction | null>(null);
  const isMoving = useRef(false);
  const { getControlsDirection } = useAvatarControls();
  const direction = getControlsDirection();
  const { sprite, updateSprite } = useAvatarAnimation({
    texture,
    frameHeight: 64,
    frameWidth: 64,
    totalFrames: 9,
    animationSpeed: ANIMATION_SPEED,
  });

  const updatePositionInFirestore = async (pos: IPosition) => {
    const user = auth.currentUser;
    if (user && roomId) {
      const positionDocRef = doc(db, "rooms", roomId, "positions", user.uid);
      await setDoc(positionDocRef, { x: pos.x, y: pos.y });
    }
  };

  const handleMovementCompletion = () => {
    const finalPosition = position.current;

    onMove(finalPosition.x, finalPosition.y);
    updatePositionInFirestore(finalPosition);
    updateCollisionMapWithCharacter(
      prevPosition.current.x,
      prevPosition.current.y,
      finalPosition.x,
      finalPosition.y
    );

    prevPosition.current = { ...finalPosition };
    targetPosition.current = null;
    isMoving.current = false;
  };

  const canMoveTo = useCallback(
    (target: IPosition): boolean => {
      return !Object.entries(allPositions).some(
        ([uid, pos]) =>
          uid !== userId && pos.x === target.x && pos.y === target.y
      );
    },
    [allPositions, userId]
  );

  const setNextTarget = useCallback(
    (direction: Direction) => {
      if (targetPosition.current) return;
      const newTarget = calculateNewTarget(
        position.current.x,
        position.current.y,
        direction
      );
      if (checkCanMove(newTarget) && canMoveTo(newTarget)) {
        targetPosition.current = newTarget;
        currentDirection.current = direction;
      }
    },
    [canMoveTo]
  );

  useEffect(() => {
    const initialRow = Math.floor(position.current.y / TILE_SIZE);
    const initialCol = Math.floor(position.current.x / TILE_SIZE);
    const idx = initialRow * COLS + initialCol;
    if (
      initialRow >= 0 &&
      initialRow < ROWS &&
      initialCol >= 0 &&
      initialCol < COLS
    ) {
      COLLISION_MAP[idx] = 1;
    }
    onMove(position.current.x, position.current.y);
  }, [onMove]);

  useTick((delta) => {
    if (direction) {
      setNextTarget(direction);
    }
    if (targetPosition.current) {
      isMoving.current = true;
      const { completed, position: newPosition } = handleMovement(
        position.current,
        targetPosition.current,
        MOVE_SPEED,
        delta
      );
      position.current = newPosition;
      if (completed) {
        handleMovementCompletion();
      }
    } else {
      isMoving.current = false;
    }
    updateSprite(currentDirection.current, isMoving.current);
  });

  return (
    <Container>
      {sprite && (
        <Sprite
          texture={sprite.texture}
          x={position.current.x}
          y={position.current.y}
          scale={0.5}
          anchor={[1, 0.5]}
        />
      )}
    </Container>
  );
};
