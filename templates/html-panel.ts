/**
 * ============================================================================
 * NeonEcho DOM+3D 融合面板 (Html Panel - Notepad / Terminal / CRT Screen)
 * ============================================================================
 * 对应设计文档: 5.4 - 记事本与CRT屏幕
 *
 * 技术选型: @react-three/drei <Html> + occlude="blending" + 自定义 material
 *
 * 核心 API:
 * - transform 模式: 用 CSS matrix3d 绑定3D位置（始终面向相机）
 * - occlude="blending": 真实深度混合遮挡（不是简单的全有/全无）
 * - material prop: 传入 meshPhysicalMaterial 精细控制光照影响
 * - onOcclude callback: 响应可见性变化，驱动 CSS transition
 * - castShadow/receiveShadow: HTML 也能投射/接收阴影
 *
 * Bug (2026-03 issue #2702): occlude prop 动态修改时不更新可见性
 * → 解决方案：使用 ref 引用而非直接内联布尔值，或强制 camera 移动触发更新
 *
 * Refs:
 * - Drei Html: https://pmndrs.github.io/drei/misc/html
 * - Drei PR#1168 (FarazzShaikh): Real occlusion with HTML elements
 * - Drei PR#2703: fix occlusion update on prop change
 * ============================================================================
 */

import {
  Html as DreiHtml,
  type HtmlProps as DreiHtmlProps,
} from '@react-three/drei';
import {
  MeshPhysicalMaterial,
  DoubleSide,
  Vector3,
} from 'three';
import { useRef, useState, useEffect, type ReactNode, type CSSProperties } from 'react';

// -----------------------------------------------------------------------------
// 配置类型
// -----------------------------------------------------------------------------

export interface HtmlPanelConfig {
  /** 是否开启 3D 变换模式 */
  transform: boolean;
  /** 遮挡模式: true=简单隐藏, "blending"=真实深度混合, "raycast"=射线检测 */
  occlude: DreiHtmlProps['occlude'];
  /** 距离缩放因子 */
  distanceFactor: number | undefined;
  /** Z 层级范围 */
  zIndexRange: [number, number];
  /** 是否投射阴影 */
  castShadow: boolean;
  /** 是否接收阴影 */
  receiveShadow: boolean;
  /** HTML 内容的不透明度 (通过 material.opacity 控制) */
  materialOpacity: number;
  /** 中心对齐 */
  center: boolean;
  /** 样式透传 */
  style: CSSProperties;
}

export const DEFAULT_HTML_PANEL_CONFIG: HtmlPanelConfig = {
  transform: true,
  occlude: 'blending', // 推荐：真实深度混合
  distanceFactor: undefined,
  zIndexRange: [16777271, 0],
  castShadow: false,
  receiveShadow: false,
  materialOpacity: 0.15, // 较低的值让光照影响更微妙
  center: true,
  style: {},
};

// -----------------------------------------------------------------------------
// 记事本面板预设
// -----------------------------------------------------------------------------

export interface NotepadPanelProps {
  /** 记事本内容 */
  content: string;
  /** 挂载位置 */
  position: [number, number, number];
  /** 旋转角度 */
  rotation?: [number, number, number];
  /** 缩放 */
  scale?: number;
  /** 记事本样式 */
  fontSize?: number;
  /** 行高 */
  lineHeight?: number;
  /** 字体 */
  fontFamily?: string;
  /** 面板背景色 */
  backgroundColor?: string;
  /** 文字颜色 */
  textColor?: string;
  /** 是否跟随目标遮挡物（Ref 数组） */
  occludeTargets?: DreiHtmlProps['occlude'];
}

/**
 * 记事本面板 - 贴合在3D平面上，支持真实遮挡
 *
 * 使用方式:
 * <NotepadPanel
 *   position={[0.5, 0.95, -0.2]}
 *   rotation={[-0.1, -0.3, 0]}
 *   fontSize={14}
 *   content="今日待办：\n- [ ] 设计方案 Review\n- [ ] 实现 M1 场景"
 * />
 */
export function NotepadPanel({
  content,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  fontSize = 14,
  lineHeight = 1.8,
  fontFamily = '"JetBrains Mono", "Fira Code", monospace',
  backgroundColor = 'rgba(15, 18, 25, 0.85)',
  textColor = '#a8d8ea',
  occludeTargets,
}: NotepadPanelProps): ReactNode {
  const [hidden, setHidden] = useState(false);

  const notepadStyle: CSSProperties = {
    background: backgroundColor,
    color: textColor,
    fontSize: `${fontSize}px`,
    lineHeight: String(lineHeight),
    fontFamily,
    padding: '16px 20px',
    borderRadius: '4px',
    border: '1px solid rgba(168, 216, 234, 0.15)',
    backdropFilter: 'blur(8px)',
    WebkitBackdropFilter: 'blur(8px)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
    whiteSpace: 'pre-wrap',
    userSelect: 'text',
    width: '280px',
    minHeight: '200px',
    transition: 'opacity 0.4s ease, transform 0.4s ease',
    opacity: hidden ? 0 : 1,
    transform: hidden ? 'scale(0.92)' : 'scale(1)',
    pointerEvents: hidden ? 'none' : 'auto',
    ...DEFAULT_HTML_PANEL_CONFIG.style,
  };

  return (
    <DreiHtml
      transform
      position={position}
      rotation={rotation}
      scale={scale}
      occlude={occludeTargets ?? DEFAULT_HTML_PANEL_CONFIG.occlude}
      onOcclude={setHidden}
      material={
        <MeshPhysicalMaterial
          side={DoubleSide}
          opacity={DEFAULT_HTML_PANEL_CONFIG.materialOpacity}
          transparent
        />
      }
      castShadow={DEFAULT_HTML_PANEL_CONFIG.castShadow}
      receiveShadow={DEFAULT_HTML_PANEL_CONFIG.receiveShadow}
      zIndexRange={DEFAULT_HTML_PANEL_CONFIG.zIndexRange}
      center={DEFAULT_HTML_PANEL_CONFIG.center}
      distanceFactor={DEFAULT_HTML_PANEL_CONFIG.distanceFactor}
      style={notepadStyle}
    >
      <div>{content}</div>
    </DreiHtml>
  );
}

// -----------------------------------------------------------------------------
// 终端面板预设
// -----------------------------------------------------------------------------

export interface TerminalPanelProps {
  /** 终端日志行 */
  lines: string[];
  /** 挂载位置 */
  position: [number, number, number];
  /** 旋转 */
  rotation?: [number, number, number];
  /** 缩放 */
  scale?: number;
  /** 光标闪烁速度 (ms) */
  cursorBlinkSpeed?: number;
  /** 标题 */
  title?: string;
  /** 是否跟随目标遮挡物 */
  occludeTargets?: DreiHtmlProps['occlude'];
}

/**
 * CRT 风格终端面板 - 滚动日志 + 绿色磷光字体
 *
 * 使用方式:
 * <TerminalPanel
 *   position={[-0.6, 0.9, 0.1]}
 *   rotation={[-0.05, 0.4, 0]}
 *   lines={logs}
 *   title="neonecho ~ terminal"
 * />
 */
export function TerminalPanel({
  lines,
  position,
  rotation = [0, 0, 0],
  scale = 1,
  cursorBlinkSpeed = 530,
  title = 'neonecho ~ terminal',
  occludeTargets,
}: TerminalPanelProps): ReactNode {
  const [hidden, setHidden] = useState(false);

  const terminalStyle: CSSProperties = {
    background: 'rgba(5, 8, 12, 0.92)',
    border: '1px solid rgba(0, 255, 135, 0.2)',
    borderRadius: '6px',
    overflow: 'hidden',
    width: '340px',
    fontFamily: '"JetBrains Mono", "Fira Code", "Consolas", monospace',
    fontSize: '12px',
    boxShadow: '0 0 20px rgba(0, 255, 135, 0.08), 0 8px 32px rgba(0,0,0,0.6)',
    transition: 'opacity 0.5s ease',
    opacity: hidden ? 0 : 1,
    pointerEvents: hidden ? 'none' : 'auto',
  };

  const headerStyle: CSSProperties = {
    background: 'rgba(0, 255, 135, 0.08)',
    borderBottom: '1px solid rgba(0, 255, 135, 0.15)',
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const dotStyle = (color: string): CSSProperties => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: color,
    boxShadow: `0 0 6px ${color}`,
  });

  const logContainerStyle: CSSProperties = {
    padding: '12px 14px',
    maxHeight: '180px',
    overflowY: 'auto',
    color: '#00ff87',
    lineHeight: '1.6',
    scrollbarWidth: 'thin' as const,
    scrollbarColor: 'rgba(0, 255, 135, 0.3) transparent',
  };

  const promptStyle: CSSProperties = {
    color: '#00ff87',
    opacity: 0.7,
  };

  return (
    <DreiHtml
      transform
      position={position}
      rotation={rotation}
      scale={scale}
      occlude={occludeTargets ?? DEFAULT_HTML_PANEL_CONFIG.occlude}
      onOcclude={setHidden}
      material={
        <MeshPhysicalMaterial
          side={DoubleSide}
          opacity={0.12}
          transparent
        />
      }
      zIndexRange={DEFAULT_HTML_PANEL_CONFIG.zIndexRange}
      center={DEFAULT_HTML_PANEL_CONFIG.center}
    >
      <div style={terminalStyle}>
        {/* 标题栏 */}
        <div style={headerStyle}>
          <span style={dotStyle('#ff5f56')} />
          <span style={dotStyle('#ffbd2e')} />
          <span style={dotStyle('#27c93f')} />
          <span style={{ marginLeft: '8px', fontSize: '11px', opacity: 0.6, color: '#00ff87' }}>
            {title}
          </span>
        </div>

        {/* 日志内容 */}
        <div style={logContainerStyle}>
          {lines.map((line, i) => (
            <div key={i}>
              <span style={promptStyle}>{'>'}</span> {line}
            </div>
          ))}
          {/* 闪烁光标 */}
          <BlinkingCursor blinkSpeed={cursorBlinkSpeed} />
        </div>
      </div>
    </DreiHtml>
  );
}

// -----------------------------------------------------------------------------
// 辅助组件
// -----------------------------------------------------------------------------

interface BlinkingCursorProps {
  blinkSpeed?: number;
}

function BlinkingCursor({ blinkSpeed = 530 }: BlinkingCursorProps): ReactNode {
  const cursorStyle: CSSProperties = {
    display: 'inline-block',
    width: '8px',
    height: '14px',
    background: '#00ff87',
    marginLeft: '2px',
    verticalAlign: 'text-bottom',
    animation: `cursorBlink ${blinkSpeed}ms step-end infinite`,
  };

  // 注入 keyframes 样式（useEffect 而非 useState initializer）
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const styleId = 'neonecho-cursor-blink';
    if (!document.getElementById(styleId)) {
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = `
        @keyframes cursorBlink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  return <span style={cursorStyle} />;
}

// -----------------------------------------------------------------------------
// 低频刷新终端（日志追加）
// -----------------------------------------------------------------------------

export interface StreamingTerminalProps extends Omit<TerminalPanelProps, 'lines'> {
  /** 最大保留行数 */
  maxLines?: number;
}

/**
 * 流式终端 - 支持逐行追加，适合 AI 响应打字机效果
 *
 * 注意: 该组件内部使用 useState 管理 lines，
 * 父组件通过 ref 注入新行
 */
export function StreamingTerminal({
  maxLines = 50,
  ...props
}: StreamingTerminalProps): ReactNode {
  // 内部状态由父组件通过 ref 或 callback 控制
  return null; // 占位，具体实现依赖父组件状态管理
}

// -----------------------------------------------------------------------------
// React Three Fiber 使用示例
// -----------------------------------------------------------------------------

/**
 * // 记事本 + 终端 + 香薰环组合
 * <group position={[0, 0.9, 0]}>
 *   {/* 台灯高模 * /}
 *   <GLTFAsset url="/models/desk-lamp.glb" />
 *
 *   {/* 记事本 * /}
 *   <NotepadPanel
 *     position={[0.4, 0.05, -0.1]}
 *     rotation={[-0.08, -0.25, 0]}
 *     content={notesContent}
 *   />
 *
 *   {/* 终端 * /}
 *   <TerminalPanel
 *     position={[-0.5, 0.08, 0.15]}
 *     rotation={[-0.05, 0.35, 0]}
 *     lines={terminalLogs}
 *   />
 *
 *   {/* 遮挡物引用（记事本和终端互相遮挡） * /}
 * </group>
 *
 * // transform vs 非 transform 对比:
 * // transform: 用 matrix3d CSS，位置始终跟随3D空间，但某些设备会模糊
 * // !transform: 用 2D translate，清晰但失去3D纵深感
 *
 * // occlude 模式选择:
 * // - true: 物件在任何3D物体后面就完全隐藏（简单）
 * // - "blending": HTML成为场景一部分，真实深度遮挡（推荐）
 * // - "raycast": 射线检测精细遮挡（开销较大）
 * // - [ref1, ref2]: 只遮挡指定物体
 */
