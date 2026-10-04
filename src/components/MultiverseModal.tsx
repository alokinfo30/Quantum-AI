import { motion, AnimatePresence } from 'motion/react';
import { GitBranch, X, Check, Sparkles, Compass } from 'lucide-react';

export interface MultiverseBranch {
  timelineName: string;
  probability: string;
  divergencePoint: string;
  outcome: string;
}

interface MultiverseModalProps {
  isOpen: boolean;
  onClose: () => void;
  branches: MultiverseBranch[];
  isLoading: boolean;
  onSelectBranch: (branch: MultiverseBranch) => void;
}

export function MultiverseModal({
  isOpen,
  onClose,
  branches,
  isLoading,
  onSelectBranch,
}: MultiverseModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-[#03091e] border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_50px_rgba(34,211,238,0.15)] text-blue-50 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Compass className="w-5 h-5 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase tracking-wider text-white flex items-center gap-2">
                  Multiverse Timeline Divergence
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
                    3 Superposition Branches
                  </span>
                </h3>
                <p className="text-xs text-blue-300/60 font-mono">
                  Explore alternative quantum trajectories and counterfactual realities
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

          {/* Branches List */}
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
              <span className="text-xs font-mono text-cyan-300 animate-pulse">
                Calculating wavefunction decoherence across multiverse branches...
              </span>
            </div>
          ) : (
            <div className="space-y-4">
              {branches.map((branch, index) => (
                <div
                  key={index}
                  className="group relative p-4 rounded-xl bg-blue-950/30 border border-cyan-500/20 hover:border-cyan-400/50 hover:bg-blue-900/30 transition-all space-y-2 cursor-pointer"
                  onClick={() => onSelectBranch(branch)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-mono text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      <GitBranch className="w-4 h-4 text-cyan-400" />
                      {branch.timelineName}
                    </div>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold">
                      Probability: {branch.probability}
                    </span>
                  </div>

                  <div className="text-xs font-mono text-blue-400/80">
                    <span className="text-cyan-400/60 uppercase text-[10px]">Divergence Point:</span>{' '}
                    {branch.divergencePoint}
                  </div>

                  <p className="text-xs text-blue-100/90 leading-relaxed font-sans pt-1">
                    {branch.outcome}
                  </p>

                  <div className="pt-2 flex justify-end">
                    <span className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-400 group-hover:underline">
                      Collapse to this timeline <Check className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
