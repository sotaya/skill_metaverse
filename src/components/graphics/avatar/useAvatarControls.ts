import { useCallback, useEffect, useState } from "react";
import type { Direction } from "../types/common";
import { DIRECTION_KEYS } from "../constants/game-world";
import { store } from "../../../app/store";

//アバター操作処理管理
export const useAvatarControls = () => {
  const [heldDirection, setHeldDirection] = useState<Direction[]>([]);

  const handleKey = useCallback((e: KeyboardEvent, isKeyDown: boolean) => {
    // イベント発生時にストアから最新の状態を取得
    const state = store.getState();
    const talkingTo = (state.user.user as any)?.talkingTo;
    const isChatting = !!talkingTo;

    // チャット中やテキスト入力中はキー操作を無視する
    if (
      isChatting ||
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement
    ) {
      // キーが離されたイベントは処理して、配列から方向をクリアする
      if (!isKeyDown) {
        const direction = DIRECTION_KEYS[e.code];
        if (!direction) return;
        setHeldDirection((prev) => prev.filter((dir) => dir !== direction));
      }
      return;
    }

    const direction = DIRECTION_KEYS[e.code];
    if (!direction) return;

    setHeldDirection((prev) => {
      if (isKeyDown) {
        return prev.includes(direction) ? prev : [direction, ...prev];
      }
      return prev.filter((dir) => dir !== direction);
    });
  }, []); // 依存配列は空でOK

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // テキスト入力中以外はデフォルトのスクロールなどを防ぐ
      if (
        !(
          document.activeElement instanceof HTMLInputElement ||
          document.activeElement instanceof HTMLTextAreaElement
        )
      ) {
        e.preventDefault();
      }
      handleKey(e, true);
    };
    const handleKeyUp = (e: KeyboardEvent) => handleKey(e, false);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKey]);

  const getControlsDirection = useCallback(() => {
    // こちらでも最新の状態をストアから取得
    const state = store.getState();
    const talkingTo = (state.user.user as any)?.talkingTo;
    const isChatting = !!talkingTo;

    // チャット中やテキスト入力中は移動しない
    if (
      isChatting ||
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement
    ) {
      return null;
    }
    return heldDirection[0] || null;
  }, [heldDirection]);

  return { getControlsDirection };
};
