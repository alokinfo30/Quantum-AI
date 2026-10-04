# ⚛️ Quantum AI — Autonomous Intelligence & Simulation Studio (2026 Core)

> An advanced, quantum-themed AI research interface powered by **Gemini 3.8 Flash**, the **Web Speech API**, interactive quantum circuit simulations, and autonomous multi-agent reasoning.

![Quantum AI Banner](https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Highlights & Viral 2026 AI Features

### 🎙️ 1. Web Speech API Voice-to-Text & Speech Synthesis
- **One-Tap Voice Input**: Integrated microphone button in the chat input field allowing continuous, hands-free voice transcription.
- **Real-Time Streaming Dictation**: Words stream dynamically into the input prompt as you speak.
- **Audio Frequency Waveform**: Live reactive soundwave visualization powered by Web Audio API `AnalyserNode`.
- **Text-to-Speech (TTS)**: Instant **Read Aloud** button on every assistant message to hear responses in futuristic audio synthesis.
- **Holographic Voice HUD**: Immersive full-screen conversational voice dialogue experience (akin to Gemini Live / ChatGPT Voice).

### ⌨️ 2. Global Keyboard Shortcut Handler
Engineered with a dedicated, cross-platform custom hook (`useKeyboardShortcuts.ts`) supporting both `Ctrl` (Windows/Linux) and `Cmd` (macOS):
| Shortcut | Action | Description |
| :--- | :--- | :--- |
| **`Ctrl + M`** / **`Cmd + M`** | **Toggle Voice Recording** | Instantly starts or stops Web Speech voice-to-text recording. |
| **`Ctrl + K`** / **`Cmd + K`** | **Clear Chat** | Collapses the quantum state back to ground state $\|0\rangle$ and clears messages. |
| **`Ctrl + B`** / **`Cmd + B`** | **Quantum Canvas** | Opens or closes the side-drawer interactive Quantum Simulation Canvas. |
| **`Ctrl + H`** / **`Cmd + H`** | **Voice HUD** | Launches the full-screen Holographic Voice Mode interface. |
| **`Enter`** | **Transmit State** | Submits query and triggers quantum collapse. |

Visual shortcut tags and live floating feedback toasts keep users informed whenever a shortcut is pressed.

---

### 🔬 3. Interactive Quantum Canvas & Code Sandbox
A side-by-side interactive simulation workspace bringing quantum mechanics to life:
1. **Bloch Sphere State Visualizer**:
   - Visual 3D-projected unit sphere displaying state vector $\| \psi \rangle = \cos(\theta/2)\|0\rangle + e^{i\phi}\sin(\theta/2)\|1\rangle$.
   - Interactive quantum gates: **Hadamard ($H$)**, **Pauli-X ($X$)**, **Pauli-Z ($Z$)**, **Phase ($S$)**, and **Reset**.
   - Dual sliders for polar angle ($\theta$) and azimuthal angle ($\phi$).
   - Real-time probability readouts for $P(\|0\rangle)$ and $P(\|1\rangle)$.
2. **Qiskit Algorithm Runner**:
   - Editable Python/Qiskit code editor.
   - Monte Carlo simulation engine executing shots (e.g., 1,024 shots) with measurement counts and celebration confetti.
3. **Wavefunction Density Simulator**:
   - Animated double-slit quantum interference pattern visualizing probability amplitudes and phase coherence.

---

### 🧠 4. Deep Reasoning (Test-Time Compute)
- Expandable **Quantum Superposition & Reasoning Process** block on assistant responses.
- Displays metrics (e.g. `Thought for 3.8s across 1,024 Eigenstates`).
- Step-by-step breakdown:
  1. *Hilbert space state vector initialization*
  2. *Constraint annealing & parallel probability evaluation*
  3. *Phase estimation & destructive interference elimination*
  4. *Wavefunction collapse to deterministic output*

---

### 🌌 5. Multiverse Timeline Divergence
- **1-Click Multiverse Fork**: Explores 3 parallel counterfactual realities for any scientific or speculative question.
- Formulates:
  - Branch title (e.g., *Timeline Alpha: Topological Dominance*)
  - Probability percentage
  - Divergence catalyst point
  - Alternate timeline outcome
- **Adopt Timeline**: Allows continuing the conversation within that divergent reality.

---

### 🖼️ 6. Multimodal Visual Quantum Analysis
- Direct file upload for quantum circuit diagrams, Feynman schematics, formulas, research charts, or screenshots.
- Instant thumbnail preview with dismissal option.
- Transmitted as base64 inline data directly to **Gemini 3.8 Flash** for multimodal analysis.

---

### ✨ 7. Prompt Superposition Expander
- Sparkles wand icon next to input field.
- Expands short or ambiguous prompts into high-dimensional technical specifications with rigorous constraints and simulation parameters.

---

### 🌐 8. Real-Time Google Search Grounding
- Toggleable **Quantum Grounding** switch.
- Fetches real-time web citations, arXiv breakthroughs, and live 2026 data via Gemini Search Grounding with direct source links.

---

### 🤖 9. Autonomous 2026 Agent Personas
Switch seamlessly between 5 specialized intelligence cores:
1. **⚛️ Deep Reasoning**: Maximum rigor, mathematical proofs, and state vector derivations.
2. **💻 Code Architect**: Qiskit, Cirq, Pennylane, CUDA-Q, and quantum gate matrices.
3. **🌌 Multiverse Simulator**: Counterfactual branches, speculative physics, and divergent timelines.
4. **🧪 Bio & Materials**: Variational Quantum Eigensolvers (VQE), molecular folding, and room-temp superconductors.
5. **🎙️ Voice Agent**: Fluid, conversational holographic audio persona optimized for spoken interaction.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | **React 19** + **TypeScript** + **Vite 6** |
| **Styling & UI** | **Tailwind CSS 4**, Lucide React, Glassmorphism, Neon Cyberpunk Palette |
| **Animation** | **Motion** (`motion/react`), HTML5 Canvas Particle Engine, Canvas Confetti |
| **Speech & Audio** | **Web Speech API** (`SpeechRecognition`), `SpeechSynthesis`, Web Audio API (`AudioContext`, `AnalyserNode`) |
| **Backend Server** | **Express 4**, `tsx`, `esbuild` |
| **AI Engine** | **@google/genai SDK** (`gemini-3.8-flash`) |

---

## 🚀 API Endpoints

### `POST /api/chat`
- **Request Body**:
  ```json
  {
    "message": "Explain quantum teleportation and draw the circuit.",
    "mode": "deep_reasoning",
    "enableSearch": true,
    "image": { "mimeType": "image/png", "data": "<base64_string>" },
    "history": []
  }
  ```
- **Response**:
  ```json
  {
    "text": "Quantum teleportation utilizes an entangled EPR pair...",
    "thinking": ["Initializing Hilbert state vector...", "..."],
    "groundingSources": [{ "title": "arXiv: Quantum Teleportation", "url": "https://..." }],
    "mode": "deep_reasoning"
  }
  ```

### `POST /api/enhance-prompt`
- **Request Body**: `{ "prompt": "build a quantum circuit" }`
- **Response**: `{ "enhancedPrompt": "Design a 3-qubit Grover search algorithm in Qiskit..." }`

### `POST /api/fork-multiverse`
- **Request Body**: `{ "context": "What if quantum computers broke RSA in 2020?" }`
- **Response**: Returns 3 structured parallel branches with probability and divergence points.

---

## 📦 Getting Started & Development

### 1. Prerequisites
- Node.js 20+
- `GEMINI_API_KEY` configured in `.env` (automatically injected in AI Studio).

### 2. Available Scripts
```bash
# Start development full-stack server (Express + Vite)
npm run dev

# Run TypeScript type check
npm run lint

# Build client and server bundles for production
npm run build

# Start production server
npm start
```

---

## 🔒 Security & Performance
- **Server-Side API Security**: Gemini API calls are strictly handled server-side (`/api/*`); API keys are never exposed to the browser.
- **Quantum Observer Shielding**: State observer-proof architecture adhering to the no-cloning theorem.
- **Fast Startup & HMR**: Powered by Vite and Node tsx.
