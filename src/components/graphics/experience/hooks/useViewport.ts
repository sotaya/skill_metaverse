import { useState, useCallback, useRef } from "react";

//カメラロジック
interface UseViewportProps {
  scale: number;
  canvasSize: { width: number; height: number };
  gameSize: { width: number; height: number };
}

export const useViewport = ({
  scale,
  canvasSize,
  gameSize,
}: UseViewportProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const clampPosition = useCallback(
    (pos: { x: number; y: number }) => {
      const minX = -(gameSize.width * scale - canvasSize.width);
      const maxX = 0;
      const minY = -(gameSize.height * scale - canvasSize.height);
      const maxY = 0;
      return {
        x: Math.max(minX, Math.min(pos.x, maxX)),
        y: Math.max(minY, Math.min(pos.y, maxY)),
      };
    },
    [canvasSize, gameSize, scale]
  );
  const handleAvatarMove = useCallback(
    (avatarPos: { x: number; y: number }) => {
      const idealPos = {
        x: -avatarPos.x * scale + canvasSize.width / 2,
        y: -avatarPos.y * scale + canvasSize.height / 2,
      };
      setPosition(clampPosition(idealPos));
    },
    [canvasSize, scale, clampPosition]
  );
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
      onMouseLeave: handleMouseUp, // 画面外にマウスが出た時もドラッグ終了
    },
  };
};
