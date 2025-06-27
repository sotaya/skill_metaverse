import { COLLISION_MAP } from "../constants/collision-map";
import { COLS, ROWS, TILE_SIZE } from "../constants/game-world";
import type { Direction, IPosition } from "../types/common";

//2Dグラフィックの処理管理
export const calculateCanvasSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return { width, height };
};

export const calculateNewTarget = (
  x: number,
  y: number,
  direction: Direction
): IPosition => {
  return {
    x:
      (x / TILE_SIZE) * TILE_SIZE +
      (direction === "LEFT"
        ? -TILE_SIZE
        : direction === "RIGHT"
        ? TILE_SIZE
        : 0),
    y:
      (y / TILE_SIZE) * TILE_SIZE +
      (direction === "UP" ? -TILE_SIZE : direction === "DOWN" ? TILE_SIZE : 0),
  };
};

export const checkCanMove = (target: IPosition) => {
  const row = Math.floor(target.y / TILE_SIZE);
  const col = Math.floor(target.x / TILE_SIZE);
  const index = COLS * row + col;
  if (index < 0 || index >= COLLISION_MAP.length) {
    return false;
  }
  return COLLISION_MAP[index] !== 1;
};

const moveTowards = (current: number, target: number, maxStep: number) => {
  return (
    current +
    Math.sign(target - current) * Math.min(Math.abs(target - current), maxStep)
  );
};

const continueMovement = (
  currentPosition: IPosition,
  targetPosition: IPosition,
  step: number
): IPosition => {
  return {
    x: moveTowards(currentPosition.x, targetPosition.x, step),
    y: moveTowards(currentPosition.y, targetPosition.y, step),
  };
};

export const handleMovement = (
  currentPosition: IPosition,
  targetPosition: IPosition,
  moveSpeed: number,
  delta: number
) => {
  const step = moveSpeed * TILE_SIZE * delta;
  const distance = Math.hypot(
    targetPosition.x - currentPosition.x,
    targetPosition.y - currentPosition.y
  );
  if (distance <= step) {
    return {
      position: targetPosition,
      completed: true,
    };
  }
  return {
    position: continueMovement(currentPosition, targetPosition, step),
    completed: false,
  };
};

export const updateCollisionMapWithCharacter = (
  prevX: number,
  prevY: number,
  newX: number,
  newY: number
) => {
  const prevRow = Math.floor(prevY / TILE_SIZE);
  const prevCol = Math.floor(prevX / TILE_SIZE);
  const prevIndex = prevRow * COLS + prevCol;
  if (
    prevRow >= 0 &&
    prevRow < ROWS &&
    prevCol >= 0 &&
    prevCol < COLS &&
    COLLISION_MAP[prevIndex] !== undefined
  ) {
    COLLISION_MAP[prevIndex] = 0;
  }

  const newRow = Math.floor(newY / TILE_SIZE);
  const newCol = Math.floor(newX / TILE_SIZE);
  const newIndex = newRow * COLS + newCol;
  if (
    newRow >= 0 &&
    newRow < ROWS &&
    newCol >= 0 &&
    newCol < COLS &&
    COLLISION_MAP[newIndex] !== undefined
  ) {
    COLLISION_MAP[newIndex] = 1;
  }
};
