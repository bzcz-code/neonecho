/**
 * ============================================================================
 * NeonEcho 8-bit 故障猫 (Glitch Cat Billboard + CRT Shader)
 * ============================================================================
 * 难点: 文档 5.3 - 8-bit 故障风小猫
 *
 * 技术选型:
 * - Billboard 技术: 2D 面片始终朝向相机（Dakota, StackOverflow 2019）
 * - CRT 故障滤镜: Scanlines + Chromatic Aberration + Glitch Displacement
 *
 * Billboard 核心算法 (顶点着色器):
 * - 从 viewMatrix 提取 cameraRight 和 cameraUp
 * - 固定 Y 轴避免镜头在上时翻转
 * - 偏移 = right * v.x + up * v.y
 *
 * CRT Shader 效果叠加:
 * - Scanlines: 水平扫描线 (mod gl_FragCoord.y)
 * - Chromatic Aberration: RGB 通道分离偏移
 * - Glitch Displacement: 周期性水平错位
 * - Vignette: 暗角色调
 *
 * Refs:
 * - https://stackoverflow.com/questions/55582846 (Dakota Billboard)
 * - https://github.com/stefanlegg/crt-fx (CRT FX library)
 * - https://github.com/luiscarlospando/crt-shader (GLSL CRT)
 * ============================================================================
 */

import {
  PlaneGeometry,
  ShaderMaterial,
  Mesh,
  Camera,
  Vector3,
  Matrix4,
  MeshBasicMaterial,
  Texture,
} from 'three';

// -----------------------------------------------------------------------------
// Billboard 顶点着色器 (核心算法)
// -----------------------------------------------------------------------------

/**
 * Billboard 顶点着色器 - 始终面向相机，Y轴固定
 *
 * 原理:
 * 1. 从 viewMatrix 提取相机的 right(+X) 和 up(+Y) 轴向量
 * 2. 用这两个轴向量重建一个始终朝向相机的平面
 * 3. Y轴固定 (0,1,0) 防止镜头从上方俯视时画面翻转
 *
 * @param viewMatrix - Three.js viewMatrix (uniform)
 * @param position - 顶点本地坐标
 * @param offset - 顶点相对实例中心的 XY 偏移 (来自 UV 或属性)
 * @param instanceOffset - 实例世界坐标
 * @param size - Billboard 宽高
 */
const BILLBOARD_VERTEX_SHADER = `
  uniform mat4 viewMatrix;
  uniform vec3 uInstanceOffset;  // 实例世界位置
  uniform vec2 uSize;          // Billboard 宽高

  attribute vec2 offset;       // 顶点 XY 偏移 (from -0.5 to 0.5)

  varying vec2 vUv;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;

    // ---- 从 viewMatrix 提取相机轴向量 ----
    // viewMatrix 列主序:
    //   column 0: camera right vector  (viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0])
    //   column 1: camera up vector     (viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1])
    vec3 cameraRight = normalize(vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]));
    vec3 cameraUp    = normalize(vec3(0.0, 1.0, 0.0)); // Y轴固定，防止翻转

    // ---- 构建 Billboard 位置 ----
    // 偏移量 = right * v.x + up * v.y，然后缩放
    vec3 rightOffset = cameraRight * offset.x * uSize.x;
    vec3 upOffset   = cameraUp    * offset.y * uSize.y;

    vec3 worldPos = uInstanceOffset + rightOffset + upOffset;
    vWorldPos = worldPos;

    gl_Position = projectionMatrix * viewMatrix * vec4(worldPos, 1.0);
  }
`;

// -----------------------------------------------------------------------------
// CRT + Glitch 片元着色器
// -----------------------------------------------------------------------------

/**
 * CRT + Glitch 片元着色器
 *
 * 效果叠加顺序:
 * 1. 基础纹理采样
 * 2. Scanlines: 水平扫描线
 * 3. Chromatic Aberration: RGB 通道分离（故障感核心）
 * 4. Glitch Displacement: 周期性水平错位
 * 5. Vignette: 暗角色调
 * 6. Noise/Flicker: 动态噪点
 */
const CRT_GLITCH_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uGlitchIntensity;   // 故障强度 (0.0-1.0)
  uniform float uScanlineIntensity; // 扫描线强度
  uniform float uChromaticOffset;   // 色差偏移量
  uniform sampler2D uTexture;      // 猫咪精灵图

  varying vec2 vUv;
  varying vec3 vWorldPos;

  // ---- 伪随机函数 ----
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // ---- Scanlines: 水平扫描线 ----
  // 原理: 用 sin + mod 在 Y 轴方向生成明暗交替条纹
  float scanline(vec2 uv, float intensity) {
    float scanlineCount = 300.0; // 扫描线密度
    float line = sin(uv.y * scanlineCount * 3.14159 * 2.0);
    // 将 [1, -1] 映射到 [1, 1-intensity]
    float effect = mix(1.0, 1.0 - intensity, step(0.0, line));
    return effect;
  }

  // ---- Chromatic Aberration: 色差 ----
  // 原理: R/G/B 三个通道用不同的 UV 偏移采样
  vec3 chromaticAberration(vec2 uv, float offset) {
    // 偏移方向：从中心向外的径向偏移
    vec2 dir = normalize(uv - 0.5);
    float dist = length(uv - 0.5);

    vec2 rUV = uv + dir * offset * dist;
    vec2 gUV = uv;
    vec2 bUV = uv - dir * offset * dist;

    float r = texture2D(uTexture, rUV).r;
    float g = texture2D(uTexture, gUV).g;
    float b = texture2D(uTexture, bUV).b;

    return vec3(r, g, b);
  }

  // ---- Glitch Displacement: 故障错位 ----
  // 原理: 周期性在某些"扫描线"上施加水平位移
  float glitchDisplacement(vec2 uv, float time, float intensity) {
    // 每隔一段时间随机触发一次故障
    float glitchTick = floor(time * 8.0); // 8Hz
    float glitchRand = random(vec2(glitchTick, 0.0));

    // 只在某些行发生错位
    float scanY = floor(uv.y * 50.0) / 50.0;
    float scanRand = random(vec2(scanY, glitchTick));

    if (scanRand > 1.0 - intensity * 0.3) {
      float displacement = (glitchRand - 0.5) * intensity * 0.1;
      return displacement;
    }
    return 0.0;
  }

  // ---- Vignette: 暗角色调 ----
  float vignette(vec2 uv, float intensity) {
    float dist = length(uv - 0.5);
    return 1.0 - dist * dist * intensity;
  }

  // ---- Noise/Flicker: 噪点闪烁 ----
  float noise(vec2 uv, float time) {
    float tick = floor(time * 30.0);
    return random(uv + vec2(tick)) * 0.05;
  }

  void main() {
    vec2 uv = vUv;

    // 1. 故障错位（影响后续所有效果）
    float glitchOff = glitchDisplacement(uv, uTime, uGlitchIntensity);
    uv.x += glitchOff;

    // 2. Chromatic Aberration
    vec3 color = chromaticAberration(uv, uChromaticOffset);

    // 3. Scanlines
    float scan = scanline(uv, uScanlineIntensity);
    color *= scan;

    // 4. Vignette
    color *= vignette(uv, 0.5);

    // 5. Noise
    color += noise(uv, uTime);

    // 6. 故障时整体亮度闪烁
    float glitchTick = floor(uTime * 8.0);
    float glitchRand = random(vec2(glitchTick, 0.0));
    if (glitchRand > 0.95) {
      color *= 1.5; // 闪白
    }

    gl_FragColor = vec4(color, 1.0);
  }
`;

// -----------------------------------------------------------------------------
// 预设配置
// -----------------------------------------------------------------------------

export interface GlitchCatConfig {
  /** Billboard 尺寸 [width, height] */
  size: [number, number];
  /** 故障强度 (0.0-1.0) */
  glitchIntensity: number;
  /** 扫描线强度 (0.0-1.0) */
  scanlineIntensity: number;
  /** 色差偏移量 */
  chromaticOffset: number;
  /** 是否自动播放动画 */
  autoAnimate: boolean;
}

export const DEFAULT_GLITCH_CAT_CONFIG: GlitchCatConfig = {
  size: [0.3, 0.25],
  glitchIntensity: 0.3,
  scanlineIntensity: 0.4,
  chromaticOffset: 0.02,
  autoAnimate: true,
};

// -----------------------------------------------------------------------------
// 状态机
// -----------------------------------------------------------------------------

export type CatBehaviorState = 'idle' | 'walking' | 'sleeping' | 'watching' | 'washing';

export const CAT_STATE_SPEEDS: Record<CatBehaviorState, number> = {
  idle: 0,
  walking: 0.05,
  sleeping: 0,
  watching: 0.02,
  washing: 0.03,
};

// -----------------------------------------------------------------------------
// 故障猫类
// -----------------------------------------------------------------------------

export class GlitchCat {
  private mesh: Mesh;
  private material: ShaderMaterial;
  private config: GlitchCatConfig;

  // 临时对象
  private tempOffset = new Float32Array(4 * 2); // 4 vertices * 2 (x,y)

  constructor(config: Partial<GlitchCatConfig> = {}) {
    this.config = { ...DEFAULT_GLITCH_CAT_CONFIG, ...config };

    // 创建 PlaneGeometry，带 offset 属性
    const geometry = new PlaneGeometry(1, 1, 1, 1);

    // 添加 offset 属性（Billboard 用）
    const offsetAttr = new (BufferAttribute as any)(
      new Float32Array([
        -0.5, -0.5,  // 左下
         0.5, -0.5,  // 右下
        -0.5,  0.5,  // 左上
         0.5,  0.5,  // 右上
      ]),
      2
    );
    geometry.setAttribute('offset', offsetAttr);

    this.material = new ShaderMaterial({
      vertexShader: BILLBOARD_VERTEX_SHADER,
      fragmentShader: CRT_GLITCH_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uGlitchIntensity: { value: this.config.glitchIntensity },
        uScanlineIntensity: { value: this.config.scanlineIntensity },
        uChromaticOffset: { value: this.config.chromaticOffset },
        uInstanceOffset: { value: new Vector3(0, 0, 0) },
        uSize: { value: new Vector3(...this.config.size, 0) },
        uTexture: { value: null },
      },
      transparent: false,
      depthTest: false, // Billboard 不写入深度
      depthWrite: false,
    });

    this.mesh = new Mesh(geometry, this.material);
    this.mesh.frustumCulled = false; // 始终渲染
  }

  // -----------------------------------------------------------------------------
  // 位置控制
  // -----------------------------------------------------------------------------

  setPosition(x: number, y: number, z: number): void {
    this.material.uniforms.uInstanceOffset.value.set(x, y, z);
  }

  setSize(width: number, height: number): void {
    this.material.uniforms.uSize.value.set(width, height, 0);
  }

  // -----------------------------------------------------------------------------
  // 状态切换
  // -----------------------------------------------------------------------------

  setState(state: CatBehaviorState): void {
    switch (state) {
      case 'idle':
        this.material.uniforms.uGlitchIntensity.value = 0.1;
        this.material.uniforms.uScanlineIntensity.value = 0.3;
        break;

      case 'walking':
        this.material.uniforms.uGlitchIntensity.value = 0.2;
        this.material.uniforms.uScanlineIntensity.value = 0.5;
        break;

      case 'sleeping':
        // 睡觉时减少故障，扫描线变慢
        this.material.uniforms.uGlitchIntensity.value = 0.05;
        this.material.uniforms.uScanlineIntensity.value = 0.2;
        this.material.uniforms.uChromaticOffset.value = 0.01;
        break;

      case 'watching':
        // 盯人时色差加大
        this.material.uniforms.uGlitchIntensity.value = 0.4;
        this.material.uniforms.uChromaticOffset.value = 0.04;
        break;

      case 'washing':
        this.material.uniforms.uGlitchIntensity.value = 0.3;
        break;
    }
  }

  /**
   * AI 说话时增强故障效果
   */
  triggerAISpeaking(active: boolean): void {
    if (active) {
      this.material.uniforms.uGlitchIntensity.value = 0.8;
      this.material.uniforms.uChromaticOffset.value = 0.05;
    } else {
      this.setState('idle');
    }
  }

  /**
   * 音乐 BPM > 120 时增强摇头效果（加速）
   */
  setMusicBPM(bpm: number): void {
    if (bpm > 120) {
      // 更频繁的故障闪烁
      this.material.uniforms.uGlitchIntensity.value = 0.6;
    } else {
      this.material.uniforms.uGlitchIntensity.value = 0.2;
    }
  }

  // -----------------------------------------------------------------------------
  // 动画更新
  // -----------------------------------------------------------------------------

  update(deltaTime: number): void {
    if (this.config.autoAnimate) {
      this.material.uniforms.uTime.value += deltaTime;
    }
  }

  // -----------------------------------------------------------------------------
  // 生命周期
  // -----------------------------------------------------------------------------

  getMesh(): Mesh {
    return this.mesh;
  }

  setTexture(texture: Texture): void {
    this.material.uniforms.uTexture.value = texture;
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}

// -----------------------------------------------------------------------------
// React Three Fiber 组件 (伪代码)
// -----------------------------------------------------------------------------

/**
 * <GlitchCatBillboard
 *   position={[x, y, z]}
 *   texture={catSpriteTexture}
 *   state="idle"
 *   musicBPM={80}
 * />
 *
 * 使用 @react-three/drei 的 Billboard 实现更简单:
 * import { Billboard } from '@react-three/drei'
 * <Billboard>
 *   <GlitchCatSprite />
 * </Billboard>
 */
