import { Stage } from "@pixi/react";
import { useCallback, useEffect, useState } from "react";
import { calculateCanvasSize } from "../helpers/common";
import { MainContainer } from "./MainContainer/MainContainer";
import { GAME_WIDTH, GAME_HEIGHT } from "../constants/game-world";
import { useAppSelector } from "../../../app/hooks";
import { useViewport } from "./hooks/useViewport";
import "./Experience.scss";

// 2D空間の表示・スクロール管理
const useWindowResize = (onResize: () => void) => {
  useEffect(() => {
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [onResize]);
};

interface ExperienceProps {
  allPositions: { [uid: string]: { x: number; y: number } };
  userId: string;
}

export const Experience = ({ allPositions, userId }: ExperienceProps) => {
  const [canvasSize, setCanvasSize] = useState(calculateCanvasSize);
  const [scale] = useState(1.8);
  const roomId = useAppSelector((state) => state.room.roomId);
  const updateCanvasSize = useCallback(
    () => setCanvasSize(calculateCanvasSize()),
    []
  );
  useWindowResize(updateCanvasSize);
  const { viewportPosition, handleAvatarMove, viewportHandlers } = useViewport({
    scale,
    canvasSize,
    gameSize: { width: GAME_WIDTH + 32, height: GAME_HEIGHT + 32 },
  });

  return (
    <div className="display" {...viewportHandlers}>
      <Stage
        width={(GAME_WIDTH + 32) * scale}
        height={(GAME_HEIGHT + 32) * scale}
        options={{ backgroundColor: 0x000033 }}
      >
        <MainContainer
          canvasSize={canvasSize}
          scale={scale}
          position={viewportPosition}
          onAvatarMove={handleAvatarMove}
          allPositions={allPositions}
          userId={userId}
          roomId={roomId || ""}
        />
      </Stage>
    </div>
  );
};
