# NeonEcho 里程碑 4: 生产力补全与细节打磨

> **版本**: V2.0
> **状态**: ✅ 已确认
> **优先级**: 中低

---

## 目标

实现极具反差感的工作流闭环，打造完整的桌面伴侣体验。

---

## 功能清单

> 本里程碑负责以下功能模块的实现

### 🐱 小猫系统

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 小猫外观 | 8-bit故障风 + Billboard技术，10+种外观 | 外观正常显示 |
| 小猫获得 | 默认就有 | 首次启动有小猫 |
| 小猫命名 | 用户可自定义命名 | 命名功能正常 |
| 小猫关系 | 独立存在，不与AI关联 | 小猫独立行为 |
| 小猫行为 | 随机行为 | 行为随机 |
| 小猫睡觉 | 用户不互动时去猫窝（可拖动）睡觉 | 睡觉行为正常 |
| 小猫互动频率 | 随机行为 | 频率随机 |
| 小猫外观解锁 | 默认全部可用 | 所有外观可用 |
| 小猫出现位置 | 从猫窝出现 | 从猫窝出现 |
| 小猫音乐联动 | 摇头/跳舞/摇尾巴/眼睛发光 | 音乐联动正常 |

### 🎵 音乐系统

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 音乐来源 | 网易云音乐API + 本地上传 | 两种来源可用 |
| 音乐联动 | 可选联动（提供开关） | 开关功能正常 |
| 音乐可视化 | 珊瑚绒律动 | 律动效果正常 |
| 背景音乐 | 内置背景音乐 | 背景音乐播放 |

### 🛠️ 生产力工具

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 记事本 | 纸质笔记本 + 发光元素 | 样式正确 |
| 记事本功能 | Markdown、待办清单、图片插入、展示所有备忘录 | 功能完整 |
| 记事本位置 | 默认位置 + 可拖动 | 可拖动 |
| 记事本数量 | 仅一个记事本 | 数量限制 |
| 待办同步 | 用户可选择是否云端同步 | 同步可选 |
| 备忘录同步 | 手动同步 | 手动同步正常 |

### 🎁 装饰物件

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 装饰物件 | 荧光生态缸、拟态发光热饮、离子情绪香薰 | 三大物件显示 |
| 生态缸获得 | 默认就有 | 首次启动有生态缸 |
| 生态缸内容 | 发光植物/萤火虫/石头沙子/小动物，可自定义 | 内容可自定义 |
| 装饰解锁 | 默认全部可用 | 所有装饰可用 |
| 热饮种类 | 咖啡/茶/热可可/热牛奶 | 四种可选 |
| 热饮交互 | 可更换饮品 + 消耗动画 + 手动补充 | 交互正常 |
| 热饮消耗 | 与AI互动时消耗 | 消耗正常 |
| 二人世界 | 简化为灯光模式 | 灯光模式正常 |
| 灯光模式触发 | 点击台灯切换 | 触发正常 |
| 灯光模式效果 | 灯光变暗、UI隐匿、暗角加深 | 效果正确 |

### 🎄 节日与事件系统

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 节日事件 | 圣诞/春节/情人节/万圣节 | 节日触发正常 |
| 节日礼物 | 外观装饰、虚拟物件、AI特殊行为、音乐 | 礼物发放正常 |
| 节日装饰 | 用户手动添加 | 手动添加正常 |
| 随机事件 | 视觉惊喜、AI主动互动、小猫特殊行为、环境变化 | 事件触发正常 |
| 事件通知 | 声音+屏幕提示 | 通知正常 |

### 📱 移动端适配

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 目标平台 | 先Web → 后打包为手机/iPad应用 | 打包成功 |
| 移动端交互 | 触摸手势 | 手势正常 |
| 移动端UI | 与桌面版相同 | UI一致 |
| 移动端性能 | 用户选择画质 | 画质可选 |
| 移动端功能 | 功能完全相同 | 功能完整 |
| 推送通知 | 可选推送 | 推送正常 |

### 🔧 技术架构

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 用户系统 | M4后期实现邮箱验证码登录 | 登录功能正常 |

---

## 技术选型

| 维度 | 决策 | 理由 |
|------|------|------|
| **记事本样式** | 纸质笔记本 + 发光元素 | 治愈系风格，有生活气息 |
| **记事本功能** | Markdown/待办/图片/展示全部 | 功能全面，实用性强 |
| **记事本位置** | 默认位置 + 可拖动 | 灵活布局 |
| **记事本数量** | 仅一个记事本 | 简化实现 |
| **待办同步** | 用户可选择是否同步 | 灵活选择 |
| **播放器样式** | 全息黑胶机 | 复古与未来结合，视觉冲击力强 |
| **音乐来源** | 网易云音乐API + 本地上传 | 两种方式都支持 |
| **小猫外观** | 像素猫（10+种外观可选） | 8-bit风格，与写实场景形成反差 |
| **小猫外观分类** | 颜色/装饰/节日限定 | 多维度选择 |
| **小猫名字** | 用户可自定义 | 个性化体验 |
| **小猫行为** | 发呆/巡逻/睡觉/盯人/物件互动 | 丰富的行为模式 |
| **小猫睡觉位置** | 猫窝（可拖动） | 有专属休息位置 |
| **小猫睡觉触发** | 用户不互动时触发 | 自然行为 |
| **小猫盯人触发** | 随机触发 | 增加趣味性 |
| **小猫互动** | 点击/拖拽/物件吸引/音乐联动 | 多种交互方式 |
| **小猫点击反馈** | 视觉Glitch + 音效 | 双重反馈 |
| **音乐联动效果** | 摇头/跳舞/摇尾巴/眼睛发光 | 多种联动效果 |
| **装饰物件风格** | 混合风格 | 不同物件不同风格，增加层次感 |
| **生态缸内容** | 发光植物/萤火虫/石头沙子/小动物 | 可自定义内容 |
| **生态缸交互** | 可自定义添加内容 | 增强互动性 |
| **热饮种类** | 咖啡/茶/热可可/热牛奶 | 多种选择 |
| **热饮交互** | 可更换饮品 + 消耗动画 | 用户手动补充 |
| **香薰颜色** | 情绪绑定 | 完全跟随AI情绪变化 |
| **灯光模式触发** | 点击台灯切换 | 直观自然 |
| **灯光模式效果** | 灯光变暗/UI隐匿/暗角加深 | 简化但有效的沉浸体验 |
| **世界导演** | 全部支持 | 随机/节日/AI联动事件 |
| **随机事件频率** | 低频率（1%概率） | 制造惊喜但不打扰 |
| **节日支持** | 圣诞/春节/情人节/万圣节 | 后期可扩展 |
| **事件通知** | 声音+视觉双重提示 | 用户不会错过惊喜 |
| **事件持续时间** | 30秒左右 | 有足够时间欣赏 |
| **拖拽范围** | 仅桌面 | 简化实现，避免复杂碰撞 |
| **物件初始位置** | 记住用户布局 | 个性化体验 |
| **用户系统** | M4后期实现邮箱验证码登录 | MVP阶段本地运行，M4后期加云端登录 |
| **小猫命名** | 用户可自定义命名 | 个性化体验 |
| **小猫关系** | 独立存在 | 不与AI关联 |
| **小猫获得** | 默认就有 | 无需解锁 |
| **小猫行为** | 随机行为 | 自然有趣 |
| **装饰解锁** | 默认全部可用 | 无需解锁 |
| **生态缸获得** | 默认就有 | 无需解锁 |
| **节日礼物** | 外观装饰/虚拟物件/AI特殊行为/音乐 | 增加节日仪式感 |
| **节日装饰** | 用户手动添加 | 不强制添加 |
| **随机事件类型** | 视觉惊喜/AI互动/小猫行为/环境变化 | 多样化惊喜 |
| **分享功能** | 支持分享 | 截图、对话记录 |
| **热饮消耗** | 与AI互动时消耗 | 增加仪式感 |

---

## 任务清单

### 4.1 Zustand状态中枢

**目标**: 彻底剥离React高频组件状态，保证60FPS满帧运行

**具体内容**:

**Store拆分**:
```typescript
// UIStore - UI状态
interface UIStore {
  isNotepadOpen: boolean;
  isPlayerOpen: boolean;
  currentNoteId: string | null;
  // ...
}

// SceneStore - 3D场景状态
interface SceneStore {
  cameraMode: 'work' | 'immersive';
  isRaining: boolean;
  timeOfDay: number;
  // ...
}

// SpatialStore - 空间坐标
interface SpatialStore {
  objects: Map<string, ObjectTransform>;
  updatePosition: (id: string, pos: Vector3) => void;
  syncToDatabase: () => Promise<void>;
}
```

**高频数据分离**:
```typescript
// 在useFrame中直接读取，不触发React重渲染
useFrame(() => {
  const position = spatialStore.getState().objects.get('cat')?.position;
  if (position) {
    catRef.current.position.copy(position);
  }
});
```

**验收标准**:
- [ ] Store正确拆分
- [ ] 高频数据不触发React重渲染
- [ ] 60FPS稳定运行

---

### 4.2 沉浸式生产力组件

#### 记事本

**样式**: 纸质笔记本 + 发光元素

**功能**:
- Markdown支持
- 待办清单（可勾选）
- 图片插入
- 打开展示所有备忘录一目了然

**技术实现**:
```typescript
import { Html } from '@react-three/drei';

function Notepad() {
  const [notes, setNotes] = useUIStore(state => state.notes);
  
  return (
    <group>
      {/* 3D笔记本模型 */}
      <mesh>
        <boxGeometry args={[0.3, 0.02, 0.4]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      
      {/* HTML内容贴合 */}
      <Html
        position={[0, 0.02, 0]}
        transform
        occlude
      >
        <div className="notepad-content">
          <ReactMarkdown>{notes[currentNoteId]}</ReactMarkdown>
        </div>
      </Html>
    </group>
  );
}
```

**展示所有备忘录**:
```typescript
function NotesOverview() {
  return (
    <div className="notes-grid">
      {notes.map(note => (
        <div className="note-card" key={note.id}>
          <h3>{note.title}</h3>
          <p>{note.content.slice(0, 100)}...</p>
        </div>
      ))}
    </div>
  );
}
```

#### 全息黑胶机

**样式**: 复古黑胶机 + 全息投影效果

**功能**:
- 在线音乐API集成
- 唱片旋转动画
- 音乐律动视觉效果

**技术实现**:
```typescript
function HolographicTurntable() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [rotation, setRotation] = useState(0);
  
  useFrame((state, delta) => {
    if (isPlaying) {
      setRotation(prev => prev + delta * 0.5);
    }
  });
  
  return (
    <group>
      {/* 底座 */}
      <mesh>
        <cylinderGeometry args={[0.15, 0.15, 0.05, 32]} />
        <meshStandardMaterial color="#2a2a2a" metalness={0.8} />
      </mesh>
      
      {/* 唱片 */}
      <mesh rotation-x={-Math.PI / 2} rotation-y={rotation}>
        <cylinderGeometry args={[0.12, 0.12, 0.005, 32]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
      
      {/* 全息投影 */}
      <HologramEffect isPlaying={isPlaying} />
    </group>
  );
}
```

**在线音乐API**:
```typescript
// 集成网易云音乐/Spotify API
async function searchMusic(query: string) {
  const response = await fetch(`/api/music/search?q=${query}`);
  return response.json();
}

async function playMusic(trackId: string) {
  const audio = new Audio(`/api/music/stream/${trackId}`);
  await audio.play();
}
```

**验收标准**:
- [ ] 记事本可输入Markdown
- [ ] 待办清单可勾选
- [ ] 图片可插入
- [ ] 可展开查看所有备忘录
- [ ] 黑胶机正常旋转
- [ ] 在线音乐可播放

---

### 4.3 8-bit故障猫

**外观**: 像素猫，8-bit风格，10+种外观可选

**外观分类**:
- **颜色**: 橘猫、黑猫、白猫、花猫等
- **装饰**: 戴帽子、围巾、领结等
- **节日限定**: 圣诞帽、春节红包等

**技术实现**:

#### Billboard技术
```typescript
import { Billboard } from '@react-three/drei';

function GlitchCat() {
  return (
    <Billboard follow={true} lockX={false} lockY={false} lockZ={false}>
      <mesh>
        <planeGeometry args={[0.1, 0.1]} />
        <glitchMaterial />
      </mesh>
    </Billboard>
  );
}
```

#### Glitch Shader
```glsl
// 顶点着色器
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// 片元着色器
uniform float time;
uniform sampler2D catTexture;
varying vec2 vUv;

void main() {
  // 周期性水平错位
  float glitchOffset = sin(time * 10.0) * 0.01 * step(0.98, sin(time * 5.0));
  vec2 uv = vUv;
  uv.x += glitchOffset;
  
  // RGB色差
  float r = texture2D(catTexture, uv + vec2(0.003, 0.0)).r;
  float g = texture2D(catTexture, uv).g;
  float b = texture2D(catTexture, uv - vec2(0.003, 0.0)).b;
  
  // CRT扫描线
  float scanline = sin(vUv.y * 400.0) * 0.1;
  
  gl_FragColor = vec4(r + scanline, g + scanline, b + scanline, 1.0);
}
```

#### 猫窝系统
```typescript
function CatBed() {
  const [position, setPosition] = useSpatialStore(state => state.catBedPosition);
  
  return (
    <DragControls onDrag={setPosition}>
      <mesh>
        {/* 猫窝模型 */}
      </mesh>
    </DragControls>
  );
}

// 小猫睡觉时走向猫窝
function catSleep(cat: Cat, catBed: Vector3) {
  // 走向猫窝
  moveTo(cat, catBed);
  // 播放睡觉动画
  playSleepAnimation();
}
```

#### NavMesh寻路（仅桌面）
```typescript
import { NavMesh } from 'three-pathfinding';

const navMesh = new NavMesh();
// 在桌面平面创建寻路网格

function moveCatTo(target: Vector3) {
  const path = navMesh.findPath(cat.position, target);
  // 沿路径移动
}
```

#### 状态机
```typescript
type CatState = 'idle' | 'patrol' | 'sleep' | 'watch' | 'interact';

function catStateMachine(state: CatState, context: CatContext): CatState {
  switch (state) {
    case 'idle':
      if (random() < 0.01) return 'patrol';
      if (random() < 0.005) return 'watch'; // 随机盯人
      if (context.userIdleTime > 60) return 'sleep'; // 用户不互动时睡觉
      return 'idle';
      
    case 'patrol':
      if (context.reachedTarget) return 'idle';
      if (context.nearObject) return 'interact';
      return 'patrol';
      
    case 'sleep':
      if (context.userInteracted) return 'idle';
      return 'sleep';
      
    case 'watch':
      // 盯人状态，看向用户
      return 'idle';
      
    // ...
  }
}
```

#### 互动实现
```typescript
// 点击互动
function handleCatClick() {
  // 播放"被点击"动画
  // 触发Glitch效果
  // 播放"喵"声
  playCatSound('meow');
}

// 拖拽移动
function handleCatDrag(position: Vector3) {
  // 限制在桌面范围内
  const clampedPos = clampToDesktop(position);
  cat.position.copy(clampedPos);
}

// 物件吸引
function checkObjectAttraction() {
  const nearbyObject = findNearbyObject(cat.position);
  if (nearbyObject === 'terrarium') {
    // 走向生态缸，盯着看
  } else if (nearbyObject === 'drink') {
    // 走向热饮，闻一闻
  }
}

// 音乐联动
function handleMusicBeat(bpm: number, intensity: number) {
  // 多种联动效果
  if (bpm > 120) {
    // 摇头动画
    playHeadBobAnimation(intensity);
  }
  if (bpm > 100) {
    // 摇尾巴
    playTailWagAnimation(intensity);
  }
  // 跳舞
  if (intensity > 0.7) {
    playDanceAnimation();
  }
  // 眼睛发光
  setEyeGlow(intensity);
}
```

**验收标准**:
- [ ] 小猫始终面朝镜头
- [ ] Glitch效果正常
- [ ] 10+种外观可选择
- [ ] 在桌面行走不穿模
- [ ] 状态切换自然
- [ ] 点击有反应（Glitch + 音效）
- [ ] 可拖拽移动
- [ ] 被物件吸引
- [ ] 音乐节奏联动（摇头/跳舞/摇尾巴/眼睛发光）
- [ ] 用户不互动时去猫窝睡觉
- [ ] 猫窝可拖动

---

### 4.4 全局拖拽控制

**目标**: 所有物件可在桌面平面内拖拽

**技术实现**:
```typescript
import { DragControls } from '@react-three/drei';

function DraggableObject({ id, children }) {
  const updatePosition = useSpatialStore(state => state.updatePosition);
  
  return (
    <DragControls
      onDrag={(local) => {
        // Y轴锁定，仅XZ平面
        const pos = new Vector3(local.x, FIXED_Y, local.z);
        
        // AABB碰撞检测
        const clampedPos = checkCollision(id, pos);
        
        updatePosition(id, clampedPos);
      }}
      onDragEnd={() => {
        // 持久化到数据库
        syncToDatabase();
      }}
    >
      {children}
    </DragControls>
  );
}
```

**AABB防穿模**:
```typescript
const objectBounds = {
  notepad: { radius: 0.2 },
  player: { radius: 0.15 },
  cat: { radius: 0.1 },
  terrarium: { radius: 0.1 },
  drink: { radius: 0.05 },
  incense: { radius: 0.08 }
};

function checkCollision(id: string, newPos: Vector3): Vector3 {
  for (const [otherId, other] of objects) {
    if (otherId === id) continue;
    
    const distance = newPos.distanceTo(other.position);
    const minDistance = objectBounds[id].radius + objectBounds[otherId].radius;
    
    if (distance < minDistance) {
      // 柔性排斥：向反方向推
      const pushDir = newPos.clone().sub(other.position).normalize();
      return other.position.clone().add(pushDir.multiplyScalar(minDistance));
    }
  }
  
  // 边界限制
  return clampToDesktop(newPos);
}
```

**验收标准**:
- [ ] 所有物件可拖拽
- [ ] Y轴锁定
- [ ] 不穿模
- [ ] 不超出桌面边界
- [ ] 位置持久化

---

### 4.5 治愈系装饰物件（混合风格）

#### 荧光生态缸
**风格**: 写实玻璃 + 赛博发光植物

**可自定义内容**:
- 发光植物（多种可选）
- 电子萤火虫
- 小石头/沙子
- 小动物（如蜗牛）
- 后期可扩展更多内容

**技术实现**:
```typescript
function BioluminescentTerrarium() {
  const [contents, setContents] = useTerrariumStore(state => state.contents);
  
  return (
    <group>
      {/* 玻璃罩 */}
      <mesh>
        <sphereGeometry args={[0.08, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshPhysicalMaterial
          transmission={0.9}
          roughness={0.1}
          thickness={0.05}
        />
      </mesh>
      
      {/* 动态渲染用户添加的内容 */}
      {contents.map(item => (
        <TerrariumItem key={item.id} type={item.type} position={item.position} />
      ))}
      
      {/* 电子萤火虫 */}
      {contents.includes('fireflies') && <FireflyParticles />}
    </group>
  );
}

// 生态缸编辑界面
function TerrariumEditor() {
  const addItem = (type: ItemType) => {
    // 添加新内容到生态缸
  };
  
  return (
    <div className="terrarium-editor">
      <button onClick={() => addItem('plant')}>添加植物</button>
      <button onClick={() => addItem('fireflies')}>添加萤火虫</button>
      <button onClick={() => addItem('stone')}>添加石头</button>
      <button onClick={() => addItem('snail')}>添加蜗牛</button>
    </div>
  );
}
```

#### 拟态发光热饮
**风格**: 写实杯子 + 赛博发光液体

**可交互功能**:
- 点击更换饮品类型（咖啡/茶/热可可/热牛奶）
- 消耗动画（液体逐渐减少）
- 消耗完后用户手动补充

**技术实现**:
```typescript
function NeonElixir() {
  const [drinkType, setDrinkType] = useState('coffee');
  const [level, setLevel] = useState(1); // 液体量 0-1
  
  // 消耗动画
  useFrame((state, delta) => {
    if (level > 0) {
      setLevel(prev => Math.max(0, prev - delta * 0.01));
    }
  });
  
  // 补充
  const refill = () => setLevel(1);
  
  const drinkColors = {
    coffee: '#8B4513',
    tea: '#90EE90',
    cocoa: '#D2691E',
    milk: '#FFFAF0'
  };
  
  return (
    <group onClick={() => cycleDrinkType()}>
      {/* 杯子 */}
      <mesh>
        <cylinderGeometry args={[0.03, 0.025, 0.08, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* 发光液体（根据level调整高度） */}
      <mesh position-y={0.02 * level} scale-y={level}>
        <cylinderGeometry args={[0.028, 0.023, 0.06, 16]} />
        <meshStandardMaterial
          color={drinkColors[drinkType]}
          emissive={drinkColors[drinkType]}
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* 体积蒸汽 */}
      {level > 0 && <SteamEffect intensity={level} />}
      
      {/* 消耗完后显示补充按钮 */}
      {level === 0 && (
        <Html>
          <button onClick={refill}>补充</button>
        </Html>
      )}
    </group>
  );
}
```

#### 离子情绪香薰
**风格**: 赛博金属环 + 流体烟雾

**技术实现**:
```typescript
function DigitalIncense() {
  const emotion = useCompanionStore(state => state.emotion);
  
  // 情绪颜色映射
  const smokeColor = {
    calm: '#4488ff',
    happy: '#ffcc00',
    sad: '#6666ff',
    angry: '#ff4444'
  }[emotion.type];
  
  return (
    <group>
      {/* 金属环 */}
      <mesh>
        <torusGeometry args={[0.05, 0.005, 8, 32]} />
        <meshStandardMaterial color="#888" metalness={0.9} />
      </mesh>
      
      {/* 流体烟雾 */}
      <SmokeParticles color={smokeColor} />
    </group>
  );
}
```

**验收标准**:
- [ ] 生态缸玻璃折射正常
- [ ] 生态缸可自定义添加内容
- [ ] 电子萤火虫飞舞
- [ ] 热饮蒸汽效果
- [ ] 热饮可更换类型
- [ ] 热饮消耗动画正常
- [ ] 热饮可手动补充
- [ ] 香薰烟雾颜色随情绪变化

---

### 4.6 灯光模式

**触发**: 点击台灯切换

**效果**:
- 灯光变暗
- UI隐匿
- 暗角加深

**技术实现**:
```typescript
function DeskLamp() {
  const [isOn, setIsOn] = useState(true);
  const setFocusMode = useSceneStore(state => state.setFocusMode);
  
  const handleToggle = () => {
    setIsOn(!isOn);
    setFocusMode(!isOn);
  };
  
  return (
    <group onClick={handleToggle}>
      {/* 台灯模型 */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.03, 0.15, 8]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      
      {/* 灯光 */}
      <spotLight
        intensity={isOn ? 1 : 0}
        angle={0.5}
        penumbra={0.5}
        color="#ffcc88"
      />
    </group>
  );
}
```

**后处理调整**:
```typescript
useEffect(() => {
  if (isFocusMode) {
    // 灯光变暗
    gsap.to(spotLight, { intensity: 0, duration: 1.5 });
    
    // UI隐匿
    gsap.to(notepadMaterial, { opacity: 0, duration: 1 });
    
    // 暗角加深
    gsap.to(vignetteEffect, { darkness: 0.8, duration: 1.5 });
  }
}, [isFocusMode]);
```

**验收标准**:
- [ ] 点击台灯切换模式
- [ ] 灯光平滑变暗
- [ ] UI正确隐匿
- [ ] 暗角效果加深

---

### 4.7 世界导演系统

**目标**: 支持随机惊喜、节日主题、AI联动事件

**具体内容**:

**环境插槽**:
```typescript
const EVENT_ANCHORS = {
  window_bracket: { position: [0, 1, -3], type: 'external' },
  window_air: { position: [0, 1.5, -2], type: 'flying' },
  desk_deco: { position: [0.5, 0.8, 0], type: 'desktop' },
  ceiling: { position: [0, 2, 0], type: 'hanging' }
};
```

**事件注册表**:
```typescript
const EVENTS = [
  // 随机事件（1%概率，持续30秒）
  {
    id: 'butterfly',
    type: 'random',
    probability: 0.01,
    anchor: 'window_air',
    component: './events/Butterfly',
    duration: 30000
  },
  {
    id: 'firefly_swarm',
    type: 'random',
    probability: 0.01,
    anchor: 'window_air',
    component: './events/FireflySwarm',
    duration: 30000
  },
  
  // 季节事件
  {
    id: 'spring_flowers',
    type: 'seasonal',
    condition: { month: [3, 4, 5] },
    anchor: 'window_bracket',
    component: './events/SpringFlowers'
  },
  
  // 节日事件
  {
    id: 'christmas',
    type: 'holiday',
    condition: { month: 12, day: [24, 25] },
    component: './events/Christmas'
  },
  {
    id: 'chinese_new_year',
    type: 'holiday',
    condition: { month: [1, 2] }, // 农历春节
    component: './events/ChineseNewYear'
  },
  {
    id: 'valentine',
    type: 'holiday',
    condition: { month: 2, day: 14 },
    component: './events/Valentine'
  },
  {
    id: 'halloween',
    type: 'holiday',
    condition: { month: 10, day: 31 },
    component: './events/Halloween'
  },
  
  // AI情绪联动事件
  {
    id: 'rainbow',
    type: 'ai_emotion',
    trigger: { emotion: 'happy', score: 0.8 },
    anchor: 'window_air',
    component: './events/Rainbow',
    duration: 30000
  }
];
```

**触发算法**:
```typescript
function checkEvents(deltaTime: number) {
  for (const event of EVENTS) {
    if (event.type === 'random' && Math.random() < event.probability * deltaTime) {
      triggerEvent(event);
    }
    
    if (event.type === 'seasonal' && checkSeason(event.condition)) {
      triggerEvent(event);
    }
    
    if (event.type === 'ai_emotion' && checkEmotion(event.trigger)) {
      triggerEvent(event);
    }
    
    if (event.type === 'holiday' && checkHoliday(event.condition)) {
      triggerEvent(event);
    }
  }
}
```

**事件通知**:
```typescript
function notifyEvent(event: Event) {
  // 声音提示
  playEventSound(event.type);
  
  // 视觉提示
  showEventNotification(event.name);
}
```

**动态加载**:
```typescript
const EventComponent = React.lazy(() => import(event.component));

function EventRenderer({ event }) {
  return (
    <React.Suspense fallback={null}>
      <EventComponent anchor={EVENT_ANCHORS[event.anchor]} />
    </React.Suspense>
  );
}
```

**验收标准**:
- [ ] 随机事件正常触发（1%概率）
- [ ] 随机事件持续30秒左右
- [ ] 节日事件按时触发（圣诞/春节/情人节/万圣节）
- [ ] AI情绪联动事件正常
- [ ] 事件组件动态加载
- [ ] 事件通知（声音+视觉）正常

---

### 4.8 节日礼物系统

**目标**: 节日时AI送给用户虚拟礼物

**具体内容**:

**礼物类型**:
- **外观装饰**: 小猫的新外观、珊瑚绒的特效等
- **虚拟物件**: 特殊的桌面物件
- **AI特殊行为**: 节日专属的AI对话风格
- **音乐**: 节日专属的背景音乐

**技术实现**:
```typescript
const HOLIDAY_GIFTS = {
  christmas: {
    decorations: ['santa_hat', 'christmas_tree', 'snow_globe'],
    aiBehavior: 'festive',
    music: 'jingle_bells'
  },
  chinese_new_year: {
    decorations: ['red_envelope', 'lantern', 'firecracker'],
    aiBehavior: 'celebratory',
    music: 'gong_xi_fa_cai'
  },
  valentine: {
    decorations: ['heart_balloon', 'rose', 'chocolate_box'],
    aiBehavior: 'romantic',
    music: 'love_theme'
  },
  halloween: {
    decorations: ['pumpkin', 'ghost', 'witch_hat'],
    aiBehavior: 'spooky',
    music: 'spooky_theme'
  }
};

function grantHolidayGift(holiday: string) {
  const gifts = HOLIDAY_GIFTS[holiday];
  // 解锁礼物
  unlockDecorations(gifts.decorations);
  // 设置AI行为
  setAIBehavior(gifts.aiBehavior);
  // 播放音乐
  playMusic(gifts.music);
  // 通知用户
  showGiftNotification(holiday);
}
```

**验收标准**:
- [ ] 节日时自动赠送礼物
- [ ] 礼物类型正确
- [ ] 礼物解锁正常
- [ ] 用户收到通知

---

### 4.9 分享功能

**目标**: 支持分享珊瑚绒截图和对话记录

**具体内容**:

**截图分享**:
```typescript
async function captureScreenshot() {
  const canvas = renderer.domElement;
  const dataUrl = canvas.toDataURL('image/png');
  
  // 复制到剪贴板或下载
  if (navigator.clipboard) {
    await navigator.clipboard.write([
      new ClipboardItem({ 'image/png': dataUrl })
    ]);
  }
  
  return dataUrl;
}
```

**对话记录分享**:
```typescript
async function shareConversation(format: 'text' | 'image') {
  const history = await getConversationHistory();
  
  if (format === 'text') {
    const text = formatConversationAsText(history);
    await navigator.clipboard.writeText(text);
  } else {
    // 生成对话截图
    const image = await generateConversationImage(history);
    return image;
  }
}
```

**验收标准**:
- [ ] 可截图分享
- [ ] 可分享对话记录
- [ ] 分享功能正常工作

---

### 4.10 小猫命名系统

**目标**: 用户可给小猫起名字

**具体内容**:
- **命名界面**: 简洁的输入框
- **名字显示**: 在小猫上方显示名字
- **名字持久化**: 存储到数据库

**验收标准**:
- [ ] 用户可输入小猫名字
- [ ] 名字显示在小猫上方
- [ ] 名字持久化保存

---

## 总体验收标准

> 每项验收必须通过功能测试确认

### 小猫系统验收

- [ ] 小猫10+种外观可选择 **[测试: 切换外观验证]**
- [ ] 小猫始终面朝镜头 **[测试: 旋转视角验证]**
- [ ] Glitch效果正常 **[测试: 观察小猫效果]**
- [ ] 小猫在桌面行走不穿模 **[测试: 观察行走]**
- [ ] 状态切换自然 **[测试: 观察状态变化]**
- [ ] 小猫点击有Glitch + 音效反馈 **[测试: 点击小猫验证]**
- [ ] 可拖拽移动 **[测试: 拖拽小猫验证]**
- [ ] 被物件吸引 **[测试: 小猫靠近物件验证]**
- [ ] 小猫音乐联动（摇头/跳舞/摇尾巴/眼睛发光） **[测试: 播放音乐观察]**
- [ ] 用户不互动时小猫去猫窝睡觉 **[测试: 等待小猫睡觉]**
- [ ] 猫窝可拖动 **[测试: 拖拽猫窝验证]**
- [ ] 用户可给小猫命名 **[测试: 输入名字验证]**
- [ ] 名字显示在小猫上方 **[测试: 检查名字显示]**
- [ ] 名字持久化保存 **[测试: 重启后检查名字]**
- [ ] 小猫从猫窝出现 **[测试: 观察小猫出现]**
- [ ] 小猫默认就有 **[测试: 首次启动检查]**
- [ ] 小猫外观全部可用 **[测试: 检查所有外观]**

### 音乐系统验收

- [ ] 音乐播放器正常工作 **[测试: 播放音乐验证]**
- [ ] 网易云API正常 **[测试: 搜索播放网易云音乐]**
- [ ] 本地上传正常 **[测试: 上传本地音乐]**
- [ ] 音乐联动开关正常 **[测试: 切换开关验证]**
- [ ] 珊瑚绒律动正常 **[测试: 播放音乐观察珊瑚绒]**
- [ ] 背景音乐播放正常 **[测试: 检查背景音乐]**
- [ ] 黑胶机正常旋转 **[测试: 播放时观察旋转]**

### 生产力工具验收

- [ ] 记事本可输入Markdown **[测试: 输入Markdown验证]**
- [ ] 待办清单可勾选 **[测试: 勾选待办验证]**
- [ ] 图片可插入 **[测试: 插入图片验证]**
- [ ] 可展开查看所有备忘录 **[测试: 展开备忘录验证]**
- [ ] 记事本可拖动位置 **[测试: 拖拽记事本验证]**
- [ ] 待办清单可选择是否云端同步 **[测试: 切换同步验证]**
- [ ] 备忘录手动同步正常 **[测试: 手动同步验证]**
- [ ] 仅一个记事本 **[测试: 检查记事本数量]**

### 装饰物件验收

- [ ] 生态缸玻璃折射正常 **[测试: 观察玻璃效果]**
- [ ] 生态缸可自定义添加内容 **[测试: 添加内容验证]**
- [ ] 电子萤火虫飞舞 **[测试: 观察萤火虫]**
- [ ] 生态缸默认就有 **[测试: 首次启动检查]**
- [ ] 热饮蒸汽效果 **[测试: 观察热饮蒸汽]**
- [ ] 热饮可更换类型 **[测试: 切换热饮验证]**
- [ ] 热饮消耗动画正常 **[测试: 观察消耗动画]**
- [ ] 热饮可手动补充 **[测试: 补充热饮验证]**
- [ ] 热饮消耗与AI互动关联 **[测试: 互动时观察消耗]**
- [ ] 香薰颜色随情绪变化 **[测试: 改变情绪观察香薰]**
- [ ] 装饰物件可交互 **[测试: 点击物件验证]**
- [ ] 所有装饰默认可用 **[测试: 检查所有装饰]**

### 灯光模式验收

- [ ] 点击台灯切换模式 **[测试: 点击台灯验证]**
- [ ] 灯光平滑变暗 **[测试: 观察灯光变化]**
- [ ] UI正确隐匿 **[测试: 检查UI隐藏]**
- [ ] 暗角效果加深 **[测试: 观察暗角]**

### 世界导演系统验收

- [ ] 随机事件正常触发（1%概率） **[测试: 长时间观察事件]**
- [ ] 随机事件持续30秒左右 **[测试: 计时验证]**
- [ ] 节日事件按时触发 **[测试: 模拟节日日期验证]**
- [ ] 圣诞节事件正常 **[测试: 12月24-25日验证]**
- [ ] 春节事件正常 **[测试: 农历春节验证]**
- [ ] 情人节事件正常 **[测试: 2月14日验证]**
- [ ] 万圣节事件正常 **[测试: 10月31日验证]**
- [ ] AI情绪联动事件正常 **[测试: 触发情绪验证]**
- [ ] 事件组件动态加载 **[测试: 观察事件加载]**
- [ ] 事件通知（声音+视觉）正常 **[测试: 检查通知]**

### 节日礼物系统验收

- [ ] 节日时自动赠送礼物 **[测试: 节日登录验证]**
- [ ] 礼物类型正确 **[测试: 检查礼物类型]**
- [ ] 礼物解锁正常 **[测试: 检查解锁状态]**
- [ ] 用户收到通知 **[测试: 检查礼物通知]**
- [ ] 节日装饰可手动添加 **[测试: 添加装饰验证]**

### 分享功能验收

- [ ] 可截图分享 **[测试: 截图验证]**
- [ ] 可分享对话记录 **[测试: 分享对话验证]**
- [ ] 分享功能正常工作 **[测试: 完整分享流程]**

### 拖拽系统验收

- [ ] 所有物件可拖拽 **[测试: 拖拽各物件验证]**
- [ ] Y轴锁定 **[测试: 拖拽时检查Y轴]**
- [ ] 不穿模 **[测试: 拖拽碰撞验证]**
- [ ] 不超出桌面边界 **[测试: 拖拽到边界验证]**
- [ ] 位置持久化 **[测试: 重启后检查位置]**
- [ ] 桌面物件位置记住用户布局 **[测试: 重启后检查布局]**

### 移动端验收

- [ ] 移动端触摸手势正常 **[测试: 触摸操作验证]**
- [ ] 移动端UI与桌面版相同 **[测试: 对比UI验证]**
- [ ] 移动端画质可选择 **[测试: 切换画质验证]**
- [ ] 移动端功能完整 **[测试: 检查所有功能]**
- [ ] 推送通知可选 **[测试: 设置推送验证]**
- [ ] 打包成功 **[测试: 打包iOS/Android]**

### 用户系统验收

- [ ] M4后期实现邮箱验证码登录 **[测试: 邮箱登录验证]**
- [ ] 验证码发送正常 **[测试: 发送验证码验证]**
- [ ] 验证码验证正常 **[测试: 输入验证码验证]**

---

## 技术难点

### 1. 在线音乐API
版权和稳定性问题：
- 使用网易云音乐API
- 支持本地上传作为备选
- 注意版权合规

### 2. NavMesh动态更新
物件拖动后需要重新计算：
- 使用简化的网格
- 或使用避障算法替代

### 3. 世界导演性能
频繁检查事件触发：
- 使用时间切片
- 优化条件判断

### 4. 生态缸自定义
动态添加内容：
- 预制多种内容模板
- 运行时动态加载

### 5. 用户系统
邮箱验证码登录：
- 需要邮件服务
- 验证码有效期管理
- 安全性考虑

---

## 依赖关系

```
4.1 Zustand状态中枢
    ↓
4.2 生产力组件
    ↓
4.3 故障猫
    ↓
4.4 拖拽控制
    ↓
4.5 装饰物件
    ↓
4.6 灯光模式
    ↓
4.7 世界导演
```

**前置依赖**: 里程碑1、里程碑2、里程碑3完成

---

*文档更新时间: 2026-04-12*
