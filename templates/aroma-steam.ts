/**
 * ============================================================================
 * NeonEcho 治愈系蒸汽系统 (Aroma Steam / Coffee Steam)
 * ============================================================================
 * 对应设计文档: 5.4 - 香薰烟雾与热饮蒸汽
 *
 * 技术选型: Perlin 噪声纹理 + 粒子运动 (Three.js Journey 方案)
 *
 * 为什么不用 curl noise 函数?
 * - Perlin 函数在 GPU 上每帧调用开销大，会掉帧
 * - 正确方案：用一张预计算的 Perlin 噪声纹理 (perlin.png)，
 *   在着色器里 texture2D 查找替代运行时计算
 *
 * 核心算法 (顶点着色器):
 * - 用 perlin 噪声纹理驱动粒子 UV 偏移
 * - 多层 turbulence：sin(time + position) 叠加
 * - Alpha 渐隐：随时间从清晰到透明
 *
 * Refs:
 * - Three.js Journey Coffee Smoke (Bruno Simon, 2024)
 *   https://threejs-journey.com/lessons/coffee-smoke-shader
 * - mrdoob/three.js#28967 (TSL WebGPU 版本, merged r168)
 * - react-smoke (isoteriksoftware/react-smoke) - 通用粒子烟雾库参考
 * ============================================================================
 */

import {
  BufferGeometry,
  BufferAttribute,
  Points,
  PointsMaterial,
  Texture,
  Vector3,
  ShaderMaterial,
  AdditiveBlending,
  DoubleSide,
  PlaneGeometry,
} from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useLoader } from '@react-three/drei';
import { useRef, useMemo, useEffect, type ReactNode } from 'react';
import * as THREE from 'three';

// -----------------------------------------------------------------------------
// GLSL 着色器
// -----------------------------------------------------------------------------

const STEAM_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uNoiseScale;     // 噪声缩放（越大越密）
  uniform float uNoiseStrength;   // 噪声扰动强度
  uniform float uSpeed;          // 上升速度
  uniform sampler2D uPerlinTexture; // Perlin 噪声纹理

  varying float vAlpha;
  varying vec2 vUv;

  // 2D Random (用于给每个粒子独立的相位偏移)
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vUv = uv;

    // ---- 粒子独立随机相位 ----
    float particleRandom = random(vec2(gl_VertexID, 0.0));
    float phase = particleRandom * 6.28318; // 0 - 2π

    // ---- 生命周期 0→1 ----
    float life = uv.y; // 用 UV.y 表示生命周期（底部=0，顶端=1）
    float clampedLife = clamp(life, 0.0, 1.0);

    // ---- Alpha: 底部不透明，顶端渐隐 ----
    // 峰形曲线：中间最亮，两端渐隐
    float alphaCurve = sin(clampedLife * 3.14159);
    vAlpha = alphaCurve * 0.6; // 峰值透明度

    // ---- Perlin 噪声驱动 XZ 摆动 ----
    // 用生命周期的偏移在噪声图上采样（沿Y轴方向查表）
    vec2 noiseCoord = vec2(
      uv.x * uNoiseScale,
      clampedLife * uNoiseScale + uTime * uSpeed * 0.3
    );
    float noiseValue = texture2D(uPerlinTexture, noiseCoord).r;

    // 噪声偏移 XZ（蒸汽左右飘动）
    float offsetX = (noiseValue - 0.5) * uNoiseStrength;
    float offsetZ = (noiseValue - 0.5) * uNoiseStrength * 0.5;

    // ---- Y 轴上升 ----
    float riseY = uTime * uSpeed * (0.5 + particleRandom * 0.5);
    // 超出高度后循环回到起点（无缝衔接）
    float maxHeight = 1.0;
    float yPos = mod(uv.y + riseY, maxHeight);

    vec3 pos = position;
    pos.x += offsetX;
    pos.y = yPos;
    pos.z += offsetZ;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const STEAM_FRAGMENT_SHADER = `
  uniform float uOpacity;
  uniform vec3  uColor;       // 蒸汽主色（香薰=淡紫白，热饮=浅棕白）
  uniform sampler2D uPerlinTexture;

  varying float vAlpha;
  varying vec2 vUv;

  void main() {
    // 从噪声纹理采样，控制圆球形状
    vec2 centeredUv = vUv - 0.5;
    float dist = length(centeredUv);

    // 边缘柔和渐隐（不是硬切）
    float softness = 1.0 - smoothstep(0.3, 0.5, dist);

    // 噪声扰动边缘，产生不规则蒸汽团效果
    vec2 noiseCoord = vUv * 3.0;
    float noiseEdge = texture2D(uPerlinTexture, noiseCoord).r;
    softness *= mix(0.7, 1.0, noiseEdge);

    float alpha = softness * vAlpha * uOpacity;

    if (alpha < 0.01) discard;

    gl_FragColor = vec4(uColor, alpha);
  }
`;

// -----------------------------------------------------------------------------
// 配置类型
// -----------------------------------------------------------------------------

export interface AromaSteamConfig {
  /** 粒子数量 */
  count: number;
  /** 蒸汽颜色 */
  color: [number, number, number];
  /** 上升速度 */
  speed: number;
  /** 噪声缩放（越大越密/越乱） */
  noiseScale: number;
  /** 噪声扰动强度 */
  noiseStrength: number;
  /** 透明度 */
  opacity: number;
  /** 粒子尺寸 */
  size: number;
  /** 发射区域半径 */
  radius: number;
  /** 发射区域高度 */
  height: number;
}

export const DEFAULT_AROMA_STEAM_CONFIG: AromaSteamConfig = {
  count: 80,
  color: [0.9, 0.85, 1.0],   // 淡紫白色（香薰）
  speed: 0.15,
  noiseScale: 2.0,
  noiseStrength: 0.3,
  opacity: 0.5,
  size: 0.15,
  radius: 0.08,
  height: 0.5,
};

// -----------------------------------------------------------------------------
// 核心组件
// -----------------------------------------------------------------------------

interface SteamParticlesProps {
  config?: Partial<AromaSteamConfig>;
  /** Perlin 噪声纹理，默认用内置 URL */
  perlinTextureUrl?: string;
}

/**
 * 袅袅蒸汽粒子系统
 *
 * 使用方式:
 * <SteamParticles position={[0, 0.95, 0]} config={{ color: [0.9, 0.85, 1.0], count: 60 }} />
 *
 * 挂载在香薰环或茶杯模型上方即可
 */
export function SteamParticles({
  config = {},
  perlinTextureUrl = '/textures/perlin.png',
}: SteamParticlesProps): ReactNode {
  const { gl } = useThree();
  const mergedConfig = { ...DEFAULT_AROMA_STEAM_CONFIG, ...config };

  // 加载 Perlin 噪声纹理
  const perlinTexture = useLoader(THREE.TextureLoader, perlinTextureUrl) as Texture;
  perlinTexture.wrapS = THREE.RepeatWrapping;
  perlinTexture.wrapT = THREE.RepeatWrapping;

  // ---- 构建几何体 ----
  // 每个粒子有 4 个顶点（Quad），UV.y 编码生命周期
  const geometry = useMemo((): BufferGeometry => {
    const { count, radius, height } = mergedConfig;
    const positions = new Float32Array(count * 4 * 3);
    const uvs = new Float32Array(count * 4 * 2);

    for (let i = 0; i < count; i++) {
      // 随机圆盘内初始位置
      const r = Math.sqrt(Math.random()) * radius;
      const theta = Math.random() * Math.PI * 2;
      const baseX = Math.cos(theta) * r;
      const baseZ = Math.sin(theta) * r;
      const baseY = Math.random(); // 随机初始高度（0-1）

      // 4 个顶点构成 quad（生命周期相同）
      const quadCorners = [
        [-0.5, 0.0],
        [0.5, 0.0],
        [-0.5, 1.0],
        [0.5, 1.0],
      ];

      for (let j = 0; j < 4; j++) {
        const vi = (i * 4 + j) * 3;
        const ui = (i * 4 + j) * 2;

        // 位置：底部对齐 baseY
        positions[vi] = baseX + quadCorners[j][0] * mergedConfig.size;
        positions[vi + 1] = baseY; // Y 会被顶点着色器覆盖
        positions[vi + 2] = baseZ + quadCorners[j][1] * mergedConfig.size * 0.3;

        // UV.x = quad 角, UV.y = 生命周期
        uvs[ui] = quadCorners[j][0] + 0.5;
        uvs[ui + 1] = baseY; // 生命周期
      }
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('uv', new BufferAttribute(uvs, 2));
    return geo;
  }, [mergedConfig]);

  // ---- 构建材质 ----
  const material = useMemo((): ShaderMaterial => {
    return new ShaderMaterial({
      vertexShader: STEAM_VERTEX_SHADER,
      fragmentShader: STEAM_FRAGMENT_SHADER,
      uniforms: {
        uTime: { value: 0 },
        uPerlinTexture: { value: perlinTexture },
        uNoiseScale: { value: mergedConfig.noiseScale },
        uNoiseStrength: { value: mergedConfig.noiseStrength },
        uSpeed: { value: mergedConfig.speed },
        uOpacity: { value: mergedConfig.opacity },
        uColor: { value: new THREE.Color(...mergedConfig.color) },
      },
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending, // 加法混合，更通透
      side: DoubleSide,
    });
  }, [perlinTexture, mergedConfig]);

  // ---- 每帧更新 ----
  useFrame(({ clock }) => {
    material.uniforms.uTime.value = clock.elapsedTime;
  });

  // ---- 清理 ----
  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  return <points geometry={geometry} material={material} />;
}

// -----------------------------------------------------------------------------
// 预设配置
// -----------------------------------------------------------------------------

/** 香薰蒸汽 - 淡紫色，轻柔上升 */
export const AROMA_STEAM_PRESET: Partial<AromaSteamConfig> = {
  count: 60,
  color: [0.88, 0.82, 1.0],
  speed: 0.12,
  noiseStrength: 0.25,
  opacity: 0.45,
};

/** 热饮蒸汽 - 浅棕白色，更密实 */
export const COFFEE_STEAM_PRESET: Partial<AromaSteamConfig> = {
  count: 100,
  color: [0.95, 0.92, 0.9],
  speed: 0.08,
  noiseStrength: 0.15,
  opacity: 0.35,
  noiseScale: 1.5,
};

/** 香薰环专用挂载点（相对香薰环中心） */
export const AROMA_MOUNT_OFFSET: [number, number, number] = [0, 0.15, 0];

// -----------------------------------------------------------------------------
// React Three Fiber 使用示例
// -----------------------------------------------------------------------------

/**
 * // 挂载在香薰环模型上方
 * <group position={[x, y, z]}>
 *   {/* 香薰环高模 * /}
 *   <GLTFAsset url="/models/aroma-diffuser.glb" />
 *
 *   {/* 蒸汽特效 * /}
 *   <SteamParticles
 *     position={AROMA_MOUNT_OFFSET}
 *     config={AROMA_STEAM_PRESET}
 *     perlinTextureUrl="/textures/perlin.png"
 *   />
 * </group>
 */
