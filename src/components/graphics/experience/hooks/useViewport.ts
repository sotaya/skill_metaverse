import { useState, useCallback, useRef, useEffect } from "react";
import {
  DEFAULT_POS_X,
  DEFAULT_POS_Y,
  GAME_HEIGHT,
  GAME_WIDTH,
} from "../../constants/game-world";

//カメラロジック
interface UseViewportProps {
  scale: number;
  canvasSize: { width: number; height: number };
}

export const useViewport = ({ scale, canvasSize }: UseViewportProps) => {
  const [position, setPosition] = useState({
    x: 0,
    y: 0,
  });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const clampPosition = useCallback(
    (pos: { x: number; y: number }) => {
      const gameWidth = (GAME_WIDTH + 32) * scale;
      const gameHeight = (GAME_HEIGHT + 32) * scale;
      const minX = -(gameWidth - canvasSize.width);
      const maxX = 0;
      const minY = -(gameHeight - canvasSize.height);
      const maxY = 0;
      const finalMinX = Math.min(minX, maxX);
      const finalMinY = Math.min(minY, maxY);
      return {
        x: Math.max(finalMinX, Math.min(pos.x, maxX)),
        y: Math.max(finalMinY, Math.min(pos.y, maxY)),
      };
    },
    [canvasSize.width, canvasSize.height, scale]
  );

  const handleAvatarMove = useCallback(
    (avatarPos: { x: number; y: number }) => {
      if (!canvasSize.width || !canvasSize.height) return;
      const idealPos = {
        x: -avatarPos.x * scale + canvasSize.width / 2,
        y: -avatarPos.y * scale + canvasSize.height / 2,
      };
      setPosition(clampPosition(idealPos));
    },
    [canvasSize.width, canvasSize.height, scale, clampPosition]
  );

  useEffect(() => {
    handleAvatarMove({ x: DEFAULT_POS_X, y: DEFAULT_POS_Y });
  }, [handleAvatarMove]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      setPosition((prevPos) =>
        clampPosition({ x: prevPos.x + dx, y: prevPos.y + dy })
      );
    },
    [clampPosition]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return {
    viewportPosition: position,
    handleAvatarMove,
    viewportHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
};
