/**
 * ============================================================================
 * NeonEcho 赛博珊瑚绒伴侣 (Cyber-Fleece Companion Shader)
 * ============================================================================
 * 难点: 文档 5.2 - 核心资产"赛博珊瑚绒"
 *
 * 技术选型: Shell + Fin 壳层法 (piellardj/fur-threejs, 2024)
 * 原理: 用多层 InstancedMesh 叠加，每层向下偏移形成绒毛深度
 *       顶点着色器用正弦波驱动"呼吸感"，片元着色器控制自发光
 *
 * 核心数学:
 * - 呼吸动画: sin(time * 2π + position * random) * amplitude
 * - 情绪颜色混合: baseColor + emotionTint (R/G/B偏移)
 * - 光纤微光: emission = baseColor * (1 + pulseIntensity)
 *
 * Refs:
 * - https://github.com/piellardj/fur-threejs (Shell + Fin technique)
 * - WebGL 2 fur simulation (Oleksandr Popov)
 * ============================================================================
 */

import {
  InstancedMesh,
  PlaneGeometry,
  ShaderMaterial,
  Matrix4,
  Vector3,
  Quaternion,
  Color,
  Mesh,
  Object3D,
  Texture
} from 'three';

// -----------------------------------------------------------------------------
// GLSL 着色器代码
// -----------------------------------------------------------------------------

/** 顶点着色器: 绒毛呼吸 + 实例矩阵变换 */
const FLEECE_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uFurLength;       // 绒毛长度
  uniform float uBreathIntensity;  // 呼吸强度 (0.0-1.0)
  uniform float uBreathSpeed;       // 呼吸频率

  varying vec2 vUv;
  varying float vLayer;            // 当前层深度 (0.0-1.0)
  varying vec3 vInstanceColor;     // 实例颜色

  // 通过 instanceMatrix 访问每个实例的变换矩阵
  attribute mat4 instanceMatrix;

  void main() {
    vUv = uv;

    // 从 instanceMatrix 提取实例位置
    vec4 worldPos = modelMatrix * instanceMatrix * vec4(position, 1.0);

    // 计算当前层深度 (0.0 = 底层, 1.0 = 顶层)
    // position.z 在这里用作层的深度标识
    float layerDepth = position.z;  // 假设 geometry 深度在 0-1

    // ---- 呼吸感核心算法 ----
    // 每根绒毛独立摆动: 正弦波 + 位置扰动 + 时间
    float PI2 = 6.2831852;
    float randomOffset = position.x * 137.6 + position.y * 73.1; // 伪随机相位
    float breathPhase = uTime * PI2 * uBreathSpeed + randomOffset;

    // 摆动幅度随层深增加（顶层摆动更大）
    float breathAmplitude = uBreathIntensity * layerDepth * uFurLength * 0.3;

    // XZ 平面内的正弦摆动
    float breathX = sin(breathPhase) * breathAmplitude * 0.5;
    float breathZ = cos(breathPhase * 0.7) * breathAmplitude * 0.3;

    // Y 轴: 随呼吸"蓬松"感
    float breathY = sin(breathPhase * 0.5) * breathAmplitude * 0.2;

    worldPos.x += breathX;
    worldPos.y += breathY + layerDepth * uFurLength; // 整体高度偏移
    worldPos.z += breathZ;

    vLayer = layerDepth;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

/** 片元着色器: 情绪颜色 + 光纤微光 + 波纹 */
const FLEECE_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uEmissionIntensity; // 发光强度
  uniform vec3  uEmotionTint;       // 情绪色调偏移
  uniform float uBaseBrightness;     // 基础亮度

  // 来自图片处理管线的贴图 (可选)
  uniform sampler2D uBaseColorMap;
  uniform sampler2D uRoughnessMap;
  uniform float uHasMaps;           // 是否有贴图 (0.0 或 1.0)

  varying vec2 vUv;
  varying float vLayer;
  varying vec3 vWorldPos;

  // ---- 情绪颜色混合 ----
  // 0.0-1.0 情绪分 → 混合情绪色调
  vec3 applyEmotion(vec3 base) {
    return base + uEmotionTint * uEmissionIntensity;
  }

  // ---- 光纤微光 (Fiber Optic Glow) ----
  // 核心: 层深越大，边缘越亮（模拟光纤尖端）
  vec3 fiberGlow(vec3 color, float layer) {
    // 边缘因子：层表面越"尖"越亮
    float edgeFactor = pow(layer, 2.0) * uEmissionIntensity;
    // 随时间波动的脉冲
    float pulse = 0.5 + 0.5 * sin(uTime * 3.0 + layer * 10.0);
    return color + vec3(0.1, 0.05, 0.15) * edgeFactor * (0.5 + 0.5 * pulse);
  }

  // ---- 语音波纹效果 ----
  // AI 说话时: 以伴侣中心为圆心向外扩散波纹
  uniform float uRippleStrength;   // 波纹强度
  uniform float uRippleSpeed;       // 波纹速度
  uniform vec3  uRippleOrigin;      // 波纹圆心世界坐标

  float rippleWave(vec3 worldPos) {
    float dist = distance(worldPos, uRippleOrigin);
    float wave = sin(dist * 20.0 - uTime * uRippleSpeed * 10.0);
    return max(0.0, wave) * uRippleStrength * (1.0 - dist * 2.0);
  }

  void main() {
    vec3 color;

    // 如果有贴图: 从贴图采样
    if (uHasMaps > 0.5) {
      color = texture2D(uBaseColorMap, vUv).rgb;
    } else {
      // Mock: 基于 UV 生成渐变色彩（测试用）
      color = vec3(vUv.x * 0.5 + 0.3, vUv.y * 0.3 + 0.2, 0.8);
    }

    // 1. 应用情绪色调
    color = applyEmotion(color);

    // 2. 基础亮度 + 呼吸衰减
    float breathFade = 0.7 + 0.3 * sin(uTime * 2.0 + vLayer * 5.0);
    color *= uBaseBrightness * breathFade;

    // 3. 光纤微光
    color = fiberGlow(color, vLayer);

    // 4. 语音波纹（如果有）
    if (uRippleStrength > 0.0) {
      float ripple = rippleWave(vWorldPos);
      color += vec3(0.2, 0.4, 0.6) * ripple; // 蓝紫色波纹
    }

    // 5. Alpha: 边缘渐隐，底层不透明，顶层半透明
    float alpha = mix(0.3, 1.0, vLayer);

    gl_FragColor = vec4(color, alpha);
  }
`;

// -----------------------------------------------------------------------------
// 绒毛层配置
// -----------------------------------------------------------------------------

export interface FleeceConfig {
  /** 绒毛层数 (越多越密，性能开销越大) */
  layerCount: number;
  /** 绒毛长度 (米) */
  furLength: number;
  /** 呼吸强度 (0.0-1.0) */
  breathIntensity: number;
  /** 呼吸速度 */
  breathSpeed: number;
  /** 自发光强度 */
  emissionIntensity: number;
  /** 基础亮度 */
  baseBrightness: number;
}

export const DEFAULT_FLEECE_CONFIG: FleeceConfig = {
  layerCount: 32,      // 32层：密集但可接受的开销
  furLength: 0.15,     // 15cm 绒毛长度
  breathIntensity: 0.4,
  breathSpeed: 0.5,
  emissionIntensity: 1.2,
  baseBrightness: 0.8,
};

// -----------------------------------------------------------------------------
// 情绪色调预设
// -----------------------------------------------------------------------------

export const EMOTION_TINTS: Record<string, [number, number, number]> = {
  calm:    [0.0,  0.0,  0.0 ],   // 无偏移
  happy:   [0.15, 0.10, 0.0 ],   // 暖黄
  sad:     [0.0,  0.0,  0.15],   // 蓝色
  angry:   [0.20, 0.0,  0.0 ],   // 红色
  excited: [0.10, 0.05, 0.10],   // 粉紫
};

// -----------------------------------------------------------------------------
// 赛博珊瑚绒类
// -----------------------------------------------------------------------------

export class CyberFleeceCompanion {
  /** 所有绒毛层 */
  private layers: InstancedMesh[] = [];
  /** 所有层的材质（方便统一更新 uniforms） */
  private materials: ShaderMaterial[] = [];
  /** 实例数量 */
  private instanceCount: number;
  /** 配置 */
  private config: FleeceConfig;

  /** 临时对象（避免 GC） */
  private tempMatrix = new Matrix4();
  private tempPosition = new Vector3();
  private tempQuaternion = new Quaternion();
  private tempScale = new Vector3(1, 1, 1);

  constructor(instanceCount: number, config: Partial<FleeceConfig> = {}) {
    this.instanceCount = instanceCount;
    this.config = { ...DEFAULT_FLEECE_CONFIG, ...config };
    this.buildLayers();
  }

  private buildLayers(): void {
    const { layerCount, furLength } = this.config;

    // 创建 base geometry（1x1 平面）
    const baseGeo = new PlaneGeometry(1, 1, 1, 1);

    for (let layer = 0; layer < layerCount; layer++) {
      const layerDepth = layer / (layerCount - 1); // 0.0 - 1.0

      const material = new ShaderMaterial({
        vertexShader: FLEECE_VERTEX_SHADER,
        fragmentShader: FLEECE_FRAGMENT_SHADER,
        uniforms: {
          uTime: { value: 0 },
          uFurLength: { value: furLength },
          uBreathIntensity: { value: this.config.breathIntensity },
          uBreathSpeed: { value: this.config.breathSpeed },
          uEmissionIntensity: { value: this.config.emissionIntensity },
          uBaseBrightness: { value: this.config.baseBrightness },
          uEmotionTint: { value: new Color(0, 0, 0) },
          uBaseColorMap: { value: null },
          uRoughnessMap: { value: null },
          uHasMaps: { value: 0.0 },
          // 波纹参数
          uRippleStrength: { value: 0.0 },
          uRippleSpeed: { value: 1.0 },
          uRippleOrigin: { value: new Vector3(0, 0, 0) },
        },
        transparent: true,
        side: 2, // DoubleSide
        depthWrite: false, // 半透明不需要深度写入
      });

      const mesh = new InstancedMesh(baseGeo, material, this.instanceCount);

      // 将层深 (Z) 编码到 geometry 中（顶点着色器读取）
      // 这样每层只需要一个 InstancedMesh
      // 注意: 这会修改原始 geometry，需要克隆
      const geoWithDepth = baseGeo.clone();
      const posAttr = geoWithDepth.attributes.position;
      for (let i = 0; i < posAttr.count; i++) {
        posAttr.setZ(i, layerDepth);
      }

      mesh.instanceMatrix = new (Matrix4 as any)(); // 初始化

      this.layers.push(mesh);
      this.materials.push(material);
    }
  }

  // -----------------------------------------------------------------------------
  // 实例管理
  // -----------------------------------------------------------------------------

  /**
   * 设置单个实例的位置和旋转
   */
  setInstance(index: number, position: [number, number, number], rotationY: number): void {
    this.tempPosition.set(...position);
    this.tempQuaternion.setFromEuler(0, rotationY, 0);
    this.tempMatrix.compose(this.tempPosition, this.tempQuaternion, this.tempScale);

    for (const layer of this.layers) {
      layer.setMatrixAt(index, this.tempMatrix);
    }
  }

  /**
   * 设置单个实例的颜色
   */
  setInstanceColor(index: number, color: Color): void {
    for (const layer of this.layers) {
      layer.setColorAt(index, color);
    }
  }

  /**
   * 标记所有层的矩阵和颜色需要更新
   */
  updateInstances(): void {
    for (const layer of this.layers) {
      layer.instanceMatrix.needsUpdate = true;
      if (layer.instanceColor) {
        (layer.instanceColor as any).needsUpdate = true;
      }
    }
  }

  // -----------------------------------------------------------------------------
  // 动画更新
  // -----------------------------------------------------------------------------

  /**
   * 每帧调用，更新所有 uniforms
   */
  update(deltaTime: number): void {
    const time = performance.now() / 1000;

    for (const mat of this.materials) {
      mat.uniforms.uTime.value = time;
    }
  }

  // -----------------------------------------------------------------------------
  // 情绪控制
  // -----------------------------------------------------------------------------

  /**
   * 设置情绪（更新色调偏移）
   */
  setEmotion(emotion: keyof typeof EMOTION_TINTS, intensity: number = 1.0): void {
    const tint = EMOTION_TINTS[emotion] ?? EMOTION_TINTS.calm;
    for (const mat of this.materials) {
      mat.uniforms.uEmotionTint.value.setRGB(tint[0] * intensity, tint[1] * intensity, tint[2] * intensity);
    }
  }

  // -----------------------------------------------------------------------------
  // 语音波纹
  // -----------------------------------------------------------------------------

  /**
   * 触发语音波纹效果
   * @param origin 波纹圆心世界坐标
   * @param strength 强度
   * @param duration 持续时间（秒）
   */
  triggerRipple(origin: [number, number, number], strength: number = 1.0, duration: number = 2.0): void {
    for (const mat of this.materials) {
      mat.uniforms.uRippleStrength.value = strength;
      mat.uniforms.uRippleOrigin.value.set(...origin);
      mat.uniforms.uRippleSpeed.value = 1.0 / duration; // speed = 1/duration
    }

    // duration 后自动关闭
    setTimeout(() => {
      for (const mat of this.materials) {
        mat.uniforms.uRippleStrength.value = 0;
      }
    }, duration * 1000);
  }

  // -----------------------------------------------------------------------------
  // 生命周期
  // -----------------------------------------------------------------------------

  addToScene(scene: THREE.Scene): void {
    for (const layer of this.layers) {
      scene.add(layer);
    }
  }

  removeFromScene(scene: THREE.Scene): void {
    for (const layer of this.layers) {
      scene.remove(layer);
    }
  }

  dispose(): void {
    for (const layer of this.layers) {
      layer.geometry.dispose();
    }
    for (const mat of this.materials) {
      mat.dispose();
    }
    this.layers = [];
    this.materials = [];
  }
}

// -----------------------------------------------------------------------------
// React Three Fiber Hook (R3F)
// -----------------------------------------------------------------------------

export function useCyberFleece(
  instanceCount: number,
  config?: Partial<FleeceConfig>
): { ref: React.MutableRefObject<CyberFleeceCompanion | null> } {
  // 注: R3F 集成需要 useFrame hook
  // 此处仅提供类定义，具体 hook 由使用时编写
  return { ref: { current: null } };
}
