import { useMemo, useState, useEffect } from "react";
import { Texture, Rectangle, BaseTexture } from "pixi.js";

interface AnimationFrames {
  UP: Texture[];
  DOWN: Texture[];
  LEFT: Texture[];
  RIGHT: Texture[];
  IDLE_UP: Texture;
  IDLE_DOWN: Texture;
  IDLE_LEFT: Texture;
  IDLE_RIGHT: Texture;
}

const FRAME_CONFIG = {
  UP: { row: 8, frames: 9 },
  LEFT: { row: 9, frames: 9 },
  DOWN: { row: 10, frames: 9 },
  RIGHT: { row: 11, frames: 9 },
};

/**
 * @param spritesheetUrl スプライトシートのURL
 * @param frameWidth 各フレームの幅
 * @param frameHeight 各フレームの高さ
 * @returns アニメーション方向ごとのテクスチャのセット、またはロード中はnull
 */
export const useAvatarTextures = (
  spritesheetUrl: string,
  frameWidth: number,
  frameHeight: number
): AnimationFrames | null => {
  const [isLoaded, setIsLoaded] = useState(false);

  const baseTexture = useMemo(
    () => BaseTexture.from(spritesheetUrl),
    [spritesheetUrl]
  );

  useEffect(() => {
    if (baseTexture.valid) {
      setIsLoaded(true);
      return;
    }

    const onUpdate = () => {
      setIsLoaded(true);
    };

    baseTexture.on("update", onUpdate);

    return () => {
      baseTexture.off("update", onUpdate);
    };
  }, [baseTexture]);

  const textures = useMemo(() => {
    if (!isLoaded) {
      return null;
    }

    const generateFrames = (row: number, frameCount: number): Texture[] => {
      const frames: Texture[] = [];
      for (let i = 0; i < frameCount; i++) {
        const frame = new Texture(
          baseTexture,
          new Rectangle(
            i * frameWidth,
            row * frameHeight,
            frameWidth,
            frameHeight
          )
        );
        frames.push(frame);
      }
      return frames;
    };

    return {
      UP: generateFrames(FRAME_CONFIG.UP.row, FRAME_CONFIG.UP.frames),
      DOWN: generateFrames(FRAME_CONFIG.DOWN.row, FRAME_CONFIG.DOWN.frames),
      LEFT: generateFrames(FRAME_CONFIG.LEFT.row, FRAME_CONFIG.LEFT.frames),
      RIGHT: generateFrames(FRAME_CONFIG.RIGHT.row, FRAME_CONFIG.RIGHT.frames),
      IDLE_UP: generateFrames(FRAME_CONFIG.UP.row, 1)[0],
      IDLE_DOWN: generateFrames(FRAME_CONFIG.DOWN.row, 1)[0],
      IDLE_LEFT: generateFrames(FRAME_CONFIG.LEFT.row, 1)[0],
      IDLE_RIGHT: generateFrames(FRAME_CONFIG.RIGHT.row, 1)[0],
    };
  }, [isLoaded, baseTexture, frameWidth, frameHeight]);

  return textures;
};
