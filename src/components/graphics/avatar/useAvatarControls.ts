import { useCallback, useEffect, useState } from "react";
import type { Direction } from "../types/common";
import { DIRECTION_KEYS } from "../constants/game-world";

//アバター操作処理管理
export const useAvatarControls = () => {
  const [heldDirection, setHeldDorection] = useState<Direction[]>([]);
  const handleKey = useCallback((e: KeyboardEvent, isKeyDown: boolean) => {
    const direction = DIRECTION_KEYS[e.code];
    if (!direction) return;
    setHeldDorection((prev) => {
      if (isKeyDown) {
        return prev.includes(direction) ? prev : [direction, ...prev];
      }
      return prev.filter((dir) => dir !== direction);
    });
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
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
    return heldDirection[0] || null;
  }, [heldDirection]);
  return { getControlsDirection };
};
