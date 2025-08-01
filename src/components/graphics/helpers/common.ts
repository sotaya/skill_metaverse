import { COLLISION_MAP } from "../constants/collision-map";
import { COLS, ROWS, TILE_SIZE } from "../constants/game-world";
import type { Direction, IPosition } from "../types/common";

// 2Dグラフィックの処理管理
export const calculateCanvasSize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  return { width, height };
};

/**
 * 現在位置から指定された方向の次の目標タイル座標を計算します。
 * @param x 現在のX座標
 * @param y 現在のY座標
 * @param direction 移動方向
 * @returns 次の目標タイル座標
 */
export const calculateNewTarget = (
  x: number,
  y: number,
  direction: Direction
): IPosition => {
  const currentTileX = Math.round(x / TILE_SIZE) * TILE_SIZE;
  const currentTileY = Math.round(y / TILE_SIZE) * TILE_SIZE;

  return {
    x:
      currentTileX +
      (direction === "LEFT"
        ? -TILE_SIZE
        : direction === "RIGHT"
        ? TILE_SIZE
        : 0),
    y:
      currentTileY +
      (direction === "UP" ? -TILE_SIZE : direction === "DOWN" ? TILE_SIZE : 0),
  };
};

/**
 * 指定したタイルが移動可能かどうかをチェックします。
 * @param target チェックする目標座標
 * @returns 移動可能であればtrue
 */
export const checkCanMove = (target: IPosition) => {
  const row = Math.round(target.y / TILE_SIZE);
  const col = Math.round(target.x / TILE_SIZE);
  const index = COLS * row + col;

  if (index < 0 || index >= COLLISION_MAP.length) {
    return false;
  }
  const tileValue = COLLISION_MAP[index];
  return tileValue !== 1 && tileValue !== 2;
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

/**
 * 全てのプレイヤーとBotの位置情報に基づいて衝突マップを更新します。
 * @param allPositions 全プレイヤーの位置情報を含むオブジェクト
 * @param botPos Botの位置情報
 * @param currentUserId 現在操作しているユーザーのID（このユーザーは障害物として扱わない）
 */
export const updateCollisionMapForAllCharacters = (
  allPositions: { [uid: string]: { position: IPosition } },
  botPos: IPosition,
  currentUserId: string
) => {
  // まず、キャラクターに由来する衝突情報(値が2)をリセット
  for (let i = 0; i < COLLISION_MAP.length; i++) {
    if (COLLISION_MAP[i] === 2) {
      COLLISION_MAP[i] = 0;
    }
  }

  // 他のプレイヤーの位置を衝突マップに設定
  Object.entries(allPositions).forEach(([uid, player]) => {
    if (uid !== currentUserId && player.position) {
      const row = Math.round(player.position.y / TILE_SIZE);
      const col = Math.round(player.position.x / TILE_SIZE);
      const index = row * COLS + col;

      if (row >= 0 && row < ROWS && col >= 0 && col < COLS) {
        COLLISION_MAP[index] = 2;
      }
    }
  });

  // Botの位置を衝突マップに設定
  if (botPos) {
    const botRow = Math.round(botPos.y / TILE_SIZE);
    const botCol = Math.round(botPos.x / TILE_SIZE);
    const botIndex = botRow * COLS + botCol;
    if (botRow >= 0 && botRow < ROWS && botCol >= 0 && botCol < COLS) {
      COLLISION_MAP[botIndex] = 2;
    }
  }
};
