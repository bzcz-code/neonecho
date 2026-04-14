// frontend/src/DeskObjects.jsx
import React, { useState } from 'react';
import { useCursor } from '@react-three/drei';

// ==========================================
// 基础可交互物件包装器 (处理 Hover 和 点击)
// ==========================================
const Interactable = ({ children, onClick, onPointerEnter, onPointerLeave }) => {
  const [hovered, setHovered] = useState(false);

  // 当鼠标悬浮时，将网页鼠标指针变成 "小手"
  useCursor(hovered, 'pointer', 'auto');

  return (
    <group
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); if(onPointerEnter) onPointerEnter(e); }}
      onPointerOut={(e) => { e.stopPropagation(); setHovered(false); if(onPointerLeave) onPointerLeave(e); }}
      onClick={(e) => { e.stopPropagation(); if(onClick) onClick(e); }}
    >
      {/* 如果悬浮，给物体稍微放大一点作为物理反馈 */}
      <group scale={hovered ? 1.05 : 1}>
        {children}
      </group>
    </group>
  );
};

// ==========================================
// 桌面物件合集
// ==========================================
export const DeskItems = () => {
  // 基准点对齐相机焦点 [8, -12.1, 26.0]
  const tableX = 8;
  const tableY = -12.1;
  const tableZ = 26.0;

  return (
    <group position={[tableX, tableY, tableZ]}>

      {/* 1. 治愈系香薰灯：拉回至近场左侧，确保可见性 */}
      <Interactable onClick={() => console.log('Aroma Active')}>
        <group position={[-10, 1.5, -5]}>
          <mesh position={[0, -1, 0]}>
            <cylinderGeometry args={[1.8, 2.2, 2, 32]} />
            <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
          </mesh>
          <mesh>
            <capsuleGeometry args={[1.3, 2.8, 16, 32]} />
            <meshStandardMaterial color="#ff8833" emissive="#ff5500" emissiveIntensity={5} toneMapped={false} />
          </mesh>
          {/* 暖色点光源，光照范围适中，增加桌面的对比度 */}
          <pointLight color="#ffaa55" intensity={100} distance={50} decay={1.5} />
        </group>
      </Interactable>

      {/* 2. 复古数据板：稍微向中心靠拢，增加平衡感 */}
      <Interactable onClick={() => console.log('Terminal Boot')}>
        <group position={[9, 0.5, 6]} rotation={[-Math.PI / 12, -Math.PI / 6, 0]}>
          <mesh>
            <boxGeometry args={[6.5, 0.5, 4.5]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, 0.26, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[6, 4]} />
            <meshBasicMaterial color="#00ff44" transparent opacity={0.5} toneMapped={false} />
          </mesh>
          <pointLight color="#00ff44" intensity={25} distance={15} />
        </group>
      </Interactable>

      {/* 3. 猫窝：保持在视觉中心 */}
      <group position={[0, 0.25, 0]}>
        <mesh>
          <cylinderGeometry args={[5.5, 5.5, 0.6, 32]} />
          <meshStandardMaterial color="#121212" roughness={1} />
        </mesh>
      </group>

    </group>
  );
};