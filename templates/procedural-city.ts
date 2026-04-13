/**
 * ============================================================================
 * NeonEcho 程序化赛博城市系统 (Procedural Cyberpunk City)
 * ============================================================================
 * 用途: 用 InstancedMesh 高性能渲染三区（过发达/发达/欠发达）城市背景
 *
 * 核心原理:
 * - InstancedMesh 单次 Draw Call 渲染数千建筑 (实测 28x FPS 提升)
 * - setColorAt 为每个实例设置不同自发光颜色 (避免创建多个材质)
 * - copyWithin 指数扩展优化初始化 (1M 实例从 45ms→5ms)
 *
 * Key Tips:
 * - 实例变换后必须调用 computeBoundingBox() / computeBoundingSphere()
 * - setColorAt 后必须设置 instanceColor.needsUpdate = true
 *
 * Refs:
 * - mrdoob/three.js PR #25579 (copyWithin 优化)
 * - 3DStreet/3dstreet PR #1460 (28x FPS 实测数据)
 * - Block City Racer: 程序化纹理绘制
 * ============================================================================
 */

import {
  InstancedMesh,
  BoxGeometry,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  Matrix4,
  Quaternion,
  Vector3,
  Color,
  Object3D,
  Scene
} from 'three';

// -----------------------------------------------------------------------------
// 城市常量
// -----------------------------------------------------------------------------

export const CITY_RADIUS = 15; // 城市轨道半径 (米)
export const CITY_SEGMENTS = 3; // 三区: 过发达/发达/欠发达

// -----------------------------------------------------------------------------
// 建筑材质预设
// -----------------------------------------------------------------------------

/** 过发达区材质 - 重金属、锈迹、工业 */
export const MATERIAL_HYPER_INDUSTRIAL = new MeshStandardMaterial({
  metalness: 0.9,
  roughness: 0.6,
  color: new Color(0.15, 0.12, 0.1),
  emissive: new Color(0.3, 0.25, 0.0),  // 警示黄自发光
  emissiveIntensity: 0.3,
});

/** 发达区材质 - 玻璃幕墙 */
export const MATERIAL_ECO_CORPORATE = new MeshPhysicalMaterial({
  metalness: 0.1,
  roughness: 0.05,
  color: new Color(0.8, 0.9, 1.0),
  emissive: new Color(0.1, 0.2, 0.4),  // 冷蓝调
  emissiveIntensity: 0.2,
  transmission: 0.3,  // 玻璃透光
});

/** 欠发达区材质 - 老旧混凝土 + 霓虹 */
export const MATERIAL_NEON_SLUM = new MeshStandardMaterial({
  metalness: 0.4,
  roughness: 0.8,
  color: new Color(0.3, 0.25, 0.2),
  emissive: new Color(0.1, 0.0, 0.2),
  emissiveIntensity: 0.1,
});

// -----------------------------------------------------------------------------
// 工具函数
// -----------------------------------------------------------------------------

/**
 * 生成赛博朋克霓虹色调
 * HSL 范围: 青蓝(0.5) → 洋红(0.9) → 紫(0.75)
 */
export function randomCyberpunkNeonColor(): Color {
  const hue = 0.5 + Math.random() * 0.4; // 0.5-0.9
  return new Color().setHSL(hue, 1.0, 0.4 + Math.random() * 0.3);
}

/**
 * 优化版实例矩阵初始化 (ycw PR #25579)
 * 使用 copyWithin 指数扩展，比循环 setMatrixAt 快 9x
 *
 * @param mesh     - InstancedMesh 实例
 * @param count    - 实例数量
 * @param initializer - (index, matrix) => void 每实例初始化函数
 */
export function fastInitInstances(
  mesh: InstancedMesh,
  count: number,
  initializer: (index: number, matrix: Matrix4) => void
): void {
  const identity = new Matrix4();
  const matrix = new Matrix4();

  // 第一步：用单位矩阵填充第一个实例
  mesh.setMatrixAt(0, identity);

  // 第二步：copyWithin 指数扩展
  // 迭代 0: copy 0..15   → 16..31
  // 迭代 1: copy 0..31   → 32..63
  // 迭代 2: copy 0..63   → 64..127 ...
  const array = mesh.instanceMatrix.array;
  const STEP = 16;
  let copied = STEP;

  while (copied < count * 16) {
    const limit = Math.min(copied, (count * 16) - copied);
    // @ts-ignore - copyWithin 是标准 TypedArray 方法
    array.copyWithin(copied, 0, limit);
    copied *= 2;
  }

  // 第三步：用实际数据覆盖前 count 个
  for (let i = 0; i < count; i++) {
    initializer(i, matrix);
    mesh.setMatrixAt(i, matrix);
  }

  mesh.instanceMatrix.needsUpdate = true;
}

// -----------------------------------------------------------------------------
// 城市扇区类
// -----------------------------------------------------------------------------

export interface CitySectorConfig {
  /** 实例数量 */
  count: number;
  /** 扇区颜色 (HSL 主色调) */
  hueRange: [number, number]; // [min, max]
  /** 高度范围 [min, max] */
  heightRange: [number, number];
  /** 材质 */
  material: MeshStandardMaterial | MeshPhysicalMaterial;
  /** 扇区角度范围 [start, end] (弧度) */
  angleRange: [number, number];
}

export const CITY_SECTOR_CONFIGS: Record<string, CitySectorConfig> = {
  hyperIndustrial: {
    count: 2000,
    hueRange: [0.1, 0.17],  // 警示黄/生化绿
    heightRange: [5, 50],
    material: MATERIAL_HYPER_INDUSTRIAL,
    angleRange: [-Math.PI / 3, Math.PI / 3], // -60° ~ +60°
  },
  ecoCorporate: {
    count: 1500,
    hueRange: [0.55, 0.65], // 冷蓝
    heightRange: [20, 60],   // 统一高耸
    material: MATERIAL_ECO_CORPORATE,
    angleRange: [Math.PI / 3, Math.PI], // 60° ~ 180°
  },
  neonSlum: {
    count: 2500,
    hueRange: [0.75, 0.95], // 洋红/青蓝/霓虹紫
    heightRange: [2, 15],   // 高低错落
    material: MATERIAL_NEON_SLUM,
    angleRange: [Math.PI, -Math.PI / 3], // 180° ~ -60°
  },
};

export class ProceduralCitySector {
  mesh: InstancedMesh;
  private config: CitySectorConfig;
  private position = new Vector3();
  private quaternion = new Quaternion();
  private scale = new Vector3();
  private matrix = new Matrix4();
  private tempColor = new Color();

  constructor(config: CitySectorConfig) {
    this.config = config;

    const geometry = new BoxGeometry(1, 1, 1);
    this.mesh = new InstancedMesh(geometry, config.material, config.count);

    this.buildSector();
  }

  private buildSector(): void {
    const { count, heightRange, hueRange, angleRange } = this.config;

    for (let i = 0; i < count; i++) {
      // 扇区内弧形分布
      const angle = angleRange[0] + Math.random() * (angleRange[1] - angleRange[0]);
      const radius = CITY_RADIUS + (Math.random() - 0.5) * 5;
      const height = heightRange[0] + Math.random() * (heightRange[1] - heightRange[0]);
      const width = 1 + Math.random() * 4;
      const depth = 1 + Math.random() * 4;

      this.position.set(
        Math.cos(angle) * radius,
        height / 2,
        Math.sin(angle) * radius
      );
      this.scale.set(width, height, depth);
      this.matrix.compose(this.position, this.quaternion, this.scale);

      this.mesh.setMatrixAt(i, this.matrix);

      // 设置实例颜色 (如果材质支持)
      if (this.mesh.instanceColor) {
        const hue = hueRange[0] + Math.random() * (hueRange[1] - hueRange[0]);
        this.tempColor.setHSL(hue, 1.0, 0.3 + Math.random() * 0.4);
        this.mesh.setColorAt(i, this.tempColor);
      }
    }

    // 重要：标记实例颜色更新
    if (this.mesh.instanceColor) {
      this.mesh.instanceColor.needsUpdate = true;
    }

    // 重要：更新包围盒 (否则射线检测失效)
    this.mesh.computeBoundingBox();
    this.mesh.computeBoundingSphere();
  }

  /**
   * 根据相机角度控制可见性 (环形轨道优化)
   */
  setVisibleForCameraAngle(cameraAngle: number): void {
    const { angleRange } = this.config;

    // 归一化角度到 [0, 2π]
    const normalizedAngle = ((cameraAngle % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const start = ((angleRange[0] % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const end = ((angleRange[1] % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

    let isVisible: boolean;
    if (start <= end) {
      isVisible = normalizedAngle >= start && normalizedAngle <= end;
    } else {
      // 跨过 0° 边界的情况
      isVisible = normalizedAngle >= start || normalizedAngle <= end;
    }

    this.mesh.visible = isVisible;
  }

  addToScene(scene: Scene): void {
    scene.add(this.mesh);
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    // 注意：材质由外部管理，不在此处 dispose
  }
}

// -----------------------------------------------------------------------------
// 城市工厂
// -----------------------------------------------------------------------------

export interface ProceduralCityResult {
  sectorHyperIndustrial: ProceduralCitySector;
  sectorEcoCorporate: ProceduralCitySector;
  sectorNeonSlum: ProceduralCitySector;
  updateVisibility: (cameraAngle: number) => void;
}

/**
 * 创建完整的三区程序化城市
 */
export function createProceduralCity(): ProceduralCityResult {
  const sectorHyperIndustrial = new ProceduralCitySector(CITY_SECTOR_CONFIGS.hyperIndustrial);
  const sectorEcoCorporate = new ProceduralCitySector(CITY_SECTOR_CONFIGS.ecoCorporate);
  const sectorNeonSlum = new ProceduralCitySector(CITY_SECTOR_CONFIGS.neonSlum);

  return {
    sectorHyperIndustrial,
    sectorEcoCorporate,
    sectorNeonSlum,
    updateVisibility(cameraAngle: number) {
      sectorHyperIndustrial.setVisibleForCameraAngle(cameraAngle);
      sectorEcoCorporate.setVisibleForCameraAngle(cameraAngle);
      sectorNeonSlum.setVisibleForCameraAngle(cameraAngle);
    },
  };
}
