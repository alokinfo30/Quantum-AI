import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, ArrowRight, Check } from 'lucide-react';

interface PromptSuperpositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalPrompt: string;
  enhancedPrompt: string;
  isLoading: boolean;
  onApply: (prompt: string) => void;
}

export function PromptSuperpositionModal({
  isOpen,
  onClose,
  originalPrompt,
  enhancedPrompt,
  isLoading,
  onApply,
}: PromptSuperpositionModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl bg-[#03091e] border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(34,211,238,0.15)] text-blue-50 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-white">
                  Quantum Prompt Superposition
                </h3>
                <p className="text-xs text-blue-300/60 font-mono">
                  Expands prompt into a high-dimensional precision formulation
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 text-blue-300 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {isLoading ? (
            <div className="py-10 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <span className="text-xs font-mono text-cyan-300 animate-pulse">
                Synthesizing high-dimensional prompt constraints...
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400/60">
                  Initial Input Prompt
                </span>
                <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-blue-200">
                  {originalPrompt}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-cyan-400" /> Superposition Expanded Prompt (2026 Engine)
                </span>
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs font-mono text-cyan-100 leading-relaxed max-h-56 overflow-y-auto">
                  {enhancedPrompt}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-blue-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => onApply(enhancedPrompt)}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-cyan-500/20"
                >
                  <Check className="w-4 h-4" /> Apply Enhanced Prompt
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
