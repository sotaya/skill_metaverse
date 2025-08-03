import React from "react";
import { Sprite, useTick } from "@pixi/react";
import { useAvatarAnimation } from "./useAvatarAnimation";
import { ANIMATION_SPEED, MOVE_SPEED } from "../constants/game-world";
import type { Direction, IPosition } from "../types/common";
import { useEffect, useRef } from "react";
import { handleMovement } from "../helpers/common";
import { AvatarList } from "./AvatarList";

interface IOtherAvatarProps {
  avatarId: number;
  position: IPosition;
  direction: Direction | null;
}

const OtherAvatarComponent: React.FC<IOtherAvatarProps> = ({
  avatarId,
  position,
  direction,
}) => {
  const avatarTextureUrl = AvatarList[avatarId] || AvatarList[0];
  const { currentTexture, updateAnimation } = useAvatarAnimation({
    spritesheetUrl: avatarTextureUrl,
    animationSpeed: ANIMATION_SPEED,
  });

  const renderedPosition = useRef<IPosition>(position);
  const targetPosition = useRef<IPosition>(position);

  useEffect(() => {
    targetPosition.current = position;
  }, [position]);

  useTick((delta) => {
    const isCurrentlyMoving =
      renderedPosition.current.x !== targetPosition.current.x ||
      renderedPosition.current.y !== targetPosition.current.y;

    if (isCurrentlyMoving) {
      const { position: newPosition } = handleMovement(
        renderedPosition.current,
        targetPosition.current,
        MOVE_SPEED,
        delta
      );
      renderedPosition.current = newPosition;
    }

    updateAnimation(direction, isCurrentlyMoving, delta);
  });

  if (!currentTexture) {
    return null;
  }

  return (
    <Sprite
      texture={currentTexture}
      x={renderedPosition.current.x}
      y={renderedPosition.current.y}
      scale={0.5}
      anchor={[0.5, 1]}
    />
  );
};

export const OtherAvatar = React.memo(OtherAvatarComponent);
