import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Noise, Vignette } from '@react-three/postprocessing';

// ==========================================
// 1. 物理常数与视角契约
// ==========================================
const CAM_POS = [-8, 7.5, 26.0];
const Y_TOP = 24.0, Z_WINDOW = -2.0, Y_DESK = -12.1;
const CAMERA_CONFIG = {
  immersive: { target: [-8, 7.5, -10], fov: 70 },
  work: { target: [40, -48.0, 26.0], fov: 55 }
};

// ==========================================
// 2. 场景组件: 赛博大都会
// ==========================================
const CyberCity = () => {
  const meshRef = useRef();
  const count = 4000;

  const { mats, clrs } = useMemo(() => {
    const o = new THREE.Object3D(), mats = [], clrs = [];
    for (let i = 0; i < count; i++) {
      const ang = (i / count) * Math.PI * 2, rad = 180 + Math.random() * 350;
      let zone = (ang < Math.PI * 0.7) ? 0 : (ang < Math.PI * 1.4 ? 1 : 2);
      let h = zone === 1 ? 250 + Math.random() * 150 : (zone === 0 ? 80 : 40);

      o.position.set(Math.cos(ang) * rad, h / 2 - 180, Math.sin(ang) * rad);
      o.scale.set(zone === 1 ? 15 : 10, h, zone === 1 ? 15 : 10);
      o.updateMatrix();

      mats.push(o.matrix.clone());
      // 增强霓虹灯的发光色彩基数，让后处理 Bloom 捕捉到
      const c = new THREE.Color(zone === 1 ? '#021840' : (zone === 0 ? '#3a2b0a' : '#0a2020'));
      clrs.push(c.r, c.g, c.b);
    }
    return { mats, clrs: new Float32Array(clrs) };
  }, []);

  useEffect(() => {
    if (!meshRef.current) return;
    mats.forEach((m, i) => meshRef.current.setMatrixAt(i, m));
    meshRef.current.geometry.setAttribute('instanceColor', new THREE.InstancedBufferAttribute(clrs, 3));
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [mats, clrs]);

  // 【调整】：加快城市自转，提升环形巡航的动态感
  useFrame((_, d) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += d * 0.035;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <boxGeometry />
      <meshStandardMaterial roughness={0.4} metalness={0.6} emissive="#000000" />
    </instancedMesh>
  );
};

// ==========================================
// 2.6 南极极昼系统 (纯手工物理色散太阳版)
// ==========================================
const DayNightSystem = ({ mode }) => {
  // 我们不再只控制一个 mesh，而是控制整个太阳系 Group
  const sunGroupRef = useRef();
  const lightRef = useRef();
  const intensityRef = useRef(mode === 'work' ? 140 : 90);

  useFrame(({ clock }, d) => {
    const system24h = 60;
    const time = clock.elapsedTime;
    const angle = -(time / system24h) * Math.PI * 2; // 保持你调转后的方向

    const radius = 300;
    const sunX = Math.cos(angle) * radius;
    const sunZ = Math.sin(angle) * radius - 50;

    // 保持高空位置
    const sunY = 15.0 + Math.sin(angle) * 1.5;

    if (sunGroupRef.current && lightRef.current) {
      sunGroupRef.current.position.set(sunX, sunY, sunZ);
      lightRef.current.position.set(sunX, sunY, sunZ);

      const targetIntensity = mode === 'work' ? 140 : 90;
      intensityRef.current = THREE.MathUtils.lerp(intensityRef.current, targetIntensity, d * 3);
      lightRef.current.intensity = intensityRef.current;
    }
  });

  return (
    <group>
      <group ref={sunGroupRef}>
        {/* 1. 核心：高冷白光太阳本体 */}
        <mesh>
          <sphereGeometry args={[15, 32, 32]} />
          <meshBasicMaterial color={[2.5, 2.5, 2.5]} toneMapped={false} />
        </mesh>

        {/* 2. 左下角：红色光晕 (红移)
            X 为负(向左)，Y 为负(向下)
        */}
        <mesh position={[-1.8, -1.8, 0]}>
          <sphereGeometry args={[15.5, 32, 32]} />
          <meshBasicMaterial
            color={[2.0, 0, 0]}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>

        {/* 3. 右上角：蓝色光晕 (蓝移)
            X 为正(向右)，Y 为正(向上)
        */}
        <mesh position={[1.8, 1.8, 0]}>
          <sphereGeometry args={[15.5, 32, 32]} />
          <meshBasicMaterial
            color={[0, 0, 3.0]}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* 维持环境主光 */}
      <pointLight ref={lightRef} color="#ffffff" distance={800} decay={1.5} />
    </group>
  );
};

// ==========================================
// 2.5 气象系统: 治愈系蒙蒙细雨
// ==========================================
const WeatherSystem = () => {
  const linesRef = useRef();

  // 1. 减少雨滴密度，蒙蒙细雨不需要一万根线，3000根足够营造氛围且更轻量
  const count = 3000;

  const { positions, velocities } = useMemo(() => {
    const pos = new Float32Array(count * 2 * 3);
    const vel = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 300;
      const y = Math.random() * 200 - 50;
      const z = -5 - Math.random() * 150;

      // 2. 缩短雨丝长度：从之前的 2~4 缩短到 0.5~1.5，表现细雨的轻盈感
      const length = 0.5 + Math.random() * 1.0;

      pos[i * 6] = x;
      pos[i * 6 + 1] = y;
      pos[i * 6 + 2] = z;

      // 稍微增加一点X轴偏移，模拟微风斜吹
      pos[i * 6 + 3] = x + 0.5;
      pos[i * 6 + 4] = y + length;
      pos[i * 6 + 5] = z;

      // 3. 放慢下落速度：从之前的 85 降到 40 左右，让画面具有呼吸感
      vel[i] = 35 + Math.random() * 10;
    }
    return { positions: pos, velocities: vel };
  }, []);

  useFrame((_, delta) => {
    if (!linesRef.current) return;
    const pos = linesRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      const speed = velocities[i] * delta;
      const windOffsetX = speed * (0.5 / 1.5);

      pos[i * 6] -= windOffsetX;
      pos[i * 6 + 1] -= speed;
      pos[i * 6 + 3] -= windOffsetX;
      pos[i * 6 + 4] -= speed;

      if (pos[i * 6 + 1] < -50) {
        const length = pos[i * 6 + 4] - pos[i * 6 + 1];
        const newX = (Math.random() - 0.5) * 300;
        pos[i * 6] = newX;
        pos[i * 6 + 3] = newX + 0.5;
        pos[i * 6 + 1] = 150;
        pos[i * 6 + 4] = 150 + length;
      }
    }
    linesRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <lineSegments ref={linesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      {/* 【修复】：更低调、更治愈的雨丝材质 */}
      <lineBasicMaterial
        color="#5599cc"
        transparent
        opacity={0.15}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </lineSegments>
  );
};

// ==========================================
// 3. 飞船舱内环境与物理玻璃 (修复渲染遮蔽)
// ==========================================
const CabinEnvironment = () => {
  return (
    <group>
      {/* 工作台 */}
      <mesh position={[12, Y_DESK - 0.05, 73]} receiveShadow>
        <boxGeometry args={[60, 0.1, 150]} />
        <meshStandardMaterial color="#080808" roughness={0.7} metalness={0.1} />
      </mesh>

      {/* 上下窗框 */}
      <mesh position={[0, Y_TOP + 2.5, Z_WINDOW]}><boxGeometry args={[150, 5, 5]} /><meshStandardMaterial color="#010101" /></mesh>
      <mesh position={[0, Y_DESK - 2.5, Z_WINDOW]}><boxGeometry args={[150, 5, 5]} /><meshStandardMaterial color="#010101" /></mesh>

      {/* 【核心修复】：放弃 transmission，改为深色镀膜玻璃 */}
      <mesh position={[0, (Y_TOP + Y_DESK) / 2, Z_WINDOW - 0.5]}>
        <boxGeometry args={[150, Math.abs(Y_TOP - Y_DESK), 0.2]} />
        <meshStandardMaterial
          color="#050810"
          transparent={true}
          opacity={0.3}
          roughness={0.1}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
};

// ==========================================
// 4. 后处理滤镜管线 (保护细雨的纯净版)
// ==========================================
const PostProcessingPipeline = () => {
  return (
    <EffectComposer multisampling={0}>
      <Bloom luminanceThreshold={1.0} mipmapBlur intensity={0.8} />
      {/* 恢复极低色散，只保留一点点镜头感，绝不干扰雨滴 */}
      <ChromaticAberration offset={[0.0005, 0.0005]} />
      <Noise opacity={0.008} />
      <Vignette offset={0.3} darkness={0.5} />
    </EffectComposer>
  );
};

// ==========================================
// 5. 相机控制器
// ==========================================
const CameraCtrl = ({ mode }) => {
  const { camera } = useThree();
  useFrame((_, d) => {
    const cfg = CAMERA_CONFIG[mode];
    camera.position.lerp(new THREE.Vector3(...CAM_POS), d * 5);
    camera.fov = THREE.MathUtils.lerp(camera.fov, cfg.fov, d * 3.5);
    camera.updateProjectionMatrix();
    const curDir = new THREE.Vector3();
    camera.getWorldDirection(curDir);
    const targetDir = new THREE.Vector3(...cfg.target).sub(camera.position).normalize();
    camera.lookAt(camera.position.clone().add(curDir.lerp(targetDir, d * 4)));
  });
  return null;
};

// ==========================================
// 6. 根组件与环境光插值
// ==========================================
const World = ({ mode }) => {
  const ambRef = useRef();

  useFrame((_, d) => {
    if (ambRef.current) {
      // 提高工作模式的环境光基数 (0.5)，确保视野周围有足够的亮度
      const targetAmb = mode === 'work' ? 0.5 : 0.3;
      ambRef.current.intensity = THREE.MathUtils.lerp(ambRef.current.intensity, targetAmb, d * 3);
    }
  });

  return (
    <>
      <ambientLight ref={ambRef} intensity={0.3} />
      <CabinEnvironment />
      <CyberCity /> {/* 旋转速度保持 d * 0.035 */}
      <DayNightSystem mode={mode} />
      <WeatherSystem /> {/* 保持你喜欢的上一版雨滴效果 */}
    </>
  );
};

export default function App() {
  const [mode, setMode] = useState('immersive');

  useEffect(() => {
    const handleWheel = (e) => setMode(e.deltaY > 0 ? 'work' : 'immersive');
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'black', overflow: 'hidden' }}>
      <Canvas shadows={{ type: THREE.PCFSoftShadowMap }} camera={{ position: CAM_POS, fov: 70 }}>
        <color attach="background" args={['#000308']} />
        <World mode={mode} />
        <CameraCtrl mode={mode} />
        <PostProcessingPipeline />
      </Canvas>

      {/* 交互提示 */}
      <div style={{ position: 'fixed', bottom: '20px', left: 0, right: 0, textAlign: 'center', opacity: 0.15, color: 'white', fontSize: '10px', letterSpacing: '5px', pointerEvents: 'none' }}>
        {mode === 'immersive' ? 'SCROLL DOWN' : 'SCROLL UP'}
      </div>
    </div>
  );
}