// shared/types.ts

// ==========================
// 1. 情绪与伴侣状态
// ==========================
export interface EmotionParameters {
  score: number;        // 0.0 - 1.0
  type: 'angry' | 'happy' | 'sad' | 'calm' | 'excited';
  intensity: number;    // 波动强度
}

export interface CompanionState {
  id: string;
  imageUrl: string;
  maps: {
    baseColor: string;
    displacement: string;
    roughness: string;
  };
  emotion: EmotionParameters;
  isProcessing: boolean;
  isSpeaking: boolean;
}

// ==========================
// 2. 神经链路对话流
// ==========================
export interface MessageFlow {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  emotionScore?: number;
}

export interface AIPacket {
  replyText: string;
  emotionScore: number;
  emotionType: string;
  isProcessing: boolean;
  audioUrl?: string;
}

// ==========================
// 3. 空间与物理层
// ==========================
export interface DeskObject {
  id: string;
  type: 'notepad' | 'player' | 'companion' | 'cat' | 'lamp' | 'terrarium' | 'drink' | 'incense' | 'crt';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  isInteractable: boolean;
  collisionRadius: number; // 防穿模系统的核心安全半径
}

export interface CatState {
  position: [number, number, number];
  state: 'idle' | 'walking' | 'sleeping' | 'watching' | 'held';
  targetPosition?: [number, number, number];
  isGlitching: boolean;
}

// ==========================
// 4. 环境与多媒体
// ==========================
export interface MusicData {
  isPlaying: boolean;
  bpm: number;
  frequencyData: Uint8Array; // 频域数据，用于驱动全息黑胶
  currentTrack?: string;
}

export interface EnvironmentEvent {
  id: string;
  type: 'butterfly' | 'flower_bloom' | 'rainbow' | 'hologram';
  anchorId: string;
  probability: number;
  triggeredAt?: Date;
  component: string; // React 组件路径，用于懒加载
}

export interface AppState {
  mode: 'immersive' | 'work' | 'focus'; // 沉浸/工作/二人世界
  isAudioInitialized: boolean;
  companion: CompanionState;
  cat: CatState;
  music: MusicData;
  objects: DeskObject[];
  isFocusMode: boolean;
}