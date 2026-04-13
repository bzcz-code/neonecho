/**
 * ============================================================================
 * NeonEcho 玻璃窗与雨滴系统 (Glass + Rain Drops Post-Processing)
 * ============================================================================
 * 难点: 文档 4.5/5.6 - 雨夜车窗朦胧感
 *
 * 技术选型: MeshPhysicalMaterial transmission + 后处理 refraction
 *
 * 方案 A (推荐, v150+):
 * - MeshPhysicalMaterial 的 transmission 属性
 * - roughness: 控制模糊/磨砂程度
 * - ior: 折射率 (1.5 玻璃, 1.33 水)
 * - thickness: 玻璃厚度影响折射深度
 * - roughnessMap + normalMap: 模拟雨滴凹凸
 *
 * 方案 B (高级):
 * - FBO 屏幕空间折射 (Maxime Heckel Blog)
 * - 多通道渲染: 隐藏玻璃 → 渲染背景 → 显示玻璃 → 应用 refraction shader
 *
 * 核心数学:
 * - 折射: refract(incident, normal, eta) 其中 eta = n1/n2
 * - Fresnel: R = R0 + (1-R0) * (1-cosθ)^5
 * - 色散: 对 R/G/B 分别用不同 ior 折射
 *
 * Refs:
 * - https://engineered.at/articles/building-a-realistic-raindrop-covered-window
 * - https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects
 * - Three.js MeshPhysicalMaterial (v150+)
 * ============================================================================
 */

import {
  MeshPhysicalMaterial,
  Mesh,
  PlaneGeometry,
  Vector2,
  Color,
  Texture,
  ShaderMaterial,
  UniformsUtils,
} from 'three';

// -----------------------------------------------------------------------------
// 雨滴玻璃材质预设
// -----------------------------------------------------------------------------

export interface RainGlassConfig {
  /** 透明度 (0.0-1.0) */
  transmission: number;
  /** 粗糙度：控制磨砂/模糊程度 */
  roughness: number;
  /** 折射率 */
  ior: number;
  /** 玻璃厚度 (影响折射深度) */
  thickness: number;
  /** 环境贴图强度 */
  envMapIntensity: number;
  /** 是否启用雨滴效果 */
  enableRaindrops: boolean;
  /** 雨滴扰动强度 */
  raindropDistortion: number;
}

export const RAIN_GLASS_DEFAULT: RainGlassConfig = {
  transmission: 0.95,
  roughness: 0.5,
  ior: 1.5,
  thickness: 0.5,
  envMapIntensity: 0.3,
  enableRaindrops: true,
  raindropDistortion: 0.03,
};

// -----------------------------------------------------------------------------
// 方案 A: MeshPhysicalMaterial (v150+ 推荐)
// -----------------------------------------------------------------------------

/**
 * 创建雨滴磨砂玻璃材质
 *
 * 原理:
 * - transmission: 让光线穿透玻璃，产生折射
 * - roughness: > 0.5 时产生磨砂玻璃效果（雨滴模糊感）
 * - ior: 折射率，玻璃=1.5，水=1.33
 * - thickness: 玻璃厚度，影响折射计算深度
 * - roughnessMap: 灰度图驱动局部模糊（模拟雨滴）
 * - normalMap: 法线贴图驱动局部折射偏移（模拟雨滴形状）
 *
 * @param config 材质配置
 * @param raindropNormalMap 雨滴法线贴图（可选）
 * @param raindropRoughnessMap 雨滴粗糙度贴图（可选）
 */
export function createRainGlassMaterial(
  config: Partial<RainGlassConfig> = {},
  raindropNormalMap?: Texture,
  raindropRoughnessMap?: Texture
): MeshPhysicalMaterial {
  const finalConfig = { ...RAIN_GLASS_DEFAULT, ...config };

  const material = new MeshPhysicalMaterial({
    color: new Color(0xffffff),
    transmission: finalConfig.transmission,
    transparent: true,
    roughness: finalConfig.roughness,
    metalness: 0,
    ior: finalConfig.ior,
    thickness: finalConfig.thickness,
    envMapIntensity: finalConfig.envMapIntensity,
    // 重要：启用物理正确的光线传输
    // 需要 renderer 使用 WebGLRenderer 且 toneMapping 开启
    attenuationColor: new Color(0xffffff),
    attenuationDistance: Infinity,
    // 雨滴法线贴图
    normalMap: raindropNormalMap ?? undefined,
    normalScale: new Vector2(
      finalConfig.raindropDistortion * 2,
      finalConfig.raindropDistortion * 2
    ),
    // 雨滴粗糙度贴图
    roughnessMap: raindropRoughnessMap ?? undefined,
    // 保持清晰的环境反射
    envNodeMaterial: true,
  });

  return material;
}

// -----------------------------------------------------------------------------
// 方案 B: 自定义折射 ShaderMaterial (高级 FBO 方案)
// -----------------------------------------------------------------------------

/**
 * 屏幕空间折射顶点着色器
 *
 * 核心: 将屏幕坐标转换为 FBO 采样坐标
 * 通过 gl_FragCoord / resolution 实现
 */
const REFRACTION_VERTEX_SHADER = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vEyeVector;

  void main() {
    vUv = uv;

    // 世界空间法线
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(normalMatrix * normal);

    // 观察向量（从相机指向像素）
    vEyeVector = normalize(worldPos.xyz - cameraPosition);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

/**
 * 屏幕空间折射片元着色器
 *
 * 效果叠加:
 * 1. 背景纹理采样（来自 FBO）
 * 2. 法线扰动折射方向
 * 3. 边缘 Fresnel 反射
 * 4. 色散（Chromatic Dispersion）
 */
const REFRACTION_FRAGMENT_SHADER = `
  uniform float uTime;
  uniform float uIOR;              // 折射率
  uniform float uRefractionScale;  // 折射强度
  uniform float uChromaticAberration; // 色差强度
  uniform float uFresnelPower;    // Fresnel 强度
  uniform sampler2D uBackground;  // FBO 背景纹理

  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vEyeVector;

  // ---- 工具函数 ----

  // Fresnel 反射公式 (Schlick近似)
  float fresnel(vec3 eyeVector, vec3 worldNormal, float power) {
    float cosTheta = abs(dot(eyeVector, worldNormal));
    float f0 = 0.04; // 玻璃的基础反射率
    return f0 + (1.0 - f0) * pow(1.0 - cosTheta, power);
  }

  // ---- 折射采样 ----
  vec3 sampleRefraction(vec2 uv, vec3 normal, vec3 eyeVec, float iorRatio) {
    vec3 refractVec = refract(eyeVec, normal, iorRatio);
    // 折射向量的 XY 分量作为 UV 偏移
    return texture2D(uBackground, uv + refractVec.xy * uRefractionScale).rgb;
  }

  // ---- 色散（Chromatic Dispersion）----
  // 原理: R/G/B 三个通道用不同折射率，产生彩虹边缘
  vec3 sampleDispersion(vec2 uv, vec3 normal, vec3 eyeVec) {
    // R: 最小折射（700nm波长）
    float iorR = iorAt(0.700);
    // G: 中等折射（546nm）
    float iorG = iorAt(0.546);
    // B: 最大折射（435nm）
    float iorB = iorAt(0.435);

    float r = sampleRefraction(uv, normal, eyeVec, 1.0/iorR).r;
    float g = sampleRefraction(uv, normal, eyeVec, 1.0/iorG).g;
    float b = sampleRefraction(uv, normal, eyeVec, 1.0/iorB).b;

    return vec3(r, g, b);
  }

  // ---- 雨滴扰动 ----
  // 用时间驱动的噪声模拟动态雨滴
  float raindropNoise(vec2 uv, float time) {
    float scale = 30.0;
    vec2 p = uv * scale;
    float x = floor(p.x + time * 10.0);
    float y = floor(p.y);
    return fract(sin(x * 12.9898 + y * 78.233) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    vec3 normal = normalize(vWorldNormal);
    vec3 eyeVec = normalize(vEyeVector);

    // 1. 雨滴扰动法线
    float noise = raindropNoise(uv, uTime) * 0.02;
    normal.xy += noise;

    // 2. 色散折射采样
    vec3 color = sampleDispersion(uv, normal, eyeVec);

    // 3. Fresnel 边缘反射
    float fres = fresnel(eyeVec, normal, uFresnelPower);
    // 简化：加一点白色高光
    color = mix(color, vec3(1.0), fres * 0.1);

    // 4. 边缘暗角色调（Vignette）
    float dist = length(uv - 0.5);
    color *= 1.0 - dist * 0.3;

    gl_FragColor = vec4(color, 0.95);
  }

  // ---- Cauchy 折射率公式 ----
  // n(λ) = A + B/λ² + C/λ⁴  (λ单位: 微米)
  // 用于计算不同波长对应的折射率
  float iorAt(float wavelength) {
    float A = 1.5046;
    float B = 0.00420;
    float C = 0.0;
    return A + B / (wavelength * wavelength);
  }
`;

/**
 * 创建自定义折射材质（用于高级 FBO 方案）
 */
export function createRefractionMaterial(
  backgroundTexture: Texture
): ShaderMaterial {
  return new ShaderMaterial({
    vertexShader: REFRACTION_VERTEX_SHADER,
    fragmentShader: REFRACTION_FRAGMENT_SHADER,
    uniforms: {
      uTime: { value: 0 },
      uIOR: { value: 1.5 },
      uRefractionScale: { value: 0.03 },
      uChromaticAberration: { value: 0.02 },
      uFresnelPower: { value: 4.0 },
      uBackground: { value: backgroundTexture },
    },
    transparent: true,
    side: 2, // DoubleSide
  });
}

// -----------------------------------------------------------------------------
// 雨滴法线贴图生成工具
// -----------------------------------------------------------------------------

/**
 * 生成程序化雨滴法线贴图（Canvas 2D 实现）
 *
 * 原理: 在 Canvas 上绘制半透明圆形雨滴，
 * 然后作为法线贴图使用（灰度值 → 法线 XY）
 *
 * @param width  贴图宽度
 * @param height 贴图高度
 * @param dropCount 雨滴数量
 */
export function generateRaindropNormalMap(
  width = 512,
  height = 512,
  dropCount = 50
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 黑色背景（无扰动）
  ctx.fillStyle = 'rgb(128, 128, 255)'; // 法线默认值 (0, 0, 1) 对应 RGB(128, 128, 255)
  ctx.fillRect(0, 0, width, height);

  // 绘制雨滴
  for (let i = 0; i < dropCount; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = 5 + Math.random() * 15;

    // 径向渐变模拟凸起的雨滴
    const gradient = ctx.createRadialGradient(
      x, y, 0,
      x, y, radius
    );
    gradient.addColorStop(0, 'rgba(180, 180, 255, 0.8)');   // 凸起中心
    gradient.addColorStop(0.5, 'rgba(128, 128, 255, 0.3)'); // 过渡
    gradient.addColorStop(1, 'rgba(128, 128, 255, 0)');    // 平滑边缘

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}

// -----------------------------------------------------------------------------
// React Three Fiber 使用示例 (伪代码)
// -----------------------------------------------------------------------------

/**
 * <RainGlassWindow>
 *   position={[0, 1, 0]}
 *   rotation={[0, 0, 0]}
 *   width={3}
 *   height={2}
 *   rainIntensity={0.8}
 * />
 *
 * 材质配置:
 * - 正常雨天: transmission=0.9, roughness=0.5, raindropDistortion=0.05
 * - 二人世界: transmission=0.95, roughness=0.1 (清晰玻璃，只留台灯光)
 * - 待机/AFK: transmission=0.85, roughness=0.7 (朦胧模糊)
 */
