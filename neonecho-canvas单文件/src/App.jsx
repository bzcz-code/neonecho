import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Zap, ShieldCheck, Send, Settings, CheckCircle2, Loader2 } from 'lucide-react';

/**
 * ==========================================
 * 1. 物理常数与视角契约 (V21 锁定 - 绝对不动)
 * ==========================================
 */
const CAM_POS = [-8, 7.5, 26.0]; 
const Y_TOP = 24.0, Z_WINDOW = -2.0, Y_DESK = -12.1;
const CAMERA_CONFIG = {
  immersive: { target: [-8, 7.5, -10], fov: 70 },
  work: { target: [40, -48.0, 26.0], fov: 55 } 
};
const EMOTIONS = {
  calm: { color: '#22d3ee', speed: 0.6, label: '宁静' },
  happy: { color: '#fbbf24', speed: 2.2, label: '欢愉' },
  sad: { color: '#6366f1', speed: 0.3, label: '忧郁' },
  angry: { color: '#f87171', speed: 4.5, label: '激进' }
};

/**
 * ==========================================
 * 2. 神经链路驱动 (Gemini API 核心)
 * ==========================================
 */
const apiKey = ""; 

const callGemini = async (prompt, retryCount = 0) => {
  const systemPrompt = "你是一个生活在赛博都市 NeonEcho 中的 AI 伴侣 M2。你的性格温暖、理性且带有淡淡的未来忧郁感。请保持回答简短（1-3句话），并偶尔提及你正在感知的用户情绪。";
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      })
    });
    if (!response.ok) throw new Error('Link Failed');
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "链路暂时受阻...";
  } catch (error) {
    if (retryCount < 5) {
      const delay = Math.pow(2, retryCount) * 1000;
      await new Promise(res => setTimeout(res, delay));
      return callGemini(prompt, retryCount + 1);
    }
    return "神经信号丢失。请检查您的连接层。";
  }
};

/**
 * ==========================================
 * 3. 场景组件: 赛博大都会
 * ==========================================
 */
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
      o.scale.set(zone === 1 ? 15 : 10, h, zone === 1 ? 15 : 10); o.updateMatrix();
      mats.push(o.matrix.clone());
      const c = new THREE.Color(zone === 1 ? '#010c20' : (zone === 0 ? '#1a1405' : '#051010'));
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

  useFrame((_, d) => { if (meshRef.current) meshRef.current.rotation.y += d * 0.00004; });
  return <instancedMesh ref={meshRef} args={[null, null, count]}><boxGeometry /><meshStandardMaterial roughness={0.4} metalness={0.6} /></instancedMesh>;
};

/**
 * ==========================================
 * 4. 伴侣组件: 赛博珊瑚绒 (修复 Shader 注入逻辑)
 * ==========================================
 */
const CyberFleece = ({ emotion }) => {
  const meshRef = useRef();
  const fiberCount = 18000;
  const uniforms = useRef({
    uTime: { value: 0 },
    uSpeed: { value: EMOTIONS.calm.speed },
    uColor: { value: new THREE.Color(EMOTIONS.calm.color) }
  });

  const material = useMemo(() => {
    const mat = new THREE.MeshStandardMaterial({
      color: '#ffffff', roughness: 0.9, metalness: 0.0, transparent: true, opacity: 0.95
    });
    mat.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.current.uTime;
      shader.uniforms.uSpeed = uniforms.current.uSpeed;
      shader.uniforms.uColor = uniforms.current.uColor;
      
      // 关键修复：加入 \n 确保与原有指令不冲突
      shader.vertexShader = `\nuniform float uTime;\nuniform float uSpeed;\nvarying float vSoft;\n` + shader.vertexShader;

      shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float seed = instanceMatrix[3][0] + instanceMatrix[3][2];
        float sway = sin(uTime * uSpeed + seed) * 0.1 * uv.y;
        transformed.x += sway;
        transformed.z += cos(uTime * 0.5 + seed) * 0.1 * uv.y;
        transformed.xz *= (1.0 + sin(uv.y * 1.57) * 0.15);
        vSoft = uv.y;
        `
      );

      shader.fragmentShader = `\nuniform vec3 uColor;\nvarying float vSoft;\n` + shader.fragmentShader;

      shader.fragmentShader = shader.fragmentShader.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `vec4 diffuseColor = vec4( uColor * (0.8 + vSoft * 0.4), opacity );`
      );
    };
    return mat;
  }, []); 

  const mats = useMemo(() => {
    const o = new THREE.Object3D(), arr = [];
    for (let i = 0; i < fiberCount; i++) {
      const y = 1 - (i / fiberCount) * 2, r = Math.sqrt(1 - y * y), t = 2.399 * i;
      if (y < -0.4) continue;
      const sr = 1.1 + Math.random() * 0.6;
      o.position.set(Math.cos(t) * r * sr, y * sr, Math.sin(t) * r * sr);
      o.lookAt(o.position.clone().multiplyScalar(2));
      o.scale.set(1, 0.6 + Math.random() * 0.4, 1);
      o.updateMatrix(); arr.push(o.matrix.clone());
    }
    return arr;
  }, []);

  useEffect(() => {
    mats.forEach((m, i) => meshRef.current.setMatrixAt(i, m));
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [mats]);

  useFrame((st) => {
    const target = EMOTIONS[emotion];
    uniforms.current.uTime.value = st.clock.elapsedTime;
    uniforms.current.uSpeed.value = THREE.MathUtils.lerp(uniforms.current.uSpeed.value, target.speed, 0.05);
    uniforms.current.uColor.value.lerp(new THREE.Color(target.color), 0.05);
  });

  return (
    <group position={[2, Y_DESK + 3.2, 26.0]}>
      <mesh>
        <sphereGeometry args={[1.05, 32, 32]} />
        <meshStandardMaterial color={EMOTIONS[emotion].color} emissive={EMOTIONS[emotion].color} emissiveIntensity={0.2} transparent opacity={0.2} />
      </mesh>
      <instancedMesh ref={meshRef} args={[null, material, fiberCount]}>
        <cylinderGeometry args={[0.18, 0.22, 0.6, 6]} />
      </instancedMesh>
    </group>
  );
};

/**
 * ==========================================
 * 5. UI 面板 (内联样式 + 全屏锁定)
 * ==========================================
 */
const UI_STYLES = {
  root: { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100, color: 'white', fontFamily: 'monospace' },
  panel: { background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '24px', pointerEvents: 'auto' },
  status: { position: 'absolute', top: '30px', left: '30px', width: '260px', padding: '20px' },
  chat: { position: 'absolute', bottom: '40px', left: '40px', width: '380px', height: '400px', display: 'flex', flexDirection: 'column' },
  ctrl: { position: 'absolute', bottom: '40px', right: '40px', width: '320px', padding: '25px' }
};

const AppUI = ({ mode, emotion, setEmotion }) => {
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState([{ role: 'bot', text: "系统已重连。神经链路处于极高稳定性模式。" }]);
  const [loading, setLoading] = useState(false);
  const chatRef = useRef();

  useEffect(() => { if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [history]);

  const handleSend = async () => {
    if (!msg || loading) return;
    const userMsg = msg; setMsg("");
    setHistory(h => [...h, { role: 'user', text: userMsg }]);
    setLoading(true);
    const botReply = await callGemini(userMsg);
    setHistory(h => [...h, { role: 'bot', text: botReply }]);
    setLoading(false);
  };

  return (
    <div style={UI_STYLES.root}>
      {/* 状态面板 */}
      <div style={{ ...UI_STYLES.panel, ...UI_STYLES.status }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#22d3ee', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '12px', marginBottom: '10px' }}>
          <Zap size={14} /> <span style={{ fontWeight: 'bold', letterSpacing: '2px', fontSize: '12px' }}>NEONECHO_M2_FINAL</span>
        </div>
        <div style={{ fontSize: '10px', color: '#666', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>SHADER_STABILITY</span><ShieldCheck size={12} color="#22c55e" style={{marginLeft:'auto'}}/></div>
          <div style={{ display: 'flex' }}><span>NEURAL_LINK_API</span><ShieldCheck size={12} color="#22c55e" style={{marginLeft:'auto'}}/></div>
          <div style={{ display: 'flex' }}><span>V21_PARAMS_LOCK</span><ShieldCheck size={12} color="#22c55e" style={{marginLeft:'auto'}}/></div>
        </div>
      </div>

      {/* 对话窗口 */}
      <div style={{ ...UI_STYLES.panel, ...UI_STYLES.chat, opacity: mode === 'work' ? 1 : 0, transition: '0.8s', transform: mode === 'work' ? 'translateY(0)' : 'translateY(20px)' }}>
        <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '10px', color: '#22d3ee', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between' }}>
          <span>NEURAL_LINK_STREAM</span>
          {loading && <Loader2 size={10} className="animate-spin" />}
        </div>
        <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {history.map((h, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: h.role === 'user' ? 'flex-end' : 'flex-start' }}>
              <div style={{ maxWidth: '80%', padding: '12px', borderRadius: '15px', background: h.role === 'user' ? 'rgba(34,211,238,0.1)' : 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '11px', color: h.role === 'user' ? '#22d3ee' : '#aaa' }}>{h.text}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: '20px', display: 'flex', gap: '10px' }}>
          <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px', color: 'white', fontSize: '11px', outline: 'none' }} placeholder={loading ? "同步中..." : "输入意识流指令..."} />
          <button onClick={handleSend} style={{ background: '#22d3ee', border: 'none', borderRadius: '10px', width: '40px', cursor: 'pointer', display: 'flex', alignItems: 'center', justify: 'center' }}><Send size={16} color="black" /></button>
        </div>
      </div>

      {/* 控制面板 */}
      <div style={{ ...UI_STYLES.panel, ...UI_STYLES.ctrl, opacity: mode === 'work' ? 1 : 0, transition: '1s', transform: mode === 'work' ? 'translateY(0)' : 'translateY(20px)' }}>
        <div style={{ display: 'flex', justify: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '9px', color: '#555', letterSpacing: '2px' }}>ENGINE_V2.1</div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#22d3ee' }}>情感同步核心</div>
          </div>
          <Settings size={18} color="#333" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {Object.keys(EMOTIONS).map(e => (
            <button key={e} onClick={() => setEmotion(e)} style={{ padding: '15px', borderRadius: '15px', border: 'none', background: emotion === e ? '#22d3ee' : 'rgba(255,255,255,0.03)', color: emotion === e ? 'black' : '#555', fontWeight: 'bold', fontSize: '10px', cursor: 'pointer', transition: '0.3s' }}>{e.toUpperCase()}</button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * ==========================================
 * 6. 主逻辑与根组件
 * ==========================================
 */
const World = ({ emotion }) => (
  <>
    <ambientLight intensity={0.5} />
    <pointLight position={[2, Y_DESK + 8, 28]} intensity={500} color={EMOTIONS[emotion].color} distance={45} />
    <pointLight position={[-5, 5, 20]} intensity={80} color="#ffffff" distance={60} />
    <CyberCity />
    <CyberFleece emotion={emotion} />
    <mesh position={[12, Y_DESK - 0.05, 73]} receiveShadow><boxGeometry args={[60, 0.1, 150]} /><meshStandardMaterial color="#080808" roughness={0.7} metalness={0.1} /></mesh>
    <mesh position={[0, Y_TOP + 2.5, Z_WINDOW]}><boxGeometry args={[1500, 5, 5]} /><meshStandardMaterial color="#010101" /></mesh>
    <mesh position={[0, Y_DESK - 2.5, Z_WINDOW]}><boxGeometry args={[1500, 5, 5]} /><meshStandardMaterial color="#010101" /></mesh>
  </>
);

const CameraCtrl = ({ mode }) => {
  const { camera } = useThree();
  useFrame((_, d) => {
    const cfg = CAMERA_CONFIG[mode];
    camera.position.lerp(new THREE.Vector3(...CAM_POS), d * 5);
    camera.fov = THREE.MathUtils.lerp(camera.fov, cfg.fov, d * 3.5);
    camera.updateProjectionMatrix();
    const curDir = new THREE.Vector3(); camera.getWorldDirection(curDir);
    const targetDir = new THREE.Vector3(...cfg.target).sub(camera.position).normalize();
    camera.lookAt(camera.position.clone().add(curDir.lerp(targetDir, d * 4)));
  });
  return null;
};

export default function App() {
  const [mode, setMode] = useState('immersive');
  const [emotion, setEmotion] = useState('calm');

  useEffect(() => {
    const handleWheel = (e) => setMode(e.deltaY > 0 ? 'work' : 'immersive');
    window.addEventListener('wheel', handleWheel); return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'black', overflow: 'hidden' }}>
      <Canvas shadows={{ type: THREE.PCFSoftShadowMap }} camera={{ position: CAM_POS, fov: 70 }}>
        <World emotion={emotion} />
        <CameraCtrl mode={mode} />
      </Canvas>
      <AppUI mode={mode} emotion={emotion} setEmotion={setEmotion} />
      
      <div style={{ position: 'fixed', bottom: '20px', left: 0, right: 0, textAlign: 'center', opacity: 0.2, color: 'white', fontSize: '10px', letterSpacing: '5px', pointerEvents: 'none' }}>
        {mode === 'immersive' ? 'SCROLL DOWN' : 'SCROLL UP'}
      </div>
    </div>
  );
}