import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronUp, Cpu, Sparkles, CheckCircle2 } from 'lucide-react';

interface ReasoningProcessProps {
  steps?: string[];
  durationMs?: number;
}

export function ReasoningProcess({ steps, durationMs = 3800 }: ReasoningProcessProps) {
  const [isOpen, setIsOpen] = useState(false);

  const defaultSteps = [
    'Initializing Hilbert state vector |ψ⟩ in 1,024-dimensional Hilbert space.',
    'Exploring parallel probability distributions and entangling state constraints.',
    'Applying quantum phase estimation to eliminate destructive interference.',
    'Wavefunction collapsed to optimal deterministic output.'
  ];

  const displaySteps = steps && steps.length > 0 ? steps : defaultSteps;

  return (
    <div className="mb-3 rounded-xl border border-cyan-500/20 bg-blue-950/20 backdrop-blur-md overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3.5 py-2 text-left hover:bg-cyan-500/5 transition-colors"
      >
        <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
          <div className="p-1 rounded bg-cyan-500/10 text-cyan-400">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <span>
            Quantum Superposition & Reasoning Process{' '}
            <span className="text-[10px] text-blue-400/60 font-mono">
              ({(durationMs / 1000).toFixed(1)}s • 1,024 Eigenstates)
            </span>
          </span>
        </div>

        <div className="text-cyan-400/60">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-cyan-500/10 px-4 py-3 space-y-2 bg-black/20"
          >
            {displaySteps.map((step, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs font-mono text-blue-200/80">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 mt-0.5 shrink-0" />
                <span>{step}</span>
              </div>
            ))}
            <div className="pt-1 flex items-center gap-2 text-[10px] font-mono text-cyan-400/50 uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              State Fidelity: 99.98% • Decoherence Free Subspace Verified
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
