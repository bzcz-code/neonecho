/**
 * ============================================================================
 * NeonEcho 柔性拖拽与防穿模系统 (Soft Drag Collision System)
 * ============================================================================
 * 难点: 文档 5.7 - 全局拖拽控制与防穿模
 *
 * 技术选型: DragControls XZ 平面锁定 + AABB 柔性排斥算法
 *
 * 核心算法:
 * 1. DragControls 的 `plane` 属性限制拖拽平面（设为 XZ）
 *    或者在 onDrag 回调中强制 y = initialY
 *
 * 2. AABB 碰撞检测:
 *    - 每个物件有一个 collisionRadius（圆柱形安全区）
 *    - 碰撞判定: distXZ < radiusA + radiusB
 *
 * 3. 柔性排斥（非即时跳转）:
 *    - 不是 posB = posB + direction * overlap（会抖）
 *    - 而是 posB 平滑 lerp 滑开: posB += direction * overlap * strength
 *    - 配合 useFrame 每帧衰减，直到距离恢复安全
 *
 * 关键参数:
 * - REPULSION_STRENGTH: 每次迭代的滑开速度 (0.05-0.2)
 * - DECAY_FACTOR: 衰减系数，每次 update 后 overlap 减少
 * - MIN_DISTANCE: 最小安全距离 = radiusA + radiusB
 *
 * Refs:
 * - @react-three/drei DragControls
 * - Three.js Box3 / Sphere 包围盒
 * ============================================================================
 */

import {
  Vector3,
  Box3,
  Sphere,
  Mesh,
  Plane,
  Raycaster,
  EventDispatcher,
} from 'three';

// -----------------------------------------------------------------------------
// 类型定义
// -----------------------------------------------------------------------------

export interface DragObject {
  id: string;
  mesh: Mesh;
  /** 安全半径 (XZ 平面) */
  collisionRadius: number;
  /** 是否被拖拽中 */
  isDragging: boolean;
  /** 当前位置 */
  position: Vector3;
  /** 拖拽前的位置 */
  previousPosition: Vector3;
  /** 拖拽偏移（用于 Y 轴锁定） */
  dragYOffset: number;
}

export interface DragConfig {
  /** 排斥强度 (0.0-1.0)，每次更新被推开的速度 */
  repulsionStrength: number;
  /** 衰减因子，每次 update 后减少 */
  decayFactor: number;
  /** 边界限制 */
  bounds: {
    minX: number;
    maxX: number;
    minZ: number;
    maxZ: number;
    /** 边界弹性（碰到边界时的软反弹） */
    bounceStrength: number;
  };
  /** Y 轴固定高度（工作台平面） */
  fixedY: number;
}

// -----------------------------------------------------------------------------
// 默认配置
// -----------------------------------------------------------------------------

export const DEFAULT_DRAG_CONFIG: DragConfig = {
  repulsionStrength: 0.1,  // 每次推开 10%
  decayFactor: 0.92,        // 每次衰减 8%
  bounds: {
    minX: -2.0,
    maxX: 2.0,
    minZ: -1.5,
    maxZ: 1.5,
    bounceStrength: 0.3,
  },
  fixedY: 0.9, // 工作台高度
};

// -----------------------------------------------------------------------------
// 柔性排斥算法 (Soft Repulsion)
// -----------------------------------------------------------------------------

/**
 * 在 XZ 平面上计算两个物件的排斥力
 *
 * 原理:
 * - 当 distance < minSafeDistance 时，物件重叠
 * - 重叠量 = minSafeDistance - distance
 * - 推动方向 = normalize(posB - posA)
 * - 但不是一次性推开，而是每次只推 overlap * strength
 * - 这样会产生平滑的"滑开"效果，而非瞬时跳转
 *
 * @param objA 物件 A
 * @param objB 物件 B
 * @param config 拖拽配置
 * @returns 是否有碰撞
 */
export function computeSoftRepulsion(
  objA: DragObject,
  objB: DragObject,
  config: DragConfig
): boolean {
  // 只检查 XZ 平面距离（忽略 Y 轴）
  const dx = objB.position.x - objA.position.x;
  const dz = objB.position.z - objA.position.z;
  const distXZ = Math.sqrt(dx * dx + dz * dz);

  const minSafeDist = objA.collisionRadius + objB.collisionRadius;

  if (distXZ < minSafeDist && distXZ > 0.001) {
    // ---- 碰撞发生 ----

    const overlap = minSafeDist - distXZ;
    const directionX = dx / distXZ;
    const directionZ = dz / distXZ;

    // 柔性排斥：每次只推开 overlap 的一部分
    const pushX = directionX * overlap * config.repulsionStrength;
    const pushZ = directionZ * overlap * config.repulsionStrength;

    // 被拖拽的物件推开其他物件
    if (objA.isDragging) {
      objB.position.x += pushX;
      objB.position.z += pushZ;
    } else if (objB.isDragging) {
      objA.position.x -= pushX;
      objA.position.z -= pushZ;
    } else {
      // 两个都没被拖拽：互相推开（但力度更小）
      objA.position.x -= pushX * 0.5;
      objA.position.z -= pushZ * 0.5;
      objB.position.x += pushX * 0.5;
      objB.position.z += pushZ * 0.5;
    }

    return true;
  }

  return false;
}

// -----------------------------------------------------------------------------
// 边界约束
// -----------------------------------------------------------------------------

/**
 * 将物件位置约束在边界内
 * 支持软反弹（不是硬截断）
 */
export function constrainToBounds(
  position: Vector3,
  config: DragConfig
): void {
  const { bounds } = config;

  // X 轴
  if (position.x < bounds.minX) {
    position.x += (bounds.minX - position.x) * bounds.bounceStrength;
  } else if (position.x > bounds.maxX) {
    position.x += (bounds.maxX - position.x) * bounds.bounceStrength;
  }

  // Z 轴
  if (position.z < bounds.minZ) {
    position.z += (bounds.minZ - position.z) * bounds.bounceStrength;
  } else if (position.z > bounds.maxZ) {
    position.z += (bounds.maxZ - position.z) * bounds.bounceStrength;
  }

  // Y 轴固定（防止物件飘起来或沉下去）
  position.y = config.fixedY;
}

// -----------------------------------------------------------------------------
// 拖拽管理器
// -----------------------------------------------------------------------------

export class SoftDragManager {
  private objects: Map<string, DragObject> = new Map();
  private config: DragConfig;
  private raycaster = new Raycaster();
  private dragPlane = new Plane(new Vector3(0, 1, 0), 0); // XZ 平面

  constructor(config: Partial<DragConfig> = {}) {
    this.config = { ...DEFAULT_DRAG_CONFIG, ...config };
  }

  // -----------------------------------------------------------------------------
  // 对象管理
  // -----------------------------------------------------------------------------

  addObject(id: string, mesh: Mesh, collisionRadius: number): void {
    this.objects.set(id, {
      id,
      mesh,
      collisionRadius,
      isDragging: false,
      position: mesh.position.clone(),
      previousPosition: mesh.position.clone(),
      dragYOffset: 0,
    });
  }

  removeObject(id: string): void {
    this.objects.delete(id);
  }

  getObject(id: string): DragObject | undefined {
    return this.objects.get(id);
  }

  // -----------------------------------------------------------------------------
  // 拖拽事件
  // -----------------------------------------------------------------------------

  /**
   * 开始拖拽
   * 记录 Y 轴偏移（用于保持高度一致）
   */
  onDragStart(id: string): void {
    const obj = this.objects.get(id);
    if (!obj) return;

    obj.isDragging = true;
    obj.previousPosition.copy(obj.position);
    obj.dragYOffset = obj.position.y - this.config.fixedY;
  }

  /**
   * 更新拖拽位置
   * 强制 Y 轴锁定到工作台平面
   */
  onDragMove(
    id: string,
    worldPosition: Vector3
  ): void {
    const obj = this.objects.get(id);
    if (!obj || !obj.isDragging) return;

    // ---- Y 轴锁定 ----
    // DragControls 的 plane 属性会给出 3D 交点
    // 我们只取 XZ，Y 固定
    obj.position.x = worldPosition.x;
    obj.position.y = this.config.fixedY + obj.dragYOffset;
    obj.position.z = worldPosition.z;
  }

  /**
   * 结束拖拽
   * 同步到 mesh.position，并触发数据库保存
   */
  onDragEnd(id: string): { position: Vector3 } | null {
    const obj = this.objects.get(id);
    if (!obj) return null;

    obj.isDragging = false;

    // 同步到 mesh
    obj.mesh.position.copy(obj.position);

    // 触发边界约束
    constrainToBounds(obj.position, this.config);
    obj.mesh.position.copy(obj.position);

    return { position: obj.position.clone() };
  }

  // -----------------------------------------------------------------------------
  // 每帧更新（物理模拟）
  // -----------------------------------------------------------------------------

  /**
   * 在 useFrame 中调用
   * 逐帧解析物件之间的柔性碰撞
   */
  update(_deltaTime: number): void {
    const objects = Array.from(this.objects.values());

    // ---- 迭代解决所有碰撞 ----
    // 需要多次迭代才能稳定（类似物理引擎的松弛算法）
    for (let iteration = 0; iteration < 3; iteration++) {
      for (let i = 0; i < objects.length; i++) {
        for (let j = i + 1; j < objects.length; j++) {
          computeSoftRepulsion(objects[i], objects[j], this.config);
        }
      }
    }

    // ---- 衰减排斥力 ----
    // 随着时间推移，如果物件停止移动，它们会自然分开
    // 这里用简单的衰减：如果物件远离，就减少推送
    for (const obj of objects) {
      if (!obj.isDragging) {
        // 非拖拽物件缓慢回归原位（如果有微小漂移）
        // 简化处理：直接同步到 mesh
        obj.mesh.position.copy(obj.position);
      }
    }

    // ---- 边界约束 ----
    for (const obj of objects) {
      constrainToBounds(obj.position, this.config);
      obj.mesh.position.copy(obj.position);
    }
  }

  // -----------------------------------------------------------------------------
  // 射线检测（用于鼠标交互）
  // -----------------------------------------------------------------------------

  /**
   * 将鼠标屏幕坐标转换为 XZ 平面世界坐标
   */
  getWorldPositionOnPlane(
    clientX: number,
    clientY: number,
    camera: THREE.Camera,
    domElement: HTMLElement
  ): Vector3 | null {
    const rect = domElement.getBoundingClientRect();
    const mouse = new Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );

    this.raycaster.setFromCamera(mouse, camera);

    const target = new Vector3();
    const hit = this.raycaster.ray.intersectPlane(this.dragPlane, target);

    return hit ? target : null;
  }
}

// -----------------------------------------------------------------------------
// React Three Fiber 集成 (伪代码)
// -----------------------------------------------------------------------------

/**
 * <SoftDragPlane
 *   objects={[
 *     { id: 'companion', mesh: companionMesh, radius: 0.3 },
 *     { id: 'notepad', mesh: notepadMesh, radius: 0.25 },
 *     { id: 'cat', mesh: catMesh, radius: 0.15 },
 *   ]}
 *   bounds={{ minX: -1.5, maxX: 1.5, minZ: -1, maxZ: 1 }}
 *   onObjectMoved={(id, pos) => saveToDatabase(id, pos)}
 * />
 *
 * // DragControls 使用方式
 * import { DragControls } from 'three/addons/controls/DragControls.js'
 *
 * const dragControls = new DragControls(objects.map(o => o.mesh), camera, renderer.domElement)
 * dragControls.addEventListener('dragstart', onDragStart)
 * dragControls.addEventListener('drag', onDrag)
 * dragControls.addEventListener('dragend', onDragEnd)
 */

// -----------------------------------------------------------------------------
// 防穿模核心公式
// -----------------------------------------------------------------------------

/**
 * 软排斥物理（每帧在 useFrame 中调用）
 *
 * 伪代码:
 *
 * for each frame:
 *   for iteration in 1..3:
 *     for each pair (A, B):
 *       dist = distance(A.xz, B.xz)
 *       minDist = A.radius + B.radius
 *       if dist < minDist:
 *         overlap = minDist - dist
 *         direction = normalize(B.xz - A.xz)
 *         // 柔性推开（不是跳跃）
 *         A.xz -= direction * overlap * 0.1
 *         B.xz += direction * overlap * 0.1
 *
 *   // 边界约束
 *   for each object:
 *     object.x = clamp(object.x, bounds.minX, bounds.maxX)
 *     object.z = clamp(object.z, bounds.minZ, bounds.maxZ)
 *     object.y = fixedY  // 锁定高度
 */
