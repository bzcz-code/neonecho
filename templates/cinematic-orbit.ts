/**
 * ============================================================================
 * NeonEcho 电影感环绕轨道相机系统 (Cinematic Orbit Camera)
 * ============================================================================
 * 用途: 相机沿 CatmullRomCurve3 平滑环绕，同时保留 OrbitControls 手动旋转
 *
 * 核心原理:
 * - CatmullRomCurve3 闭合环形样条定义轨道路径
 * - getTangentAt() 获取切线矢量驱动四元数旋转
 * - 四元数 setFromAxisAngle + cross(up, tangent) 实现"头朝前"跟随
 * - OrbitControls.target.lerp() 保持环绕中心在工作台
 *
 * Key Params:
 * - curve.tension:  0.5 (CatmullRom 默认)
 * - orbitSpeed:     0.0003 (极慢=挂机感)
 * - lookAhead:      0.01 (提前看向轨道前方)
 *
 * Refs:
 * - StackOverflow: Move camera along spline while maintaining orbit panning
 * - Three.js Docs: CatmullRomCurve3, OrbitControls
 * ============================================================================
 */

import {
  CatmullRomCurve3,
  Vector3,
  Quaternion,
  PerspectiveCamera,
  Spherical
} from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// -----------------------------------------------------------------------------
// 轨道预设
// -----------------------------------------------------------------------------

/** 沉浸模式 - 广角，窗外清晰，环绕速度慢 */
const IMMERSIVE_ORBIT = new CatmullRomCurve3(
  [
    new Vector3(4, 1.5, 4),
    new Vector3(-4, 1.5, 4),
    new Vector3(-4, 1.5, -4),
    new Vector3(4, 1.5, -4),
  ],
  true,        // 闭合环形
  'catmullrom',
  0.5          // tension
);

/** 工作模式 - 聚焦桌面，FOV 小，窗外模糊 */
const WORK_ORBIT = new CatmullRomCurve3(
  [
    new Vector3(1.5, 1.2, 2),
    new Vector3(-1.5, 1.2, 2),
    new Vector3(-1.5, 1.2, -2),
    new Vector3(1.5, 1.2, -2),
  ],
  true,
  'catmullrom',
  0.5
);

// -----------------------------------------------------------------------------
// 相机状态
// -----------------------------------------------------------------------------

export type OrbitMode = 'immersive' | 'work' | 'focus';

interface OrbitState {
  currentOrbit: CatmullRomCurve3;
  targetOrbit: CatmullRomCurve3;
  progress: number;         // 0.0 - 1.0
  transitionProgress: number; // 0.0 - 1.0 (过渡动画)
  isTransitioning: boolean;
}

const state: OrbitState = {
  currentOrbit: IMMERSIVE_ORBIT,
  targetOrbit: IMMERSIVE_ORBIT,
  progress: 0,
  transitionProgress: 1.0,
  isTransitioning: false,
};

// -----------------------------------------------------------------------------
// 工具函数
// -----------------------------------------------------------------------------

/** 上方向向量 */
const UP = new Vector3(0, 1, 0);

/** 临时四元数 (避免每帧 GC) */
const tempQuat = new Quaternion();

/** 临时轴向量 */
const tempAxis = new Vector3();

/**
 * 三次缓动函数 (ease-in-out cubic)
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * 球面线性插值混合两条轨道
 */
function lerpOrbit(progress: number, from: CatmullRomCurve3, to: CatmullRomCurve3): Vector3 {
  const fromPos = from.getPoint(progress);
  const toPos = to.getPoint(progress);
  return fromPos.lerp(toPos, state.transitionProgress);
}

// -----------------------------------------------------------------------------
// 主控制器
// -----------------------------------------------------------------------------

export class CinematicOrbitController {
  private camera: PerspectiveCamera;
  private controls: OrbitControls;
  private lookTarget = new Vector3(0, 0.9, 0); // 工作台中心

  /** 每帧移动量 (极慢=挂机感) */
  readonly orbitSpeed = 0.0003;

  /** 提前看向轨道前方的量 */
  readonly lookAhead = 0.01;

  /** 目标跟随速度 */
  readonly targetLerpSpeed = 0.02;

  constructor(camera: PerspectiveCamera, controls: OrbitControls) {
    this.camera = camera;
    this.controls = controls;
  }

  /**
   * 每帧调用 (放在 requestAnimationFrame 循环中)
   */
  update(_deltaTime: number = 1 / 60): void {
    if (state.isTransitioning) {
      this.updateTransition();
    }

    this.updateOrbit();
    this.updateControls();
  }

  /**
   * 更新轨道运动
   */
  private updateOrbit(): void {
    // 沿轨道移动
    state.progress = (state.progress + this.orbitSpeed) % 1.0;

    // 获取当前轨道位置和切线
    const orbit = state.isTransitioning
      ? state.currentOrbit
      : state.targetOrbit;

    const camPos = orbit.getPoint(state.progress);
    const tangent = orbit.getTangent(state.progress).normalize();

    // 计算相机朝向 (跟随切线方向)
    // 这段数学让相机"头朝前"沿着轨道走
    tempAxis.crossVectors(UP, tangent).normalize();
    const radians = Math.acos(Math.min(1, UP.dot(tangent)));
    tempQuat.setFromAxisAngle(tempAxis, radians);

    // 应用到相机
    this.camera.position.copy(camPos);
    this.camera.quaternion.copy(tempQuat);

    // 看向轨道前方 (提前量创造平滑过渡)
    const lookAheadProgress = (state.progress + this.lookAhead) % 1.0;
    const lookAheadPos = orbit.getPoint(lookAheadProgress);
    this.camera.lookAt(lookAheadPos);
  }

  /**
   * 更新 OrbitControls (保持环绕中心在工作台)
   */
  private updateControls(): void {
    this.controls.target.lerp(this.lookTarget, this.targetLerpSpeed);
    this.controls.update();
  }

  /**
   * 更新过渡动画
   */
  private updateTransition(): void {
    state.transitionProgress = Math.min(1.0, state.transitionProgress + 0.005);

    if (state.transitionProgress >= 1.0) {
      state.currentOrbit = state.targetOrbit;
      state.isTransitioning = false;
    }
  }

  /**
   * 切换模式
   */
  switchMode(mode: OrbitMode): void {
    if (mode === 'focus') {
      this.enableFocusMode();
      return;
    }

    const targetOrbit = mode === 'immersive' ? IMMERSIVE_ORBIT : WORK_ORBIT;

    if (targetOrbit === state.targetOrbit) return;

    state.targetOrbit = targetOrbit;
    state.transitionProgress = 0;
    state.isTransitioning = true;
  }

  /**
   * 二人世界模式：相机锁定在珊瑚绒上
   */
  enableFocusMode(): void {
    // 暂停轨道运动
    state.isTransitioning = false;
  }

  /**
   * 二人世界模式：相机平滑移动到伴侣位置
   */
  animateToCompanion(companionPosition: Vector3): void {
    // 目标位置：珊瑚绒前方偏右一点
    const focusCamPos = new Vector3(
      companionPosition.x + 0.3,
      companionPosition.y + 0.1,
      companionPosition.z + 0.5
    );

    // 使用球面线性插值平滑过渡
    // 这里简化处理，实际可用 gsap 等动画库
    this.camera.position.copy(focusCamPos);
    this.camera.lookAt(companionPosition);
    this.lookTarget.copy(companionPosition);
  }

  /**
   * 禁用二人世界，恢复正常模式
   */
  disableFocusMode(): void {
    this.lookTarget.set(0, 0.9, 0); // 恢复工作台中心
    this.switchMode('immersive');
  }

  /**
   * 设置环绕中心点
   */
  setOrbitCenter(x: number, y: number, z: number): void {
    this.lookTarget.set(x, y, z);
  }

  /**
   * 获取当前进度 (0-1)
   */
  getProgress(): number {
    return state.progress;
  }

  /**
   * 设置进度 (用于同步多相机)
   */
  setProgress(progress: number): void {
    state.progress = ((progress % 1) + 1) % 1;
  }
}

// -----------------------------------------------------------------------------
// 相机初始化工厂
// -----------------------------------------------------------------------------

export interface CinematicCameraResult {
  controller: CinematicOrbitController;
  switchMode: (mode: OrbitMode) => void;
  enableFocusMode: (companionPos?: Vector3) => void;
  disableFocusMode: () => void;
}

/**
 * 创建电影感环绕相机系统
 */
export function createCinematicCamera(
  camera: PerspectiveCamera,
  controls: OrbitControls,
  initialMode: OrbitMode = 'immersive'
): CinematicCameraResult {
  const controller = new CinematicOrbitController(camera, controls);

  // 初始化模式
  controller.switchMode(initialMode);

  return {
    controller,
    switchMode: (mode) => controller.switchMode(mode),
    enableFocusMode: (companionPos?: Vector3) => {
      controller.enableFocusMode();
      if (companionPos) {
        controller.animateToCompanion(companionPos);
      }
    },
    disableFocusMode: () => controller.disableFocusMode(),
  };
}
