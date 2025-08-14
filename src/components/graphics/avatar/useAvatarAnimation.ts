import { useRef, useState, useCallback, useEffect } from "react";
import { Texture } from "pixi.js";
import type { Direction } from "../types/common";
import { useAvatarTextures } from "./useAvatarTextures";

interface UseAvatarAnimationProps {
  spritesheetUrl: string;
  animationSpeed: number;
}

/**
 * アバターのアニメーション状態を管理し、現在のフレームのテクスチャを返すフック。
 * パフォーマンス向上のため、テクスチャが実際に変更された場合のみstateを更新します。
 * @param spritesheetUrl スプライトシートのURL
 * @param animationSpeed アニメーションの速度
 * @returns {object} 現在表示すべきテクスチャと、アニメーションを更新する関数
 */
export const useAvatarAnimation = ({
  spritesheetUrl,
  animationSpeed,
}: UseAvatarAnimationProps) => {
  const textures = useAvatarTextures(spritesheetUrl, 64, 64);
  const [currentTexture, setCurrentTexture] = useState<Texture | null>(null);

  const frameRef = useRef(0);
  const elapsedTimeRef = useRef(0);
  const lastDirectionRef = useRef<Direction | null>(null);

  const updateAnimation = useCallback(
    (direction: Direction | null, isMoving: boolean, delta: number) => {
      if (!textures) {
        return;
      }

      let nextTexture: Texture;

      if (!isMoving) {
        // 静止している場合は、方向に応じた静止フレームを表示
        frameRef.current = 0;
        switch (direction) {
          case "UP":
            nextTexture = textures.IDLE_UP;
            break;
          case "LEFT":
            nextTexture = textures.IDLE_LEFT;
            break;
          case "RIGHT":
            nextTexture = textures.IDLE_RIGHT;
            break;
          case "DOWN":
          default:
            nextTexture = textures.IDLE_DOWN;
            break;
        }
      } else {
        // 向きが変わったらアニメーションをリセット
        if (direction !== lastDirectionRef.current) {
          frameRef.current = 0;
        }
        lastDirectionRef.current = direction;

        elapsedTimeRef.current += delta;

        // アニメーションフレームを更新
        if (elapsedTimeRef.current * animationSpeed >= 1) {
          frameRef.current += 1;
          elapsedTimeRef.current = 0;
        }

        let animationFrames: Texture[] = textures.DOWN;
        switch (direction) {
          case "UP":
            animationFrames = textures.UP;
            break;
          case "LEFT":
            animationFrames = textures.LEFT;
            break;
          case "RIGHT":
            animationFrames = textures.RIGHT;
            break;
        }

        // アニメーションをループ
        if (frameRef.current >= animationFrames.length) {
          frameRef.current = 0;
        }
        nextTexture = animationFrames[frameRef.current];
      }

      // テクスチャが実際に変更された場合のみstateを更新
      setCurrentTexture((current) =>
        current !== nextTexture ? nextTexture : current
      );
    },
    [textures, animationSpeed]
  );

  // 初期テクスチャを設定
  useEffect(() => {
    if (textures && !currentTexture) {
      setCurrentTexture(textures.IDLE_DOWN);
    }
  }, [textures, currentTexture]);

  return { currentTexture, updateAnimation };
};
