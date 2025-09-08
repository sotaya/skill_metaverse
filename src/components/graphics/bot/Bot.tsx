import { Sprite, useTick } from "@pixi/react";
import { useAvatarAnimation } from "../avatar/useAvatarAnimation";
import { ANIMATION_SPEED } from "../constants/game-world";
import type { Direction } from "../types/common";
import avatarBot from "../../../assets/avatar_bot.png";

interface IBotProps {
  x: number;
  y: number;
  direction: Direction | null;
}

export const Bot: React.FC<IBotProps> = ({ x, y, direction }) => {
  const { currentTexture, updateAnimation } = useAvatarAnimation({
    spritesheetUrl: avatarBot,
    animationSpeed: ANIMATION_SPEED,
  });

  useTick((delta) => {
    updateAnimation(direction, false, delta);
  });

  if (!currentTexture) {
    return null;
  }
  return (
    <Sprite
      texture={currentTexture}
      x={x}
      y={y}
      scale={0.5}
      anchor={[0.5, 1]}
    />
  );
};
