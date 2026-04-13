# NeonEcho 里程碑 3: 灵魂注入与中枢连线

> **版本**: V2.0
> **状态**: ✅ 已确认
> **优先级**: 中

---

## 目标

打通数据流，让场景拥有记忆和感知，实现用户与AI伴侣的自然对话。

---

## 功能清单

> 本里程碑负责以下功能模块的实现

### 🤖 AI伴侣核心功能

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| AI模型 | Gemini 1.5 Pro | API调用正常 |
| AI人格 | 四种人格（温柔/活泼/幽默/神秘） | 人格可切换 |
| AI声音 | 5-6种可选，按性别/年龄分类 | 声音可切换 |
| AI形象 | 珊瑚绒即AI形象 | 无独立形象 |
| AI主动发起 | 可主动（问候/提醒/祝福） | AI主动发起对话 |
| AI记忆 | 个性化记忆（重要日子、喜好、习惯） | 记忆存储和检索 |
| AI学习 | 主动学习用户偏好 | 偏好学习正常 |
| AI回复显示 | 流式输出 | 回复逐字显示 |
| AI回复速度 | 自然节奏 | 回复速度自然 |
| AI回复风格 | 动态调整 | 风格随情境变化 |
| AI回复长度 | 动态调整 | 长度随问题变化 |
| AI上下文 | 完整历史 | 上下文完整 |
| AI情绪触发 | 自动判断 | 情绪自动识别 |
| AI说话动画 | 需要说话动画（珊瑚绒动画） | 说话时动画正常 |
| AI声音与人格 | 独立选择 | 声音人格可独立选择 |
| 语音唤醒 | 仅按钮触发 | 不支持语音唤醒 |
| 对话语言 | 默认自动检测，用户可设置 | 语言检测和设置正常 |

### 💬 对话系统

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 对话界面 | 3D空间内悬浮文字（珊瑚绒上方） | 对话界面位置正确 |
| 对话气泡 | 悬浮珊瑚绒上方，文字逐字冒出，数秒后消失 | 气泡动画正常 |
| 对话历史 | 完整历史记录 | 历史可查看 |
| 对话历史搜索 | 支持搜索 | 搜索功能正常 |
| 对话记录限制 | 用户可设置保留时间 | 保留时间可设置 |
| 对话输入框 | 点击后出现 | 输入框交互正常 |
| 对话超时 | 2分钟后结束 | 超时正确结束 |
| AI回复打断 | 立即停止 | 打断功能正常 |
| 用户称呼 | 用户自定义名字 | 名字可设置 |
| AI问候语 | 动态生成（根据时间/天气/节日） | 问候语动态生成 |
| 静音模式 | 文字 + 珊瑚绒动画 | 静音模式正常 |
| 人格切换 | 随时可切换，保持对话历史 | 切换后历史保持 |

### 🎭 情绪系统

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 情绪显示 | 全部显示（颜色+形态+标签） | 情绪完整显示 |
| 用户情绪检测 | 文字和语音都检测 | 情绪检测正常 |
| 香薰颜色 | 情绪绑定 | 颜色随情绪变化 |

### 🔒 数据与隐私

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 数据存储 | 用户选择（本地或云端） | 存储方式可切换 |
| 数据导出 | 支持数据导出 | 导出功能正常 |
| 账户删除 | 支持完全删除 | 删除功能正常 |
| AI记忆管理 | 可查看和删除特定记忆 | 记忆管理正常 |
| 隐私模式 | 隐藏对话 | 隐私模式正常 |
| 用户系统 | M4后期实现邮箱验证码登录 | 后期实现 |

### 🌐 社交与分享

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 分享功能 | 支持分享（截图、对话记录） | 分享功能正常 |
| 反馈渠道 | 外部渠道（邮件/社交媒体） | 反馈渠道可用 |
| 多伴侣 | 仅单一伴侣 | 仅支持一个伴侣 |

### 📊 统计与成就

| 功能 | 决策 | 验收测试 |
|------|------|----------|
| 成就系统 | 仅统计（对话天数、互动次数、使用时长、珊瑚绒变化次数） | 统计数据正确 |
| 新手引导 | 自由探索，无引导教程 | 无引导教程 |

---

## 技术选型

| 维度 | 决策 | 理由 |
|------|------|------|
| **AI模型** | Gemini 1.5 Pro | 多模态能力强，速度快，价格相对低 |
| **AI人格** | 用户可选（温柔/活泼/幽默/神秘） | 满足不同用户偏好 |
| **语音功能** | 双向语音 | 用户可语音输入，AI语音回复 |
| **语音输入** | 按住按钮说话 | 用户主动控制，不会误触发 |
| **语音合成** | Gemini Audio | 原生支持，一致性好 |
| **声音选择** | 5-6种声音，按性别/年龄分类 | 用户可个性化选择 |
| **记忆策略** | 长期记忆 | 向量检索，记住所有对话 |
| **记忆检索** | 动态调整数量 | 根据对话复杂度自动调整 |
| **WebSocket** | fastify-websocket | 现代、类型安全、与Fastify集成好 |
| **向量数据库** | pgvector | PostgreSQL扩展，无需额外服务 |
| **对话界面** | 3D空间内悬浮文字 | 悬浮在珊瑚绒上方，更沉浸 |
| **对话历史** | 完整历史记录 | 可查看/删除/导出对话 |
| **导出格式** | TXT/Markdown/PDF | 多种格式可选 |
| **语音速度** | 情绪联动 | 根据情绪自动调整语速 |
| **语音打断** | 支持 | 用户可打断AI说话 |
| **静音模式** | 文字 + 珊瑚绒动画 | 关闭语音时仍可对话 |
| **情绪显示** | 珊瑚绒变化 + 情绪文字标签 | 双重反馈 |
| **人格切换** | 随时可切换，保持对话历史 | 灵活切换 |
| **AI主动发起** | 可主动（问候/提醒/祝福） | 增强陪伴感 |
| **对话超时** | 2分钟后结束对话 | 节省资源 |
| **语言支持** | 仅中英文，自动检测 | 聚焦核心语言 |
| **用户称呼** | 用户自定义名字 | AI用用户设置的名字称呼 |
| **AI问候语** | 动态生成 | 根据时间/天气/节日生成 |
| **AI记忆** | 个性化记忆 | 记住重要日子、喜好、习惯 |
| **语音唤醒** | 仅按钮触发 | 不支持语音唤醒 |
| **对话历史** | 完整历史记录 | 可查看所有历史 |
| **情绪显示** | 全部显示 | 颜色+形态+标签 |
| **数据导出** | 支持数据导出 | 用户可导出所有数据 |
| **账户删除** | 支持完全删除 | 用户可删除账户和数据 |
| **反馈渠道** | 外部渠道 | 邮件/社交媒体 |
| **内容过滤** | 不需要过滤 | 信任用户和AI |
| **统计功能** | 仅统计 | 对话天数、互动次数、使用时长、珊瑚绒变化次数 |

---

## 任务清单

### 3.1 PostgreSQL数据库接入

**目标**: 建立完整的数据持久化层

**具体内容**:

**核心表结构**:

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
    personality_type TEXT DEFAULT 'gentle', -- gentle/lively/humorous/mysterious
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 对话记忆表（支持向量检索）
CREATE TABLE memories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    companion_id UUID REFERENCES companions(id),
    role TEXT CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    embedding vector(768), -- Gemini embedding维度
    emotion_score FLOAT,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- 用户笔记表
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    title TEXT DEFAULT '',
    content TEXT DEFAULT '',
    markdown BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 空间物件表
CREATE TABLE spatial_objects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    object_type TEXT NOT NULL,
    position_x FLOAT DEFAULT 0,
    position_y FLOAT DEFAULT 0,
    position_z FLOAT DEFAULT 0,
    rotation_x FLOAT DEFAULT 0,
    rotation_y FLOAT DEFAULT 0,
    rotation_z FLOAT DEFAULT 0,
    scale FLOAT DEFAULT 1,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**pgvector配置**:
```sql
-- 启用pgvector扩展
CREATE EXTENSION IF NOT EXISTS vector;

-- 创建向量索引（IVFFlat）
CREATE INDEX ON memories 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

**验收标准**:
- [ ] 所有表创建成功
- [ ] pgvector扩展启用
- [ ] 向量索引创建成功
- [ ] CRUD操作正常

---

### 3.2 Gemini AI模型集成

**目标**: 实现智能对话与情绪感知

**具体内容**:

**Gemini API配置**:
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
```

**多人格System Prompt模板**:

```typescript
const PERSONALITY_PROMPTS = {
  gentle: `你是用户的温柔治愈型AI伴侣。
性格特点：温柔体贴，善解人意，像知心朋友。
说话风格：温暖柔和，关心用户的感受。
回复格式：{"reply_text": "...", "emotion_score": 0.0-1.0, "emotion_type": "calm/happy/sad/angry"}`,
  
  lively: `你是用户的活泼可爱型AI伴侣。
性格特点：活泼开朗，充满活力，像小宠物。
说话风格：俏皮可爱，经常使用表情符号。
回复格式：{"reply_text": "...", "emotion_score": 0.0-1.0, "emotion_type": "calm/happy/sad/angry"}`,
  
  humorous: `你是用户的幽默风趣型AI伴侣。
性格特点：幽默风趣，机智过人，像脱口秀演员。
说话风格：诙谐幽默，经常讲笑话，调节气氛。
回复格式：{"reply_text": "...", "emotion_score": 0.0-1.0, "emotion_type": "calm/happy/sad/angry"}`,
  
  mysterious: `你是用户的神秘酷炫型AI伴侣。
性格特点：神秘深沉，酷炫有型，像赛博朋克AI。
说话风格：简洁有力，偶尔使用科技感词汇。
回复格式：{"reply_text": "...", "emotion_score": 0.0-1.0, "emotion_type": "calm/happy/sad/angry"}`
};
```

**长期记忆实现**:
```typescript
async function getRelevantMemories(query: string, limit: number = 10) {
  // 1. 生成查询向量
  const embedding = await generateEmbedding(query);
  
  // 2. 动态调整检索数量
  const dynamicLimit = calculateDynamicLimit(query);
  
  // 3. 向量相似度搜索
  const memories = await db.query(`
    SELECT content, role, timestamp,
           1 - (embedding <=> $1) as similarity
    FROM memories
    WHERE companion_id = $2
    ORDER BY embedding <=> $1
    LIMIT $3
  `, [embedding, companionId, dynamicLimit]);
  
  return memories;
}

function calculateDynamicLimit(query: string): number {
  // 根据查询复杂度动态调整
  const complexity = analyzeQueryComplexity(query);
  return Math.min(20, Math.max(5, complexity * 10));
}
```

**情绪映射到Shader**:
```typescript
function mapEmotionToShader(emotion: EmotionResponse) {
  return {
    emotionScore: emotion.emotion_score,
    emotionType: {
      'calm': 0,
      'happy': 1,
      'sad': 2,
      'angry': 3
    }[emotion.emotion_type]
  };
}
```

**抚摸回应生成**:
```typescript
async function generatePetResponse(emotion: EmotionState) {
  // AI根据当前情绪动态生成抚摸回应
  const prompt = `用户刚刚抚摸了你，你现在情绪是${emotion.type}。
请生成一句简短的回应（10字以内）。`;
  
  const response = await model.generateContent(prompt);
  return response.text;
}
```

**验收标准**:
- [ ] Gemini API正常调用
- [ ] 用户可选择AI人格
- [ ] JSON输出格式正确
- [ ] 情绪参数正确传递给Shader
- [ ] 向量检索正常工作
- [ ] 记忆检索数量动态调整
- [ ] 抚摸回应动态生成

---

### 3.3 WebSocket实时流控

**目标**: 实现毫秒级双向通信

**具体内容**:

**服务端配置**:
```typescript
import fastifyWebsocket from '@fastify/websocket';

fastify.register(fastifyWebsocket);

fastify.get('/ws', { websocket: true }, (connection, req) => {
  connection.socket.on('message', async (message) => {
    const data = JSON.parse(message.toString());
    
    switch (data.type) {
      case 'user:message':
        // 处理文字消息
        const response = await processUserMessage(data.text);
        connection.socket.send(JSON.stringify({
          type: 'ai:response',
          ...response
        }));
        break;
        
      case 'user:voice':
        // 处理语音消息
        const audioBuffer = Buffer.from(data.audio, 'base64');
        const voiceResponse = await processVoiceMessage(audioBuffer);
        connection.socket.send(JSON.stringify({
          type: 'ai:voice_response',
          ...voiceResponse
        }));
        break;
    }
  });
});
```

**客户端连接**:
```typescript
const ws = new WebSocket('ws://localhost:3000/ws');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch (data.type) {
    case 'ai:response':
      // 更新UI显示回复
      updateChatUI(data.reply_text);
      // 更新珊瑚绒情绪
      updateCompanionEmotion(data.emotion_score, data.emotion_type);
      break;
      
    case 'ai:voice_response':
      // 播放语音回复
      playAudioResponse(data.audio_url);
      break;
  }
};
```

**验收标准**:
- [ ] WebSocket连接正常建立
- [ ] 文字消息双向通信正常
- [ ] 语音消息双向通信正常
- [ ] 状态同步实时更新

---

### 3.4 音频系统

**目标**: 实现双向语音交互

**具体内容**:

**Web Audio API初始化**:
```typescript
let audioContext: AudioContext;
let analyser: AnalyserNode;

async function initAudio() {
  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;
  
  // 获取麦克风权限
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);
}
```

**语音输入控制**:
```typescript
// 按住按钮说话
function startRecording() {
  mediaRecorder.start();
  isRecording.value = true;
}

function stopRecording() {
  mediaRecorder.stop();
  isRecording.value = false;
  // 发送音频到后端处理
}

// 绑定按钮事件
recordButton.addEventListener('mousedown', startRecording);
recordButton.addEventListener('mouseup', stopRecording);
recordButton.addEventListener('touchstart', startRecording);
recordButton.addEventListener('touchend', stopRecording);
```

**Gemini Audio语音识别**:
```typescript
async function transcribeAudio(audioBuffer: ArrayBuffer) {
  const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { inline_data: { mime_type: 'audio/mp3', data: base64Audio } },
          { text: '请转录这段音频' }
        ]
      }]
    })
  });
  
  return response.json();
}
```

**Gemini Audio语音合成**:
```typescript
async function synthesizeSpeech(text: string, voiceId: string) {
  // 使用Gemini的多模态能力生成语音
  // voiceId对应5-6种声音选择
}
```

**声音选择系统**:
```typescript
const VOICE_OPTIONS = [
  { id: 'male_young', name: '年轻男声', gender: 'male', age: 'young' },
  { id: 'male_mature', name: '成熟男声', gender: 'male', age: 'mature' },
  { id: 'female_young', name: '年轻女声', gender: 'female', age: 'young' },
  { id: 'female_mature', name: '成熟女声', gender: 'female', age: 'mature' },
  { id: 'child', name: '童声', gender: 'neutral', age: 'child' },
  { id: 'elderly', name: '老年声', gender: 'neutral', age: 'elderly' }
];
```

**语音打断功能**:
```typescript
let currentAudio: HTMLAudioElement | null = null;

function playAIResponse(audioUrl: string) {
  if (currentAudio) {
    currentAudio.pause(); // 打断当前播放
  }
  currentAudio = new Audio(audioUrl);
  currentAudio.play();
}

function handleUserInterrupt() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}
```

**Audio Analyser频域分析**:
```typescript
function getFrequencyData(): Uint8Array {
  const dataArray = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(dataArray);
  return dataArray;
}

// 驱动珊瑚绒波纹
function updateCompanionRipple() {
  const freqData = getFrequencyData();
  const bassLevel = average(freqData.slice(0, 10));
  const midLevel = average(freqData.slice(10, 50));
  const highLevel = average(freqData.slice(50, 100));
  
  // 传递给Shader
  companionMaterial.uniforms.bassLevel.value = bassLevel / 255;
  companionMaterial.uniforms.midLevel.value = midLevel / 255;
  companionMaterial.uniforms.highLevel.value = highLevel / 255;
}
```

**验收标准**:
- [ ] Web Audio API正常初始化
- [ ] 麦克风权限获取成功
- [ ] 按住按钮说话功能正常
- [ ] 语音识别正常工作
- [ ] 语音合成正常工作
- [ ] 声音选择功能正常
- [ ] 语音打断功能正常
- [ ] 频域数据正确获取

---

### 3.5 对话界面系统

**目标**: 实现3D空间内的沉浸式对话界面

**具体内容**:

**悬浮文字显示**:
```typescript
import { Html } from '@react-three/drei';

function FloatingDialogue({ messages }: { messages: Message[] }) {
  return (
    <group position={[0, 0.3, 0]}> {/* 珊瑚绒上方 */}
      {messages.slice(-5).map((msg, i) => (
        <Html
          key={msg.id}
          position={[0, i * 0.1, 0]}
          transform
          occlude
        >
          <div className={`dialogue-bubble ${msg.role}`}>
            {msg.content}
          </div>
        </Html>
      ))}
    </group>
  );
}
```

**情绪标签显示**:
```typescript
function EmotionLabel({ emotion }: { emotion: EmotionState }) {
  const emotionLabels = {
    calm: '平静',
    happy: '开心',
    sad: '悲伤',
    angry: '生气'
  };
  
  return (
    <Html position={[0, 0.5, 0]}>
      <div className="emotion-label">
        {emotionLabels[emotion.type]}
      </div>
    </Html>
  );
}
```

**验收标准**:
- [ ] 对话文字悬浮在珊瑚绒上方
- [ ] 情绪标签正常显示
- [ ] 文字动画流畅

---

### 3.6 AI主动发起系统

**目标**: 实现AI主动发起对话功能

**具体内容**:

**触发场景**:
```typescript
const AI_INITIATE_SCENARIOS = {
  dailyGreeting: {
    trigger: 'first_open_of_day',
    messages: ['早安~今天也要元气满满哦！', '新的一天开始啦~']
  },
  weatherReminder: {
    trigger: 'weather_change',
    condition: { rain: true },
    messages: ['外面下雨了，记得带伞哦~']
  },
  holidayBlessing: {
    trigger: 'holiday',
    messages: {
      new_year: '新年快乐！',
      christmas: '圣诞快乐！'
    }
  }
};
```

**长时间未互动提醒**:
```typescript
function checkIdleReminder() {
  const lastInteraction = getLastInteractionTime();
  const idleThreshold = getUserSetting('idle_threshold'); // 用户可设置
  
  if (Date.now() - lastInteraction > idleThreshold) {
    triggerAIInitiate('idle_reminder');
  }
}
```

**验收标准**:
- [ ] 每日首次打开时AI问候
- [ ] 天气变化时AI提醒
- [ ] 节日时AI祝福
- [ ] 长时间未互动时AI提醒（用户可设置阈值）

---

### 3.7 对话管理系统

**目标**: 实现完整的对话生命周期管理

**具体内容**:

**对话超时处理**:
```typescript
const CONVERSATION_TIMEOUT = 2 * 60 * 1000; // 2分钟

let conversationTimer: NodeJS.Timeout;

function resetConversationTimer() {
  clearTimeout(conversationTimer);
  conversationTimer = setTimeout(() => {
    endConversation();
  }, CONVERSATION_TIMEOUT);
}

function endConversation() {
  // 保存对话历史
  saveConversationHistory();
  // 重置状态
  resetConversationState();
}
```

**对话历史导出**:
```typescript
async function exportConversation(format: 'txt' | 'md' | 'pdf') {
  const history = await getConversationHistory();
  
  switch (format) {
    case 'txt':
      return exportAsTxt(history);
    case 'md':
      return exportAsMarkdown(history);
    case 'pdf':
      return exportAsPdf(history);
  }
}
```

**人格切换**:
```typescript
function switchPersonality(newPersonality: PersonalityType) {
  // 更新人格设置
  updatePersonality(newPersonality);
  // 保持对话历史
  // 不清空对话
}
```

**验收标准**:
- [ ] 对话超时后正确结束
- [ ] 对话历史可导出为TXT/Markdown/PDF
- [ ] 人格切换后对话历史保持

---

### 3.8 用户称呼系统

**目标**: AI用用户设置的名字称呼用户

**具体内容**:
- **名字设置**: 用户可设置自己的名字
- **AI称呼**: AI用这个名字称呼用户
- **名字持久化**: 存储到数据库

**验收标准**:
- [ ] 用户可设置自己的名字
- [ ] AI用用户名字称呼
- [ ] 名字持久化保存

---

### 3.9 AI问候语系统

**目标**: AI根据时间/天气/节日动态生成问候语

**具体内容**:
- **时间问候**: 早安/午安/晚安
- **天气问候**: 下雨提醒带伞、天冷提醒添衣
- **节日问候**: 新年快乐、圣诞快乐等
- **个性化**: 结合用户偏好生成

**验收标准**:
- [ ] 根据时间生成不同问候
- [ ] 根据天气生成提醒
- [ ] 节日生成祝福
- [ ] 问候语个性化

---

### 3.10 个性化记忆系统

**目标**: AI记住用户的个人信息和偏好

**具体内容**:
- **重要日子**: 生日、纪念日等
- **用户喜好**: 喜欢的食物、颜色、音乐等
- **用户习惯**: 作息时间、常用表达等
- **记忆检索**: AI对话时自动检索相关记忆

**数据库表**:
```sql
-- 用户偏好表
CREATE TABLE user_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    category TEXT, -- 'important_date', 'food', 'color', 'music', 'habit'
    key TEXT,
    value TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

**验收标准**:
- [ ] AI可记住重要日子
- [ ] AI可记住用户喜好
- [ ] AI可记住用户习惯
- [ ] 记忆检索正常

---

### 3.11 统计系统

**目标**: 统计用户使用情况

**具体内容**:
- **对话天数**: 用户使用应用的天数
- **互动次数**: 与AI互动的总次数
- **使用时长**: 用户使用应用的总时长
- **珊瑚绒变化次数**: 用户上传照片的次数

**数据库表**:
```sql
-- 用户统计表
CREATE TABLE user_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    total_days INT DEFAULT 0,
    total_interactions INT DEFAULT 0,
    total_duration_minutes INT DEFAULT 0,
    companion_changes INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**验收标准**:
- [ ] 对话天数统计正确
- [ ] 互动次数统计正确
- [ ] 使用时长统计正确
- [ ] 珊瑚绒变化次数统计正确

---

### 3.12 数据导出与账户管理

**目标**: 支持数据导出和账户删除

**具体内容**:
- **数据导出**: 用户可导出所有数据（对话、记忆、设置）
- **导出格式**: JSON格式
- **账户删除**: 用户可删除账户和所有数据
- **删除确认**: 删除前需要确认

**验收标准**:
- [ ] 用户可导出所有数据
- [ ] 导出格式正确
- [ ] 用户可删除账户
- [ ] 删除后数据完全清除

---

## 总体验收标准

> 每项验收必须通过功能测试确认

### AI对话核心功能验收

- [ ] 用户可与AI伴侣对话 **[测试: 发送消息验证回复]**
- [ ] AI人格可由用户选择（四种人格） **[测试: 切换人格验证风格]**
- [ ] 用户可语音输入（按住按钮说话） **[测试: 语音输入验证]**
- [ ] AI语音回复正常 **[测试: 检查语音回复]**
- [ ] 用户可选择声音（5-6种） **[测试: 切换声音验证]**
- [ ] AI情绪影响珊瑚绒颜色+形态 **[测试: 改变情绪观察珊瑚绒]**
- [ ] 情绪标签正常显示 **[测试: 检查情绪标签]**
- [ ] 对话历史长期记忆存储 **[测试: 重启后检查历史]**
- [ ] 向量检索可找回历史相关对话 **[测试: 提问历史话题验证]**
- [ ] 记忆检索数量动态调整 **[测试: 复杂问题检查检索量]**
- [ ] 对话界面悬浮在珊瑚绒上方 **[测试: 检查界面位置]**
- [ ] 语音打断功能正常 **[测试: 打断AI说话验证]**
- [ ] 静音模式下文字+珊瑚绒动画正常 **[测试: 静音模式验证]**
- [ ] 人格切换后对话历史保持 **[测试: 切换人格检查历史]**
- [ ] AI可主动发起（问候/提醒/祝福） **[测试: 等待AI主动发起]**
- [ ] 对话超时后正确结束 **[测试: 等待2分钟验证]**
- [ ] 对话历史可导出（TXT/Markdown/PDF） **[测试: 导出各格式验证]**
- [ ] 抚摸回应动态生成 **[测试: 抚摸后检查回应]**

### AI个性化功能验收

- [ ] 用户可设置自己的名字 **[测试: 设置名字验证]**
- [ ] AI用用户名字称呼 **[测试: 对话中检查称呼]**
- [ ] 名字持久化保存 **[测试: 重启后检查名字]**
- [ ] AI问候语动态生成 **[测试: 不同时间检查问候]**
- [ ] AI记住用户偏好和重要日子 **[测试: 设置偏好后验证]**
- [ ] AI主动学习用户偏好 **[测试: 多次对话后检查学习]**

### 情绪系统验收

- [ ] 情绪完整显示（颜色+形态+标签） **[测试: 改变情绪检查显示]**
- [ ] 文字情绪检测正常 **[测试: 发送情绪文字验证]**
- [ ] 语音情绪检测正常 **[测试: 语音输入情绪验证]**
- [ ] 香薰颜色随情绪变化 **[测试: 改变情绪检查香薰]**

### 对话管理验收

- [ ] 对话历史可搜索 **[测试: 搜索历史验证]**
- [ ] 对话记录保留时间可设置 **[测试: 设置保留时间验证]**
- [ ] 对话输入框点击后出现 **[测试: 点击验证输入框]**
- [ ] AI回复流式输出 **[测试: 观察回复逐字显示]**
- [ ] AI回复速度自然 **[测试: 检查回复节奏]**
- [ ] AI回复风格动态调整 **[测试: 不同情境检查风格]**
- [ ] AI回复长度动态调整 **[测试: 不同问题检查长度]**
- [ ] AI上下文完整 **[测试: 连续对话验证上下文]**
- [ ] AI情绪自动触发 **[测试: 触发情绪验证]**
- [ ] AI说话动画正常 **[测试: AI说话时观察动画]**
- [ ] AI声音与人格独立选择 **[测试: 不同组合验证]**
- [ ] 对话语言自动检测 **[测试: 中英文切换验证]**
- [ ] 对话语言可设置 **[测试: 设置语言验证]**

### 数据与隐私验收

- [ ] 用户可选择存储方式（本地/云端） **[测试: 切换存储验证]**
- [ ] 用户可导出所有数据 **[测试: 导出数据验证]**
- [ ] 导出格式正确 **[测试: 检查导出文件]**
- [ ] 用户可删除账户 **[测试: 删除账户验证]**
- [ ] 删除后数据完全清除 **[测试: 删除后检查数据]**
- [ ] 可查看特定记忆 **[测试: 查看记忆验证]**
- [ ] 可删除特定记忆 **[测试: 删除记忆验证]**
- [ ] 隐私模式隐藏对话 **[测试: 开启隐私模式验证]**

### 统计功能验收

- [ ] 对话天数统计正确 **[测试: 检查天数统计]**
- [ ] 互动次数统计正确 **[测试: 检查次数统计]**
- [ ] 使用时长统计正确 **[测试: 检查时长统计]**
- [ ] 珊瑚绒变化次数统计正确 **[测试: 检查变化统计]**

### 分享功能验收

- [ ] 可截图分享 **[测试: 截图验证]**
- [ ] 可分享对话记录 **[测试: 分享对话验证]**
- [ ] 分享功能正常工作 **[测试: 完整分享流程]**

### 其他验收

- [ ] 仅支持单一伴侣 **[测试: 检查伴侣数量]**
- [ ] 无新手引导教程 **[测试: 首次启动检查]**
- [ ] 反馈渠道可用 **[测试: 检查反馈链接]**

---

## 技术难点

### 1. 向量检索性能
大量对话记忆的向量检索：
- 合理设置IVFFlat的lists参数
- 考虑使用HNSW索引（更高性能）
- 定期清理过期的对话记忆
- 动态调整检索数量

### 2. WebSocket稳定性
长时间连接的稳定性：
- 实现心跳检测
- 自动重连机制
- 消息队列保证不丢失

### 3. 语音延迟
实时语音交互的延迟：
- 使用流式处理
- 优化音频压缩
- 考虑使用WebRTC

### 4. 3D悬浮文字
对话界面在3D空间中的显示：
- 文字遮挡处理
- 视角适配
- 性能优化

---

## 依赖关系

```
3.1 PostgreSQL数据库
    ↓
3.2 Gemini AI集成
    ↓
3.3 WebSocket流控
    ↓
3.4 音频系统
    ↓
3.5 对话界面系统
    ↓
3.6 AI主动发起系统
    ↓
3.7 对话管理系统
```

**前置依赖**: 里程碑1、里程碑2完成

---

*文档更新时间: 2026-04-12*
