import { useCallback, useEffect } from "react";
import { DIRECTION_KEYS } from "../constants/game-world";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  addDirection,
  removeDirection,
  selectHeldDirections,
} from "../../../features/controlsSlice";
import { store } from "../../../app/store";

export const useAvatarControls = () => {
  const dispatch = useAppDispatch();
  const heldDirections = useAppSelector(selectHeldDirections);

  const handleKey = useCallback(
    (e: KeyboardEvent, isKeyDown: boolean) => {
      const state = store.getState();
      const talkingTo = (state.user.user as any)?.talkingTo;
      const isChatting = !!talkingTo;

      if (
        isChatting ||
        document.activeElement instanceof HTMLInputElement ||
        document.activeElement instanceof HTMLTextAreaElement
      ) {
        if (!isKeyDown) {
          const direction = DIRECTION_KEYS[e.code];
          if (direction) {
            dispatch(removeDirection(direction));
          }
        }
        return;
      }

      const direction = DIRECTION_KEYS[e.code];
      if (!direction) return;

      if (isKeyDown) {
        dispatch(addDirection(direction));
      } else {
        dispatch(removeDirection(direction));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
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
    const state = store.getState();
    const talkingTo = (state.user.user as any)?.talkingTo;
    const isChatting = !!talkingTo;

    if (
      isChatting ||
      document.activeElement instanceof HTMLInputElement ||
      document.activeElement instanceof HTMLTextAreaElement
    ) {
      return null;
    }
    return heldDirections[0] || null;
  }, [heldDirections]);

  return { getControlsDirection };
};
