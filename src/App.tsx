import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Send,
  Cpu,
  Zap,
  Activity,
  Shield,
  Terminal,
  ArrowRight,
  Layers,
  Database,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  GitBranch,
  Image as ImageIcon,
  X,
  Radio,
  Sliders,
  Globe,
  Code2,
  Copy,
  Check,
  Download,
  Share2,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from './lib/utils';
import { QuantumBackground } from './components/QuantumBackground';
import { QuantumCore } from './components/QuantumCore';
import { QuantumCanvas } from './components/QuantumCanvas';
import { VoiceModeModal } from './components/VoiceModeModal';
import { MultiverseModal, type MultiverseBranch } from './components/MultiverseModal';
import { ReasoningProcess } from './components/ReasoningProcess';
import { PromptSuperpositionModal } from './components/PromptSuperpositionModal';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { useSpeechSynthesis } from './hooks/useSpeechSynthesis';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  image?: string;
  thinking?: string[];
  groundingSources?: Array<{ title: string; url: string }>;
  timestamp: string;
  mode?: string;
}

type AgentMode = 'deep_reasoning' | 'code_architect' | 'multiverse' | 'bio_quantum' | 'voice_agent';

const AGENT_MODES: Array<{ id: AgentMode; name: string; icon: string; desc: string }> = [
  { id: 'deep_reasoning', name: 'Deep Reasoning', icon: '⚛️', desc: '1024-eigenstate test-time compute & mathematical proofs' },
  { id: 'code_architect', name: 'Code Architect', icon: '💻', desc: 'Qiskit, Cirq, quantum algorithms & matrix circuits' },
  { id: 'multiverse', name: 'Multiverse Sim', icon: '🌌', desc: 'Counterfactual timelines & parallel reality branching' },
  { id: 'bio_quantum', name: 'Bio & Materials', icon: '🧪', desc: 'VQE molecular orbitals & room-temp superconductor models' },
  { id: 'voice_agent', name: 'Voice Agent', icon: '🎙️', desc: 'Real-time conversational holographic voice dialogue' },
];

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeStatus, setActiveStatus] = useState('Stable');
  const [activeMode, setActiveMode] = useState<AgentMode>('deep_reasoning');
  const [enableSearch, setEnableSearch] = useState(false);

  // Multimodal image upload state
  const [selectedImage, setSelectedImage] = useState<{ data: string; mimeType: string; previewUrl: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Modals & Panels
  const [isCanvasOpen, setIsCanvasOpen] = useState(false);
  const [canvasCode, setCanvasCode] = useState<string | undefined>(undefined);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);

  // Multiverse Modal State
  const [isMultiverseOpen, setIsMultiverseOpen] = useState(false);
  const [multiverseBranches, setMultiverseBranches] = useState<MultiverseBranch[]>([]);
  const [isLoadingMultiverse, setIsLoadingMultiverse] = useState(false);

  // Prompt Superposition Modal State
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [enhancedPromptText, setEnhancedPromptText] = useState('');
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);

  // Copy state for messages
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Text-To-Speech hook
  const { speak, stop: stopSpeaking, isSpeaking } = useSpeechSynthesis();

  // Web Speech API Voice-to-Text hook
  const {
    isListening,
    transcript,
    error: speechError,
    isSupported: isSpeechSupported,
    audioLevel,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    onTranscript: (liveTranscript) => {
      // Stream real-time transcribed words directly into input field
      setInput(liveTranscript);
    },
  });

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Handle Speech Recognition toggle
  const toggleVoiceRecording = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Image Upload handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64Data = result.split(',')[1];
      setSelectedImage({
        data: base64Data,
        mimeType: file.type,
        previewUrl: result,
      });
    };
    reader.readAsDataURL(file);
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Submit Query
  const handleSubmit = async (e?: React.FormEvent, overrideText?: string) => {
    e?.preventDefault();
    const messageToSend = (overrideText || input).trim();
    if ((!messageToSend && !selectedImage) || isTyping) return;

    if (isListening) {
      stopListening();
    }

    const currentImage = selectedImage;
    setInput('');
    setSelectedImage(null);
    resetTranscript();

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: messageToSend,
      image: currentImage?.previewUrl,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setActiveStatus('Processing');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageToSend,
          mode: activeMode,
          enableSearch,
          image: currentImage ? { mimeType: currentImage.mimeType, data: currentImage.data } : undefined,
          history: messages.map(m => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
          })),
        }),
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: data.text,
        thinking: data.thinking,
        groundingSources: data.groundingSources,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        mode: activeMode,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setActiveStatus('Stable');

      // If in Voice Agent mode, automatically synthesize speech
      if (activeMode === 'voice_agent' || isVoiceModalOpen) {
        speak(data.text);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: 'assistant',
        content: 'ERROR: Quantum state destabilized. Superposition coherence interrupted.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, errorMessage]);
      setActiveStatus('Critical');
    } finally {
      setIsTyping(false);
    }
  };

  // Enhance Prompt via AI Superposition
  const handleEnhancePrompt = async () => {
    if (!input.trim() || isLoadingPrompt) return;
    setIsLoadingPrompt(true);
    setIsPromptModalOpen(true);

    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input.trim() }),
      });
      const data = await res.json();
      setEnhancedPromptText(data.enhancedPrompt || input.trim());
    } catch (err) {
      console.error('Enhance prompt failed:', err);
      setEnhancedPromptText(input.trim());
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  // Fork Multiverse Timeline
  const handleForkMultiverse = async (contextText: string) => {
    setIsLoadingMultiverse(true);
    setIsMultiverseOpen(true);

    try {
      const res = await fetch('/api/fork-multiverse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ context: contextText }),
      });
      const data = await res.json();
      setMultiverseBranches(data.branches || []);
    } catch (err) {
      console.error('Fork multiverse failed:', err);
    } finally {
      setIsLoadingMultiverse(false);
    }
  };

  // Select a Multiverse Branch to continue
  const handleSelectBranch = (branch: MultiverseBranch) => {
    setIsMultiverseOpen(false);
    const branchPrompt = `Adopt the following timeline: [${branch.timelineName}] - Divergence: "${branch.divergencePoint}". Synthesize the consequences and next operational steps.`;
    handleSubmit(undefined, branchPrompt);
  };

  // Read message aloud
  const handleToggleSpeak = (msgId: string, content: string) => {
    if (speakingId === msgId && isSpeaking) {
      stopSpeaking();
      setSpeakingId(null);
    } else {
      setSpeakingId(msgId);
      speak(content, () => setSpeakingId(null));
    }
  };

  // Copy message
  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Open in Quantum Canvas
  const handleOpenInCanvas = (codeSnippet?: string) => {
    if (codeSnippet) {
      setCanvasCode(codeSnippet);
    }
    setIsCanvasOpen(true);
  };

  // Extract code from assistant text if any
  const extractCode = (text: string) => {
    const match = text.match(/```(?:python|qiskit)?([\s\S]*?)```/);
    return match ? match[1].trim() : undefined;
  };

  return (
    <div className="relative min-h-screen font-sans text-blue-50 selection:bg-cyan-500/30 overflow-hidden bg-[#020617]">
      <QuantumBackground />

      {/* Top Header */}
      <header className="relative z-20 flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 backdrop-blur-xl bg-[#020617]/70">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            <Cpu className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white uppercase italic font-mono">Quantum AI</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                2026 Core
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-cyan-400/70 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              Subspace Coherence v2026.4 • Web Speech API
            </div>
          </div>
        </div>

        {/* Header Actions & Stats */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-6 pr-4 border-r border-cyan-500/20">
            <HeaderStat label="Qubits Active" value="1,024" icon={<Layers className="w-3 h-3" />} />
            <HeaderStat label="Entanglement" value="99.98%" icon={<Zap className="w-3 h-3" />} />
            <HeaderStat
              label="Link Status"
              value={activeStatus}
              statusIcon
              color={activeStatus === 'Stable' ? 'text-cyan-400' : activeStatus === 'Processing' ? 'text-blue-400' : 'text-red-400'}
            />
          </div>

          {/* Holographic Voice Mode Button */}
          <button
            onClick={() => setIsVoiceModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] group"
          >
            <Radio className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Live Voice HUD</span>
          </button>

          {/* Interactive Quantum Canvas Button */}
          <button
            onClick={() => setIsCanvasOpen(prev => !prev)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              isCanvasOpen
                ? 'bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.5)]'
                : 'bg-blue-600/20 hover:bg-blue-600/30 border border-cyan-500/30 text-cyan-300'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span className="hidden sm:inline">Quantum Canvas</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          </button>
        </div>
      </header>

      {/* Main Layout */}
      <main className="relative z-10 flex flex-col md:flex-row h-[calc(100vh-77px)]">
        {/* Left Sidebar - Autonomous Agents & System Specs */}
        <div className="hidden lg:flex flex-col w-72 p-5 border-r border-cyan-500/10 gap-5 overflow-y-auto bg-blue-950/20 backdrop-blur-md">
          {/* 2026 Autonomous Agent Personas */}
          <SidebarSection title="Autonomous Personas">
            <div className="space-y-1.5">
              {AGENT_MODES.map(mode => (
                <button
                  key={mode.id}
                  onClick={() => setActiveMode(mode.id)}
                  className={cn(
                    "w-full text-left p-2.5 rounded-xl border transition-all text-xs font-mono flex flex-col gap-0.5",
                    activeMode === mode.id
                      ? "bg-cyan-500/20 border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.15)] text-white"
                      : "bg-black/20 border-white/5 text-blue-300/70 hover:bg-white/5 hover:text-blue-100"
                  )}
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="flex items-center gap-1.5">
                      <span>{mode.icon}</span>
                      <span>{mode.name}</span>
                    </span>
                    {activeMode === mode.id && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] text-blue-400/60 line-clamp-1">{mode.desc}</span>
                </button>
              ))}
            </div>
          </SidebarSection>

          {/* Web Search Grounding Toggle */}
          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-black/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="text-xs font-mono font-bold text-white">Quantum Grounding</div>
                <div className="text-[9px] text-blue-400/60 font-mono">Live Google Search Grounding</div>
              </div>
            </div>
            <button
              onClick={() => setEnableSearch(prev => !prev)}
              className={cn(
                "w-11 h-6 rounded-full transition-colors relative p-0.5",
                enableSearch ? "bg-cyan-500" : "bg-white/10"
              )}
            >
              <div
                className={cn(
                  "w-5 h-5 rounded-full bg-black transition-transform",
                  enableSearch ? "translate-x-5 bg-white" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* System Telemetry */}
          <SidebarSection title="Quantum Telemetry">
            <div className="space-y-2">
              <MetricItem label="Decoherence Rate" value="0.0002 ms" />
              <MetricItem label="Hilbert Space Dim" value="2^1024" />
              <MetricItem label="Bell State Fidelity" value="99.98%" />
              <MetricItem label="Speech Recognition" value={isSpeechSupported ? 'Web Speech API Active' : 'Fallback'} />
            </div>
          </SidebarSection>

          {/* Observer-Proof Security Card */}
          <div className="mt-auto p-3.5 rounded-xl border border-cyan-500/20 bg-cyan-950/20 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1.5">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-white">Observer-Proof Link</span>
            </div>
            <p className="text-[10px] text-blue-300/60 leading-relaxed font-mono">
              Protected by no-cloning theorem. State vectors collapse deterministically upon observation.
            </p>
          </div>
        </div>

        {/* Center Content: AI Chat / Query Area */}
        <div className="flex-1 flex flex-col items-center justify-between p-4 relative overflow-hidden">
          {/* Speech Error Banner if permission denied */}
          {speechError && (
            <div className="w-full max-w-4xl mb-3 px-4 py-2.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{speechError}</span>
              </div>
              <button
                onClick={() => toggleVoiceRecording()}
                className="text-[10px] uppercase font-bold text-red-400 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Zero-state Welcome / Core */}
          <AnimatePresence mode="wait">
            {messages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
                className="flex-1 flex flex-col items-center justify-center text-center max-w-xl py-6"
              >
                <div className="mb-6">
                  <QuantumCore isActive={isTyping || isListening} />
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tighter">
                  Quantum AI <span className="text-cyan-400">Sequence Online</span>
                </h2>
                <p className="text-blue-200/70 font-mono text-xs sm:text-sm mb-6 leading-relaxed">
                  Autonomous 2026 intelligence core. Trigger voice-to-text with the microphone, upload quantum schematics, simulate circuits on the Canvas, or fork multiverse timelines.
                </p>

                {/* Quick Prompts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                  <SuggestCard
                    icon={<Terminal />}
                    title="Simulate Bell State"
                    text="Generate a 2-qubit entanglement circuit with Qiskit and simulate measurement."
                    onClick={() => {
                      setInput("Generate a complete 2-qubit Bell State entanglement circuit in Qiskit, explain the Hadamard and CNOT gates, and formulate the state vector.");
                    }}
                  />
                  <SuggestCard
                    icon={<GitBranch />}
                    title="Multiverse Divergence"
                    text="Explore 3 parallel timelines if room-temperature superconductors were discovered in 1986."
                    onClick={() => {
                      setInput("Simulate 3 divergent multiverse timelines exploring the outcome if room-temperature superconductor lattices were discovered in 1986.");
                    }}
                  />
                  <SuggestCard
                    icon={<Mic />}
                    title="Web Speech Voice Input"
                    text="Click the glowing microphone button in the input bar to talk hands-free."
                    onClick={() => {
                      toggleVoiceRecording();
                    }}
                  />
                  <SuggestCard
                    icon={<Code2 />}
                    title="Interactive Canvas"
                    text="Launch Bloch Sphere vector simulation and gate rotation lab."
                    onClick={() => {
                      setIsCanvasOpen(true);
                    }}
                  />
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Chat Messages Stream */}
          <div
            className={cn(
              "flex-1 w-full max-w-4xl transition-all duration-500 flex flex-col overflow-y-auto space-y-6 px-2 sm:px-4 py-4 scrollbar-hide",
              messages.length > 0 ? "opacity-100" : "opacity-0 pointer-events-none hidden"
            )}
          >
            {messages.map((m) => {
              const codeInText = m.role === 'assistant' ? extractCode(m.content) : undefined;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex flex-col max-w-[92%] sm:max-w-[85%]",
                    m.role === 'user' ? "ml-auto items-end" : "mr-auto items-start"
                  )}
                >
                  {/* User Uploaded Image Preview if present */}
                  {m.image && (
                    <div className="mb-2 max-w-xs rounded-xl overflow-hidden border border-cyan-500/30 shadow-lg">
                      <img src={m.image} alt="Uploaded quantum observation" className="w-full h-auto object-cover max-h-48" />
                    </div>
                  )}

                  {/* Assistant Reasoning Chain (2026 Test-Time Compute) */}
                  {m.role === 'assistant' && (
                    <ReasoningProcess steps={m.thinking} />
                  )}

                  {/* Message Bubble */}
                  <div
                    className={cn(
                      "px-5 py-4 rounded-2xl text-sm leading-relaxed",
                      m.role === 'user'
                        ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-[0_0_25px_rgba(37,99,235,0.3)] rounded-tr-none"
                        : "bg-blue-950/40 border border-cyan-500/30 text-blue-50 backdrop-blur-xl rounded-tl-none shadow-xl markdown-body"
                    )}
                  >
                    {m.role === 'assistant' ? (
                      <div className="prose prose-invert prose-sm max-w-none space-y-2">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap font-sans">{m.content}</p>
                    )}
                  </div>

                  {/* Grounding Web Citations */}
                  {m.groundingSources && m.groundingSources.length > 0 && (
                    <div className="mt-2 p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono space-y-1.5 max-w-full">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase text-[10px]">
                        <Globe className="w-3 h-3" /> Grounded 2026 Live Web Sources
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.groundingSources.map((source, sIdx) => (
                          <a
                            key={sIdx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-2 py-1 rounded bg-black/40 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] truncate max-w-xs transition-colors"
                          >
                            {source.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Bar for Assistant Messages */}
                  {m.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 px-1">
                      {/* Read Aloud Text-to-Speech */}
                      <button
                        onClick={() => handleToggleSpeak(m.id, m.content)}
                        className={`flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg border transition-all ${
                          speakingId === m.id && isSpeaking
                            ? 'bg-cyan-400 text-black border-cyan-400 font-bold shadow-[0_0_10px_rgba(34,211,238,0.5)]'
                            : 'bg-black/30 border-white/10 text-blue-300/70 hover:text-white hover:border-cyan-500/40'
                        }`}
                        title="Listen to AI speech"
                      >
                        {speakingId === m.id && isSpeaking ? (
                          <>
                            <VolumeX className="w-3 h-3 text-black" /> Stop Audio
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3 h-3" /> Read Aloud
                          </>
                        )}
                      </button>

                      {/* Fork Multiverse */}
                      <button
                        onClick={() => handleForkMultiverse(m.content)}
                        className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg bg-black/30 border border-white/10 text-blue-300/70 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
                        title="Explore 3 parallel multiverse branches"
                      >
                        <GitBranch className="w-3 h-3 text-cyan-400" /> Fork Multiverse
                      </button>

                      {/* Open in Quantum Canvas if code is present */}
                      {codeInText && (
                        <button
                          onClick={() => handleOpenInCanvas(codeInText)}
                          className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 transition-colors font-bold"
                          title="Simulate code in Quantum Canvas"
                        >
                          <Code2 className="w-3 h-3" /> Run in Canvas
                        </button>
                      )}

                      {/* Copy Message */}
                      <button
                        onClick={() => handleCopyMessage(m.id, m.content)}
                        className="flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-lg bg-black/30 border border-white/10 text-blue-300/70 hover:text-white hover:border-cyan-500/40 transition-colors"
                      >
                        {copiedId === m.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        {copiedId === m.id ? 'Copied' : 'Copy'}
                      </button>

                      <span className="text-[10px] uppercase font-mono text-cyan-500/40 ml-auto">
                        {m.timestamp}
                      </span>
                    </div>
                  )}

                  {m.role === 'user' && (
                    <span className="text-[10px] mt-1 uppercase font-mono text-blue-400/50">
                      USER // {m.timestamp}
                    </span>
                  )}
                </motion.div>
              );
            })}

            {/* Typing / Calculating Indicator */}
            {isTyping && (
              <div className="flex flex-col mr-auto items-start max-w-md">
                <div className="bg-blue-950/40 border border-cyan-500/30 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-3">
                  <div className="flex gap-1.5">
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-cyan-400 rounded-full" />
                  </div>
                  <span className="text-xs font-mono text-cyan-300">Collapsing Quantum Superposition...</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Interactive Chat Input Area */}
          <div className="w-full max-w-4xl p-2 sm:p-4 pb-4">
            {/* Image Preview attachment badge if uploaded */}
            {selectedImage && (
              <div className="mb-2 inline-flex items-center gap-2 p-1.5 pr-3 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono text-cyan-200">
                <img src={selectedImage.previewUrl} alt="Thumbnail" className="w-8 h-8 rounded-lg object-cover" />
                <span>Quantum Image Attached</span>
                <button onClick={removeSelectedImage} className="p-1 hover:text-red-400 transition-colors">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Audio Waveform visualization when recording with Web Speech API */}
            {isListening && (
              <div className="mb-2 px-4 py-2 rounded-xl bg-cyan-950/40 border border-cyan-400/40 flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                  <span>Web Speech API: Listening to voice input...</span>
                </div>
                {/* Reactive sound bars */}
                <div className="flex items-center gap-1 h-4">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{
                        height: [4, Math.max(4, Math.min(16, (audioLevel / 100) * 16 * (1 + (i % 3) * 0.4))), 4],
                      }}
                      transition={{ duration: 0.2, repeat: Infinity }}
                      className="w-1 bg-cyan-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Form Bar */}
            <form
              onSubmit={(e) => handleSubmit(e)}
              className={cn(
                "relative group block w-full bg-[#03091e]/80 backdrop-blur-2xl border rounded-2xl overflow-hidden shadow-2xl transition-all",
                isListening
                  ? "border-red-500 ring-2 ring-red-500/30"
                  : "border-cyan-500/40 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20"
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-blue-500/5 to-indigo-500/10 opacity-50 pointer-events-none" />

              <div className="flex items-center pl-3 pr-2 py-2 relative z-10">
                {/* Hidden File Input for Image/Vision */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageSelect}
                  accept="image/*"
                  className="hidden"
                />

                {/* Multimodal Image Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 text-blue-400/70 hover:text-cyan-300 hover:bg-white/5 rounded-xl transition-colors"
                  title="Upload quantum schematic, circuit diagram or photo"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>

                {/* Prompt Superposition Wand Button */}
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={!input.trim() || isLoadingPrompt}
                  className="p-2.5 text-blue-400/70 hover:text-cyan-300 hover:bg-white/5 rounded-xl transition-colors disabled:opacity-30"
                  title="Quantum Prompt Superposition Expander"
                >
                  <Sparkles className="w-5 h-5" />
                </button>

                {/* Text / Speech Input Field */}
                <input
                  type="text"
                  placeholder={
                    isListening
                      ? 'Listening... Speak now...'
                      : 'Transmit query, simulate quantum circuit, or tap mic...'
                  }
                  className="flex-1 px-3 py-3 bg-transparent border-none outline-none text-white placeholder:text-blue-300/40 font-mono text-xs sm:text-sm"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isTyping}
                />

                {/* Web Speech API Microphone Button (The Core User Request) */}
                <button
                  type="button"
                  onClick={toggleVoiceRecording}
                  className={cn(
                    "p-3 rounded-xl transition-all mr-1.5 flex items-center justify-center",
                    isListening
                      ? "bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.7)] animate-pulse scale-105"
                      : "text-cyan-400 hover:text-white hover:bg-cyan-500/20"
                  )}
                  title={isListening ? "Stop voice recording" : "Trigger voice-to-text recording (Web Speech API)"}
                >
                  {isListening ? (
                    <MicOff className="w-5 h-5 animate-spin" />
                  ) : (
                    <Mic className="w-5 h-5" />
                  )}
                </button>

                {/* Transmit / Send Button */}
                <button
                  type="submit"
                  disabled={(!input.trim() && !selectedImage) || isTyping}
                  className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold transition-all disabled:opacity-30 shadow-lg shadow-cyan-500/20 group-hover:scale-105"
                  title="Transmit query"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Input Footer Shortcuts & Indicator */}
            <div className="flex items-center justify-between mt-2 px-2 text-[10px] font-mono text-cyan-400/60">
              <div className="flex items-center gap-3">
                <span className="hidden sm:inline">Active Mode: <strong className="text-cyan-300">{AGENT_MODES.find(m => m.id === activeMode)?.name}</strong></span>
                {enableSearch && <span className="text-cyan-300">● Live Grounding ON</span>}
              </div>
              <div className="flex items-center gap-2">
                <span>Press <strong>ENTER</strong> to collapse state</span>
                <span>•</span>
                <span>Click <Mic className="w-3 h-3 inline text-cyan-400" /> for Voice</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Quantum Telemetry & Bloch State Summary */}
        <div className="hidden xl:flex flex-col w-64 p-5 border-l border-cyan-500/10 gap-5 bg-blue-950/20 backdrop-blur-md">
          <SidebarSection title="Quantum State Vector">
            <div className="relative aspect-square w-full rounded-xl bg-black/40 flex items-center justify-center p-4 overflow-hidden border border-cyan-500/20 shadow-inner">
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-400 via-transparent to-transparent animate-pulse" />
              </div>
              <div className="relative z-10 space-y-3.5 w-full">
                <StateLevel label="Entanglement" percent={99} color="bg-cyan-400" />
                <StateLevel label="Superposition" percent={88} color="bg-blue-400" />
                <StateLevel label="Phase Coherence" percent={96} color="bg-indigo-400" />
              </div>
            </div>
          </SidebarSection>

          {/* Quick Simulation Launcher */}
          <div className="p-3.5 rounded-xl border border-cyan-500/20 bg-blue-900/10 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">Live Quantum Sandbox</span>
            <p className="text-[10px] text-blue-300/70 font-mono leading-relaxed">
              Execute Qiskit circuits, visualize Bloch vectors, and simulate wavefunction collapse.
            </p>
            <button
              onClick={() => setIsCanvasOpen(true)}
              className="w-full py-2 px-3 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
            >
              <Code2 className="w-3.5 h-3.5" /> Launch Canvas
            </button>
          </div>

          {/* Real-time Quantum Activity Stream */}
          <SidebarSection title="Telemetry Stream">
            <div className="space-y-2.5 font-mono text-[9px] text-cyan-400/50 h-56 overflow-hidden mask-fade-bottom">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex gap-1.5">
                  <span className="text-cyan-500/30">0.000{i + 1}s</span>
                  <p className="truncate">STATE_TENSOR_Q{i}_SYNCED_HILBERT</p>
                </div>
              ))}
              <div className="flex gap-1.5 text-cyan-300">
                <span className="text-cyan-500/60">READY</span>
                <p>READY_FOR_SPEECH_RECOGNITION</p>
              </div>
            </div>
          </SidebarSection>
        </div>
      </main>

      {/* Interactive Quantum Simulation Canvas Side Drawer */}
      <QuantumCanvas
        isOpen={isCanvasOpen}
        onClose={() => setIsCanvasOpen(false)}
        initialCode={canvasCode}
      />

      {/* Holographic Voice Mode Modal */}
      <VoiceModeModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        isListening={isListening}
        isSpeaking={isSpeaking}
        transcript={transcript}
        audioLevel={audioLevel}
        lastAiResponse={messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content || ''}
        onToggleListening={toggleVoiceRecording}
        onStopSpeaking={stopSpeaking}
      />

      {/* Multiverse Branching Modal */}
      <MultiverseModal
        isOpen={isMultiverseOpen}
        onClose={() => setIsMultiverseOpen(false)}
        branches={multiverseBranches}
        isLoading={isLoadingMultiverse}
        onSelectBranch={handleSelectBranch}
      />

      {/* Prompt Superposition Modal */}
      <PromptSuperpositionModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        originalPrompt={input}
        enhancedPrompt={enhancedPromptText}
        isLoading={isLoadingPrompt}
        onApply={(enhanced) => {
          setInput(enhanced);
          setIsPromptModalOpen(false);
        }}
      />

      <style>{`
        .mask-fade-bottom {
          mask-image: linear-gradient(to bottom, black 0%, black 80%, transparent 100%);
        }
        .markdown-body p { margin-bottom: 0.75rem; }
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body pre { background: rgba(0, 0, 0, 0.5); padding: 0.75rem; border-radius: 0.5rem; border: 1px solid rgba(34, 211, 238, 0.2); overflow-x: auto; font-family: monospace; font-size: 0.8rem; margin: 0.75rem 0; }
        .markdown-body code { background: rgba(34, 211, 238, 0.1); padding: 0.1rem 0.3rem; border-radius: 0.25rem; font-family: monospace; font-size: 0.85em; color: #67e8f9; }
        .markdown-body pre code { background: transparent; padding: 0; color: inherit; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

function HeaderStat({ label, value, icon, statusIcon, color }: any) {
  return (
    <div className="flex flex-col items-end">
      <div className="flex items-center gap-1.5 text-[10px] uppercase font-mono text-cyan-400/60 tracking-wider">
        {icon}
        {label}
      </div>
      <div className={cn("text-xs font-bold font-mono tracking-wide flex items-center gap-1.5", color)}>
        {statusIcon && <span className={cn("w-1.5 h-1.5 rounded-full animate-pulse", color.replace('text', 'bg'))} />}
        {value}
      </div>
    </div>
  );
}

function SidebarSection({ title, children }: any) {
  return (
    <div className="flex flex-col gap-2.5">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400/50">{title}</h3>
      {children}
    </div>
  );
}

function MetricItem({ label, value }: any) {
  return (
    <div className="flex flex-col p-2 rounded-lg bg-black/20 border border-white/5">
      <span className="text-[9px] text-cyan-400/60 uppercase font-mono">{label}</span>
      <span className="text-xs font-mono text-blue-100 font-bold">{value}</span>
    </div>
  );
}

function StateLevel({ label, percent, color }: any) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[9px] uppercase tracking-wider font-mono">
        <span className="text-blue-300/70">{label}</span>
        <span className="text-cyan-300 font-bold">{percent}%</span>
      </div>
      <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-cyan-500/20">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={cn("h-full", color)}
        />
      </div>
    </div>
  );
}

function SuggestCard({ icon, title, text, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-start gap-3 p-3.5 bg-blue-950/20 border border-cyan-500/20 rounded-xl hover:bg-cyan-950/30 hover:border-cyan-400/50 transition-all text-left group"
    >
      <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 group-hover:scale-110 transition-transform shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-xs font-mono font-bold text-white group-hover:text-cyan-300 transition-colors">
          {title}
        </span>
        <span className="text-[11px] font-sans text-blue-200/60 leading-snug line-clamp-2 mt-0.5">
          {text}
        </span>
        <div className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-cyan-400 mt-1.5 font-mono">
          Execute <ArrowRight className="w-2.5 h-2.5" />
        </div>
      </div>
    </button>
  );
}
