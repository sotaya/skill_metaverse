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
  const [viewportPosition, setViewportPosition] = useState({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });
  const targetPosition = useRef({ x: 0, y: 0 });

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
      targetPosition.current = clampPosition(idealPos);
    },
    [canvasSize.width, canvasSize.height, scale, clampPosition]
  );

  useEffect(() => {
    const initialAvatarPos = { x: DEFAULT_POS_X, y: DEFAULT_POS_Y };
    if (!canvasSize.width || !canvasSize.height) return;

    const idealPos = {
      x: -initialAvatarPos.x * scale + canvasSize.width / 2,
      y: -initialAvatarPos.y * scale + canvasSize.height / 2,
    };
    const initialPos = clampPosition(idealPos);

    currentPosition.current = initialPos;
    targetPosition.current = initialPos;
    setViewportPosition(initialPos);
  }, [canvasSize.width, canvasSize.height, scale, clampPosition]);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      const current = currentPosition.current;
      const target = targetPosition.current;

      const dx = target.x - current.x;
      const dy = target.y - current.y;

      if (Math.abs(dx) < 0.1 && Math.abs(dy) < 0.1) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      const easingFactor = 0.1;
      const newX = current.x + dx * easingFactor;
      const newY = current.y + dy * easingFactor;

      currentPosition.current = { x: newX, y: newY };
      setViewportPosition(currentPosition.current);

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

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

      const newPos = clampPosition({
        x: currentPosition.current.x + dx,
        y: currentPosition.current.y + dy,
      });

      currentPosition.current = newPos;
      targetPosition.current = newPos;
      setViewportPosition(newPos);
    },
    [clampPosition]
  );

  const handleMouseUp = useCallback(() => {
    isDragging.current = false;
  }, []);

  return {
    viewportPosition,
    handleAvatarMove,
    viewportHandlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
    },
  };
};
