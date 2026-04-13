/**
 * ============================================================================
 * NeonEcho 局部霓虹辉光系统 (Selective Neon Bloom)
 * ============================================================================
 * 用途: 只让珊瑚绒、霓虹灯牌发光，避免全局光污染
 *
 * 核心原理:
 * - 使用 Layers 系统标记需要发光的物件
 * - SelectiveUnrealBloomPass 只对指定层执行辉光计算
 * - 相比官方两遍渲染方案，此方案只需一次渲染管道
 *
 * Key Params (from @visualsource/selective-unrealbloompass):
 * - threshold: 亮度阈值 (0.0-1.0), 推荐 0.85
 * - strength:  辉光强度 (0.0-3.0), 推荐 1.5
 * - radius:    模糊半径 (0.0-1.0), 推荐 0.4
 *
 * Install: npm i @visualsource/selective-unrealbloompass
 * Docs:   https://github.com/VisualSource/selectiveUnrealBloomPass
 * ============================================================================
 */

import {
  Layers,
  Vector2,
  Mesh,
  Material
} from 'three';
import { SelectiveUnrealBloomPass } from '@visualsource/selective-unrealbloompass';

// -----------------------------------------------------------------------------
// 辉光层常量
// -----------------------------------------------------------------------------

/** 辉光层编号 (可与其他 Layers 共存) */
export const BLOOM_LAYER = 1;

// -----------------------------------------------------------------------------
// 工厂函数
// -----------------------------------------------------------------------------

/**
 * 创建选择性霓虹辉光通道
 *
 * @param width  - 渲染宽度
 * @param height - 渲染高度
 * @param scene  - Three.js 场景
 * @param camera - Three.js 相机
 */
export function createNeonBloomPass(
  width: number,
  height: number,
  scene: THREE.Scene,
  camera: THREE.Camera
): SelectiveUnrealBloomPass {
  const bloomPass = new SelectiveUnrealBloomPass(
    new Vector2(width, height),
    1.5,   // strength  - 霓虹灯需要较强辉光
    0.4,   // radius   - 中等模糊半径
    0.85,  // threshold - 高阈值确保只有发光源触发
    true,  // selective - 开启选择模式
    BLOOM_LAYER,
    scene,
    camera
  );

  return bloomPass;
}

// -----------------------------------------------------------------------------
// 辉光层控制
// -----------------------------------------------------------------------------

/**
 * 标记物件为发光体 (加入辉光层)
 */
export function enableBloom(mesh: Mesh): void {
  mesh.layers.enable(BLOOM_LAYER);
}

/**
 * 移除物件的发光标记
 */
export function disableBloom(mesh: Mesh): void {
  mesh.layers.disable(BLOOM_LAYER);
}

/**
 * 场景中所有物件默认关闭辉光
 */
export function disableBloomAll(scene: THREE.Scene): void {
  scene.traverse((obj) => {
    if (obj instanceof Mesh) {
      obj.layers.disable(BLOOM_LAYER);
    }
  });
}

/**
 * 二人世界模式：只让珊瑚绒发光，其他全部关闭
 */
export function enableFocusBloomMode(scene: THREE.Scene, companion: Mesh, bloomPass: SelectiveUnrealBloomPass): void {
  disableBloomAll(scene);
  enableBloom(companion);
  bloomPass.strength = 2.0; // 增强聚焦
}

/**
 * 恢复正常辉光模式
 */
export function disableFocusBloomMode(scene: THREE.Scene, bloomPass: SelectiveUnrealBloomPass): void {
  // 注意：调用方需要根据具体场景重新启用需要的物件辉光
  bloomPass.strength = 1.5; // 恢复正常强度
}

// -----------------------------------------------------------------------------
// 内置辉光强度预设
// -----------------------------------------------------------------------------

export const BLOOM_PRESETS = {
  /** 默认霓虹模式 */
  default: { strength: 1.5, threshold: 0.85, radius: 0.4 },

  /** 二人世界聚焦模式 */
  focus: { strength: 2.0, threshold: 0.9, radius: 0.3 },

  /** 雨夜朦胧模式 */
  rainy: { strength: 1.8, threshold: 0.7, radius: 0.5 },

  /** 节能模式 (低配设备) */
  lowPower: { strength: 0.8, threshold: 0.9, radius: 0.2 },
} as const;

/**
 * 应用辉光预设
 */
export function applyBloomPreset(
  bloomPass: SelectiveUnrealBloomPass,
  preset: keyof typeof BLOOM_PRESETS
): void {
  const { strength, threshold, radius } = BLOOM_PRESETS[preset];
  bloomPass.strength = strength;
  bloomPass.threshold = threshold;
  bloomPass.radius = radius;
}
