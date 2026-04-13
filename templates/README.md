# NeonEcho Templates

高性能技术资产模板库，提取自 Three.js 社区顶级开源实现。

## 目录

| 文件 | 用途 | 核心依赖 |
|------|------|----------|
| `neon-bloom.ts` | 局部霓虹辉光系统 | `@visualsource/selective-unrealbloompass` |
| `procedural-city.ts` | InstancedMesh 程序化城市 | `three` |
| `cinematic-orbit.ts` | 电影感环绕轨道相机 | `three/addons/controls/OrbitControls.js` |
| `fleece-companion.ts` | 赛博珊瑚绒伴侣 Shell+Fin 着色器 | `three` |
| `glitch-cat.ts` | 8-bit 故障猫 Billboard + CRT Shader | `three` |
| `glass-rain.ts` | 雨滴磨砂玻璃 (MeshPhysicalMaterial transmission) | `three` |
| `soft-drag.ts` | 柔性拖拽防穿模 (AABB 柔性排斥算法) | `three` |
| `aroma-steam.ts` | 香薰/热饮蒸汽粒子 (Perlin 噪声纹理) | `three`, `@react-three/drei` |
| `html-panel.ts` | DOM+3D 融合记事本/终端 (Drei Html occlude) | `@react-three/drei` |
| `glTF-asset.ts` | GLTF 高模加载 + 选择性发光材质覆写 | `@react-three/drei`, `@react-three/postprocessing` |

## 安装依赖

```bash
pnpm add three @visualsource/selective-unrealbloompass
```

## 使用方式

```typescript
// 1. 局部霓虹辉光
import { createNeonBloomPass, enableBloom, BLOOM_LAYER } from './templates/neon-bloom';

const bloomPass = createNeonBloomPass(width, height, scene, camera);
companion.layers.enable(BLOOM_LAYER); // 珊瑚绒发光
composer.addPass(bloomPass);

// 2. 程序化城市
import { createProceduralCity } from './templates/procedural-city';

const city = createProceduralCity();
city.sectorNeonSlum.addToScene(scene);
city.updateVisibility(cameraAngle); // 每帧更新可见性

// 3. 环绕相机
import { createCinematicCamera } from './templates/cinematic-orbit';

const { controller, switchMode } = createCinematicCamera(camera, controls);
controller.update(); // 渲染循环中调用
switchMode('work');  // 切换到工作模式
```

## 性能备注

- `procedural-city.ts` 使用 `copyWithin` 指数扩展，1M 实例初始化从 45ms→5ms
- `neon-bloom.ts` 的选择性辉光只需一次渲染，传统方案需要两次
- `cinematic-orbit.ts` 的四元数跟随使用临时对象池，避免每帧 GC
