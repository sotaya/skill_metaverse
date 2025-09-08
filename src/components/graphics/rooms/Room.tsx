import { Sprite } from "@pixi/react";
import roomAsset from "../../../assets/field_map.png";
import {
  GAME_HEIGHT,
  GAME_WIDTH,
  OFFSET_X,
  OFFSET_Y,
} from "../constants/game-world";

export const Room = () => {
  return (
    <Sprite
      image={roomAsset}
      width={GAME_WIDTH}
      height={GAME_HEIGHT}
      x={OFFSET_X}
      y={OFFSET_Y}
    />
  );
};
