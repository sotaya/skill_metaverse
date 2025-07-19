import React from "react";
import { Sprite, useTick } from "@pixi/react";
import { useCallback, useEffect, useRef } from "react";
import {
  DEFAULT_POS_X,
  DEFAULT_POS_Y,
  MOVE_SPEED,
  ANIMATION_SPEED,
} from "../constants/game-world";
import { useAvatarControls } from "./useAvatarControls";
import type { Direction, IPosition } from "../types/common";
import {
  calculateNewTarget,
  checkCanMove,
  handleMovement,
  updateCollisionMapForAllCharacters,
} from "../helpers/common";
import { useAvatarAnimation } from "./useAvatarAnimation";
import { AvatarList } from "./AvatarList";

interface ParticipantData {
  position: IPosition;
  userName: string;
  avatarId: number;
  direction: Direction;
}

interface IAvatarProps {
  onMove: (position: IPosition, direction: Direction | null) => void;
  userId: string;
  roomId: string;
  allPositions: { [uid: string]: ParticipantData };
  botPos: IPosition;
  avatarId: number;
}

const AvatarComponent: React.FC<IAvatarProps> = ({
  onMove,
  userId,
  allPositions,
  botPos,
  avatarId,
}) => {
  const avatarTextureUrl = AvatarList[avatarId] || AvatarList[0];

  const { currentTexture, updateAnimation } = useAvatarAnimation({
    spritesheetUrl: avatarTextureUrl,
    animationSpeed: ANIMATION_SPEED,
  });

  const position = useRef<IPosition>({ x: DEFAULT_POS_X, y: DEFAULT_POS_Y });
  const targetPosition = useRef<IPosition | null>(null);
  const currentDirection = useRef<Direction | null>(null);
  const isMoving = useRef(false);

  const { getControlsDirection } = useAvatarControls();

  useEffect(() => {
    updateCollisionMapForAllCharacters(allPositions, botPos, userId);
  }, [allPositions, botPos, userId]);

  const handleMovementCompletion = useCallback(() => {
    onMove(position.current, currentDirection.current);
    targetPosition.current = null;
    isMoving.current = false;
  }, [onMove]);

  const setNextTarget = useCallback(
    (direction: Direction) => {
      if (targetPosition.current) return;

      currentDirection.current = direction;
      const newTarget = calculateNewTarget(
        position.current.x,
        position.current.y,
        direction
      );

      if (checkCanMove(newTarget)) {
        targetPosition.current = newTarget;
        isMoving.current = true;
      } else {
        onMove(position.current, currentDirection.current);
      }
    },
    [onMove]
  );

  useEffect(() => {
    onMove(position.current, "DOWN");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useTick((delta) => {
    const direction = getControlsDirection();

    if (direction && !isMoving.current) {
      setNextTarget(direction);
    }

    if (isMoving.current && targetPosition.current) {
      const { completed, position: newPosition } = handleMovement(
        position.current,
        targetPosition.current,
        MOVE_SPEED,
        delta
      );
      position.current = newPosition;
      onMove(position.current, currentDirection.current);
      if (completed) {
        handleMovementCompletion();
      }
    }

    updateAnimation(currentDirection.current, isMoving.current, delta);
  });

  if (!currentTexture) {
    return null;
  }

  return (
    <Sprite
      texture={currentTexture}
      x={position.current.x}
      y={position.current.y}
      scale={0.5}
      anchor={[0.5, 1]}
    />
  );
};

export const Avatar = React.memo(AvatarComponent);
