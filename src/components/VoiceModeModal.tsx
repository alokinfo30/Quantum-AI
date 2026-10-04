import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, X, Sparkles, Radio } from 'lucide-react';

interface VoiceModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  audioLevel: number;
  lastAiResponse: string;
  onToggleListening: () => void;
  onStopSpeaking: () => void;
}

export function VoiceModeModal({
  isOpen,
  onClose,
  isListening,
  isSpeaking,
  transcript,
  audioLevel,
  lastAiResponse,
  onToggleListening,
  onStopSpeaking,
}: VoiceModeModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/95 backdrop-blur-2xl p-6 text-white select-none"
      >
        {/* Background glow effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-cyan-600/20 via-blue-600/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse" />
        </div>

        {/* Top Control Bar */}
        <div className="absolute top-8 left-8 right-8 flex items-center justify-between z-20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight uppercase font-mono flex items-center gap-2">
                Quantum Voice Interface
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Web Speech Live API
                </span>
              </h2>
              <p className="text-xs text-blue-300/60 font-mono">Real-time Voice-to-Text & Holographic Speech Synthesis</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Center Holographic Orb & Status */}
        <div className="relative z-10 flex flex-col items-center max-w-xl text-center space-y-10">
          {/* Animated Quantum Audio Sphere */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Outer reactive waves based on audioLevel */}
            <motion.div
              animate={{
                scale: isListening ? [1, 1 + (audioLevel / 100) * 0.4, 1] : isSpeaking ? [1, 1.25, 1] : [1, 1.05, 1],
                opacity: isListening ? [0.4, 0.8, 0.4] : 0.3,
              }}
              transition={{ repeat: Infinity, duration: isListening ? 0.3 : 2, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full border-2 border-cyan-400/40 border-dashed"
            />
            <motion.div
              animate={{
                scale: isListening ? [1, 1.15, 1] : isSpeaking ? [1, 1.35, 1] : [1, 1.08, 1],
                rotate: 360,
              }}
              transition={{
                scale: { repeat: Infinity, duration: 1.5, ease: 'easeInOut' },
                rotate: { repeat: Infinity, duration: 15, ease: 'linear' },
              }}
              className="absolute inset-6 rounded-full border border-blue-500/30"
            />

            {/* Glowing Core Sphere */}
            <motion.div
              animate={{
                scale: isListening ? 1 + (audioLevel / 100) * 0.3 : isSpeaking ? [1, 1.15, 1] : 1,
                boxShadow: isListening
                  ? `0 0 ${30 + audioLevel}px rgba(34, 211, 238, 0.6)`
                  : isSpeaking
                  ? '0 0 60px rgba(59, 130, 246, 0.8)'
                  : '0 0 30px rgba(59, 130, 246, 0.3)',
              }}
              transition={{ duration: 0.15 }}
              className={`w-32 h-32 rounded-full relative z-10 flex items-center justify-center transition-all ${
                isListening
                  ? 'bg-gradient-to-tr from-cyan-500 to-teal-400'
                  : isSpeaking
                  ? 'bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500'
                  : 'bg-gradient-to-tr from-blue-900 to-cyan-950 border border-cyan-500/40'
              }`}
            >
              {isListening ? (
                <Mic className="w-12 h-12 text-black animate-pulse" />
              ) : isSpeaking ? (
                <Volume2 className="w-12 h-12 text-white animate-bounce" />
              ) : (
                <Sparkles className="w-10 h-10 text-cyan-400/80" />
              )}
            </motion.div>
          </div>

          {/* Dynamic Status Text */}
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-xs font-mono tracking-widest uppercase">
              <span
                className={`w-2 h-2 rounded-full ${
                  isListening
                    ? 'bg-cyan-400 animate-ping'
                    : isSpeaking
                    ? 'bg-green-400 animate-pulse'
                    : 'bg-blue-400'
                }`}
              />
              {isListening
                ? 'Listening to Quantum Voice Input...'
                : isSpeaking
                ? 'Synthesizing Quantum Voice Response...'
                : 'Microphone Standby'}
            </div>

            {/* Live Transcript / Speech Display */}
            <div className="min-h-16 px-6 py-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md max-w-lg">
              {transcript ? (
                <p className="text-base text-cyan-300 font-mono italic leading-relaxed">
                  "{transcript}"
                </p>
              ) : lastAiResponse ? (
                <p className="text-sm text-blue-200/80 font-sans line-clamp-3">
                  {lastAiResponse}
                </p>
              ) : (
                <p className="text-sm text-white/40 font-mono">
                  Tap microphone or speak into your device...
                </p>
              )}
            </div>
          </div>

          {/* Voice Controls */}
          <div className="flex items-center gap-4">
            <button
              onClick={onToggleListening}
              className={`p-5 rounded-full transition-all shadow-xl flex items-center justify-center ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 ring-4 ring-red-500/20'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/30 ring-4 ring-cyan-500/20'
              }`}
            >
              {isListening ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
            </button>

            {isSpeaking && (
              <button
                onClick={onStopSpeaking}
                className="p-4 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                title="Mute Audio Playback"
              >
                <Volume2 className="w-6 h-6 text-cyan-400" />
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
