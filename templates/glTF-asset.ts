/**
 * ============================================================================
 * NeonEcho 高模资产加载与材质覆写系统 (GLTF Asset Loader)
 * ============================================================================
 * 对应设计文档: 5.4 - 高级资产加载管线
 *
 * 技术选型: useGLTF + scene.clone() + traverse 材质覆写
 *
 * 核心流程:
 * 1. useGLTF 异步加载 .glb / .gltf
 * 2. useMemo + scene.clone() 避免同一资产重复加载的引用冲突
 * 3. scene.traverse() 遍历所有 Mesh，按名称或材质名称匹配
 * 4. 替换指定 Mesh 的 material 为自定义发光材质
 * 5. 开启 castShadow / receiveShadow 阴影
 * 6. Assign 到专门的 Three.js Layer，供选择性 Bloom 处理
 *
 * 材质覆写要点:
 * - 直接赋值: mesh.material = newMaterial（会替换整个材质）
 * - 材质数组: gltf mesh.material 可能是数组，需遍历逐个替换
 * - 保持原来其他属性: 先 clone 原有 material，再 override 关键属性
 *
 * Layer Bloom 技术:
 * - 将需要发光的 mesh assign 到专门的 Layer (e.g., Layer 1 = BLOOM_LAYER)
 * - SelectiveBloom 只处理该层，其他物件不受影响
 * - 伴侣（珊瑚绒）+ 故障猫 已使用此方案
 *
 * Refs:
 * - Drei useGLTF: https://docs.pmnd.rs/api/drei/usegltf
 * - Drei Clone component: 用于批量复制同一 GLTF
 * - pmndrs/react-three-fiber#3600: 选择性 Bloom + SelectiveBloom
 * - SkeletonUtils.clone: 克隆带骨骼动画的 GLTF
 * ============================================================================
 */

import { useGLTF } from '@react-three/drei';
import { useMemo, type ReactNode } from 'react';
import {
  Mesh,
  MeshStandardMaterial,
  MeshPhysicalMaterial,
  Color,
  Texture,
  Material,
  Object3D,
  Layer,
} from 'three';
import { Clone } from '@react-three/drei';
import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils';
import { MOCK_MODE } from '@neonecho/shared/constants';

// -----------------------------------------------------------------------------
// 核心类型
// -----------------------------------------------------------------------------

/** 需要覆写的目标 mesh 描述 */
export interface MaterialOverrideTarget {
  /** mesh 名称（在 GLTF 中定义的 name） */
  meshName: string;
  /** 新材质类型 */
  materialType: 'emissive' | 'physical' | 'standard';
  /** 覆写配置 */
  config: EmissiveOverrideConfig | PhysicalOverrideConfig | StandardOverrideConfig;
}

/** 自发光覆写配置 */
export interface EmissiveOverrideConfig {
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
  emissiveMap?: Texture | null;
}

/** Physical 材质覆写配置 */
export interface PhysicalOverrideConfig {
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
  metalness?: number;
  transmission?: number;
  ior?: number;
  thickness?: number;
  emissiveMap?: Texture | null;
}

/** Standard 材质覆写配置 */
export interface StandardOverrideConfig {
  color?: string;
  emissive?: string;
  emissiveIntensity?: number;
  emissiveMap?: Texture | null;
  roughness?: number;
  metalness?: number;
  transparent?: boolean;
  opacity?: number;
}

export interface GLTFAssetConfig {
  /** GLTF / GLB 资源路径 */
  url: string;
  /** 是否开启阴影投射 */
  castShadow?: boolean;
  /** 是否接收阴影 */
  receiveShadow?: boolean;
  /** 是否启用 MOCK 模式 */
  mock?: boolean;
  /** 材质覆写目标列表 */
  materialOverrides?: MaterialOverrideTarget[];
  /** 是否 assign 到 Bloom Layer（供选择性 Bloom 使用） */
  enableBloomLayer?: boolean;
  /** 缩放 */
  scale?: number | [number, number, number];
  /** 旋转 */
  rotation?: [number, number, number];
  /** 位置 */
  position?: [number, number, number];
  /** 挂载点 ref（供父组件获取） */
  meshRef?: React.RefObject<Mesh | Mesh[] | null>;
}

// -----------------------------------------------------------------------------
// 工具函数
// -----------------------------------------------------------------------------

/**
 * 递归遍历 Object3D，查找指定名称的 Mesh
 */
function findMeshByName(
  root: Object3D,
  targetName: string
): Mesh[] {
  const results: Mesh[] = [];
  root.traverse((child) => {
    if (child instanceof Mesh && child.name === targetName) {
      results.push(child);
    }
  });
  return results;
}

/**
 * 创建发光材质
 */
function createEmissiveMaterial(
  config: EmissiveOverrideConfig
): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: config.color ? new Color(config.color) : new Color(0xffffff),
    emissive: config.emissive ? new Color(config.emissive) : new Color(0xffffff),
    emissiveIntensity: config.emissiveIntensity ?? 1.0,
    emissiveMap: config.emissiveMap ?? null,
  });
}

/**
 * 创建 Physical 材质
 */
function createPhysicalMaterial(
  config: PhysicalOverrideConfig
): MeshPhysicalMaterial {
  return new MeshPhysicalMaterial({
    color: config.color ? new Color(config.color) : new Color(0xffffff),
    emissive: config.emissive ? new Color(config.emissive) : new Color(0xffffff),
    emissiveIntensity: config.emissiveIntensity ?? 1.0,
    emissiveMap: config.emissiveMap ?? null,
    roughness: config.roughness ?? 0.2,
    metalness: config.metalness ?? 0.0,
    transmission: config.transmission ?? 0,
    ior: config.ior ?? 1.5,
    thickness: config.thickness ?? 0,
  });
}

/**
 * 创建 Standard 材质
 */
function createStandardMaterial(
  config: StandardOverrideConfig
): MeshStandardMaterial {
  return new MeshStandardMaterial({
    color: config.color ? new Color(config.color) : new Color(0xffffff),
    emissive: config.emissive ? new Color(config.emissive) : new Color(0xffffff),
    emissiveIntensity: config.emissiveIntensity ?? 1.0,
    emissiveMap: config.emissiveMap ?? null,
    roughness: config.roughness ?? 0.5,
    metalness: config.metalness ?? 0.0,
    transparent: config.transparent ?? false,
    opacity: config.opacity ?? 1.0,
  });
}

/**
 * 应用材质覆写到 scene
 */
function applyMaterialOverrides(
  scene: Object3D,
  overrides: MaterialOverrideTarget[]
): void {
  for (const override of overrides) {
    const meshes = findMeshByName(scene, override.meshName);
    if (meshes.length === 0) continue;

    for (const mesh of meshes) {
      let newMaterial: Material;

      switch (override.materialType) {
        case 'emissive':
          newMaterial = createEmissiveMaterial(
            override.config as EmissiveOverrideConfig
          );
          break;
        case 'physical':
          newMaterial = createPhysicalMaterial(
            override.config as PhysicalOverrideConfig
          );
          break;
        case 'standard':
          newMaterial = createStandardMaterial(
            override.config as StandardOverrideConfig
          );
          break;
        default:
          continue;
      }

      // 处理材质数组（GLTF 中 mesh.material 可能是数组）
      if (Array.isArray(mesh.material)) {
        // 逐个替换
        for (let i = 0; i < mesh.material.length; i++) {
          // 克隆基础属性
          const baseMat = mesh.material[i] as MeshStandardMaterial;
          if (baseMat && 'color' in baseMat) {
            newMaterial = newMaterial.clone();
            if ('emissiveIntensity' in newMaterial) {
              // 保留原材质其他属性
              (newMaterial as MeshStandardMaterial).color = baseMat.color.clone();
              (newMaterial as MeshStandardMaterial).roughness =
                (baseMat as MeshStandardMaterial).roughness ?? 0.5;
              (newMaterial as MeshStandardMaterial).metalness =
                (baseMat as MeshStandardMaterial).metalness ?? 0;
            }
          }
          mesh.material[i] = newMaterial.clone();
        }
      } else {
        mesh.material = newMaterial;
      }
    }
  }
}

// -----------------------------------------------------------------------------
// 加载状态组件
// -----------------------------------------------------------------------------

interface GLTFLoadingFallbackProps {
  progress?: number;
  error?: string;
}

function GLTFLoadingFallback({
  progress,
  error,
}: GLTFLoadingFallbackProps): ReactNode {
  if (error) {
    return null; // 或显示错误 UI
  }
  return null; // 无需 fallback，占位用
}

// -----------------------------------------------------------------------------
// 核心资产组件
// -----------------------------------------------------------------------------

interface GLTFAssetProps extends GLTFAssetConfig {}

/**
 * 高模资产加载组件
 *
 * 标准用法:
 * <GLTFAsset
 *   url="/models/desk-lamp.glb"
 *   castShadow
 *   receiveShadow
 *   materialOverrides={[
 *     {
 *       meshName: 'bulb', // GLTF 中定义的 mesh name
 *       materialType: 'emissive',
 *       config: { emissive: '#ffcc66', emissiveIntensity: 2.5 },
 *     },
 *   ]}
 *   enableBloomLayer
 *   position={[0, 0.9, 0]}
 * />
 */
export function GLTFAsset({
  url,
  castShadow = true,
  receiveShadow = true,
  mock = MOCK_MODE,
  materialOverrides = [],
  enableBloomLayer = false,
  scale = 1,
  rotation = [0, 0, 0],
  position = [0, 0, 0],
}: GLTFAssetProps): ReactNode {
  // ---- 加载 GLTF ----
  // 注意: useGLTF 在 Suspense 中使用会自动处理加载状态
  const gltf = useGLTF(url);

  // ---- MOCK 模式: 直接返回场景 ----
  // （在 MOCK_MODE 下，我们没有真实 GLTF 文件，跳过 clone）
  const scene = useMemo(() => {
    if (mock) {
      return gltf.scene;
    }

    // 关键：克隆 scene，避免同一 GLTF 被多个实例使用时引用冲突
    // drcmda (drei 作者) 明确指出：不要在 useEffect 中 clone，要用 useMemo
    const cloned = gltf.scene.clone();

    // ---- 应用材质覆写 ----
    if (materialOverrides.length > 0) {
      applyMaterialOverrides(cloned, materialOverrides);
    }

    // ---- 开启阴影 ----
    if (castShadow || receiveShadow) {
      cloned.traverse((child) => {
        if (child instanceof Mesh) {
          child.castShadow = castShadow;
          child.receiveShadow = receiveShadow;
        }
      });
    }

    // ---- Assign 到 Bloom Layer ----
    if (enableBloomLayer) {
      const BLOOM_LAYER = 1;
      cloned.traverse((child) => {
        if (child instanceof Mesh) {
          child.layers.enable(BLOOM_LAYER);
        }
      });
    }

    return cloned;
  }, [
    gltf,
    mock,
    materialOverrides,
    castShadow,
    receiveShadow,
    enableBloomLayer,
  ]);

  return (
    <primitive
      object={scene}
      scale={scale}
      rotation={rotation}
      position={position}
    />
  );
}

// -----------------------------------------------------------------------------
// 带骨骼动画的 GLTF 克隆（使用 SkeletonUtils）
// -----------------------------------------------------------------------------

/**
 * 带骨骼动画的资产加载
 * 注意：需要 import { SkeletonUtils } from 'three/examples/jsm/utils/SkeletonUtils'
 *
 * 使用方式:
 * <SkeletalGLTFAsset url="/models/character.glb" />
 */
export function SkeletalGLTFAsset(props: GLTFAssetProps): ReactNode {
  const gltf = useGLTF(props.url);

  const cloned = useMemo(() => {
    // SkeletonUtils.clone 保留骨骼动画
    return SkeletonUtils.clone(gltf.scene);
  }, [gltf]);

  return (
    <primitive
      object={cloned}
      scale={props.scale}
      rotation={props.rotation}
      position={props.position}
    />
  );
}

// -----------------------------------------------------------------------------
// 批量复制组件（使用 Drei Clone）
// -----------------------------------------------------------------------------

/**
 * 批量渲染同一个 GLTF 资产（高性能）
 * 使用 Drei Clone 组件进行浅拷贝
 *
 * 使用方式:
 * <GLTFInstanced
 *   url="/models/companion.glb"
 *   count={3}
 *   positions={[
 *     [0, 0.9, 0],
 *     [0.5, 0.9, 0.2],
 *     [-0.4, 0.9, 0.15],
 *   ]}
 *   materialOverrides={[...]}
 * />
 */
export interface GLTFInstancedConfig extends Omit<GLTFAssetConfig, 'position'> {
  count: number;
  positions: [number, number, number][];
}

export function GLTFInstanced({
  url,
  count,
  positions,
  ...props
}: GLTFInstancedConfig): ReactNode {
  const gltf = useGLTF(url);

  return (
    <>
      {positions.slice(0, count).map((pos, i) => (
        <Clone
          key={i}
          object={gltf.scene}
          position={pos}
          scale={props.scale}
          rotation={props.rotation}
        />
      ))}
    </>
  );
}

// -----------------------------------------------------------------------------
// 预设配置
// -----------------------------------------------------------------------------

/** 台灯灯泡发光覆写 */
export const DESK_LAMP_BULB_OVERRIDE: MaterialOverrideTarget = {
  meshName: 'bulb', // GLTF 中灯泡 mesh 的名称（需根据实际模型调整）
  materialType: 'emissive',
  config: {
    emissive: '#ffcc66',
    emissiveIntensity: 3.0,
    color: '#fff8e0',
  },
};

/** 香薰环发光覆写 */
export const AROMA_DIFFUSER_GLOW_OVERRIDE: MaterialOverrideTarget = {
  meshName: 'glow_ring',
  materialType: 'physical',
  config: {
    emissive: '#e0aaff',
    emissiveIntensity: 2.0,
    transmission: 0.9,
    roughness: 0.1,
    ior: 1.4,
    thickness: 0.1,
  },
};

/** 记事本封面材质覆写 */
export const NOTEPAD_COVER_OVERRIDE: MaterialOverrideTarget = {
  meshName: 'cover',
  materialType: 'standard',
  config: {
    color: '#1a1a2e',
    roughness: 0.8,
    metalness: 0.1,
  },
};

// -----------------------------------------------------------------------------
// React Three Fiber 使用示例
// -----------------------------------------------------------------------------

/**
 * // 基础加载
 * <GLTFAsset
 *   url="/models/desk-lamp.glb"
 *   position={[0.3, 0.9, -0.2]}
 *   castShadow
 *   receiveShadow
 * />
 *
 * // 替换灯泡为发光材质 + 开启 Bloom Layer
 * <GLTFAsset
 *   url="/models/desk-lamp.glb"
 *   position={[0.3, 0.9, -0.2]}
 *   materialOverrides={[DESK_LAMP_BULB_OVERRIDE]}
 *   enableBloomLayer  // 让灯泡进入 Bloom Layer
 *   castShadow
 * />
 *
 * // 选择性 Bloom 的完整用法（在父组件中）:
 * import { Selection, Select } from '@react-three/postprocessing'
 * import { BLOOM_LAYER } from '@neonecho/templates/neon-bloom'
 *
 * <Selection>
 *   <EffectComposer>
 *     <SelectiveBloom selection={someRef} layers={[BLOOM_LAYER]} />
 *   </EffectComposer>
 *
 *   <Select enabled>
 *     <GLTFAsset
 *       url="/models/lamp.glb"
 *       materialOverrides={[DESK_LAMP_BULB_OVERRIDE]}
 *       enableBloomLayer
 *     />
 *   </Select>
 * </Selection>
 *
 * // 批量渲染（3个伴侣并排）
 * <GLTFInstanced
 *   url="/models/companion.glb"
 *   count={3}
 *   positions={[[0, 0, 0], [1, 0, 0], [-1, 0, 0]]}
 * />
 */
