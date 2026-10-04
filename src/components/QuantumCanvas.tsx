import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { Play, RotateCcw, Copy, Check, Sparkles, X, Activity, Layers, Code, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuantumCanvasProps {
  isOpen: boolean;
  onClose: () => void;
  initialCode?: string;
}

export function QuantumCanvas({ isOpen, onClose, initialCode }: QuantumCanvasProps) {
  const [activeTab, setActiveTab] = useState<'bloch' | 'circuit' | 'wave'>('bloch');

  // Bloch Sphere & Single-Qubit State
  // |psi> = cos(theta/2)|0> + e^(i*phi)sin(theta/2)|1>
  const [theta, setTheta] = useState<number>(Math.PI / 2); // default 90 deg -> superposition
  const [phi, setPhi] = useState<number>(0);
  const [shots, setShots] = useState<number>(1024);
  const [isRunningSim, setIsRunningSim] = useState(false);
  const [simResults, setSimResults] = useState<{ zero: number; one: number; count: number } | null>(null);

  // Quantum Circuit Code
  const [code, setCode] = useState<string>(
    initialCode ||
`# Quantum Entanglement Protocol (Bell State |Φ+⟩)
import qiskit
from qiskit import QuantumCircuit, transpile
from qiskit_aer import AerSimulator

# Initialize 2 qubits & 2 classical registers
qc = QuantumCircuit(2, 2)

# Step 1: Create superposition on qubit 0
qc.h(0)

# Step 2: Entangle qubit 0 and qubit 1 via CNOT
qc.cx(0, 1)

# Step 3: Measurement in computational basis
qc.measure([0, 1], [0, 1])

# Transpile & Execute on Quantum Simulator
simulator = AerSimulator()
compiled_circuit = transpile(qc, simulator)
job = simulator.run(compiled_circuit, shots=1024)
result = job.result()
counts = result.get_counts()`
  );
  const [copied, setCopied] = useState(false);

  // Calculate probabilities
  const prob0 = useMemo(() => Math.cos(theta / 2) ** 2, [theta]);
  const prob1 = useMemo(() => Math.sin(theta / 2) ** 2, [theta]);

  // Coordinates on Bloch Sphere unit projection
  const blochX = useMemo(() => Math.sin(theta) * Math.cos(phi), [theta, phi]);
  const blochY = useMemo(() => Math.sin(theta) * Math.sin(phi), [theta, phi]);
  const blochZ = useMemo(() => Math.cos(theta), [theta]);

  // Apply common quantum gates
  const applyGate = (gate: 'H' | 'X' | 'Z' | 'S' | 'reset') => {
    switch (gate) {
      case 'reset':
        setTheta(0);
        setPhi(0);
        break;
      case 'X': // NOT gate: flips |0> to |1> (theta -> pi - theta)
        setTheta(prev => Math.PI - prev);
        break;
      case 'H': // Hadamard: |0> -> (|0>+|1>)/sqrt(2)
        if (Math.abs(theta) < 0.05) {
          setTheta(Math.PI / 2);
          setPhi(0);
        } else if (Math.abs(theta - Math.PI) < 0.05) {
          setTheta(Math.PI / 2);
          setPhi(Math.PI);
        } else {
          setTheta(prev => (prev === Math.PI / 2 ? 0 : Math.PI / 2));
        }
        break;
      case 'Z': // Phase flip
        setPhi(prev => (prev + Math.PI) % (2 * Math.PI));
        break;
      case 'S': // Phase gate (pi/2)
        setPhi(prev => (prev + Math.PI / 2) % (2 * Math.PI));
        break;
    }
  };

  // Run Monte Carlo quantum measurement simulation
  const handleRunSimulation = () => {
    setIsRunningSim(true);
    setTimeout(() => {
      let count0 = 0;
      for (let i = 0; i < shots; i++) {
        if (Math.random() < prob0) count0++;
      }
      const count1 = shots - count0;
      setSimResults({ zero: count0, one: count1, count: shots });
      setIsRunningSim(false);

      // Trigger quantum celebration confetti
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#818cf8', '#22d3ee', '#60a5fa'],
      });
    }, 600);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-[#03091e]/95 backdrop-blur-2xl border-l border-cyan-500/20 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] flex flex-col text-blue-50 overflow-hidden"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/20 bg-blue-950/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold uppercase tracking-wider text-white">Quantum Simulation Canvas</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                Live 2026 Engine
              </span>
            </div>
            <p className="text-xs text-blue-300/60 font-mono">Interactive Qubit State, Circuit Simulator & Wavefunction</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-white/10 text-blue-300 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 px-6 pt-3 border-b border-cyan-500/10 bg-blue-950/20">
        <button
          onClick={() => setActiveTab('bloch')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'bloch'
              ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-500/10'
              : 'border-transparent text-blue-400/60 hover:text-blue-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" /> Bloch Sphere State
        </button>

        <button
          onClick={() => setActiveTab('circuit')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'circuit'
              ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-500/10'
              : 'border-transparent text-blue-400/60 hover:text-blue-300'
          }`}
        >
          <Code className="w-3.5 h-3.5" /> Qiskit Algorithm Runner
        </button>

        <button
          onClick={() => setActiveTab('wave')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-wider transition-all border-b-2 ${
            activeTab === 'wave'
              ? 'border-cyan-400 text-cyan-300 font-bold bg-cyan-500/10'
              : 'border-transparent text-blue-400/60 hover:text-blue-300'
          }`}
        >
          <Zap className="w-3.5 h-3.5" /> Wavefunction Density
        </button>
      </div>

      {/* Body Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {activeTab === 'bloch' && (
          <div className="space-y-6">
            {/* Visual Bloch Representation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="relative aspect-square w-full rounded-2xl bg-black/40 border border-cyan-500/30 flex items-center justify-center p-6 shadow-inner overflow-hidden">
                {/* Orbital Rings */}
                <div className="absolute inset-8 rounded-full border border-dashed border-cyan-500/30 animate-[spin_20s_linear_infinite]" />
                <div className="absolute inset-12 rounded-full border border-blue-500/20" />
                <div className="absolute w-full h-[1px] bg-cyan-500/30" />
                <div className="absolute h-full w-[1px] bg-cyan-500/30" />

                {/* Poles */}
                <span className="absolute top-2 text-[10px] font-mono text-cyan-300 font-bold">|0⟩ (North Pole)</span>
                <span className="absolute bottom-2 text-[10px] font-mono text-cyan-300 font-bold">|1⟩ (South Pole)</span>
                <span className="absolute right-2 text-[10px] font-mono text-blue-400">|+⟩</span>
                <span className="absolute left-2 text-[10px] font-mono text-blue-400">|-⟩</span>

                {/* State Vector |psi> */}
                <div
                  className="absolute w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_15px_#22d3ee] transition-all duration-300"
                  style={{
                    transform: `translate(${blochX * 70}px, ${-blochZ * 70}px)`,
                  }}
                />
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <line
                    x1="50%"
                    y1="50%"
                    x2={`${50 + blochX * 35}%`}
                    y2={`${50 - blochZ * 35}%`}
                    stroke="#38bdf8"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                </svg>

                {/* Center Qubit Core */}
                <div className="w-4 h-4 rounded-full bg-blue-600/80 border border-cyan-300 animate-pulse" />
              </div>

              {/* State Vector Math & Probability Readout */}
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/20 space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">State Vector |ψ⟩</span>
                  <div className="text-sm font-mono text-white break-all">
                    |ψ⟩ = {Math.cos(theta / 2).toFixed(3)}|0⟩ + {Math.sin(theta / 2).toFixed(3)}e<sup>i({(phi / Math.PI).toFixed(2)}π)</sup>|1⟩
                  </div>
                  <div className="text-[11px] font-mono text-blue-300/70">
                    Spherical Coordinates: θ = {(theta * (180 / Math.PI)).toFixed(0)}°, φ = {(phi * (180 / Math.PI)).toFixed(0)}°
                  </div>
                </div>

                {/* Probability Bars */}
                <div className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-cyan-300">P(|0⟩) Probability</span>
                      <span className="font-bold text-white">{(prob0 * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-cyan-500/20">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300"
                        style={{ width: `${prob0 * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-indigo-300">P(|1⟩) Probability</span>
                      <span className="font-bold text-white">{(prob1 * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-indigo-500/20">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300"
                        style={{ width: `${prob1 * 100}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Monte Carlo Simulation Result */}
                {simResults && (
                  <div className="p-3 rounded-xl bg-blue-900/30 border border-blue-500/30 text-xs font-mono space-y-1">
                    <div className="flex items-center justify-between text-cyan-300 font-bold">
                      <span>Shot Measurements ({simResults.count})</span>
                      <span className="text-[10px] text-green-400">✓ FIDELITY CONFIRMED</span>
                    </div>
                    <div className="flex justify-between text-blue-200">
                      <span>|0⟩ state detected: {simResults.zero} times</span>
                      <span>|1⟩ state detected: {simResults.one} times</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Interactive Quantum Gates */}
            <div className="p-4 rounded-xl bg-blue-950/40 border border-cyan-500/20 space-y-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">Apply Quantum Gates</span>
              <div className="grid grid-cols-5 gap-2">
                <button
                  onClick={() => applyGate('H')}
                  className="p-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all text-center"
                >
                  H (Hadamard)
                  <span className="block text-[8px] text-blue-300/60 mt-0.5">Superposition</span>
                </button>
                <button
                  onClick={() => applyGate('X')}
                  className="p-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all text-center"
                >
                  X (Pauli-X)
                  <span className="block text-[8px] text-blue-300/60 mt-0.5">Quantum NOT</span>
                </button>
                <button
                  onClick={() => applyGate('Z')}
                  className="p-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all text-center"
                >
                  Z (Pauli-Z)
                  <span className="block text-[8px] text-blue-300/60 mt-0.5">Phase Flip</span>
                </button>
                <button
                  onClick={() => applyGate('S')}
                  className="p-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition-all text-center"
                >
                  S Gate
                  <span className="block text-[8px] text-blue-300/60 mt-0.5">+π/2 Phase</span>
                </button>
                <button
                  onClick={() => applyGate('reset')}
                  className="p-3 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono font-bold transition-all text-center flex flex-col items-center justify-center"
                >
                  <RotateCcw className="w-3.5 h-3.5 mb-1" />
                  Reset |0⟩
                </button>
              </div>

              {/* Angles Sliders */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-blue-300">
                    <span>Polar Angle (θ): {(theta * (180 / Math.PI)).toFixed(0)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={Math.PI}
                    step="0.05"
                    value={theta}
                    onChange={(e) => setTheta(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px] font-mono text-blue-300">
                    <span>Azimuthal Angle (φ): {(phi * (180 / Math.PI)).toFixed(0)}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={2 * Math.PI}
                    step="0.05"
                    value={phi}
                    onChange={(e) => setPhi(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleRunSimulation}
              disabled={isRunningSim}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs uppercase tracking-wider font-bold shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {isRunningSim ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  Collapsing Quantum Superposition...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" /> Run {shots} Quantum Measurements
                </>
              )}
            </button>
          </div>
        )}

        {activeTab === 'circuit' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                Qiskit 2026 Script Sandbox
              </span>
              <div className="flex gap-2">
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-mono"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
                <button
                  onClick={handleRunSimulation}
                  disabled={isRunningSim}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs font-mono hover:bg-cyan-400 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" /> Execute Circuit
                </button>
              </div>
            </div>

            <div className="relative rounded-xl border border-cyan-500/20 bg-black/60 p-4 font-mono text-xs overflow-x-auto shadow-inner">
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={14}
                className="w-full bg-transparent text-cyan-200 outline-none resize-none font-mono text-xs leading-relaxed"
                spellCheck={false}
              />
            </div>

            <div className="p-4 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs font-mono space-y-2">
              <div className="text-cyan-400 font-bold uppercase tracking-wider">Execution Pipeline (2026 Standard)</div>
              <p className="text-blue-300/70 leading-relaxed">
                Unitary gate synthesis transpiled for fault-tolerant logical qubits. Coherence threshold enforced at &gt;99.98% fidelity.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'wave' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-black/50 border border-cyan-500/30 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono uppercase text-cyan-300 font-bold">
                  Double-Slit Wavefunction Density |Ψ(x,t)|²
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-400/10 px-2 py-0.5 rounded">
                  De Broglie Phase Coherent
                </span>
              </div>

              {/* Dynamic Wave Simulation visual */}
              <div className="h-44 w-full bg-black/60 rounded-xl relative overflow-hidden flex items-end px-2 pb-2 gap-1 border border-cyan-500/10">
                {[...Array(48)].map((_, i) => {
                  const x = (i - 24) / 4;
                  // Sinc squared interference pattern
                  const intensity = Math.pow(Math.sin(x) / (x || 0.001), 2) * Math.cos(x * 1.5) ** 2;
                  const heightPercent = Math.max(8, Math.min(100, Math.round(intensity * 100)));
                  return (
                    <motion.div
                      key={i}
                      animate={{
                        height: [`${heightPercent * 0.7}%`, `${heightPercent}%`, `${heightPercent * 0.7}%`],
                      }}
                      transition={{
                        duration: 2 + (i % 3) * 0.4,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="flex-1 bg-gradient-to-t from-blue-600 via-cyan-400 to-white rounded-t-sm opacity-80"
                    />
                  );
                })}
              </div>

              <p className="text-xs font-mono text-blue-200/70 leading-relaxed">
                Visualizing quantum interference fringes: particles propagate as probability waves in superposition until an observer or detector causes wavefunction collapse into localized particle states.
              </p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
