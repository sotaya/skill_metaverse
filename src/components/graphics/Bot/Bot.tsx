import { Sprite } from "@pixi/react";
import { Rectangle, Texture } from "pixi.js";
import botAsset from "../../../assets/avatar_bot.png";
import { TILE_SIZE } from "../constants/game-world";
import { useMemo } from "react";

// Botアバターのフィールド配置用コンポーネント
interface BotProps {
  x: number;
  y: number;
  width?: number;
  height?: number;
}

export const Bot = ({
  x,
  y,
  width = TILE_SIZE,
  height = TILE_SIZE,
}: BotProps) => {
  const botTexture = useMemo(() => {
    const base = Texture.from(botAsset);
    return new Texture(base.baseTexture, new Rectangle(0, 64 * 2, 64, 64));
  }, []);

  return (
    <Sprite texture={botTexture} x={x} y={y} width={width} height={height} />
  );
};
