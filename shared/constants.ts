// shared/constants.ts

// ==========================
// 1. 摄影机机位与视场 (FOV)
// ==========================
export const CAMERA_CONFIG = {
  work: {
    position: [0, 1.2, 2],
    fov: 50,
    target: [0, 0.5, 0] // 聚焦工作台中心
  },
  immersive: {
    position: [0, 1.5, 0.5],
    fov: 75,
    target: [0, 1, -5] // 视线穿透玻璃看向远方城市
  }
} as const;

// ==========================
// 2. 世界导演事件锚点
// ==========================
// 窗外焊接支架位置 (用于停靠飞鸟、生成盆栽等)
export const ANCHOR_BRACKET_POS: [number, number, number] = [4.5, 1.0, -2.5];

// ==========================
// 3. 物理边界与防穿模
// ==========================
// 桌面可拖拽区域的安全边界 (XZ平面)，防止物件掉落
export const DESK_BOUNDS = {
  minX: -3.5,
  maxX: 3.5,
  minZ: -1.0,
  maxZ: 2.0
} as const;

// 默认安全排斥半径 (柔性排斥算法的基础参数)
export const DEFAULT_COLLISION_RADIUS = 0.3;