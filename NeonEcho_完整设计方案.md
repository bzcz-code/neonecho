# NeonEcho (霓虹回声) - 完整设计方案

> **版本**: V1.5 终极版  
> **定位**: 赛博朋克沉浸式桌面伴侣应用  
> **目标用户**: 喜欢《光·遇》式治愈感、Lo-fi Chillhop 氛围的挂机/工作人群

---

## 目录

1. [项目愿景与核心理念](#1-项目愿景与核心理念)
2. [产品定位与目标用户](#2-产品定位与目标用户)
3. [核心技术栈选型](#3-核心技术栈选型)
4. [视觉与环境设定](#4-视觉与环境设定)
5. [核心功能模块详解](#5-核心功能模块详解)
6. [工程规范与架构原则](#6-工程规范与架构原则)
7. [四大里程碑详细规划](#7-四大里程碑详细规划)
8. [关键技术细节索引](#8-关键技术细节索引)
9. [数据库设计概要](#9-数据库设计概要)
10. [接口契约定义](#10-接口契约定义)

---

## 1. 项目愿景与核心理念

### 1.1 核心概念

NeonEcho 是一个结合了 **3D 沉浸式环境** 与 **高效生产力工具** 的桌面级 Web 应用。用户处于一艘在赛博朋克城市上空巡航的飞船中，可以在「沉浸观景模式」与「窗边工作模式」之间无缝平滑切换。

### 1.2 三大核心特色

| 特色 | 描述 |
|------|------|
| **极致视觉障眼法** | 利用 Three.js 后处理（Bloom、玻璃折射）与 2.5D 视差，在有限算力下营造 2077 级别的电影级光影 |
| **情感化 AI 实体** | 放弃传统 3D 建模，独创「赛博珊瑚绒」生命体。将用户上传的二维照片通过 Shader 转化为可交互、有呼吸感、能根据 AI 情绪波动的 3D 物理资产 |
| **波普碰撞的独立生命** | 结合动态的 8-bit 故障风小猫、沉浸式写实活页记事本和基于音频频域律动的拟态音乐播放器，制造强烈的视觉反差与生活沉浸感 |

### 1.3 设计理念

- **"障眼法" (Smoke and Mirrors)**: 把算力全部倾注在「镜头感」和「环境光影」上，而非无微不至的细节建模
- **"生活化科技感" (Lived-in Clutter)**: 工作台上充满生活气息的物件，而非冷冰冰的工业设计
- **"治愈系赛博朋克" (Cozy Cyberpunk)**: 摒弃硬核科技的焦虑感，打造适合深夜挂机、陪伴入眠的 Lo-fi 赛博治愈桌面

---

## 2. 产品定位与目标用户

### 2.1 目标用户画像

- **核心用户**: 喜欢《光·遇》《桃园深处有人家》的治愈感用户
- **使用场景**: 
  - 边挂机边工作/学习
  - 晚上睡不着，打开项目欣赏梦幻赛博风景
  - 与 AI 虚拟伴侣聊天倾诉
- **情感需求**: 孤独感与陪伴感的平衡，需要一个"精神避难所"

### 2.2 核心体验循环

```
进入场景 → 欣赏城市景观 → 与珊瑚绒互动 → 开启台灯二人世界 → 挂机入睡
```

### 2.3 挂机模式 (AFK Mode)

当用户 5 分钟未操作时：
- UI 界面（记事本等）自动透明淡出
- 画面景深锁定在窗外的雨景、桌面的荧光缸和呼吸的珊瑚绒上
- 彻底沦为一个极致美丽的动态壁纸伴侣

---

## 3. 核心技术栈选型

### 3.1 前端技术栈

| 技术 | 用途 |
|------|------|
| **Vite** | 构建工具，提供极速的开发体验 |
| **React 18** | UI 框架 |
| **Zustand** | 全局状态管理（剥离高频渲染状态，保证 60FPS） |
| **TypeScript** | 类型安全，契约驱动开发的核心 |

### 3.2 3D 渲染技术栈

| 技术 | 用途 |
|------|------|
| **Three.js** | 底层 3D 引擎 |
| **@react-three/fiber (R3F)** | React 的 Three.js 渲染器 |
| **@react-three/drei** | 实用的 R3F 辅助组件库 |
| **@react-three/postprocessing** | 后期处理效果（Bloom、色差等） |
| **GLSL Shaders** | 自定义顶点/片元着色器（珊瑚绒、CRT、故障效果） |

### 3.3 后端技术栈

| 技术 | 用途 |
|------|------|
| **Node.js** | 后端服务与 WebSocket 中枢 |
| **WebSocket** | 毫秒级流式通信 |
| **Python + FastAPI/Flask** | 图像深度处理微服务 |
| **OpenCV** | 图像特征提取（主色调、高度图、粗糙度图） |

### 3.4 数据库与 AI

| 技术 | 用途 |
|------|------|
| **PostgreSQL** | 主数据库（支持 `pgvector` 插件用于向量记忆） |
| **Prisma / Drizzle ORM** | 数据库访问层 |
| **Gemini 1.5 Pro / Claude 3** | 多模型路由，情感对话与逻辑推理 |
| **Pinecone / Milvus** (预留) | 向量数据库，长期记忆存储 |

---

## 4. 视觉与环境设定

### 4.1 宏观城市规划 (The Macro-City)

城市分为三个区域，形成强烈的视觉对比：

#### 4.1.1 过发达区 (Hyper-Industrial / 工业区)

| 属性 | 设定 |
|------|------|
| **建筑风格** | 粗野主义与异形结构的结合，千奇百怪的建筑形态 |
| **材质** | 重金属、锈迹、工业管道 |
| **光影设计** | 刺眼的警示黄、生化绿，常年笼罩在工业雾霾（Volumetric Fog）中 |
| **特效** | 高耸的烟囱喷射出粒子火焰 |
| **氛围** | 压迫感、污染、科技过度发展的阴暗面 |

#### 4.1.2 发达区 (Eco-Corporate / 财阀核心区)

| 属性 | 设定 |
|------|------|
| **建筑风格** | 秩序井然的巨型玻璃幕墙建筑，垂直绿化 |
| **材质** | 光滑玻璃、金属 |
| **光影设计** | 冷色调的纯净蓝、白光为主 |
| **特效** | 全息投影的垂直绿化（Holographic Flora） |
| **氛围** | 冰冷、高效、财阀统治感 |

#### 4.1.3 欠发达区 (Neon-Slums / 贫民窟)

| 属性 | 设定 |
|------|------|
| **建筑风格** | 建筑高低错落，拥挤不堪，外墙挂满错综复杂的管道和冷气机 |
| **材质** | 老旧混凝土、生锈金属 |
| **光影设计** | 经典的赛博朋克色调：高饱和的洋红、青蓝、霓虹紫 |
| **特效** | 密集的中文/日文/霓虹灯牌 |
| **氛围** | 灯红酒绿、烟火气、混乱中的生命力 |

**细节描述**：城市三区（过发达、发达、欠发达）并非随机分布，而是作为 **360 度的三个扇区** 环绕在中央轨道外侧。随着飞船的环形巡航，窗外景色会像走马灯一样循环切换，形成一个物理逻辑自洽的视觉闭环。

### 4.2 气象系统

#### 4.2.1 3D 雨水粒子系统

- **空中飘落**: 3D Rain Particles 在空中形成雨丝
- **玻璃雨痕**: 雨水打在飞船玻璃上产生动态的雨痕与折射扭曲（Screen Space Refraction）
- **增强梦幻感**: 雨水效果是增强沉浸感的关键视觉元素

### 4.3 微观飞船内部 (The Micro-Cabin)

#### 4.3.1 飞船环形轨道

- **巡航速度**: 极慢的速度（可调节）在城市中心巡航
- **渲染优化**: 
  - 远景使用烘焙好的全景图（HDRI）或低模
  - 近景使用高模
  - 分层渲染保证性能

#### 4.3.2 工作台细节

- **生活化杂乱**: 拟态发光热饮、离子情绪香薰、复古微型副屏、终端监听器、台灯、微缩生态缸、全息悬浮黑胶机等
- **心理学效应**: 这种"杂乱"能让人产生强烈的安全感和归属感

### 4.4 2.5D 视差与强迫透视 (Matte Painting & Parallax)

为了性能优化，采用三层渲染策略：

| 层级 | 技术方案 | 算力消耗 |
|------|----------|----------|
| **远景** | 赛博朋克城市 HDRI 全景图作为 Skybox，或几层带有发光贴图（Emission Map）的 2D 面片（Planes）做视差滚动 | 极低 |
| **中景** | 错落的楼房使用极简的 Low-Poly 几何体，贴上烘焙好的高质量纹理（Baked Textures） | 低 |
| **近景** | 窗框、工作台、赛博珊瑚绒、记事本——分配多边形和 PBR 材质的主战场 | 高 |

### 4.5 玻璃滤镜与光学畸变 (Post-Processing & Optical Effects)

利用 `@react-three/postprocessing` 构建后期处理管线：

| 效果 | 技术实现 | 视觉作用 |
|------|----------|----------|
| **传输材质 (Transmission)** | 给飞船玻璃赋予折射属性，加上带有污渍和雨痕的法线贴图（Normal Map） | 窗外低模城市经过玻璃折射产生朦胧的"雨夜真实感" |
| **镜头畸变 (Lens Distortion)** | 模拟物理镜头的轻微桶形畸变 | 增强"摄像机观测"的沉浸感 |
| **色差 (Chromatic Aberration)** | 模拟物理镜头的边缘色散（RGB分离） | 赛博朋克视觉的标志性特征 |
| **Bloom (泛光)** | 霓虹灯的灵魂效果 | 让霓虹灯产生柔和的光晕 |
| **胶片颗粒 (Film Grain)** | 底层的胶片颗粒噪点 | 掩盖低模粗糙感，产生电影级质感 |

---

### 4.6离子烟雾的“物理扰流”效果 (补全任务 4.6/5.6.3)

在讨论“离子情绪香薰”与小猫的互动时，我们提到了一个非常细硬核的视觉反馈：

- **细节描述**：香薰烟雾粒子系统应支持简单的物理碰撞判定。当 **8-bit 小猫的爪子划过烟雾** 时，烟雾会产生真实的 **“扰流 (Turbulent Flow)”** 效果，即烟雾向四周散开后再慢慢汇合，增强环境的生命力。

### 4.7 “二人世界”模式下的声音屏蔽 (补全任务 4.7/5.6.5)

在“二人世界”模式下，除了视觉上的变化，**声音的沉浸感** 也是我们讨论过的：

- **细节描述**：开启“二人世界”后，系统应自动 **降低窗外城市环境音（雨声、交通噪音）的音量**，同时开启微弱的心跳声或更纯净的 Lo-fi 背景音，从听觉上彻底完成“私密空间”的构建。

## 5. 核心功能模块详解

### 5.1 镜头与模式切换 (Camera Choreography)

#### 5.1.1 双模式设计

| 模式 | 视角特征 | 用途 |
|------|----------|------|
| **沉浸模式** | 贴近玻璃的广角全景（FOV 75），窗外景深清晰 | 欣赏城市 360 度全景 |
| **工作模式** | 聚焦桌面的工作视角（FOV 50），加入景深 Depth of Field 模糊窗外背景 | 专注于工作台 |

#### 5.1.2 平滑切换

- **技术**: 不做生硬的画面跳转，使用平滑的贝塞尔曲线（Bezier Curve）进行相机插值移动
- **视觉中心**: 工作模式下，视觉中心回到桌面，窗外背景适度模糊

---

### 5.2 赛博珊瑚绒 (Cyber-Fleece Companion)

#### 5.2.1 核心设计理念

放弃复杂的 3D 资产生成管线，采用 **"像素级毛绒映射" (Pixel-to-Fleece Mapping)**：

> 用户上传的照片直接成为生命体的遗传图谱。每一根短短粗粗的绒毛都从图像像素中汲取生命，不仅保留了原图的所有色彩信息，还赋予了它实体的物理存在和赛博式的光影呼吸感。

#### 5.2.2 技术实现原理

| 步骤 | 技术细节 |
|------|----------|
| **数据采集** | 创建高密度的顶点网格（Vertex Grid），在 Shader 内部读取特定网格点对应的 UV 坐标处的像素颜色值 |
| **几何体生成** | 利用 `InstancedMesh` 生成数万根短线段（极短、极粗的圆柱体或带有厚度的线段），每个实例继承其根部像素的 RGB 值 |
| **位移与生命力** | 顶点 Shader (Vertex Shader) 根据正弦波（Sin Wave）和时间参数，让绒毛实例轻微、非同步地浮动或摆动 |

#### 5.2.3 视觉效果细节

##### 光纤微光 (Fiber-Optic Micro-Glow)

- 每个纤维看起来像一根根微小的**光纤（optic fibers）**
- 光线不仅透过来，还可以随着毛毯内部的情绪或音乐节拍在每根纤维中传递
- 线头尖端加入微弱的自发光（Emission）和 Bloom 后处理

##### 情绪颜色微调 (核心细节)

```
情绪参数: 0.0 - 1.0 (作为外部变量传递给 Shader)
- 愤怒 (Angry): 像素颜色 + 红色分量
- 开心 (Happy): 像素颜色 + 暖黄色分量  
- 悲伤 (Sad): 像素颜色 + 蓝色分量
- 平静 (Calm): 保持原色
```

##### 物理呼吸感

- 利用 Sine 波函数实现全图整体"呼吸感"形变
- 开心时：毛毯更柔软、蓬松，呼吸频率慢且深
- 愤怒时：毛毯变得紧绷、表面毛刺立起，呼吸短促且剧烈

##### 语音波纹交互 (核心细节)

- **触发条件**: AI 说话时
- **视觉效果**: 以绒毛球中心为圆心产生水滴样的波纹位移场扩张
- **Shader 逻辑**: 编写波纹扩散逻辑，根据音频频段振幅驱动法线贴图的扭曲
- **技术**: 使用 Audio Analyser 获取实时音频数据

##### 抚摸交互

- **实时反馈**: 鼠标悬停点击时局部绒毛被"压下"
- **恢复动画**: 手离开后，被压下的纤维缓慢反弹恢复原状
- **记忆印记**: 留下短暂的（1-2秒）"抚摸印记"，就像真实毛绒一样

#### 5.2.4 图像处理管线 (Python 后端)

| 输出贴图 | 生成方法 | 用途 |
|----------|----------|------|
| **Base Color Map (底色贴图)** | 保持原汁原味的高清色彩 | 绒毛根部颜色 |
| **Height/Displacement Map (高度位移图)** | 利用 Sobel 算子提取图片中的明暗或边缘轮廓 | 让毛毯表面产生高低起伏的物理厚度错落感 |
| **Roughness Map (粗糙度图)** | 智能识别图片中的材质 | 让某些区域反光强烈（赛博金属线），某些区域吸光（哑光绒毛） |

#### 5.2.5 后端架构升级

- **Node.js (业务调度)** + **Python (图像算法)** 的微服务架构
- **数据库持久化**: PostgreSQL 存储处理后的 3 张贴图路径与用户资产关联
- **对象存储**: 图片保存在本地文件系统或云存储（OSS/S3），数据库存储 URL 路径

---

### 5.3 8-bit 赛博小猫 (The Glitch Cat)

#### 5.3.1 视觉反差设计

在高度写实的 3D 场景中，加入一只 2D 像素风或体素风的小猫，自带 CRT 屏幕的故障扫描线效果。

#### 5.3.2 渲染策略 (Billboard & Glitch Shader)

##### 永远面朝镜头 (Billboard 技术)

- **技术**: 放弃复杂的 3D 骨骼动画，使用经典的 **Billboard（广告牌）技术**
- **实现**: 小猫本质上是一个 2D 的面片，随着镜头的转动始终面朝玩家（类似早期的《Doom》）
- **优势**: 极大地节省了性能

##### 故障艺术材质 (Glitch Shader)

为小猫的面片写一个专属的 Shader，加入：
- **周期性水平错位 (Glitch)**: 模拟数字信号干扰
- **RGB 色差 (Chromatic Aberration)**: 红蓝通道分离
- **CRT 扫描线 (Scanlines)**: 水平扫描线效果
- **效果**: 当它在发光的桌面上走动时，身上的光影是不真实的，这种"不真实"恰恰是赛博朋克的精髓

#### 5.3.3 行为逻辑 (NavMesh & State Machine)

##### 寻路网格

- 在工作台表面、窗沿和窗外的金属架上铺设隐形的 NavMesh（寻路网格）
- **动态更新**: 当用户拖动桌面物件改变位置后，必须动态更新 NavMesh，否则小猫会穿模

##### 状态机设计

| 状态 | 行为描述 | 触发条件 |
|------|----------|----------|
| **发呆** | 静止不动，偶尔眨眼 | 默认状态 |
| **洗脸** | 做出洗脸的动画 | 随机触发 |
| **巡逻** | 在桌面上走动 | 定时触发 |
| **睡觉** | 蜷缩成一团打呼噜 | 检测到用户挂机或音乐舒缓 |
| **盯人** | 跳到屏幕正中间盯着用户 | 长时间不操作鼠标 |

##### 事件触发系统

- **音乐联动**: 当音乐 BPM 超过 120 时，小猫可能会跟着摇头
- **AI 联动**: AI 说话或音乐律动剧烈时，触发 Glitch 故障动画
- **物件互动**: 
  - 趴在荧光生态缸外，好奇地随着电子萤火虫晃动脑袋
  - 蜷缩在黑胶机散发的暖光旁边打呼噜睡觉
  - 凑过去闻一闻热饮的蒸汽，满足地眯起眼睛

##### 打断与恢复机制

- **被抓起**: 当用户用鼠标抓起正在走动的小猫时，强制打断状态机，进入"被拎起/悬空"的视觉状态
- **放下**: 重新计算落地点的寻路逻辑。若落点与其他物件重合，优先触发柔性排斥滑落到最近的安全空地

---

### 5.4 写实活页记事本 (Realistic Notepad)

#### 5.4.1 视觉设计

- **3D 模型**: 高模的记事本，带有皮革纹理和纸张粗糙度
- **桌面呈现**: 写实风格的皮质/纸质本子，散发微光

#### 5.4.2 3D 与 2D 的无缝切换

- **点击交互**: 点击时镜头平滑拉近聚焦
- **UI 注入**: 利用 `@react-three/drei` 的 `<Html>` 组件，将真实的 React DOM 精准地贴合在 3D 纸张模型的表面
- **手写质感**: 
  - 特定的手写体 Web Font
  - CSS 滤镜（轻微的模糊和透明度不均）
  - 让输入的文字看起来像是用碳素笔写上去的

#### 5.4.3 功能特性

- **Markdown 渲染**: 支持 Markdown 语法
- **待做清单**: 可作为待办事项列表
- **数据同步**: 所有文字内容自动同步至 PostgreSQL，保证工作不丢失
- **数据库表**: `notes` 表记录用户笔记内容
- 可以将所有的笔记、图片二维展开，方便查找

---

### 5.5 拟态玻璃音乐播放器 (Holographic Glass Player)

#### 5.5.1 视觉表现

- **形态**: 一块带有厚度和边缘折射的磨砂玻璃悬浮在桌面上方（竖直漂浮），后期升级为全息黑胶机
- **材质**: 使用 Three.js 的 `MeshPhysicalMaterial` 配置 `transmission` 和 `roughness`
- **UI 方案**: 
  - 使用 `CSS3DRenderer` 将真实的 DOM 元素无缝嵌入到 Three.js 场景中
  - 或在屏幕空间叠加带有 `backdrop-filter: blur()` 的玻璃拟物化 UI

#### 5.5.2 律动交互

##### Web Audio API 频域分析

- 获取音乐的频域数据（Frequency Data）
- 实时传递给场景

##### 音乐与场景的共振

| 频段 | 映射效果 |
|------|----------|
| **低频 (Bass)** | 驱动窗外大型霓虹灯的闪烁 |
| **中高频** | 驱动"赛博珊瑚绒"根部光纤的微光闪烁 |
| **BPM** | 小猫尾巴摆动、播放器光效、窗外霓虹灯闪烁频率 |

#### 5.5.3 实体化升级: 全息黑胶机

- **设计**: 结合复古与未来的设计，底座是温润的木质或磨砂金属
- **动画**: 上方悬浮着一张半透明的光盘或黑胶唱片，随着音乐缓慢旋转
- **光源**: 散发出暖黄色的胆机光晕（PointLight）

---

### 5.6 治愈系环境装饰物件

#### 5.6.1 荧光微缩生态缸 (Bioluminescent Terrarium)

| 属性 | 设定 |
|------|------|
| **外观** | 倒扣的玻璃半球，里面是一小块长满荧光苔藓的泥土，或一株散发着柔和呼吸光的"阿凡达式"赛博植物 |
| **内部特效** | 偶尔会有几只光点构成的"电子萤火虫"在玻璃罩内飞舞 |
| **Shader** | 玻璃折射 Shader + 内部发光粒子系统 |
| **白噪音** | 靠近时能听到极其微弱的虫鸣或植物生长的白噪音 |
| **小猫互动** | 猫咪会趴在玻璃罩外，好奇地随着电子萤火虫晃动脑袋，试图用爪子去抓 |

#### 5.6.2 拟态发光热饮 (Neon Elixir / Hot Tea)

| 属性 | 设定 |
|------|------|
| **外观** | 杯底发光的赛博抹茶，或悬浮着发光珍珠的饮品 |
| **蒸汽特效** | "数字蒸汽"的流速调得极慢，像云朵一样在杯口盘旋（体积蒸汽 Shader） |
| **温度感** | 营造温暖的氛围 |
| **小猫互动** | 猫咪偶尔会凑过去闻一闻蒸汽，然后满足地眯起眼睛 |

#### 5.6.3 离子情绪香薰 (Digital Incense)

| 属性 | 设定 |
|------|------|
| **外观** | 垂直悬浮的金属圆环，中间扩散出彩色的离子烟雾 |
| **烟雾特效** | 丝绸质感的流体烟雾特效 |
| **情绪绑定** | 烟雾颜色与 AI 伴侣（珊瑚绒）的情绪深度绑定 |
| **睡眠模式** | 夜晚挂机时，AI 进入"休眠守护"状态，香薰散发出深蓝色或紫罗兰色微光，烟雾弥漫整个桌面底部 |

**细节描述**：香薰烟雾粒子系统应支持简单的物理碰撞判定。当 **8-bit 小猫的爪子划过烟雾** 时，烟雾会产生真实的 **“扰流 (Turbulent Flow)”** 效果，即烟雾向四周散开后再慢慢汇合，增强环境的生命力。

#### 5.6.4 微型 CRT 终端监听器 (Mini Retro Terminal)

##### 视觉设计

- **外观**: 巴掌大的显像管（CRT）小屏幕，复古造型
- **显示内容**: 不断滚动显示系统的后台日志

##### CRT Shader 实现

将普通的 Canvas 纹理通过自定义 Shader "做旧"：

| 效果 | 描述 |
|------|------|
| **扫描线 (Scanlines)** | 强制在画面上画出细密的水平黑线，模拟电子枪扫描的缝隙 |
| **屏幕曲率 (Curvature)** | 把原本平面的画面向外凸起拉伸成球面（鱼眼变形） |
| **边缘暗角 (Vignette)** | 屏幕中心亮，四周暗 |
| **色差/RGB分离 (Chromatic Aberration)** | 模拟老式显示器电子束对不齐，文字边缘出现红蓝色重影 |
| **噪声闪烁** | 周期性的微小噪声，模拟信号不良 |

##### 数据映射

- **WebSocket 管道**: 将 Node.js 的运行日志实时推送到前端
- **Canvas 绘制**: 前端用 HTML Canvas 将文字画出来，不断向上滚动
- **Three.js 纹理**: 将动态 Canvas 作为纹理贴到微型屏幕的 3D 模型上

##### 小猫互动

- 猫咪会踩过迷你键盘，导致屏幕瞬间进入"蓝屏故障"或显示一串乱码 `meowmeowmeow...`

#### 5.6.5 台灯与"二人世界"沉浸模式

##### 物理台灯设定

- **外观**: 带有赛博元素的"复古银行家台灯"或极简的"悬浮光环台灯"
- **开关**: 一根物理的金属拉线，或一个可以点击的拟真机械开关
- **光源**: Three.js 的 `SpotLight`，带有清晰边缘衰减，提供温馨的暖色照明

##### "二人世界"触发逻辑 (Lights-Out Transition)

| 触发动作 | 咔哒一声清脆的物理开关音效 |
|----------|---------------------------|
| **灯光变化** | 桌面主光源（SpotLight）在 1.5秒内平滑熄灭 |
| **UI 隐匿** | 所有生产力 UI（记事本、播放器面板）透明度降为 0 |
| **暗角加深** | 动态拉高后期管线中的 Vignette（屏幕暗角）参数 |
| **景深增强** | 加重 Depth of Field（景深），使窗外城市彻底虚化 |
| **唯一焦点** | 视觉中心强制锁定在发光的"赛博珊瑚绒"上 |
| **行为屏蔽** | 暂停小猫的主动巡逻行为（转为原地睡眠），屏蔽其他物件的鼠标 Hover 事件 |
| **输入锁定** | 鼠标和麦克风的输入将 100% 锁定在 AI 伴侣身上 |

---

**细节描述**：开启“二人世界”后，系统应自动 **降低窗外城市环境音（雨声、交通噪音）的音量**，同时开启微弱的心跳声或更纯净的 Lo-fi 背景音，从听觉上彻底完成“私密空间”的构建。

### 5.7 全局拖拽控制与防穿模系统

#### 5.7.1 可拖拽物件清单

- 记事本、播放器、珊瑚绒、小猫、台灯、生态缸、热饮、香薰

#### 5.7.2 拖拽技术实现

| 功能 | 实现细节 |
|------|----------|
| **平面锁定** | 引入 `@react-three/drei` 的 `<DragControls>`，强制锁定 Y 轴，所有拖拽仅限 XZ 桌面平面 |
| **碰撞边界** | 为桌面设定隐形的空气墙（Bounding Box），防止物件被拖出窗外 |

#### 5.7.3 防穿模系统 (核心设计)

##### AABB 与安全半径

- 放弃复杂的 Mesh 级碰撞
- 为每个物件包裹一个隐形的圆柱体或 AABB（轴对齐包围盒）作为"安全距离界限"

##### 柔性排斥算法 (Soft Repulsion)

```
在 useFrame 的渲染循环中实时计算：
1. 计算拖拽物与静态物的 XZ 距离
2. 当距离 < 两者安全半径之和时：
   - 不直接锁定坐标（会导致手感卡顿发抖）
   - 应用基于缓动函数（如 damp 或弹簧动画）的排斥向量
   - 让被挤压的物件平滑地"滑开"或让拖拽物"滑过"边缘
```

#### 5.7.4 空间坐标持久化

- **Zustand SpatialStore**: 实时记录所有可交互物件的当前坐标 `(x, y, z)` 和旋转角度
- **数据库同步**: 拖拽结束（`onDragEnd`）时，立即同步至 PostgreSQL
- **唤醒恢复**: 下次打开时，桌面依旧是用户离开时弄乱的样子

---

### 5.8 世界导演与环境插槽系统

#### 5.8.1 设计理念

为了支持后续"零代码侵入"式更新惊喜事件，建立"插槽与插件（Slots & Plugins）"架构。

#### 5.8.2 场景插槽化 (Scene Anchors)

在 Three.js 的场景树中，预先放置若干个"隐形挂载点"（Empty Object3D/Group）：

| 插槽 ID | 位置描述 | 用途 |
|---------|----------|------|
| `anchor_external_bracket` | 窗外焊接支架上 | 放置盆栽、蝴蝶等 |
| `anchor_window_air` | 玻璃外侧一定距离的路径 | 飞行物（蝴蝶、无人机等） |
| `anchor_desk_deco` | 桌面上除了核心物件外的闲置区域 | 桌面装饰 |
| `anchor_ceiling` | 飞船顶端 | 悬挂物 |
| `anchor_ship_edge` | 飞船边缘 | 边界事件 |

#### 5.8.3 "世界导演"模块 (The World Director)

- **注册机制**: 所有的惊喜事件都在一个配置表（Registry）里登记
- **触发算法**: 根据以下条件决定开启哪个事件：
  1. 现实时间（如：春天花开）
  2. 概率（如：1% 几率飞过蝴蝶）
  3. AI 情绪（如：AI 开心时出现彩虹）
- **外部控制**: 预留 API，允许后端 Node.js 强制触发特定事件（如：用户生日时窗外显示"Happy Birthday"）

#### 5.8.4 动态加载机制

- 利用 React 的 `Suspense` 和 `lazy` 加载
- 只有当导演决定触发事件时，才请求对应的 3D 模型和 Shader
- 保证初始化加载速度

---

## 6. 工程规范与架构原则

### 6.1 契约驱动开发 (Contract-Driven)

**核心原则**: 严禁各个模块盲目并行。所有开发必须在确立全局 `types.ts` 接口类型之后才能开始。

- **宪法文件**: `shared/types.ts` 定义所有核心数据结构
- **类型安全**: TypeScript 严格模式，任何跨模块数据必须符合契约
- **目的**: 保证前后端数据结构 100% 一致

### 6.2 Monorepo 架构

```
neon-echo/
├── package.json          # 根配置，concurrently 一键启动
├── shared/
│   ├── types.ts          # 全局类型定义（项目宪法）
│   └── constants.ts      # 全局常量（如 ANCHOR_BRACKET_POS）
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── shaders/
│   │   ├── stores/
│   │   └── scenes/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   └── websocket/
│   └── package.json
└── python-service/
    └── image_processor.py
```

**启动脚本**: `npm run dev` 同时启动前端 Vite (5173) 和后端 Node.js (3000)

### 6.3 防御性 API 调试

- **MOCK_AI_MODE**: 后端环境变量开关
- **用途**: 在 UI 与 Shader 联调期间，使用本地 Mock 数据阻断无意义的网络请求
- **实现**: `setTimeout` 模拟 2 秒延迟，返回预设假数据
- **目的**: 避免在热更新中烧毁 API 额度

### 6.4 空间交互的物理法则

- 所有桌面物件支持 3D 空间拖拽
- 严格锁定 Y 轴，只允许在 XZ 平面移动
- 防止物件悬浮或穿模进入桌子内部

### 6.5 音频自动播放策略

**问题**: 浏览器严格禁止无用户交互自动播放音频

**解决方案**: 设计"系统启动/登入"（Boot Sequence）界面
- 用户点击"INITIATE SYSTEM"或"戴上耳机"按钮
- 触发过渡动画（赛博朋克终端代码滚动）
- 静默唤醒并授权 Web Audio API 实例

### 6.6 状态管理分离

**问题**: React 状态更新可能导致 Three.js 掉帧

**解决方案**: Zustand 状态管理
- React 组件之外获取和更新状态
- 3D 渲染通过 `useFrame` 直接读取状态
- UI 与 3D 两者互不干扰

---

## 7. 四大里程碑详细规划

### 📍 里程碑 1: 视觉基座与契约 (The Visual Foundation)

> **必须完全串行，打牢地基，统一工程规范与物理比例尺。**

#### 任务 1.1: Monorepo 环境初始化

| 项目 | 详情 |
|------|------|
| **目标** | 实现跨端运行与环境一致性 |
| **技术** | pnpm workspaces 或 npm workspaces |
| **目录结构** | `frontend/` (Vite + React)、`backend/` (Node.js)、`shared/`、`python-service/` |
| **配置** | `concurrently` 实现一行命令 `npm run dev` 同时启动双端 |
| **适配** | 后端 Node.js Windows 环境适配 |

#### 任务 1.2: 起草《项目宪法》

| 项目 | 详情 |
|------|------|
| **目标** | 建立约束所有子 Agent 的"宪法" |
| **文件** | `shared/types.ts` |
| **内容** | 定义核心数据结构：`CompanionState`、`MessageFlow`、`EmotionParameters`、`DeskObject`、`CatState`、`MusicData`、`EnvironmentEvent` |
| **常量** | `shared/constants.ts` 定义 `ANCHOR_BRACKET_POS` 等坐标常量 |

#### 任务 1.3: 三维摄影机与场景规划

| 项目 | 详情 |
|------|------|
| **目标** | 定义"工作模式"与"沉浸模式"的视线范围 |
| **技术** | 使用 `framer-motion-3d` 或 `gsap` |
| **工作台视角** | FOV 50，焦距 0.8m，加入景深模糊窗外 |
| **窗外远景视角** | FOV 75，无限焦距 |
| **切换动画** | 贝塞尔曲线平滑过渡 |

#### 任务 1.4: 低模与后处理管线

| 项目 | 详情 |
|------|------|
| **目标** | 确立项目的"胶片感"基调 |
| **占位模型** | 极其简单的方块代表高楼和桌子 |
| **后处理效果** | Bloom 泛光（阈值 0.8）、Chromatic Aberration（边缘色散）、Film Grain（胶片噪点） |
| **玻璃材质** | 带有污渍和雨痕的折射贴图 |

#### 任务 1.5: 三区城市粗模布景

**过发达区（工业区）:**
- 特征: "异形建筑、重金属、污染"
- 目标: 布置形状千奇百怪的低模建筑，重度发光的警示黄灯效，模拟烟尘粒子

**发达区（核心区）:**
- 特征: "秩序、高耸、绿化"
- 目标: 布置整齐的高密度玻璃幕墙模型，全息投影的垂直绿化

**欠发达区（贫民窟）:**
- 特征: "错落、灯红酒绿"
- 目标: 布置高矮不一的小型模型，挂满洋红/青蓝霓虹灯牌

**细节描述**：城市三区（过发达、发达、欠发达）并非随机分布，而是作为 **360 度的三个扇区** 环绕在中央轨道外侧。随着飞船的环形巡航，窗外景色会像走马灯一样循环切换，形成一个物理逻辑自洽的视觉闭环。

#### 任务 1.6: 气象系统基础

- 3D Rain Particles 基础框架
- 玻璃雨痕 Normal Map 准备
- Screen Space Refraction 配置

---

### 📍 里程碑 2: 核心魔法与资产管线 (Photo to Fleece)

> **基于 M1 契约，前后端开始局部并行，实现项目的灵魂转化。**

#### 任务 2.1: Python 图像特征裂变脚本

| 项目 | 详情 |
|------|------|
| **目标** | 将 2D 图片转化为 3D 渲染所需的深度数据 |
| **技术** | Python + FastAPI/Flask + OpenCV |
| **Base Color** | 提取照片主色调 |
| **Displacement Map** | 利用 Sobel 算子生成边缘高度图（灰度图） |
| **Roughness Map** | 输出粗糙度图，深色区域吸光，浅色区域亮如光纤 |
| **API** | 接收图片 → 处理 → 返回 3 张贴图路径 |

#### 任务 2.2: Node.js 资产路由与持久化

| 项目 | 详情 |
|------|------|
| **目标** | 搭建图片上传与处理的 API 链路 |
| **上传 API** | 接收前端图片上传 |
| **调度逻辑** | Node.js 调用 Python 脚本处理 |
| **存储** | 图片保存到 `uploads/` 目录或 OSS/S3 |
| **数据库** | PostgreSQL `companions` 表记录图片路径、处理参数 |
| **响应** | 返回 3 张贴图 URL 给前端 |

#### 任务 2.3: 赛博珊瑚绒 Shader（最难点）

**基础形态映射:**
- 利用 `InstancedMesh` 生成数万根短粗绒毛
- 每一根从根部像素汲取颜色（Base Color Map）
- 高度由位移图决定
- 线头尖端加入微弱的自发光（Emission）透光效果

**物理呼吸感:**
- Vertex Shader 中加入 Sine 波函数
- 静态毛毯产生自然、轻微的上下浮动与飘动

**情绪颜色微调:**
- 情绪参数 (0.0-1.0) 作为外部 uniform 传递给 Shader
- 愤怒: +红色分量
- 开心: +暖黄色分量
- 悲伤: +蓝色分量

**语音波纹交互:**
- 编写波纹扩散逻辑（片元 Shader）
- AI 说话时，以绒毛球中心为圆心产生水滴样波纹位移场
- 根据音频频段振幅驱动波纹强度

**抚摸交互:**
- Raycaster 检测鼠标与绒毛的交互
- 局部顶点偏移模拟"压下"效果
- 缓动函数实现缓慢恢复

---

### 📍 里程碑 3: 灵魂注入与中枢连线 (The Brain Integration)

> **打通数据流，让场景拥有记忆、智商和感知。**

#### 任务 3.1: PostgreSQL 数据库接入

| 表名 | 字段 | 用途 |
|------|------|------|
| `companions` | id, image_url, color_params, emotion_state, created_at | 珊瑚绒资产 |
| `memories` | id, companion_id, role, content, emotion_score, timestamp | 对话历史（最近 20 轮） |
| `notes` | id, content, markdown, updated_at | 记事本内容 |
| `spatial_objects` | id, object_type, position_x, y, z, rotation, scale | 物件空间坐标 |
| `events` | id, event_type, triggered_at, anchor_id | 事件触发记录 |

**pgvector 预留**: 为后续 AI 向量记忆做准备

#### 任务 3.2: 多模型 LLM 路由中心

| 项目 | 详情 |
|------|------|
| **封装** | Gemini 1.5 Pro / Claude 3 API |
| **System Prompt 设计** | 定义 AI 人格、情感输出规范 |
| **输出格式** | 强制 JSON: `{ reply_text, emotion_score, is_processing }` |
| **路由策略** | 闲聊 → 低延迟高情商模型；复杂指令 → 逻辑推理顶级模型 |
| **情绪映射** | `emotion_score` (0.0-1.0) 映射到 Shader 参数 |

#### 任务 3.3: WebSocket 实时流控通道

| 项目 | 详情 |
|------|------|
| **技术** | Socket.io 或原生 WebSocket |
| **链路** | 前端录音/文本 → 后端 STT → LLM 推理 → TTS → 前端播放 |
| **状态同步** | 实时下发 `is_processing`、`emotion_score` |
| **延迟掩盖** | "解析中 (Thinking)" 状态：珊瑚绒 Shader 切换到底层微光闪烁动画 |
| **视觉同步** | AI 语音播放时，实时触发波纹 Shader |

#### 任务 3.4: 音频系统

| 项目 | 详情 |
|------|------|
| **Web Audio API** | 初始化音频上下文 |
| **Audio Analyser** | 获取频域数据 |
| **TTS 播放** | 流式语音播放与波形同步 |

---

### 📍 里程碑 4: 生产力补全与细节打磨 (The Polishing)

> **回到前端状态深水区，实现极具反差感的工作流闭环。**

#### 任务 4.1: Zustand 状态中枢与空间坐标持久化

| 项目 | 详情 |
|------|------|
| **目标** | 彻底剥离 React 高频组件状态，保证 60FPS 满帧运行 |
| **Store 拆分** | `UIStore`（记事本等）、`SceneStore`（3D 状态）、`SpatialStore`（物件坐标） |
| **高频数据** | 音频频段、猫咪坐标、珊瑚绒波纹参数 |
| **持久化** | `SpatialStore` 实时同步到数据库 |

#### 任务 4.2: 沉浸式生产力组件 (Drei HTML)

**活页记事本:**
- 使用 `@react-three/drei` 的 `<Html>` 将 React 组件贴合在 3D 纸张模型表面
- 支持 Markdown 渲染
- 手写字体 + 粗糙纸张纹理 CSS 滤镜
- 数据同步至 PostgreSQL

**全息音乐播放器:**
- `MeshPhysicalMaterial` 配置 transmission 和 roughness
- 悬浮旋转动画（黑胶机实体化）
- Web Audio 频域分析驱动视觉律动

#### 任务 4.3: 独立生命体 - 8-bit 故障猫 AI

**Billboard 技术:**
- 2D 面片始终面朝镜头
- 随镜头转动自动旋转

**Glitch Shader:**
- 周期性水平错位
- RGB 色差
- CRT 扫描线

**NavMesh 寻路:**
- 桌面、窗沿、窗外金属架铺设寻路网格
- 状态机：发呆、洗脸、巡逻、睡觉、盯人
- 动态更新：物件拖动后重新计算路径

**事件联动:**
- 音乐 BPM > 120 时摇头
- AI 说话时触发 Glitch
- 与装饰物件互动（生态缸、黑胶机、热饮）

#### 任务 4.4: 全局拖拽控制与防穿模系统

| 项目 | 详情 |
|------|------|
| **DragControls** | `@react-three/drei` 实现拖拽 |
| **平面锁定** | 强制 Y 轴锁定，仅限 XZ 平面 |
| **AABB 包围盒** | 每个物件的安全半径 |
| **柔性排斥算法** | 缓动函数实现平滑滑开，避免卡顿发抖 |
| **边界限制** | 空气墙防止拖出窗外 |
| **打断机制** | 抓起小猫时中断状态机，进入"被拎起"状态 |

#### 任务 4.5: 世界导演与环境插槽系统

| 项目 | 详情 |
|------|------|
| **预设插槽** | 5-8 个 `EventAnchor`（焊接架、玻璃外沿、飞船顶端、桌面边缘） |
| **事件注册表** | `events.config.ts`：id, probability, targetAnchor, component |
| **触发算法** | 现实时间、概率、AI 情绪 |
| **生命周期** | 事件自销毁（如蝴蝶飞出视野后卸载） |
| **外部 API** | Node.js 强制触发特定事件 |
| **动态加载** | React Suspense + lazy |

#### 任务 4.6: 治愈系环境装饰与白噪音触发器

**荧光生态缸:**
- 玻璃折射 Shader
- 内部发光粒子系统（电子萤火虫）
- 微弱虫鸣白噪音

**全息黑胶机:**
- 悬浮旋转动画
- 暖黄色环境光 (PointLight)
- 小猫蜷缩睡觉交互

**拟态发光热饮:**
- 慢速流动的体积蒸汽 Shader
- 营造温度感

**离子情绪香薰:**
- 丝绸质感的流体烟雾特效
- 色彩与 AI 睡眠/情绪状态同步

**微型 CRT 监听器:**
- CRT 着色器：扫描线、曲率、色差、噪声
- WebSocket 实时日志映射
- Canvas 纹理贴图

#### 任务 4.7: 环境光源控制与"二人世界"沉浸模式

| 项目 | 详情 |
|------|------|
| **物理台灯** | 可点击的机械开关，带拉线音效 |
| **触发状态** | `isFocusMode` 全局状态 |
| **灯光变化** | 主光源平滑熄灭 |
| **UI 隐匿** | 生产力 UI 透明度降为 0 |
| **后处理加深** | Vignette 暗角 + Depth of Field 景深 |
| **行为屏蔽** | 小猫睡眠、其他物件 Hover 禁用 |
| **输入独占** | 100% 锁定 AI 伴侣交互 |

---

## 8. 关键技术细节索引

### 8.1 Shader 技术汇总

| Shader 名称 | 用途 | 关键技术 |
|-------------|------|----------|
| **珊瑚绒顶点 Shader** | 绒毛生成与呼吸动画 | InstancedMesh + Vertex Displacement + Sine Wave |
| **珊瑚绒片元 Shader** | 颜色、发光、波纹 | Emission Map + Ripple Diffusion + 情绪 Color Mixing |
| **Glitch Shader** | 小猫故障效果 | RGB Shift + Horizontal Glitch + Scanlines |
| **CRT Shader** | 微型副屏复古效果 | Curvature + Vignette + Chromatic Aberration + Noise |
| **体积蒸汽 Shader** | 热饮蒸汽 | Particle System + Slow Motion Flow |
| **玻璃折射 Shader** | 生态缸、飞船玻璃 | Transmission + Normal Map + Rain Distortion |

### 8.2 渲染优化策略

| 策略 | 实现 |
|------|------|
| 2.5D 视差 | HDRI 远景 + Low-Poly 中景 + PBR 近景 |
| Billboard | 小猫 2D 面片始终面朝镜头 |
| InstancedMesh | 珊瑚绒数万根绒毛实例化渲染 |
| Suspense/Lazy | 事件组件动态加载 |
| LOD (预留) | 根据距离切换模型精度 |

### 8.3 状态管理策略

| 状态类型 | 管理工具 | 更新频率 |
|----------|----------|----------|
| UI 状态 | Zustand UIStore | 用户交互触发 |
| 3D 场景状态 | Zustand SceneStore | 每帧读取，不触发 React 重渲染 |
| 空间坐标 | Zustand SpatialStore + DB | 拖拽结束时持久化 |
| WebSocket 状态 | Socket.io Client | 实时双向同步 |

---

## 9. 数据库设计概要

### 9.1 核心表结构

```sql
-- 珊瑚绒伴侣表
CREATE TABLE companions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    image_url TEXT NOT NULL,
    base_color_map TEXT,
    displacement_map TEXT,
    roughness_map TEXT,
    emotion_state JSONB DEFAULT '{"score": 0.5, "type": "calm"}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 对话记忆表
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    companion_id UUID REFERENCES companions(id),
    role TEXT CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    emotion_score FLOAT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- 空间物件表
CREATE TABLE spatial_objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_type TEXT NOT NULL, -- 'notepad', 'player', 'cat', 'terrarium', etc.
    position_x FLOAT DEFAULT 0,
    position_y FLOAT DEFAULT 0,
    position_z FLOAT DEFAULT 0,
    rotation_x FLOAT DEFAULT 0,
    rotation_y FLOAT DEFAULT 0,
    rotation_z FLOAT DEFAULT 0,
    scale FLOAT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 用户笔记表
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT DEFAULT '',
    markdown BOOLEAN DEFAULT true,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 10. 接口契约定义

### 10.1 核心 TypeScript 接口

```typescript
// shared/types.ts

// 情绪参数
interface EmotionParameters {
  score: number;        // 0.0 - 1.0
  type: 'angry' | 'happy' | 'sad' | 'calm' | 'excited';
  intensity: number;    // 波动强度
}

// 珊瑚绒状态
interface CompanionState {
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

// AI 消息包
interface AIPacket {
  replyText: string;
  emotionScore: number;
  emotionType: string;
  isProcessing: boolean;
  audioUrl?: string;
}

// 桌面物件
interface DeskObject {
  id: string;
  type: 'notepad' | 'player' | 'companion' | 'cat' | 'lamp' | 'terrarium' | 'drink' | 'incense' | 'crt';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  isInteractable: boolean;
  collisionRadius: number;
}

// 小猫状态
interface CatState {
  position: [number, number, number];
  state: 'idle' | 'walking' | 'sleeping' | 'watching' | 'held';
  targetPosition?: [number, number, number];
  isGlitching: boolean;
}

// 音乐数据
interface MusicData {
  isPlaying: boolean;
  bpm: number;
  frequencyData: Uint8Array; // 频域数据
  currentTrack?: string;
}

// 环境事件
interface EnvironmentEvent {
  id: string;
  type: 'butterfly' | 'flower_bloom' | 'rainbow' | 'hologram';
  anchorId: string;
  probability: number;
  triggeredAt?: Date;
  component: string; // React 组件路径
}

// 全局应用状态
interface AppState {
  mode: 'immersive' | 'work' | 'focus'; // 沉浸/工作/二人世界
  isAudioInitialized: boolean;
  companion: CompanionState;
  cat: CatState;
  music: MusicData;
  objects: DeskObject[];
  isFocusMode: boolean;
}
```

### 10.2 WebSocket 事件定义

```typescript
// 客户端 → 服务端
interface ClientEvents {
  'user:message': { text: string; timestamp: number };
  'user:voice': { audioBlob: Blob; timestamp: number };
  'object:moved': { objectId: string; position: [number, number, number] };
  'mode:change': { mode: 'immersive' | 'work' | 'focus' };
}

// 服务端 → 客户端
interface ServerEvents {
  'ai:response': AIPacket;
  'ai:processing': { isProcessing: boolean };
  'cat:update': CatState;
  'music:sync': { bpm: number; frequencyData: number[] };
  'event:trigger': EnvironmentEvent;
  'log:append': { message: string; level: 'info' | 'warn' | 'error' };
}
```

---

## 附录: 设计决策记录

### A. 为什么不使用 SQLite？

**决策**: 放弃 SQLite，直接使用 PostgreSQL

**理由**:
- 长周期项目需要向量检索能力 (`pgvector`)
- 避免后期痛苦的迁移成本
- Docker 本地运行 PostgreSQL 仅需一行命令

### B. 为什么采用"障眼法"而非真实建模？

**决策**: 2.5D 视差 + 后期处理 替代 全 3D 建模

**理由**:
- 用户不会进入城市内部，只需做好"看向窗外"的那一面
- 玻璃滤镜本身就是最好的"遮羞布"
- 保证在普通轻薄本上也能流畅运行

### C. 为什么是"珊瑚绒毛毯"而非 3D 模型？

**决策**: 照片 → 毛绒 Shader 替代 AI 生成 3D 模型

**理由**:
- AI 生成 3D 模型需要数分钟，打破沉浸感
- 用户可以与"自己的照片"对话，情感连接更强
- 技术实现优雅，充分发挥 WebGL 实时渲染优势

### D. 为什么是"治愈系"而非"硬核黑客"？

**决策**: 治愈系 Cozy Cyberpunk 替代 硬核 Industrial

**理由**:
- 目标用户是喜欢挂机、放松的人群
- 电路板和代码终端会产生"焦虑感"
- 生态缸、黑胶机、热饮更能提供"生命感"和"陪伴感"

---

*文档生成时间: 2026-04-08*  
*适用版本: NeonEcho V1.0 MVP*
